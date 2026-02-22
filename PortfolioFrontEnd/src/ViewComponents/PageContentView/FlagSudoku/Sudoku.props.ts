export interface EntityEntry {
    name: string;   // the "country" field used as the cell identifier
    image?: string; // optional URL for a custom image
}

export interface GridProps {
    size: number;
    gridRules: string[];  // [col rules..., row rules...] — used to derive per-cell rules
    ndjson?: string;      // raw NDJSON data passed to WASM for validation
    entities?: EntityEntry[]; // when set, drives the dropdown instead of countries_info.json
}

export interface CellProps {
    id: number;
    handleCellFlagChange: (id: number, name: string, correct: boolean | null) => void;
    isCorrect: boolean | null;
    chosenNames: string[];
    selectedName: string;
    validateAnswer?: (name: string) => Promise<boolean | null>;
    entities?: EntityEntry[]; // when set, drives the dropdown and image
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
    country_code: string;
    flag_features: FlagFeatures;
}

