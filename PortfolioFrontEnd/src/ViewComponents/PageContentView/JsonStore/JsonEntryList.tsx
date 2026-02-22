interface StoredEntry {
    id: string;
    label: string;
    data: unknown;
    savedAt: string;
}

interface JsonEntryListProps {
    entries: StoredEntry[];
    selectedId: string | null;
    onSelect: (entry: StoredEntry) => void;
    onDelete: (id: string) => void;
}

const JsonEntryList = ({ entries, selectedId, onSelect, onDelete }: JsonEntryListProps) => (
    <aside className="json-store__list">
        <h2>Saved Entries</h2>
        {entries.length === 0 && (
            <p className="json-store__empty">No entries yet.</p>
        )}
        {entries.map((entry) => (
            <div
                key={entry.id}
                className={`json-store__list-item${selectedId === entry.id ? " json-store__list-item--active" : ""}`}
                onClick={() => onSelect(entry)}
            >
                <span className="json-store__list-label">{entry.label}</span>
                <span className="json-store__list-date">
                    {new Date(entry.savedAt).toLocaleString()}
                </span>
                <button
                    className="json-store__delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entry.id);
                    }}
                >
                    ✕
                </button>
            </div>
        ))}
    </aside>
);

export default JsonEntryList;
