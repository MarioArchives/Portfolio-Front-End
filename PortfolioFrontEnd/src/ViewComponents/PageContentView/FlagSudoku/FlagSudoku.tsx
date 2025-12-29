import "./FlagSudokuStyles.css"
import { type FC, useEffect, useState } from "react";
import type { GridProps, CellProps, CountryFlag } from "./Sudoku.props";
import flags from './countries_info.json' with { type: 'json' };
import { FlagImage } from "./FlagImage.tsx";

function defaultGrid(size: number) {
    const state: string[] = [];
    for (let i = 0; i < size * size; i++) {
        state.push("default")
    }
    return state;
};

function getHeadders() {
    //Should get list of headders
    //Ideally, the list will be a valid headder
}

const SudokuCell: FC<CellProps> = ({ id, handleCellFlagChange, isCorrect }) => {
    const [countryCode, setCountryCode] = useState<string>("default");
    const [selectioned, setSelected] = useState<boolean>(false);
    const [sudokuCellStyling, setSudokuCellStyling] = useState<React.CSSProperties>({})
    useEffect(() => {
        if (isCorrect !== null) {
            setSudokuCellStyling(isCorrect
                ? { backgroundColor: 'rgba(0, 255, 0, 0.5)' }
                : { backgroundColor: 'rgba(255, 0, 0, 0.5)' })
        }

    }, [isCorrect])

    const handleCodeChange = (newCode: string) => {
        if (!selectioned) {
            setCountryCode(newCode === "" ? "default" : newCode)
            handleCellFlagChange(id, newCode)
            setSelected(true)
        }
    }

    return (<div className="SudokuCell" style={sudokuCellStyling}>
        <div className="FlagCellHolder">
            <FlagImage code={countryCode} />
        </div>
        <div className="SudokuFlagSelectionHolder">
            <select className="SudokuFlagSelection" onChange={(e) => handleCodeChange(e.target.value)} defaultValue="">
                {(!selectioned) ? (
                    <>
                        <option value="">Select a country...</option>
                        {flags.map((value, idx) => (
                            <option key={idx} value={`${value.country_code}`}>{value.country}</option>))}
                    </>
                ) : (<option value=""> {`${countryCode} selected`}</option>)}
            </select>
        </div>
    </div>)
}

const SudokuGrid: FC<GridProps> = ({ size, gridRules }) => {

    const [sudokuState, setSudokuState] = useState<string[]>(defaultGrid(size));

    const sudokuStyle = {
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
    };

    function handleCellFlagChange(cellId: number, newCode: string) {
        const newState = [...sudokuState];
        newState[cellId] = newCode;
        setSudokuState(newState)

    }

    return (<div className="SudokuGrid" style={sudokuStyle}>
        {sudokuState.map((_, index: number) => (<SudokuCell key={index} id={index} handleCellFlagChange={handleCellFlagChange} isCorrect={null} />))}
    </div>
    )
}
const SudokuHeadders = (size: number) => {
    const headder: string[] = [];
    for (let i = 1; i <= 2 * size; i++) {
        headder.push(`requirement-${i}`);
    }
    return headder;
}

const FlagSudokuView = () => {
    const size: number = 3;
    const AllHeadders: string[] = SudokuHeadders(size);
    const columnHeadders: string[] = AllHeadders.slice(0, size);
    const rowHeadders: string[] = AllHeadders.slice(size, size * 2);
    return (<>
        <div className="SudokuColumnHeadders">
            {columnHeadders.map((title, idx) => (<div className="HeadderCell" key={idx}>{title}</div>))}
        </div>
        <div className="SudokuRowHeadersAndGrid">
            <div className="SudokuRowHeaders">
                {rowHeadders.map((title, idx) => (<div className="SudokuRotatedCell " key={idx}>{title}</div>))}
            </div>
            <SudokuGrid size={size} gridRules={AllHeadders} />
        </div>
    </>)
}

export default FlagSudokuView;
