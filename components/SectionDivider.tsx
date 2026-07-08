export default function SectionDivider() {
  return (
    <div
      className="flex w-full flex-col"
      role="separator"
      aria-hidden="true"
    >
      <div className="h-0 w-full border-t-2 border-primary" />
      <div className="h-0 w-full border-t-4 border-accent-light" />
    </div>
  );
}
