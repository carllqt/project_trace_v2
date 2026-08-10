import { Head, Link, useForm } from "@inertiajs/react";
import Lottie from "lottie-react";
import shoppingCartAnimation from "../assets/shopping-cart.json";
import {
    BarChart3,
    ClipboardCheck,
    Eye,
    LockKeyhole,
    LogIn,
    ShieldCheck,
    Truck,
    UserRound,
} from "lucide-react";

export default function Welcome({ canResetPassword, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const submit = (event) => {
        event.preventDefault();
        post(route("login"), { onFinish: () => reset("password") });
    };
    return (
        <>
            <Head title="Procurement Tracking System" />
            <main className="relative h-screen overflow-hidden bg-[#f9fbff] text-[#111c3d]">
                <div className="pointer-events-none absolute -bottom-8 left-0 h-[62%] w-[62%] bg-[url('/sdo-ilagan-building.jpg')] bg-cover bg-center opacity-50" />
                <div className="pointer-events-none absolute -bottom-8 left-0 h-[66%] w-[64%] bg-[linear-gradient(to_bottom,rgba(249,251,255,1)_0%,rgba(249,251,255,.78)_28%,rgba(249,251,255,.25)_68%,rgba(249,251,255,.08)_100%)]" />
                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 1536 1024"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient
                            id="wave-blue"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >
                            <stop offset="0" stopColor="#0b4196" />
                            <stop offset="1" stopColor="#002d78" />
                        </linearGradient>
                        <filter
                            id="wave-glow"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feDropShadow
                                dx="-28"
                                dy="-12"
                                stdDeviation="30"
                                floodColor="#ffffff"
                                floodOpacity="0.52"
                            />
                        </filter>
                    </defs>
                    <path fill="url(#wave-blue)" d="M0 930H1536V1024H0Z" />
                    <path
                        filter="url(#wave-glow)"
                        fill="url(#wave-blue)"
                        d="M1536 207C1418 226 1330 306 1238 420C1110 579 980 754 858 844C775 905 705 963 650 1024H1536Z"
                    />
                </svg>
                <div className="pointer-events-none absolute right-8 top-6 grid grid-cols-10 gap-3 opacity-25">
                    {Array.from({ length: 70 }).map((_, index) => (
                        <span
                            key={index}
                            className="h-1 w-1 rounded-full bg-[#1653aa]"
                        />
                    ))}
                </div>

                <div className="relative z-10 grid h-screen lg:grid-cols-[1.15fr_.85fr]">
                    <section className="relative flex h-screen flex-col px-8 pt-10 sm:px-12 lg:px-[6.5vw] lg:pt-12">
                        <div className="flex items-center gap-3 text-[#082b7d]">
                            <img
                                src="/deped-logo.png"
                                alt="Department of Education seal"
                                className="h-[68px] w-[68px] rounded-full object-contain"
                            />
                            <p className="text-lg font-bold leading-tight sm:text-xl">
                                SCHOOLS DIVISION OFFICE
                                <br />
                                CITY OF ILAGAN
                            </p>
                        </div>

                        <div className="mt-6 max-w-2xl">
                            <p className="text-2xl font-medium tracking-tight sm:text-3xl">
                                Welcome to
                            </p>
                            <h1 className="mt-1.5 text-4xl font-black leading-[.98] tracking-tight text-[#092b7c] sm:text-5xl xl:text-6xl">
                                PROCUREMENT
                                <br />
                                TRACKING SYSTEM
                            </h1>
                            <div className="mt-4 h-[3px] w-32 bg-[#f6b400]" />
                            <p className="mt-4 max-w-xl text-sm leading-6 text-[#142040] sm:text-base">
                                A centralized platform for monitoring and
                                managing procurement processes across all
                                schools and offices under the Schools Division
                                Office – Ilagan City.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4 text-xs">
                            <Feature
                                icon={<ClipboardCheck />}
                                title="Track"
                                text="Procurement Activities"
                            />
                            <Feature
                                icon={<Truck />}
                                title="Monitor"
                                text="Delivery and Status"
                            />
                            <Feature
                                icon={<BarChart3 />}
                                title="Generate"
                                text="Reports and Analytics"
                            />
                        </div>
                    </section>

                    <section className="relative flex h-screen items-center justify-center px-8 py-10">
                        <form
                            onSubmit={submit}
                            className="w-full max-w-[530px] rounded-2xl bg-white px-10 py-9 shadow-[0_18px_45px_rgba(20,42,85,.16)]"
                        >
                            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#edf4ff]">
                                <Lottie
                                    animationData={shoppingCartAnimation}
                                    loop
                                    className="h-24 w-24"
                                    aria-label="Animated shopping cart"
                                />
                            </div>
                            <h2 className="mt-3 text-center text-lg font-bold text-[#102f7c]">
                                Login to Your Account
                            </h2>
                            <p className="mt-1 text-center text-xs text-[#52607d]">
                                Enter your credentials to access the system
                            </p>
                            <label className="mt-5 block text-xs font-medium">
                                Username
                                <div className="relative mt-1.5">
                                    <UserRound
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71809f]"
                                        size={15}
                                    />
                                    <input
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#bdc8dc] py-2 pl-9 text-xs outline-none"
                                        placeholder="Enter your username"
                                        autoFocus
                                    />
                                </div>
                            </label>
                            {errors.email && (
                                <p className="text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                            <label className="mt-3 block text-xs font-medium">
                                Password
                                <div className="relative mt-1.5">
                                    <LockKeyhole
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71809f]"
                                        size={15}
                                    />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#bdc8dc] py-2 pl-9 text-xs outline-none"
                                        placeholder="Enter your password"
                                    />
                                    <Eye
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71809f]"
                                        size={15}
                                    />
                                </div>
                            </label>
                            <div className="mt-3 flex justify-between text-[11px]">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="mr-1.5"
                                    />
                                    Remember me
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-[#0756d9]"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <button
                                disabled={processing}
                                className="mt-5 flex w-full justify-center gap-2 rounded-lg bg-[#093887] py-2.5 text-xs font-bold text-white"
                            >
                                <LogIn size={17} />
                                LOGIN
                            </button>
                            <div className="my-6 flex items-center gap-4 text-sm">
                                <span className="h-px flex-1 bg-slate-300" />
                                or
                                <span className="h-px flex-1 bg-slate-300" />
                            </div>
                            <button
                                type="button"
                                className="flex w-full justify-center gap-3 rounded-lg border border-[#5770a4] py-3 font-semibold text-[#0a2875]"
                            >
                                <ShieldCheck size={20} />
                                Login with SDO Ilagan Account
                            </button>
                            <p className="mt-6 text-center text-sm text-[#50607f]">
                                For assistance, please contact the ICT Unit.
                            </p>
                        </form>
                    </section>
                </div>
                <div className="absolute bottom-0 left-0 z-20 flex w-full items-center gap-3 px-8 py-3 text-white lg:w-[58%] lg:px-[4.5vw]">
                    <ShieldCheck size={28} strokeWidth={1.7} />
                    <p className="text-[11px] leading-4">
                        <strong>Secure. Transparent. Efficient.</strong>
                        <br />
                        Building accountability in every transaction.
                    </p>
                </div>
            </main>
        </>
    );
}

function Feature({ icon, title, text }) {
    return (
        <div className="flex max-w-[145px] items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#0756d9] shadow-[0_5px_16px_rgba(20,52,104,.18)]">
                {icon}
            </div>
            <p className="leading-[1.25]">
                <strong className="text-[#082b81]">{title}</strong>
                <br />
                {text}
            </p>
        </div>
    );
}
