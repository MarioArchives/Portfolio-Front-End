// ─── Sudoku WASM ─────────────────────────────────────────────────────────────

export interface SudokuResult {
  possible_solutions: number;
  rule_num: number;
  total_cells: number;
  rules: string[];
  cell_rule_pairs: { x: number; y: number }[];
  cell_candidates: { name: string; candidates: string[] }[];
  solutions: string[][];
  error?: string;
}

let sudokuModulePromise: Promise<any> | null = null;

function getSudokuModule(): Promise<any> {
    if (sudokuModulePromise) return sudokuModulePromise;

    // MODULARIZE=1 makes sudoku.js assign a factory function to
    // window.createSudokuModule instead of polluting window.Module.
    sudokuModulePromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/compiledFunctions/sudoku.js";
        script.onerror = () => reject(new Error("Failed to load sudoku.js"));
        script.onload = () => {
            const factory = (window as any).createSudokuModule;
            if (!factory) {
                reject(new Error("createSudokuModule not found on window"));
                return;
            }
            factory().then(resolve).catch(reject);
        };
        document.body.appendChild(script);
    });

    return sudokuModulePromise;
}

function jsStringToWasm(mod: any, str: string): number {
    const len = mod.lengthBytesUTF8(str) + 1;
    const ptr = mod._malloc(len);
    mod.stringToUTF8(str, ptr, len);
    return ptr;
}

export async function generateSudokuFromJson(jsonData: string): Promise<SudokuResult> {
    const mod = await getSudokuModule();
    const ptr = jsStringToWasm(mod, jsonData);
    const resultPtr: number = mod.ccall(
        "generate_sudoku_from_json",
        "number",
        ["number"],
        [ptr]
    );
    mod._free(ptr);
    const resultStr = mod.UTF8ToString(resultPtr);
    mod._free(resultPtr);
    return JSON.parse(resultStr) as SudokuResult;
}

export async function checkCountryFitsRules(
    jsonData: string,
    countryName: string,
    rowRule: string,
    colRule: string
): Promise<boolean> {
    const mod = await getSudokuModule();

    const ptrs = [jsonData, countryName, rowRule, colRule].map(s => jsStringToWasm(mod, s));
    const resultPtr: number = mod.ccall(
        "check_country_fits_rules",
        "number",
        ["number", "number", "number", "number"],
        ptrs
    );
    ptrs.forEach(p => mod._free(p));

    const resultStr = mod.UTF8ToString(resultPtr);
    mod._free(resultPtr);

    const parsed = JSON.parse(resultStr);
    if (parsed.error) throw new Error(parsed.error);
    return parsed.fits as boolean;
}

export async function getAvailableRules(jsonData: string): Promise<string[]> {
    const mod = await getSudokuModule();
    const ptr = jsStringToWasm(mod, jsonData);
    const resultPtr: number = mod.ccall(
        "get_available_rules",
        "number",
        ["number"],
        [ptr]
    );
    mod._free(ptr);
    const resultStr = mod.UTF8ToString(resultPtr);
    mod._free(resultPtr);
    return JSON.parse(resultStr) as string[];
}

// ─── Maze helpers ─────────────────────────────────────────────────────────────

export const generateRandomMazeConfiguration = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.round(Math.random() * 15));
};

// Configure the paths (set these at app startup if needed)
export const WASM_CONFIG = {
    jsPath: "/compiledFunctions/maze.js",
    wasmPath: "/compiledFunctions/maze.wasm",
};

interface CellInformation {
    id: number;
    groupId: string;
    state: number;
    is_start: number;
    is_end: number;
    leads_to_exit?: number;
}

interface EmscriptenModule {
    ccall: (
        funcName: string,
        returnType: string,
        argTypes: string[],
        args: any[]
    ) => any;
    UTF8ToString: (ptr: number) => string;
    _free: (ptr: number) => void;
}

declare global {
    interface Window {
        Module: any; // Changed from function to any for flexibility
    }
    var Module: any; // Global Module variable
}

let modulePromise: Promise<EmscriptenModule> | null = null;

// Load the module once and cache it
function getModule(): Promise<EmscriptenModule> {
    if (modulePromise) {
        return modulePromise; // Return cached promise
    }

    modulePromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = WASM_CONFIG.jsPath;

        script.onload = () => {
            const mod = window.Module || (globalThis as any).Module;

            if (!mod) {
                reject(new Error("Module not found after loading maze.js"));
                return;
            }

            // ALWAYS wait for onRuntimeInitialized - the WASM needs to fully load
            const originalCallback = mod.onRuntimeInitialized;
            mod.onRuntimeInitialized = () => {
                if (originalCallback) originalCallback();
                resolve(mod);
            };
        };

        script.onerror = () => reject(new Error("Failed to load maze.js"));

        document.body.appendChild(script);
    });

    return modulePromise;
}

export async function generateMaze(
    height: number,
    width: number,
    horizontalConnectivity: number
): Promise<Array<CellInformation>> {
    const module = await getModule();

    const ptr = module.ccall(
        "generateFullMaze",
        "number",
        ["number", "number", "number"],
        [width, height, horizontalConnectivity]
    );

    const jsonString = module.UTF8ToString(ptr);

    module._free(ptr);

    return JSON.parse(jsonString);
}
export async function testMazeSpeed(
    updateMethod: number,
    dimensions: number
): Promise<number> {
    const mod = await getModule();
    const timeTaken: number = mod.ccall(
        "test_method_speed",
        "number",
        ["number", "number"],
        [updateMethod, dimensions]
    );
    return timeTaken;
}
