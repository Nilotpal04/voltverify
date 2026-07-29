import { useState } from "react";
import { documentsApi } from "../../api/documents";
import Modal from "../common/Modal";
import DateRangePicker from "./DateRangePicker";

export default function ExportDocuments() {
    const [open, setOpen] = useState(false);
    const [dates, setDates] = useState({
        from: "",
        to: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        if (!dates.from || !dates.to) {
            setError("Please select both dates.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await documentsApi.export(
                dates.from,
                dates.to
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `documents_${dates.from}_${dates.to}.xlsx`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

            setOpen(false);

        } catch (err) {
            console.error(err);
            setError(
                "Failed to export documents."
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="btn-primary btn-sm"
            >
                Download Report
            </button>


            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Download Report"
                size="md"
            >
                <div className="space-y-5">

                    <DateRangePicker
                        from={dates.from}
                        to={dates.to}
                        onChange={setDates}
                    />


                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}


                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() => setOpen(false)}
                            className="btn-ghost btn-sm"
                        >
                            Cancel
                        </button>


                        <button
                            onClick={handleDownload}
                            disabled={loading}
                            className="btn-primary btn-sm"
                        >
                            {loading
                                ? "Downloading..."
                                : "Download Excel"
                            }
                        </button>

                    </div>

                </div>

            </Modal>
        </>
    );
}