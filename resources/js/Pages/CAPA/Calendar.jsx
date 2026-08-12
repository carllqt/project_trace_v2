import { Head } from "@inertiajs/react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({ activities }) {
    const [month, setMonth] = useState(() => new Date());
    const cells = useMemo(() => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const first = new Date(year, monthIndex, 1).getDay();
        const count = new Date(year, monthIndex + 1, 0).getDate();
        return Array.from({ length: 42 }, (_, index) => {
            const day = index - first + 1;
            return day > 0 && day <= count ? day : null;
        });
    }, [month]);

    const activityMap = useMemo(() => activities.reduce((map, item) => {
        const key = String(item.date).slice(0, 10);
        map[key] = [...(map[key] ?? []), item];
        return map;
    }, {}), [activities]);

    const changeMonth = (amount) => setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));
    const monthLabel = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <MainLayout>
            <Head title="CAPA Calendar" />
            <BreadCrumbsHeader breadcrumbs={[{ label: "CAPA Calendar", showOnMobile: true }]} />
            <div className="min-h-[calc(100vh-65px)] p-5 md:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900"><CalendarDays className="text-blue-700" /> Calendar of Activities</h1>
                            <p className="mt-1 text-sm text-slate-500">View all scheduled CAPA activities.</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border bg-white p-1 shadow-sm">
                            <button onClick={() => changeMonth(-1)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Previous month"><ChevronLeft className="size-4" /></button>
                            <button onClick={() => setMonth(new Date())} className="min-w-40 px-3 text-sm font-bold text-slate-700">{monthLabel}</button>
                            <button onClick={() => changeMonth(1)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Next month"><ChevronRight className="size-4" /></button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-7 border-b bg-slate-50">
                            {days.map((day) => <div key={day} className="px-2 py-3 text-center text-xs font-extrabold uppercase tracking-wide text-slate-500">{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7">
                            {cells.map((day, index) => {
                                const key = day ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                                const items = key ? activityMap[key] ?? [] : [];
                                const today = key === new Date().toLocaleDateString("en-CA");
                                return <div key={index} className={`min-h-28 border-b border-r p-2 ${day ? "bg-white" : "bg-slate-50/70"}`}>
                                    {day && <span className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-bold ${today ? "bg-blue-700 text-white" : "text-slate-600"}`}>{day}</span>}
                                    <div className="mt-1 space-y-1.5">
                                        {items.map((item) => <div key={item.id} title={item.activity} className="rounded-lg border-l-4 border-blue-600 bg-blue-50 p-2 text-[11px] text-slate-700">
                                            <p className="font-bold leading-tight text-blue-900">{item.activity}</p>
                                        </div>)}
                                    </div>
                                </div>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
