import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JsonStore.css";
import { generateSudokuFromJson } from "../../../utils";

interface StoredEntry {
    id: string;
    label: string;
    data: unknown;
    savedAt: string;
}

const STORAGE_KEY = "portfolio_json_store";

const loadEntries = (): StoredEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveEntries = (entries: StoredEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const JsonStore = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<StoredEntry[]>(loadEntries);
    const [input, setInput] = useState("");
    const [label, setLabel] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<StoredEntry | null>(null);
    const [copied, setCopied] = useState(false);
    const [sudokuLoading, setSudokuLoading] = useState(false);
    const [sudokuError, setSudokuError] = useState<string | null>(null);

    useEffect(() => {
        saveEntries(entries);
    }, [entries]);

    useEffect(() => {
        setSudokuError(null);
    }, [selected?.id]);

    const handleSubmit = () => {
        setError(null);
        let parsed: unknown;
        try {
            parsed = JSON.parse(input);
        } catch (e) {
            setError("Invalid JSON: " + (e as Error).message);
            return;
        }

        const entry: StoredEntry = {
            id: crypto.randomUUID(),
            label: label.trim() || "Untitled",
            data: parsed,
            savedAt: new Date().toISOString(),
        };

        setEntries((prev) => [entry, ...prev]);
        setInput("");
        setLabel("");
        setSelected(entry);
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    const handleCopy = (entry: StoredEntry) => {
        navigator.clipboard.writeText(JSON.stringify(entry.data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleGenerateSudoku = async () => {
        if (!selected) return;
        setSudokuError(null);
        setSudokuLoading(true);
        try {
            const data = selected.data;
            let ndjson: string;
            if (typeof data === "string") {
                ndjson = data;
            } else if (Array.isArray(data)) {
                ndjson = data.map((item) => JSON.stringify(item)).join("\n");
            } else {
                ndjson = JSON.stringify(data);
            }

            const result = await generateSudokuFromJson(ndjson);
            if (result.error) {
                setSudokuError(result.error);
            } else {
                navigate("/Flags", { state: { sudoku: result, ndjson } });
            }
        } catch (e) {
            setSudokuError((e as Error).message);
        } finally {
            setSudokuLoading(false);
        }
    };

    return (
        <div className="json-store">
            <h1>JSON Store</h1>

            <section className="json-store__submit">
                <input
                    className="json-store__label-input"
                    type="text"
                    placeholder="Label (optional)"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <textarea
                    className="json-store__textarea"
                    placeholder='Paste your JSON here — one object per line (NDJSON) for sudoku generation'
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError(null);
                    }}
                    spellCheck={false}
                />
                {error && <p className="json-store__error">{error}</p>}
                <button className="json-store__btn" onClick={handleSubmit}>
                    Save JSON
                </button>
            </section>

            <div className="json-store__main">
                <aside className="json-store__list">
                    <h2>Saved Entries</h2>
                    {entries.length === 0 && (
                        <p className="json-store__empty">No entries yet.</p>
                    )}
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className={`json-store__list-item${selected?.id === entry.id ? " json-store__list-item--active" : ""}`}
                            onClick={() => setSelected(entry)}
                        >
                            <span className="json-store__list-label">{entry.label}</span>
                            <span className="json-store__list-date">
                                {new Date(entry.savedAt).toLocaleString()}
                            </span>
                            <button
                                className="json-store__delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(entry.id);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </aside>

                <section className="json-store__viewer">
                    <h2>
                        {selected ? selected.label : "Select an entry"}
                        {selected && (
                            <button
                                className="json-store__copy-btn"
                                onClick={() => handleCopy(selected)}
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
                                    onClick={handleGenerateSudoku}
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
            </div>
        </div>
    );
};

export default JsonStore;
