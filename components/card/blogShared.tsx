import Link from "next/link";

type ReadMoreLinkProps = {
  href: string;
  className?: string;
};

export default function ReadMoreLink({ href, className = "" }: ReadMoreLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-[37px] w-[111px] items-center justify-center rounded-full border-[1.5px] border-accent-light bg-white px-6 py-2 font-sans text-xs leading-4 text-primary transition-opacity hover:opacity-80 ${className}`}
    >
      Read More
    </Link>
  );
}

function BlogCardBlur({ variant }: { variant: "featured" | "compact" }) {
  if (variant === "featured") {
    return (
      <>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[189px] -top-[135px] h-[955px] w-[103px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-8 top-[185px] h-[948px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
        />
      </>
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[52px] -top-[357px] h-[955px] w-[103px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[213px] -top-[217px] h-[948px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
    </>
  );
}

export { BlogCardBlur };
