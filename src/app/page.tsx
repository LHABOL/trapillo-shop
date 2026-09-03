"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadingScreen } from "@/components/sections/LoadingScreen";
import { ConductorThread } from "@/components/sections/ConductorThread";
import { Hero } from "@/components/sections/Hero";
import { MadeToMeasure } from "@/components/sections/MadeToMeasure";
import { ThreadBeginning } from "@/components/sections/ThreadBeginning";
import { Craft } from "@/components/sections/Craft";
import { FloatingBags } from "@/components/sections/FloatingBags";
import { BrandIdentity } from "@/components/sections/BrandIdentity";
import { Finder } from "@/components/sections/Finder";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { Finale } from "@/components/sections/Finale";
import { Contact } from "@/components/sections/Contact";
import { LocationMap } from "@/components/sections/LocationMap";
import { CustomizeInvite } from "@/components/sections/CustomizeInvite";
import { Footer } from "@/components/sections/Footer";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  // Un único refresh autoritativo cuando ya montaron todas las secciones y el
  // loader terminó. Los pines dependen de que TODAS las alturas estén asentadas;
  // hacer refresh por sección producía posiciones mal calculadas en móvil.
  useEffect(() => {
    if (!loaded) return;
    registerGsap();
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    // el swap de fuentes cambia alturas → recalcular cuando estén listas
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("load", onLoad);
    };
  }, [loaded]);

  return (
    <>
      <LoadingScreen onDone={handleLoaded} />
      <ConductorThread />
      <main>
        <Hero />
        <MadeToMeasure />
        <ThreadBeginning />
        <Craft />
        <FloatingBags />
        <BrandIdentity />
        <Finder />
        <FeaturedCollection />
        <Finale />
        <Contact />
        <LocationMap />
        <CustomizeInvite />
      </main>
      <Footer />
    </>
  );
}
