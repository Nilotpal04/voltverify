import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchDocs } from "../store/slices/documentsSlice";
import { StatusBadge } from "../components/common/Badge";
import { InlineLoader } from "../components/common/Spinner";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import DateRangePicker from "../components/documents/DateRangePicker";
import { fmtDate, fmtBytes, canVerify } from "../utils/helpers";

const STATUSES = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
];

export default function DocumentsPage() {
    const dispatch = useDispatch();
    const { items, total, loading, pageSize, error } = useSelector(
        (s) => s.docs,
    );
    const role = useSelector((s) => s.auth.user?.role);
    const [params, setParams] = useSearchParams();

    const page = parseInt(params.get("page") || "1", 10);
    const status = params.get("status") || "";
    const dateFrom = params.get("date_from") || "";
    const dateTo = params.get("date_to") || "";

    const isAdmin = canVerify(role); // true for admin + super_admin

    useEffect(() => {
        const p = { page, page_size: pageSize };
        if (status) p.status = status;
        // Date filtering is admin-only — only send it if the user can actually use it
        if (isAdmin && dateFrom) p.date_from = dateFrom;
        if (isAdmin && dateTo) p.date_to = dateTo;
        dispatch(fetchDocs(p));
    }, [dispatch, page, status, pageSize, dateFrom, dateTo, isAdmin]);

    const setFilter = (key, val) => {
        const next = new URLSearchParams(params);
        if (val) next.set(key, val);
        else next.delete(key);
        next.set("page", "1");
        setParams(next);
    };

    const setDateRange = ({ from, to }) => {
        const next = new URLSearchParams(params);
        if (from) next.set("date_from", from);
        else next.delete("date_from");
        if (to) next.set("date_to", to);
        else next.delete("date_to");
        next.set("page", "1");
        setParams(next);
    };

    const hasDateFilter = isAdmin && (dateFrom || dateTo);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Documents
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {total} total
                    </p>
                </div>
                <Link to="/upload" className="btn-primary btn-sm">
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Upload
                </Link>
            </div>

            {/* Status filters */}
            <div className="flex items-center gap-2 flex-wrap">
                {STATUSES.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => setFilter("status", s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${status === s.value ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Date range filter — admin / super_admin only */}
            {isAdmin && (
                <div className="card card-body py-3.5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Upload date
                        </div>
                        <DateRangePicker
                            from={dateFrom}
                            to={dateTo}
                            onChange={setDateRange}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                    {error}
                </div>
            )}

            <div className="card">
                {loading ? (
                    <InlineLoader />
                ) : items.length === 0 ? (
                    <EmptyState
                        icon={
                            <svg
                                className="w-16 h-16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        }
                        title="No documents found"
                        description={
                            hasDateFilter
                                ? "No documents were uploaded in the selected date range."
                                : status
                                  ? `No ${status} documents.`
                                  : "Upload a document to get started."
                        }
                        action={
                            <Link to="/upload" className="btn-primary btn-sm">
                                Upload document
                            </Link>
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="tbl-th">#</th>
                                        <th className="tbl-th">Filename</th>
                                        <th className="tbl-th hidden md:table-cell">
                                            Size
                                        </th>
                                        <th className="tbl-th">Status</th>
                                        <th className="tbl-th hidden lg:table-cell">
                                            Uploaded
                                        </th>
                                        <th className="tbl-th text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((doc) => (
                                        <tr key={doc.id} className="tbl-tr">
                                            <td className="tbl-td font-mono text-gray-400 text-xs">
                                                {doc.id}
                                            </td>
                                            <td className="tbl-td">
                                                <span className="font-medium text-gray-900 max-w-[200px] block truncate">
                                                    {doc.original_filename}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {doc.mime_type}
                                                </span>
                                            </td>
                                            <td className="tbl-td hidden md:table-cell text-gray-400">
                                                {fmtBytes(doc.file_size_bytes)}
                                            </td>
                                            <td className="tbl-td">
                                                <StatusBadge
                                                    status={doc.status}
                                                />
                                            </td>
                                            <td className="tbl-td hidden lg:table-cell text-gray-400 text-xs">
                                                {fmtDate(doc.uploaded_at)}
                                            </td>
                                            <td className="tbl-td text-right">
                                                <Link
                                                    to={`/documents/${doc.id}`}
                                                    className="btn-ghost btn-sm text-gray-500"
                                                >
                                                    View →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 pb-4">
                            <Pagination
                                page={page}
                                pageSize={pageSize}
                                total={total}
                                onPage={(p) => setFilter("page", p.toString())}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
