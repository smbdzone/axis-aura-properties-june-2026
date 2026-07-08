import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 pt-[180px]">
      <h1 className="font-heading text-4xl font-bold text-primary">
        Property Not Found
      </h1>
      <p className="font-sans text-lg text-black/60">
        The property you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/new-project"
        className="rounded-3xl border border-accent-light px-8 py-3 font-heading text-xl font-medium text-white"
        style={{ background: "var(--gradient-metallic)" }}
      >
        Browse Properties
      </Link>
    </main>
  );
}
