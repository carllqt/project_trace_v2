export const normalizePR = (data) => {
    if (!data) {
        return null;
    }

    const stage = Number(
        data.stage ??
            data.stage_number ??
            String(data.status ?? "").replace("stage_", "") ??
            1,
    );

    return {
        ...data,

        stage: Number.isFinite(stage) && stage > 0 ? stage : 1,

        routes: Array.isArray(data.routes) ? data.routes : [],

        activity_logs: Array.isArray(data.activity_logs)
            ? data.activity_logs
            : [],

        documents: Array.isArray(data.documents) ? data.documents : [],

        stage_data:
            data.stage_data && typeof data.stage_data === "object"
                ? data.stage_data
                : {},

        current_department:
            data.current_department ??
            data.department ??
            data.currentDepartment ??
            "",

        route_status: data.route_status ?? "pending",

        status: data.status ?? "in_progress",
    };
};
