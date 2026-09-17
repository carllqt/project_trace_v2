import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import Calendar from "./Partials/Calendar";
import Management from "./Partials/Management";

export default function Index({ activities, calendarActivities, calendarMonth, canManage = false }) {
    return (
        <MainLayout toasterProps={{ position: "top-right", closeButton: true, duration: 3500 }}>
            <Head title="CAPA" />
            <BreadCrumbsHeader breadcrumbs={[{ label: "CAPA", showOnMobile: true }]} />
            <div className="min-h-[calc(100vh-65px)] min-w-0 w-full p-5 md:p-8">
                <div className="min-w-0 w-full space-y-10">
                    {canManage && <Management activities={activities} />}
                    <Calendar
                        activities={activities}
                        calendarActivities={calendarActivities}
                        calendarMonth={calendarMonth}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
