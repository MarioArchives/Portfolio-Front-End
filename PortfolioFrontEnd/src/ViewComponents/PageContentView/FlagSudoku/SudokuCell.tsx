import { memo } from "react";
import type { CellProps, EntityEntry } from "./Sudoku.props";
import flags from './countries_info.json' with { type: 'json' };

const defaultEntities: EntityEntry[] = flags.map(f => ({ name: f.country, image: undefined }));

function resolveImage(selectedName: string, selectedEntry: EntityEntry | undefined): string {
    if (!selectedName) return "./defaultCountryImage.png";
    if (selectedEntry?.image) return selectedEntry.image;
    const code = flags.find(f => f.country === selectedName)?.country_code;
    if (code) return `https://flagcdn.com/${code.toLowerCase()}.svg`;
    return "./defaultCountryImage.png";
}

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
    const imageSrc = resolveImage(selectedName, selectedEntry);
    const isSelected = Boolean(selectedName);

    const cellStyle: React.CSSProperties = isCorrect === null
        ? {}
        : isCorrect
            ? { backgroundColor: "rgba(0, 255, 0, 0.5)" }
            : { backgroundColor: "rgba(255, 0, 0, 0.5)" };

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

export default SudokuCell;
