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
import { Footer } from "@/components/sections/Footer";
import { ScrollTrigger } from "@/lib/gsap";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (loaded) ScrollTrigger.refresh();
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
      </main>
      <Footer />
    </>
  );
}
