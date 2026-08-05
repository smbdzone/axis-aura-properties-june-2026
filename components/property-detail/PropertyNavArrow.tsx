import Image from "next/image";

type PropertyNavArrowProps = {
  direction: "left" | "right";
  label: string;
  onClick: () => void;
  className?: string;
};

export default function PropertyNavArrow({
  direction,
  label,
  onClick,
  className = "",
}: PropertyNavArrowProps) {
  const src =
    direction === "left" ? "/New folder/left.svg" : "/New folder/right.svg";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex shrink-0 items-center justify-center p-2.5 transition-opacity hover:opacity-80 ${className}`}
    >
      <Image
        src={src}
        alt=""
        width={28}
        height={38}
        className="h-[37px] w-[26.5px]"
        aria-hidden="true"
      />
    </button>
  );
}
