import { type FC, useEffect, useMemo, useState } from "react";
import type { GridProps, EntityEntry } from "./Sudoku.props";
import { checkCountryFitsRules } from "../../../utils";
import SudokuCell from "./SudokuCell";
import flags from './countries_info.json' with { type: 'json' };

const defaultEntities: EntityEntry[] = flags.map(f => ({ name: f.country, image: undefined }));

function defaultGrid(size: number): string[] {
    return Array(size * size).fill("");
}

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

export const SudokuGrid: FC<GridProps> = ({ size, gridRules, ndjson, entities: entitiesProp }) => {
    const totalCells = size * size;
    const [selectedNames, setSelectedNames] = useState<string[]>(defaultGrid(size));
    const [chosenNames, setChosenNames] = useState<string[]>([]);
    const [correctness, setCorrectness] = useState<(boolean | null)[]>(
        Array(totalCells).fill(null)
    );

    const entities = useMemo<EntityEntry[]>(() => {
        if (entitiesProp && entitiesProp.length > 0) return entitiesProp;
        if (ndjson) {
            const parsed = parseEntities(ndjson);
            if (parsed.length > 0) return parsed;
        }
        return defaultEntities;
    }, [entitiesProp, ndjson]);

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

export default SudokuGrid;
