export interface GridProps {
    size: number;
    gridRules: string[]
}

export interface CellProps {
    id: number;
    handleCellFlagChange: (id: number, code: string) => void;
    isCorrect: boolean | null
}

export interface HeadderProps {
    size: number;
}
interface FlagStructure {
    is_rectangular: boolean;
    is_square: boolean;
    is_vertical_orientation: boolean;
    is_horizontal_orientation: boolean;
    has_non_standard_shape: boolean;
    has_swallowtail: boolean;
}

interface FlagColors {
    has_red: boolean;
    has_white: boolean;
    has_blue: boolean;
    has_green: boolean;
    has_yellow: boolean;
    has_black: boolean;
    has_orange: boolean;
    has_purple: boolean;
    has_gold: boolean;
    has_light_blue: boolean;
    has_maroon: boolean;
}

interface FlagFeatures {
    structure: FlagStructure;
    colors: FlagColors;
}

export interface CountryFlag {
    country: string;
    flag_features: FlagFeatures;
}

