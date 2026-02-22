import { useState } from "react";
import type { SudokuResult } from "../../../utils";

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

export default SolutionBox;
