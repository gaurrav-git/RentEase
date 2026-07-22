function StatCard({
    title,
    value,
    subtitle,
    icon,
    iconBg,
}) {
    return (
        <div
            className="
                rounded-2xl
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-900
                p-5
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-md
            "
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default StatCard;