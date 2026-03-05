import type {
    ConfiguratorStep,
    ConfiguratorState,
    ConfiguratorStateKey,
} from '~/types/creator';

export const CONFIG_KEYS: ConfiguratorStateKey[] = [
    'productType',
    'material',
    'cut',
    'color',
    'size',
    'sleeveType',
    'neckline',
];

export const SUMMARY_FIELD_KEYS: Record<ConfiguratorStateKey, string> = {
    productType: 'creatorSummaryProductType',
    material: 'creatorSummaryMaterial',
    cut: 'creatorSummaryCut',
    color: 'creatorSummaryColor',
    size: 'creatorSummarySize',
    sleeveType: 'creatorSummarySleeveType',
    neckline: 'creatorSummaryNeckline',
};

export const VALIDATION_REQUIRED_KEY = 'creatorValidationRequired';

export function getCreatorSteps(): ConfiguratorStep[] {
    return [
        {
            id: 'productType',
            titleKey: 'creatorStepProductType',
            icon: 'heroicons:cube',
            options: [
                {
                    id: 'tshirt',
                    labelKey: 'creatorOptionTshirt',
                    descriptionKey: 'creatorOptionTshirtDesc',
                    icon: 'heroicons:cube',
                },
                {
                    id: 'hoodie',
                    labelKey: 'creatorOptionHoodie',
                    descriptionKey: 'creatorOptionHoodieDesc',
                    icon: 'heroicons:academic-cap',
                },
                {
                    id: 'shorts',
                    labelKey: 'creatorOptionShorts',
                    descriptionKey: 'creatorOptionShortsDesc',
                    icon: 'heroicons:rectangle-stack',
                },
                {
                    id: 'leggings',
                    labelKey: 'creatorOptionLeggings',
                    descriptionKey: 'creatorOptionLeggingsDesc',
                    icon: 'heroicons:user',
                },
                {
                    id: 'joggers',
                    labelKey: 'creatorOptionJoggers',
                    descriptionKey: 'creatorOptionJoggersDesc',
                    icon: 'heroicons:rectangle-group',
                },
                {
                    id: 'jacket',
                    labelKey: 'creatorOptionJacket',
                    descriptionKey: 'creatorOptionJacketDesc',
                    icon: 'heroicons:shield-check',
                },
                {
                    id: 'tank',
                    labelKey: 'creatorOptionTank',
                    descriptionKey: 'creatorOptionTankDesc',
                    icon: 'heroicons:minus',
                },
            ],
        },
        {
            id: 'material',
            titleKey: 'creatorStepMaterial',
            icon: 'heroicons:squares-2x2',
            options: [
                {
                    id: 'cotton',
                    labelKey: 'creatorOptionCotton',
                    descriptionKey: 'creatorOptionCottonDesc',
                    icon: 'heroicons:cloud',
                },
                {
                    id: 'polyester',
                    labelKey: 'creatorOptionPolyester',
                    descriptionKey: 'creatorOptionPolyesterDesc',
                    icon: 'heroicons:bolt',
                },
                {
                    id: 'blend',
                    labelKey: 'creatorOptionBlend',
                    descriptionKey: 'creatorOptionBlendDesc',
                    icon: 'heroicons:squares-2x2',
                },
                {
                    id: 'bamboo',
                    labelKey: 'creatorOptionBamboo',
                    descriptionKey: 'creatorOptionBambooDesc',
                    icon: 'heroicons:leaf',
                },
                {
                    id: 'lycra',
                    labelKey: 'creatorOptionLycra',
                    descriptionKey: 'creatorOptionLycraDesc',
                    icon: 'heroicons:sparkles',
                },
                {
                    id: 'mesh',
                    labelKey: 'creatorOptionMesh',
                    descriptionKey: 'creatorOptionMeshDesc',
                    icon: 'heroicons:squares-plus',
                },
            ],
        },
        {
            id: 'cut',
            titleKey: 'creatorStepCut',
            icon: 'heroicons:scissors',
            options: [
                {
                    id: 'slim',
                    labelKey: 'creatorOptionSlim',
                    descriptionKey: 'creatorOptionSlimDesc',
                    icon: 'heroicons:arrows-pointing-in',
                },
                {
                    id: 'regular',
                    labelKey: 'creatorOptionRegular',
                    descriptionKey: 'creatorOptionRegularDesc',
                    icon: 'heroicons:arrows-right-left',
                },
                {
                    id: 'oversize',
                    labelKey: 'creatorOptionOversize',
                    descriptionKey: 'creatorOptionOversizeDesc',
                    icon: 'heroicons:arrows-pointing-out',
                },
                {
                    id: 'relaxed',
                    labelKey: 'creatorOptionRelaxed',
                    descriptionKey: 'creatorOptionRelaxedDesc',
                    icon: 'heroicons:arrow-trending-up',
                },
                {
                    id: 'athletic',
                    labelKey: 'creatorOptionAthletic',
                    descriptionKey: 'creatorOptionAthleticDesc',
                    icon: 'heroicons:bolt',
                },
            ],
        },
        {
            id: 'color',
            titleKey: 'creatorStepColor',
            icon: 'heroicons:swatch',
            options: [
                {
                    id: 'black',
                    labelKey: 'creatorOptionBlack',
                    colorClass: 'bg-black',
                },
                {
                    id: 'navy',
                    labelKey: 'creatorOptionNavy',
                    colorClass: 'bg-blue-900',
                },
                {
                    id: 'white',
                    labelKey: 'creatorOptionWhite',
                    colorClass: 'bg-white border-2 border-secondary-200',
                },
                {
                    id: 'red',
                    labelKey: 'creatorOptionRed',
                    colorClass: 'bg-red-600',
                },
                {
                    id: 'grey',
                    labelKey: 'creatorOptionGrey',
                    colorClass: 'bg-secondary-500',
                },
                {
                    id: 'green',
                    labelKey: 'creatorOptionGreen',
                    colorClass: 'bg-green-600',
                },
                {
                    id: 'blue',
                    labelKey: 'creatorOptionBlue',
                    colorClass: 'bg-blue-500',
                },
                {
                    id: 'yellow',
                    labelKey: 'creatorOptionYellow',
                    colorClass: 'bg-yellow-400',
                },
                {
                    id: 'burgundy',
                    labelKey: 'creatorOptionBurgundy',
                    colorClass: 'bg-red-900',
                },
                {
                    id: 'orange',
                    labelKey: 'creatorOptionOrange',
                    colorClass: 'bg-orange-500',
                },
            ],
        },
        {
            id: 'size',
            titleKey: 'creatorStepSize',
            icon: 'heroicons:scale',
            options: [
                {
                    id: 'xs',
                    labelKey: 'creatorOptionXs',
                    descriptionKey: 'creatorOptionXsDesc',
                    icon: 'heroicons:hashtag',
                },
                {
                    id: 's',
                    labelKey: 'creatorOptionS',
                    descriptionKey: 'creatorOptionSDesc',
                    icon: 'heroicons:hashtag',
                },
                {
                    id: 'm',
                    labelKey: 'creatorOptionM',
                    descriptionKey: 'creatorOptionMDesc',
                    icon: 'heroicons:hashtag',
                },
                {
                    id: 'l',
                    labelKey: 'creatorOptionL',
                    descriptionKey: 'creatorOptionLDesc',
                    icon: 'heroicons:hashtag',
                },
                {
                    id: 'xl',
                    labelKey: 'creatorOptionXl',
                    descriptionKey: 'creatorOptionXlDesc',
                    icon: 'heroicons:hashtag',
                },
                {
                    id: 'xxl',
                    labelKey: 'creatorOptionXxl',
                    descriptionKey: 'creatorOptionXxlDesc',
                    icon: 'heroicons:hashtag',
                },
            ],
        },
        {
            id: 'sleeveType',
            titleKey: 'creatorStepSleeveType',
            icon: 'heroicons:hand-raised',
            options: [
                {
                    id: 'short',
                    labelKey: 'creatorOptionShortSleeve',
                    descriptionKey: 'creatorOptionShortSleeveDesc',
                    icon: 'heroicons:minus',
                },
                {
                    id: 'long',
                    labelKey: 'creatorOptionLongSleeve',
                    descriptionKey: 'creatorOptionLongSleeveDesc',
                    icon: 'heroicons:arrows-up-down',
                },
                {
                    id: 'sleeveless',
                    labelKey: 'creatorOptionSleeveless',
                    descriptionKey: 'creatorOptionSleevelessDesc',
                    icon: 'heroicons:x-mark',
                },
                {
                    id: 'tank',
                    labelKey: 'creatorOptionTankSleeve',
                    descriptionKey: 'creatorOptionTankSleeveDesc',
                    icon: 'heroicons:rectangle-stack',
                },
            ],
        },
        {
            id: 'neckline',
            titleKey: 'creatorStepNeckline',
            icon: 'heroicons:ellipsis-horizontal',
            options: [
                {
                    id: 'crew',
                    labelKey: 'creatorOptionCrew',
                    descriptionKey: 'creatorOptionCrewDesc',
                    icon: 'heroicons:circle',
                },
                {
                    id: 'vneck',
                    labelKey: 'creatorOptionVneck',
                    descriptionKey: 'creatorOptionVneckDesc',
                    icon: 'heroicons:chevron-down',
                },
                {
                    id: 'round',
                    labelKey: 'creatorOptionRound',
                    descriptionKey: 'creatorOptionRoundDesc',
                    icon: 'heroicons:ellipsis-horizontal',
                },
                {
                    id: 'polo',
                    labelKey: 'creatorOptionPolo',
                    descriptionKey: 'creatorOptionPoloDesc',
                    icon: 'heroicons:rectangle-stack',
                },
            ],
        },
        {
            id: 'summary',
            titleKey: 'creatorStepSummary',
            icon: 'heroicons:check-circle',
            options: [],
        },
    ];
}

export function createInitialConfig(): ConfiguratorState {
    return {
        productType: '',
        material: '',
        cut: '',
        color: '',
        size: '',
        sleeveType: '',
        neckline: '',
    };
}
