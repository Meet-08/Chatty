"use client";

import { THEMES } from "@/lib/constants";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();

  if (!resolvedTheme) return null;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
      {THEMES.map((theme) => (
        <button
          key={theme}
          className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === theme ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
          onClick={() => setTheme(theme)}
        >
          <div
            className="relative h-8 w-full rounded-md overflow-hidden"
            data-theme={theme}
          >
            <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
              <div className="rounded bg-primary"></div>
              <div className="rounded bg-secondary"></div>
              <div className="rounded bg-accent"></div>
              <div className="rounded bg-neutral"></div>
            </div>
          </div>
          <span className="text-[11px] font-medium truncate w-full text-center">
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
};
export default ThemeSwitcher;
