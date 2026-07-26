export default function DateRangePicker({ from, to, onChange }) {
    const setFrom = (v) => onChange({ from: v, to });
    const setTo = (v) => onChange({ from, to: v });
    const clear = () => onChange({ from: "", to: "" });

    const hasValue = from || to;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-medium">
                    From
                </label>
                <input
                    type="date"
                    value={from || ""}
                    max={to || undefined}
                    onChange={(e) => setFrom(e.target.value)}
                    className="field-input py-1.5 px-2.5 text-xs w-[140px]"
                />
            </div>
            <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-medium">To</label>
                <input
                    type="date"
                    value={to || ""}
                    min={from || undefined}
                    onChange={(e) => setTo(e.target.value)}
                    className="field-input py-1.5 px-2.5 text-xs w-[140px]"
                />
            </div>
            {hasValue && (
                <button
                    onClick={clear}
                    className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
                >
                    Clear dates
                </button>
            )}
        </div>
    );
}
