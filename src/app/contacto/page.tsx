import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { LocationMap } from "@/components/sections/LocationMap";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp, Instagram o email. Taller en Roma Norte, CDMX.",
};

export default function ContactoPage() {
  return (
    <main className="bg-ivory pt-20 md:pt-28">
      <Contact />
      <LocationMap />
    </main>
  );
}
