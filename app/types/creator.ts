export interface ConfiguratorOption {
    id: string;
    labelKey: string;
    descriptionKey?: string;
    icon?: string;
    colorClass?: string;
}

export interface ConfiguratorStep {
    id: string;
    titleKey: string;
    icon: string;
    options: ConfiguratorOption[];
}

export interface ConfiguratorState {
    productType: string;
    material: string;
    cut: string;
    color: string;
    size: string;
    sleeveType: string;
    neckline: string;
}

export type ConfiguratorStateKey = keyof ConfiguratorState;
