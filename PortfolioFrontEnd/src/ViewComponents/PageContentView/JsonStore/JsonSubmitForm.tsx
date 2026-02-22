interface JsonSubmitFormProps {
    label: string;
    input: string;
    error: string | null;
    onLabelChange: (value: string) => void;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
}

const JsonSubmitForm = ({ label, input, error, onLabelChange, onInputChange, onSubmit }: JsonSubmitFormProps) => (
    <section className="json-store__submit">
        <input
            className="json-store__label-input"
            type="text"
            placeholder="Label (optional)"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
        />
        <textarea
            className="json-store__textarea"
            placeholder="Paste your JSON here — one object per line (NDJSON) for sudoku generation"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            spellCheck={false}
        />
        {error && <p className="json-store__error">{error}</p>}
        <button className="json-store__btn" onClick={onSubmit}>
            Save JSON
        </button>
    </section>
);

export default JsonSubmitForm;
