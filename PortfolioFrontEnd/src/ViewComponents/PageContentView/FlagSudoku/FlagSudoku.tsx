import "./FlagSudokuStyles.css"
import { type FC, useEffect, useMemo, useState, memo } from "react";
import { useLocation } from "react-router-dom";
import type { GridProps, CellProps, EntityEntry } from "./Sudoku.props";
import type { SudokuResult } from "../../../utils";
import { checkCountryFitsRules } from "../../../utils";
import flags from './countries_info.json' with { type: 'json' };

// Default entity list derived from bundled countries data
const defaultEntities: EntityEntry[] = flags.map(f => ({ name: f.country, image: undefined }));

function defaultGrid(size: number): string[] {
    return Array(size * size).fill("");
}

// Parse NDJSON into entity entries, picking up optional "image" property
function parseEntities(ndjson: string): EntityEntry[] {
    const entries: EntityEntry[] = [];
    for (const line of ndjson.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
            const obj = JSON.parse(trimmed);
            const name: string = obj.country ?? obj.name ?? "";
            if (!name) continue;
            entries.push({ name, image: obj.image ?? undefined });
        } catch {
            // skip unparseable lines
        }
    }
    return entries;
}

// ─── Cell ─────────────────────────────────────────────────────────────────────

const SudokuCell = memo(function SudokuCell({
    id,
    handleCellFlagChange,
    isCorrect,
    chosenNames,
    selectedName,
    validateAnswer,
    entities,
}: CellProps) {
    const entityList = entities ?? defaultEntities;
    const selectedEntry = entityList.find(e => e.name === selectedName);

    const cellStyle: React.CSSProperties = isCorrect === null
        ? {}
        : isCorrect
            ? { backgroundColor: 'rgba(0, 255, 0, 0.5)' }
            : { backgroundColor: 'rgba(255, 0, 0, 0.5)' };

    const handleNameChange = async (newName: string) => {
        if (newName === "") return;

        handleCellFlagChange(id, newName, null);

        let correct: boolean | null = null;
        if (validateAnswer) {
            try {
                correct = await validateAnswer(newName);
            } catch {
                correct = null;
            }
        }

        handleCellFlagChange(id, newName, correct);
    };

    // Resolve the image to show
    const imageSrc: string = (() => {
        if (!selectedName) return "./defaultCountryImage.png";
        if (selectedEntry?.image) return selectedEntry.image;
        // Fall back to flag CDN when using countries data (name → code lookup)
        const code = flags.find(f => f.country === selectedName)?.country_code;
        if (code) return `https://flagcdn.com/${code.toLowerCase()}.svg`;
        return "./defaultCountryImage.png";
    })();

    const isSelected = Boolean(selectedName);

    return (
        <div className="SudokuCell" style={cellStyle}>
            <div className="FlagCellHolder">
                <img src={imageSrc} className="SudokuFlagContainer" loading="lazy" />
            </div>
            <div className="SudokuFlagSelectionHolder">
                <select
                    className="SudokuFlagSelection"
                    onChange={(e) => handleNameChange(e.target.value)}
                    value={isSelected ? selectedName : ""}
                >
                    <option value="">
                        {isSelected ? `${selectedName} ✎` : "Select…"}
                    </option>
                    {entityList
                        .filter(e => !chosenNames.includes(e.name) || e.name === selectedName)
                        .map((e, idx) => (
                            <option key={idx} value={e.name}>{e.name}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
});

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const SudokuGrid: FC<GridProps> = ({ size, gridRules, ndjson, entities: entitiesProp }) => {
    const totalCells = size * size;
    const [selectedNames, setSelectedNames] = useState<string[]>(defaultGrid(size));
    const [chosenNames, setChosenNames] = useState<string[]>([]);
    const [correctness, setCorrectness] = useState<(boolean | null)[]>(
        Array(totalCells).fill(null)
    );

    // Derive entity list: prefer explicit prop, then parse from ndjson, then bundled flags
    const entities = useMemo<EntityEntry[]>(() => {
        if (entitiesProp && entitiesProp.length > 0) return entitiesProp;
        if (ndjson) {
            const parsed = parseEntities(ndjson);
            if (parsed.length > 0) return parsed;
        }
        return defaultEntities;
    }, [entitiesProp, ndjson]);

    // gridRules: [col0..colN, row0..rowN]
    const colRules = gridRules.slice(0, size);
    const rowRules = gridRules.slice(size);

    useEffect(() => {
        setSelectedNames(defaultGrid(size));
        setChosenNames([]);
        setCorrectness(Array(totalCells).fill(null));
    }, [size, gridRules]);

    const sudokuStyle = {
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
    };

    function handleCellFlagChange(cellId: number, newName: string, correct: boolean | null) {
        setSelectedNames(prev => {
            const next = [...prev];
            const old = next[cellId];
            next[cellId] = newName;
            setChosenNames(c => {
                const without = c.filter(x => x !== old);
                return newName ? [...without, newName] : without;
            });
            return next;
        });
        setCorrectness(prev => {
            const next = [...prev];
            next[cellId] = correct;
            return next;
        });
    }

    return (
        <div className="SudokuGrid" style={sudokuStyle}>
            {selectedNames.map((name, index) => {
                const row = Math.floor(index / size);
                const col = index % size;
                const rowRule = rowRules[row];
                const colRule = colRules[col];

                const validateAnswer = ndjson && rowRule && colRule
                    ? async (entityName: string): Promise<boolean | null> => {
                        return checkCountryFitsRules(ndjson, entityName, rowRule, colRule);
                    }
                    : undefined;

                return (
                    <SudokuCell
                        key={index}
                        id={index}
                        handleCellFlagChange={handleCellFlagChange}
                        isCorrect={correctness[index]}
                        chosenNames={chosenNames}
                        selectedName={name}
                        validateAnswer={validateAnswer}
                        entities={entities}
                    />
                );
            })}
        </div>
    );
};

// ─── Solution box ─────────────────────────────────────────────────────────────

const SolutionBox = ({ sudoku }: { sudoku: SudokuResult }) => {
    const [open, setOpen] = useState(false);
    const side = sudoku.rule_num / 2;
    const colRules = sudoku.rules.slice(0, side);
    const rowRules = sudoku.rules.slice(side);
    const solution = sudoku.solutions[0] ?? [];

    return (
        <div className="SolutionBox">
            <button className="SolutionBox__toggle" onClick={() => setOpen(o => !o)}>
                {open ? "Hide Solution ▲" : "Show Solution ▼"}
            </button>
            {open && (
                <div className="SolutionBox__content">
                    <table className="SolutionBox__table">
                        <thead>
                            <tr>
                                <th></th>
                                {colRules.map((r, i) => (
                                    <th key={i} className="SolutionBox__col-header">{r.replace(/_/g, " ")}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rowRules.map((rowRule, row) => (
                                <tr key={row}>
                                    <th className="SolutionBox__row-header">{rowRule.replace(/_/g, " ")}</th>
                                    {colRules.map((_, col) => {
                                        // C solver fills column-major: col*side + row
                                        const cellIndex = col * side + row;
                                        return (
                                            <td key={col} className="SolutionBox__cell">
                                                {solution[cellIndex] ?? "?"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ─── Page view ────────────────────────────────────────────────────────────────

const FlagSudokuView = () => {
    const location = useLocation();
    const sudoku: SudokuResult | undefined = (location.state as any)?.sudoku;
    const ndjson: string | undefined = (location.state as any)?.ndjson;

    if (sudoku) {
        const side = sudoku.rule_num / 2;
        const colRules = sudoku.rules.slice(0, side);
        const rowRules = sudoku.rules.slice(side);
        const gridRules = [...colRules, ...rowRules];

        return (<>
            {sudoku.solutions.length > 0 && <SolutionBox sudoku={sudoku} />}
            <div className="SudokuLayoutWrapper">
                <div className="SudokuLayout" style={{ "--sudoku-side": side } as React.CSSProperties}>
                    <div className="SudokuLayout__corner" />
                    {colRules.map((rule, idx) => (
                        <div className="HeadderCell" key={idx}>{rule.replace(/_/g, " ")}</div>
                    ))}
                    {rowRules.map((rule, idx) => (
                        <div className="SudokuRotatedCell" key={idx}>{rule.replace(/_/g, " ")}</div>
                    ))}
                    <SudokuGrid size={side} gridRules={gridRules} ndjson={ndjson} />
                </div>
            </div>
        </>);
    }

    // Default — no sudoku passed in
    const size = 3;
    const placeholderRules = Array.from({ length: size * 2 }, (_, i) => `requirement-${i + 1}`);
    const colRules = placeholderRules.slice(0, size);
    const rowRules = placeholderRules.slice(size);

    return (<>
        <div className="SudokuLayoutWrapper">
            <div className="SudokuLayout" style={{ "--sudoku-side": size } as React.CSSProperties}>
                <div className="SudokuLayout__corner" />
                {colRules.map((title, idx) => (<div className="HeadderCell" key={idx}>{title}</div>))}
                {rowRules.map((title, idx) => (<div className="SudokuRotatedCell" key={idx}>{title}</div>))}
                <SudokuGrid size={size} gridRules={placeholderRules} />
            </div>
        </div>
    </>);
};

export default FlagSudokuView;
