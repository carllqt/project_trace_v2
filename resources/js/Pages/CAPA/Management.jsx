import { Head, router, useForm, usePage } from "@inertiajs/react";
import { CalendarPlus, ClipboardList, FileSpreadsheet, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";

const emptyForm = { date: "", activity: "", participants: "", lead_division: "", venue: "", remarks: "" };
const fields = [
    ["date", "Date", "date", ""],
    ["activity", "Activity", "text", "e.g. Division planning workshop"],
    ["participants", "Participants", "text", "e.g. School heads and coordinators"],
    ["lead_division", "Lead Division", "text", "e.g. Curriculum Implementation Division"],
    ["venue", "Venue", "text", "e.g. Division Conference Hall"],
    ["remarks", "Remarks", "text", "Add any notes or reminders"],
];

export default function Management({ activities }) {
    const { flash = {} } = usePage().props;
    const form = useForm(emptyForm);
    const importForm = useForm({ rows: [] });
    const fileRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    useEffect(() => { if (flash.success) toast.success(flash.success); }, [flash.success]);

    const submit = (event) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { form.reset(); setEditingActivity(null); setShowForm(false); } };
        if (editingActivity) form.put(route("capa.update", editingActivity.id), options);
        else form.post(route("capa.store"), options);
    };

    const closeForm = () => {
        form.clearErrors();
        form.reset();
        setEditingActivity(null);
        setShowForm(false);
    };

    const openAddForm = () => {
        form.reset();
        form.clearErrors();
        setEditingActivity(null);
        setShowForm(true);
    };

    const openEditForm = (activity) => {
        form.clearErrors();
        form.setData({
            date: String(activity.date).slice(0, 10),
            activity: activity.activity ?? "",
            participants: activity.participants ?? "",
            lead_division: activity.lead_division ?? "",
            venue: activity.venue ?? "",
            remarks: activity.remarks ?? "",
        });
        setEditingActivity(activity);
        setShowForm(true);
    };

    const normalizeKey = (key) => String(key).trim().toLowerCase().replace(/\s+/g, "_");
    const excelDate = (value) => {
        if (typeof value === "number") {
            const parsed = XLSX.SSF.parse_date_code(value);
            return parsed ? `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}` : "";
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-CA");
    };

    const importExcel = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
            const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
            const rows = rawRows.map((raw) => Object.fromEntries(Object.entries(raw).map(([key, value]) => [normalizeKey(key), value])))
                .map((row) => ({
                    date: excelDate(row.date), activity: String(row.activity ?? "").trim(), participants: String(row.participants ?? "").trim(),
                    lead_division: String(row.lead_division ?? "").trim(), venue: String(row.venue ?? "").trim(), remarks: String(row.remarks ?? "").trim(),
                })).filter((row) => row.date && row.activity);
            if (!rows.length) throw new Error("No valid rows found. Check the Date and Activity columns.");
            importForm.setData("rows", rows);
            router.post(route("capa.import"), { rows }, { preserveScroll: true, onSuccess: () => { toast.success(`${rows.length} rows imported.`); fileRef.current.value = ""; }, onError: () => toast.error("Some spreadsheet rows are invalid.") });
        } catch (error) { toast.error(error.message || "Unable to read the spreadsheet."); }
    };

    return (
        <MainLayout>
            <Head title="CAPA Management" />
            <BreadCrumbsHeader breadcrumbs={[{ label: "CAPA Management", showOnMobile: true }]} />
            <div className="min-h-[calc(100vh-65px)] p-5 md:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div><h1 className="text-2xl font-extrabold text-slate-900">CAPA Management</h1><p className="mt-1 text-sm text-slate-500">Add activities manually or import an Excel file.</p></div>
                        <div className="flex gap-2">
                            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={importExcel} className="hidden" />
                            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100"><Upload className="size-4" /> Import Excel</button>
                            <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20"><Plus className="size-4" /> Add Activity</button>
                        </div>
                    </div>

                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]" onClick={form.processing ? undefined : closeForm} />
                            <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                                <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <CalendarPlus className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900">{editingActivity ? "Edit CAPA Activity" : "Add CAPA Activity"}</h2>
                                            <p className="mt-0.5 text-[11px] font-medium text-slate-500">{editingActivity ? "Update the selected calendar activity" : "Create a new calendar of activities entry"}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={closeForm} disabled={form.processing} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close modal"><X className="h-4 w-4" /></button>
                                </div>

                                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                                    <div className="overflow-y-auto px-6 py-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ClipboardList className="h-3.5 w-3.5" /></div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-800">Activity Information</h3>
                                                <p className="text-[10px] font-medium text-slate-400">Schedule and details of the CAPA activity</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                            {fields.map(([name, label, type, placeholder]) => (
                                                <div key={name} className={name === "remarks" ? "sm:col-span-2" : ""}>
                                                    <InputField label={label} name={name} type={type} placeholder={placeholder} value={form.data[name]} onChange={(e) => form.setData(name, e.target.value)} required={["date", "activity"].includes(name)} isTextarea={name === "remarks"} rows={3} />
                                                    <InputError message={form.errors[name]} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                                        <p className="hidden text-[10px] font-medium text-slate-400 sm:block">Fields marked with <span className="text-red-500">*</span> are required.</p>
                                        <div className="ml-auto flex items-center gap-2">
                                            <button type="button" onClick={closeForm} disabled={form.processing} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
                                            <button type="submit" disabled={form.processing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                                                {form.processing ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving...</> : <><Save className="h-3.5 w-3.5" />{editingActivity ? "Update Activity" : "Save Activity"}</>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b px-5 py-4"><FileSpreadsheet className="size-5 text-emerald-600" /><h2 className="font-extrabold text-slate-800">Activity Records</h2><span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{activities.length}</span></div>
                        <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Date", "Activity", "Participants", "Lead Division", "Venue", "Remarks", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-extrabold">{h}</th>)}</tr></thead>
                            <tbody className="divide-y">{activities.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="whitespace-nowrap px-4 py-3 font-bold text-slate-700">{new Date(`${String(item.date).slice(0, 10)}T00:00:00`).toLocaleDateString()}</td><td className="px-4 py-3 font-semibold text-slate-800">{item.activity}</td><td className="px-4 py-3 text-slate-600">{item.participants || "—"}</td><td className="px-4 py-3 text-slate-600">{item.lead_division || "—"}</td><td className="px-4 py-3 text-slate-600">{item.venue || "—"}</td><td className="px-4 py-3 text-slate-600">{item.remarks || "—"}</td><td className="whitespace-nowrap px-4 py-3"><button onClick={() => openEditForm(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit"><Pencil className="size-4" /></button><button onClick={() => confirm("Delete this CAPA activity?") && router.delete(route("capa.destroy", item.id), { preserveScroll: true })} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="size-4" /></button></td></tr>)}</tbody>
                        </table>{!activities.length && <p className="py-12 text-center text-sm text-slate-500">No CAPA activities yet.</p>}</div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Excel columns: Date, Activity, Participants, Lead Division, Venue, Remarks. Date and Activity are required.</p>
                </div>
            </div>
        </MainLayout>
    );
}
