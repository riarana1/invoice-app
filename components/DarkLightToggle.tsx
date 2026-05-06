"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

export default function DarkLightToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use a timeout to avoid the "cascading renders" error in React 19
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:text-gray-300 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <IoSunnySharp size={18} />
      ) : (
        <IoMoonSharp size={18} />
      )}
    </button>
  );
}