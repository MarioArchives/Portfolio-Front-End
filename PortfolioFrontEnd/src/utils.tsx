export const generateRandomMazeConfiguration = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.round(Math.random() * 15));
};

// Configure the paths (set these at app startup if needed)
export const WASM_CONFIG = {
  jsPath: "/compiledFunctions/maze.js",
  wasmPath: "/compiledFunctions/maze.wasm",
};

// mazeModule.ts
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

// Now you can just call this function directly!
export async function generateMaze(
  height: number,
  width: number,
  horizontalConnectivity: number
): Promise<Array<{ id: number; groupId: string; state: number }>> {
  const module = await getModule();

  // Get the pointer to the JSON string
  const ptr = module.ccall(
    "generateFullMaze",
    "number",
    ["number", "number", "number"],
    [width, height, horizontalConnectivity] // Note: your C function takes width first, then height
  );

  // Convert the pointer to a JavaScript string
  const jsonString = module.UTF8ToString(ptr);

  // Free the allocated memory
  module._free(ptr);

  // Parse the JSON string and return the result
  return JSON.parse(jsonString);
}
