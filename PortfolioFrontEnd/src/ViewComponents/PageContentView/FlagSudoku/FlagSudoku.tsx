import "./FlagSudokuStyles.css";
import { useLocation } from "react-router-dom";
import type { SudokuResult } from "../../../utils";
import SudokuGrid from "./SudokuGrid";
import SolutionBox from "./SolutionBox";

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
