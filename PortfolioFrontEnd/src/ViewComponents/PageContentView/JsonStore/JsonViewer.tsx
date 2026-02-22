interface StoredEntry {
    id: string;
    label: string;
    data: unknown;
    savedAt: string;
}

interface JsonViewerProps {
    selected: StoredEntry | null;
    copied: boolean;
    sudokuLoading: boolean;
    sudokuError: string | null;
    onCopy: (entry: StoredEntry) => void;
    onGenerateSudoku: () => void;
}

const JsonViewer = ({ selected, copied, sudokuLoading, sudokuError, onCopy, onGenerateSudoku }: JsonViewerProps) => (
    <section className="json-store__viewer">
        <h2>
            {selected ? selected.label : "Select an entry"}
            {selected && (
                <button
                    className="json-store__copy-btn"
                    onClick={() => onCopy(selected)}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            )}
        </h2>

        {selected ? (
            <>
                <div className="json-store__sudoku-section">
                    <button
                        className="json-store__btn json-store__btn--sudoku"
                        onClick={onGenerateSudoku}
                        disabled={sudokuLoading}
                    >
                        {sudokuLoading ? "Generating…" : "Generate Sudoku"}
                    </button>
                    {sudokuError && (
                        <p className="json-store__error">Error: {sudokuError}</p>
                    )}
                </div>
                <pre className="json-store__pre">
                    {JSON.stringify(selected.data, null, 2)}
                </pre>
            </>
        ) : (
            <p className="json-store__empty">
                Submit JSON on the left and select an entry to view it here.
            </p>
        )}
    </section>
);

export default JsonViewer;
