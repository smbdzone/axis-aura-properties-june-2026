"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { notificationItems, type NotificationItem } from "@/components/data/notificationsAdmin";

const checkboxClassName =
  "size-[23px] shrink-0 appearance-none rounded-lg border border-[#669BBC] bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-[#003049] checked:bg-[#003049]";

type NotificationFilter = "all" | "unread";

function NotificationAvatar({ label }: { label: string }) {
  return (
    <div className="flex h-[50px] w-[47px] shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-[linear-gradient(130deg,#0A4F75_10%,#669BBC_60%,#003049_100%)]">
      <span className="font-[family-name:var(--font-sandena)] text-sm font-bold text-white">
        {label}
      </span>
    </div>
  );
}

function NotificationRow({
  item,
  checked,
  onToggle,
}: {
  item: NotificationItem;
  checked: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="relative flex items-center justify-between gap-6 rounded-xl border-[1.5px] border-[#669BBC] px-6 py-3">
      {item.unread ? (
        <span
          className="absolute -right-1 -top-2 h-4 w-4 rounded-full border-[1.5px] border-[#669BBC] bg-[#003049]"
          aria-label="Unread"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 items-center gap-8">
        <input
          type="checkbox"
          aria-label={`Select notification ${item.id}`}
          checked={checked}
          onChange={() => onToggle(item.id)}
          className={checkboxClassName}
        />

        <div className="flex min-w-0 flex-1 items-center gap-5">
          <NotificationAvatar label={item.avatarLabel} />

          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-2.5 gap-y-1">
            <p className="min-w-0 flex-1 font-[family-name:var(--font-sandena)] text-sm font-bold leading-[19px] text-[#333333]">
              {item.message}
            </p>
            <span className="shrink-0 font-[family-name:Helvetica,Arial,sans-serif] text-sm leading-[19px] text-black">
              {item.timeAgo}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="shrink-0 cursor-pointer text-[#003049]"
        aria-label={`Delete notification ${item.id}`}
      >
        <Icon icon="fluent:delete-16-regular" width={16} height={16} />
      </button>
    </div>
  );
}

export default function NotificationsSection() {
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const visibleItems = useMemo(
    () => (filter === "unread" ? notificationItems.filter((item) => item.unread) : notificationItems),
    [filter],
  );

  const toggleRow = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  };

  return (
    <section className="mx-auto flex w-full flex-col px-8 py-8">
      <div className="flex w-full flex-col gap-6 rounded-2xl border-[1.5px] border-[#669BBC] p-4">
        <div className="flex items-center gap-4 border-b border-[#669BBC] px-6 pb-4">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`flex h-[42px] items-center justify-center rounded-lg border-[1.5px] px-4 font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] ${
              filter === "all"
                ? "border-[#669BBC] bg-[#003049] text-white"
                : "border-[#669BBC] bg-white text-[#003049]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`flex h-[42px] items-center justify-center rounded border-[1.5px] px-4 font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] ${
              filter === "unread"
                ? "border-[#669BBC] bg-[#003049] text-white"
                : "border-[#669BBC] bg-white text-[#003049]"
            }`}
          >
            Unread
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {visibleItems.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              checked={selectedIds.includes(item.id)}
              onToggle={toggleRow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
