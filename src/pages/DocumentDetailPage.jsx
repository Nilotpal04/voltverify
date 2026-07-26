import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
    fetchDoc,
    updateDoc,
    verifyDoc,
    rejectDoc,
    fetchAudit,
    clearCurrent,
} from "../store/slices/documentsSlice";
import { useToast } from "../hooks/useToast";
import { StatusBadge } from "../components/common/Badge";
import { PageLoader } from "../components/common/Spinner";
import ExtractedDataEditor from "../components/documents/ExtractedDataEditor";
import VerifyRejectModal from "../components/documents/VerifyRejectModal";
import DocumentPreview from "../components/documents/DocumentPreview";
import { fmtDate, fmtBytes, canVerify } from "../utils/helpers";

export default function DocumentDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const toast = useToast();
    const { current: doc, loading, audit } = useSelector((s) => s.docs);
    const user = useSelector((s) => s.auth.user);

    const [modal, setModal] = useState(null); // 'verify' | 'reject'
    const [actionLoading, setActionLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAudit, setShowAudit] = useState(false);
    const [showPreview, setShowPreview] = useState(true); // preview open by default

    useEffect(() => {
        dispatch(fetchDoc(Number(id)));
        return () => dispatch(clearCurrent());
    }, [id, dispatch]);

    const handleSave = async (data) => {
        setSaving(true);
        const res = await dispatch(
            updateDoc({ id: Number(id), extracted_data: data }),
        );
        setSaving(false);
        if (res.error) toast.error(res.payload || "Save failed.");
        else toast.success("Changes saved.");
    };

    const handleVerifyReject = async (remark) => {
        setActionLoading(true);
        const action = modal === "verify" ? verifyDoc : rejectDoc;
        const res = await dispatch(action({ id: Number(id), remark }));
        setActionLoading(false);
        if (res.error) toast.error(res.payload || "Action failed.");
        else {
            toast.success(
                modal === "verify"
                    ? "Document verified."
                    : "Document rejected.",
            );
            setModal(null);
        }
    };

    const loadAudit = () => {
        setShowAudit((v) => !v);
        if (!audit[id]) dispatch(fetchAudit(Number(id)));
    };

    if (loading && !doc) return <PageLoader />;
    if (!doc)
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Document not found.</p>
                <Link
                    to="/documents"
                    className="btn-secondary btn-sm mt-4 inline-flex"
                >
                    ← Back
                </Link>
            </div>
        );

    const isVerified = doc.status === "verified";
    const myRole = user?.role;

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link
                    to="/documents"
                    className="hover:text-gray-700 transition-colors"
                >
                    Documents
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium truncate">
                    {doc.original_filename}
                </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-lg font-bold text-gray-900">
                            {doc.original_filename}
                        </h1>
                        <StatusBadge status={doc.status} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                        Document #{doc.id} · {fmtBytes(doc.file_size_bytes)} ·{" "}
                        {doc.mime_type}
                    </p>
                </div>

                {canVerify(myRole) && doc.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setModal("reject")}
                            className="btn-danger btn-sm"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => setModal("verify")}
                            className="btn-success btn-sm"
                        >
                            Verify
                        </button>
                    </div>
                )}
            </div>

            {/* Status banners */}
            {doc.status === "rejected" && doc.verification_remark && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                    <p className="font-semibold text-red-700 mb-0.5">
                        Rejected
                    </p>
                    <p className="text-red-600">{doc.verification_remark}</p>
                </div>
            )}
            {doc.status === "verified" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
                    <p className="font-semibold text-emerald-700 mb-0.5">
                        Verified {fmtDate(doc.verified_at)}
                    </p>
                    {doc.verification_remark && (
                        <p className="text-emerald-600">
                            {doc.verification_remark}
                        </p>
                    )}
                </div>
            )}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] items-start">
                {/* Extracted data */}
                <div className="card overflow-hidden border-gray-200/80 shadow-sm shadow-gray-200/70">
                    <div className="card-header bg-white/90 backdrop-blur">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Extracted data
                            </h2>
                            {!isVerified && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Review and refine extracted fields before verification
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="card-body bg-gradient-to-b from-white to-gray-50/60">
                        {doc.extracted_data ? (
                            <ExtractedDataEditor
                                key={doc.id + JSON.stringify(doc.extracted_data)}
                                data={doc.extracted_data}
                                onSave={handleSave}
                                saving={saving}
                                readOnly={isVerified}
                            />
                        ) : (
                            <p className="text-sm text-gray-400">
                                No extracted data available.
                            </p>
                        )}
                    </div>
                </div>

                {/* File preview */}
                <div className="card overflow-hidden border-gray-200/80 shadow-sm shadow-gray-200/70 xl:sticky xl:top-6">
                    <button
                        onClick={() => setShowPreview((v) => !v)}
                        className="card-header w-full text-left cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl bg-white/90 backdrop-blur"
                    >
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-gray-400 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.75}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    File preview
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    Live document view with quick download access
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                            {showPreview ? "Hide" : "Show"}
                            <svg
                                className={`w-3.5 h-3.5 transition-transform ${showPreview ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </button>

                    {showPreview && (
                        <div className="p-4 bg-gradient-to-b from-gray-50/70 to-white">
                            <DocumentPreview
                                docId={doc.id}
                                mimeType={doc.mime_type}
                                filename={doc.original_filename}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Metadata */}
            <div className="card card-body">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Details
                </h2>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                    {[
                        { label: "Uploaded", value: fmtDate(doc.uploaded_at) },
                        {
                            label: "Status",
                            value: <StatusBadge status={doc.status} />,
                        },
                        {
                            label: "File size",
                            value: fmtBytes(doc.file_size_bytes),
                        },
                        { label: "MIME type", value: doc.mime_type || "—" },
                        {
                            label: "Verified at",
                            value: fmtDate(doc.verified_at),
                        },
                        {
                            label: "Remark",
                            value: doc.verification_remark || "—",
                        },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <dt className="field-label">{label}</dt>
                            <dd className="text-gray-700 mt-0.5">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Audit log */}
            {canVerify(myRole) && (
                <div className="card">
                    <div
                        className="card-header cursor-pointer"
                        onClick={loadAudit}
                    >
                        <h2 className="text-sm font-semibold text-gray-900">
                            Audit trail
                        </h2>
                        <span className="text-xs text-gray-400">
                            {showAudit ? "Hide" : "Show"}
                        </span>
                    </div>
                    {showAudit && (
                        <div className="px-6 py-4 space-y-2">
                            {!audit[id] ? (
                                <p className="text-sm text-gray-400">
                                    Loading…
                                </p>
                            ) : audit[id].length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    No audit entries.
                                </p>
                            ) : (
                                audit[id].map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-gray-700 capitalize">
                                                {log.action.replace("_", " ")}
                                            </span>
                                            {log.detail && (
                                                <span className="text-gray-400 ml-2 text-xs">
                                                    — {log.detail}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 shrink-0">
                                            {fmtDate(log.timestamp)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            <VerifyRejectModal
                open={!!modal}
                mode={modal}
                onClose={() => setModal(null)}
                onSubmit={handleVerifyReject}
                loading={actionLoading}
            />
        </div>
    );
}
