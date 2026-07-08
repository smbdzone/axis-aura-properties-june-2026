import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { LuHeart, LuLink, LuMessageCircle } from "react-icons/lu";
import { newsEngagement } from "@/components/data/newsComments";

const shareLinks = [
  { label: "Copy link", href: "#", Icon: LuLink },
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "X (Twitter)", href: "#", Icon: FaXTwitter },
  { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  { label: "WhatsApp", href: "#", Icon: FaWhatsapp },
];

type NewsEngagementBarProps = {
  variant?: "page" | "comment";
  showReply?: boolean;
  likes?: string;
  comments?: string;
};

export default function NewsEngagementBar({
  variant = "page",
  showReply = false,
  likes = newsEngagement.likes,
  comments = newsEngagement.comments,
}: NewsEngagementBarProps) {
  const iconClass = variant === "page" ? "text-primary" : "text-[#333333]";
  const textClass = variant === "page" ? "text-primary" : "text-[#333333]";

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-4 max-lg:flex-col max-lg:items-center max-lg:gap-4",
        variant === "page" ? "w-full justify-between gap-8 lg:gap-[233px]" : "gap-4",
      ].join(" ")}
    >
      <div className="flex items-center gap-4 max-lg:justify-center">
        <div className={`flex items-center gap-1 ${textClass}`}>
          <LuHeart className={`size-6 ${iconClass}`} aria-hidden="true" />
          <span className="font-sans text-base leading-[22px]">{likes}</span>
        </div>
        <div className={`flex items-center gap-1 ${textClass}`}>
          <LuMessageCircle className={`size-6 ${iconClass}`} aria-hidden="true" />
          <span className="font-sans text-base leading-[22px]">{comments}</span>
        </div>
        {showReply ? (
          <button
            type="button"
            className="cursor-pointer font-sans text-base leading-[22px] text-black underline"
          >
            Reply
          </button>
        ) : null}
      </div>

      {variant === "page" ? (
        <div className="flex items-center gap-6 max-lg:justify-center max-lg:gap-5 lg:gap-8">
          {shareLinks.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="text-primary transition-opacity hover:opacity-80"
            >
              <Icon className="size-6" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
