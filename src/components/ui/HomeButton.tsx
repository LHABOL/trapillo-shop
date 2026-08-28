"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

export function HomeButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const goHome = () => {
    if (pathname !== "/") {
      router.push("/");
      return;
    }
    scrollTo(0, { duration: 2 });
  };

  return (
    <button
      type="button"
      onClick={goHome}
      data-cursor="INICIO"
      aria-label="Volver al inicio"
      className={clsx(
        "group fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-ink/20 bg-ivory/70 px-3 py-2 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-ink/70 backdrop-blur-md transition-all duration-500 ease-cinema hover:border-ink/50 hover:text-ink",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full bg-clay transition-transform duration-500 group-hover:scale-150"
      />
      Home
    </button>
  );
}
