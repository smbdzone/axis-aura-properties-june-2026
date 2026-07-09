import {
  sessionTableColumns,
  sessionTableRows,
  sessionTableTitle,
  type SessionTableRow,
} from "@/components/data/sessionTableData";

function SessionTableRowItem({ row }: { row: SessionTableRow }) {
  return (
    <div className="flex h-16 items-center rounded-xl border-[1.5px] border-accent-light px-6 py-3">
      <div className="grid w-full grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.45fr))] items-center gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <input
            type="checkbox"
            aria-label={`Select ${row.country}`}
            className="size-[23px] shrink-0 appearance-none rounded-lg border border-accent-light bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-primary checked:bg-primary"
          />
          <span className="truncate font-sans text-2xl font-bold leading-[33px] text-primary">
            {row.country}
          </span>
        </div>

        <span className="text-center font-sans text-xl font-medium leading-[26px] text-[rgba(0,48,73,0.8)]">
          {row.sessions}
        </span>
        <span className="text-center font-sans text-xl font-medium leading-[26px] text-[rgba(0,48,73,0.8)]">
          {row.clicks}
        </span>
        <span className="text-center font-sans text-xl font-medium leading-[26px] text-[rgba(0,48,73,0.8)]">
          {row.reach}
        </span>
      </div>
    </div>
  );
}

export default function SessionTableSection() {
  return (
    <section className="flex w-full flex-col gap-8">
      <h2 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        Session Table
      </h2>

      <div className="flex w-full flex-col gap-2.5 rounded-2xl border-[1.5px] border-accent-light bg-white p-4">
        <div className="border-b-[1.5px] border-accent-light pb-2.5">
          <h3 className="font-sans text-2xl font-bold leading-[33px] text-primary">
            {sessionTableTitle}
          </h3>
        </div>

        <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.45fr))] items-center gap-4 px-6 pt-1">
          <span className="font-sans text-sm font-bold leading-[19px] text-black/60">
            {sessionTableColumns[0].label}
          </span>
          {sessionTableColumns.slice(1).map((column) => (
            <span
              key={column.key}
              className="text-center font-sans text-sm font-bold leading-[19px] text-black/60"
            >
              {column.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {sessionTableRows.map((row) => (
            <SessionTableRowItem key={row.id} row={row} />
          ))}
        </div>
      </div>
    </section>
  );
}
