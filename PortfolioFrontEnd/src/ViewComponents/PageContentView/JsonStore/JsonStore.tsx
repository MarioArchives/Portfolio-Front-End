import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JsonStore.css";
import { generateSudokuFromJson } from "../../../utils";
import JsonSubmitForm from "./JsonSubmitForm";
import JsonEntryList from "./JsonEntryList";
import JsonViewer from "./JsonViewer";

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
            <JsonSubmitForm
                label={label}
                input={input}
                error={error}
                onLabelChange={setLabel}
                onInputChange={(value) => { setInput(value); setError(null); }}
                onSubmit={handleSubmit}
            />
            <div className="json-store__main">
                <JsonEntryList
                    entries={entries}
                    selectedId={selected?.id ?? null}
                    onSelect={setSelected}
                    onDelete={handleDelete}
                />
                <JsonViewer
                    selected={selected}
                    copied={copied}
                    sudokuLoading={sudokuLoading}
                    sudokuError={sudokuError}
                    onCopy={handleCopy}
                    onGenerateSudoku={handleGenerateSudoku}
                />
            </div>
        </div>
    );
};

export default JsonStore;
