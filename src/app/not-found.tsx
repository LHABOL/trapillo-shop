import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-6 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-4 text-walnut">Este hilo se cortó.</h1>
        <p className="mt-5 text-ash">La página que buscas no existe o cambió de lugar.</p>
        <Link
          href="/"
          className="mt-8 inline-block border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.22em]"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
