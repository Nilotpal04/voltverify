import { useEffect, useState, useCallback } from "react";
import { documentsApi } from "../../api/documents";

/**
 * DocumentPreview
 *
 * Fetches the file blob from GET /documents/{id}/file (auth header injected
 * automatically), turns it into an object URL, then renders:
 *   - PDF  → <iframe>  (browser built-in PDF viewer)
 *   - image → <img>
 *   - other → download link
 *
 * The object URL is revoked on unmount to avoid memory leaks.
 */
export default function DocumentPreview({ docId, mimeType, filename }) {
    const [blobUrl, setBlobUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await documentsApi.file(docId);
            const url = URL.createObjectURL(res.data);
            setBlobUrl(url);
        } catch (e) {
            setError(
                e.response?.data?.detail || "Could not load file preview.",
            );
        } finally {
            setLoading(false);
        }
    }, [docId]);

    useEffect(() => {
        load();
        return () => {
            // clean up blob URL when component unmounts or docId changes
            setBlobUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        };
    }, [load]);

    const isPdf = mimeType === "application/pdf";
    const isImage = mimeType?.startsWith("image/");

    /* ── Loading ── */
    if (loading)
        return (
            <div className="flex flex-col items-center justify-center gap-3 h-64 bg-gray-50 rounded-xl border border-gray-200">
                <svg
                    className="w-6 h-6 animate-spin text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                <p className="text-sm text-gray-400">Loading preview…</p>
            </div>
        );

    /* ── Error ── */
    if (error)
        return (
            <div className="flex flex-col items-center justify-center gap-3 h-64 bg-red-50 rounded-xl border border-red-200 px-6 text-center">
                <svg
                    className="w-8 h-8 text-red-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                </svg>
                <div>
                    <p className="text-sm font-medium text-red-700">
                        Preview unavailable
                    </p>
                    <p className="text-xs text-red-500 mt-0.5">{error}</p>
                </div>
                <button onClick={load} className="btn-secondary btn-sm mt-1">
                    Retry
                </button>
            </div>
        );

    /* ── PDF ── */
    if (isPdf)
        return (
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-inner shadow-gray-200/60">
                <iframe
                    src={blobUrl}
                    title={filename}
                    className="w-full"
                    style={{ height: "68vh", minHeight: "520px" }}
                />
                <DownloadBar blobUrl={blobUrl} filename={filename} />
            </div>
        );

    /* ── Image ── */
    if (isImage)
        return (
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner shadow-gray-200/50">
                <div className="flex items-center justify-center p-5 min-h-[360px]">
                    <img
                        src={blobUrl}
                        alt={filename}
                        className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm"
                    />
                </div>
                <DownloadBar blobUrl={blobUrl} filename={filename} />
            </div>
        );

    /* ── Unsupported / fallback ── */
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-48 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <svg
                className="w-10 h-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            <div className="text-center">
                <p className="text-sm text-gray-500 font-medium">
                    No preview available for this file type
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{mimeType}</p>
            </div>
            <a
                href={blobUrl}
                download={filename}
                className="btn-secondary btn-sm"
            >
                Download file
            </a>
        </div>
    );
}

/* Small bar below the preview with an open/download button */
function DownloadBar({ blobUrl, filename }) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-400 truncate min-w-0">
                {filename}
            </p>
            <a
                href={blobUrl}
                download={filename}
                className="btn-secondary btn-sm gap-1.5 shrink-0"
            >
                <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                Download
            </a>
        </div>
    );
}
