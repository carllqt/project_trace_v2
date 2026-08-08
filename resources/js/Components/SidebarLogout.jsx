import { usePage, Link } from "@inertiajs/react";
import { LogOut } from "lucide-react";

export function SidebarLogout() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "U";

    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/40 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40">
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                    {initials}
                </div>
                <div className="flex flex-col min-w-0 text-xs">
                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                        {user?.name}
                    </span>
                    <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {user?.email}
                    </span>
                </div>
            </div>

            <Link
                href={route("logout")}
                method="post"
                as="button"
                aria-label="Log out"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-600 transition"
            >
                <LogOut className="size-4" />
            </Link>
        </div>
    );
}
