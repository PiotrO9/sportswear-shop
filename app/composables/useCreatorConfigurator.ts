import type {
    ConfiguratorOption,
    ConfiguratorState,
    ConfiguratorStateKey,
} from '~/types/creator';
import {
    CONFIG_KEYS,
    createInitialConfig,
    getCreatorSteps,
    SUMMARY_FIELD_KEYS,
    VALIDATION_REQUIRED_KEY,
} from '~/services/creatorConfigurator';

const CREATOR_STORAGE_KEY = 'creator-configurator-progress';

interface SavedCreatorState {
    config: ConfiguratorState;
    stepIndex: number;
}

function loadSavedState(): SavedCreatorState | null {
    if (import.meta.server) return null;

    try {
        const raw = localStorage.getItem(CREATOR_STORAGE_KEY);

        if (!raw) return null;

        const parsed = JSON.parse(raw) as SavedCreatorState;

        if (!parsed || typeof parsed.stepIndex !== 'number' || !parsed.config) {
            return null;
        }

        const defaultConfig = createInitialConfig();
        const config: ConfiguratorState = {
            productType: parsed.config.productType ?? defaultConfig.productType,
            material: parsed.config.material ?? defaultConfig.material,
            cut: parsed.config.cut ?? defaultConfig.cut,
            color: parsed.config.color ?? defaultConfig.color,
            size: parsed.config.size ?? defaultConfig.size,
            sleeveType: parsed.config.sleeveType ?? defaultConfig.sleeveType,
            neckline: parsed.config.neckline ?? defaultConfig.neckline,
        };

        return { config, stepIndex: parsed.stepIndex };
    } catch {
        return null;
    }
}

function saveState(config: ConfiguratorState, stepIndex: number): void {
    if (import.meta.server) return;

    try {
        localStorage.setItem(
            CREATOR_STORAGE_KEY,
            JSON.stringify({ config: { ...config }, stepIndex }),
        );
    } catch {
        // Ignore storage errors
    }
}

function clearSavedState(): void {
    if (import.meta.server) return;

    try {
        localStorage.removeItem(CREATOR_STORAGE_KEY);
    } catch {
        // Ignore storage errors
    }
}

export function useCreatorConfigurator() {
    const { t } = useI18n();

    const steps = getCreatorSteps();
    const currentStepIndex = ref(0);
    const isResetModalOpen = ref(false);
    const validationError = ref<string>('');
    const config = reactive<ConfiguratorState>({ ...createInitialConfig() });

    onMounted(() => {
        const saved = loadSavedState();

        if (saved?.config) {
            Object.assign(config, saved.config);
        }

        if (
            saved &&
            saved.stepIndex >= 0 &&
            saved.stepIndex < steps.length
        ) {
            currentStepIndex.value = saved.stepIndex;
        }
    });

    watch(
        [config, currentStepIndex],
        () => saveState(config, currentStepIndex.value),
        { deep: true },
    );

    const currentStep = computed(() => steps[currentStepIndex.value]);
    const isFirstStep = computed(() => currentStepIndex.value === 0);
    const isLastStep = computed(
        () => currentStepIndex.value === steps.length - 1,
    );

    const hasAnySelection = computed(() =>
        CONFIG_KEYS.some((key) => !!config[key]?.trim()),
    );

    function isStepAccessible(index: number): boolean {
        if (index === 0) return true;

        for (let i = 0; i < index; i++) {
            const step = steps[i];

            if (!step || step.options.length === 0) continue;

            const key = step.id as ConfiguratorStateKey;

            if (!config[key]?.trim()) return false;
        }

        return true;
    }

    function isCurrentStepValid(): boolean {
        const step = currentStep.value;

        if (!step || step.options.length === 0) return true;

        const key = step.id as ConfiguratorStateKey;

        return !!config[key]?.trim();
    }

    function getCurrentValue(): string {
        const step = currentStep.value;

        if (!step) return '';

        const key = step.id as ConfiguratorStateKey;

        return config[key] ?? '';
    }

    function clearStepsAfter(keyIndex: number): void {
        for (let i = keyIndex + 1; i < CONFIG_KEYS.length; i++) {
            const key = CONFIG_KEYS[i];

            if (key) config[key] = '';
        }
    }

    function handleSelectOption(optionId: string): void {
        const step = currentStep.value;

        if (!step) return;

        const key = step.id as ConfiguratorStateKey;
        const keyIndex = CONFIG_KEYS.indexOf(key);

        config[key] = optionId;
        validationError.value = '';

        if (keyIndex >= 0) {
            clearStepsAfter(keyIndex);
        }
    }

    function handleStepClick(index: number): void {
        if (!isStepAccessible(index)) return;

        currentStepIndex.value = index;
        validationError.value = '';
    }

    function handleNext(): void {
        if (!isCurrentStepValid()) {
            validationError.value = t(VALIDATION_REQUIRED_KEY);

            return;
        }

        if (!isLastStep.value) {
            currentStepIndex.value += 1;
            validationError.value = '';
        }
    }

    function handlePrev(): void {
        if (!isFirstStep.value) {
            currentStepIndex.value -= 1;
            validationError.value = '';
        }
    }

    function handleReset(): void {
        currentStepIndex.value = 0;
        config.productType = '';
        config.material = '';
        config.cut = '';
        config.color = '';
        config.size = '';
        config.sleeveType = '';
        config.neckline = '';
        clearSavedState();
    }

    function handleOpenResetModal(): void {
        isResetModalOpen.value = true;
    }

    function handleConfirmReset(): void {
        handleReset();
    }

    function handleKeyDown(event: KeyboardEvent, optionId: string): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSelectOption(optionId);
        }
    }

    function getSummaryLabel(key: ConfiguratorStateKey): string {
        const step = steps.find((s) => s.id === key);
        const option = step?.options.find((o) => o.id === config[key]);

        if (option) return t(option.labelKey);

        if (config[key]) return config[key];

        return '—';
    }

    function getSummaryOption(
        key: ConfiguratorStateKey,
    ): ConfiguratorOption | undefined {
        const step = steps.find((s) => s.id === key);

        return step?.options.find((o) => o.id === config[key]);
    }

    return {
        steps,
        config,
        currentStepIndex,
        isResetModalOpen,
        validationError,
        currentStep,
        isFirstStep,
        isLastStep,
        hasAnySelection,
        configKeys: CONFIG_KEYS,
        summaryFieldKeys: SUMMARY_FIELD_KEYS,
        isStepAccessible,
        isCurrentStepValid,
        getCurrentValue,
        handleSelectOption,
        handleStepClick,
        handleNext,
        handlePrev,
        handleReset,
        handleOpenResetModal,
        handleConfirmReset,
        handleKeyDown,
        getSummaryLabel,
        getSummaryOption,
    };
}
