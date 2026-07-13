import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

const primaryNavLinks = [
  { label: "New Projects", href: "/new-project" },
  { label: "Developers", href: "/developers" },
  { label: "Residential", href: "/residential" },
  { label: "Commercial", href: "/commercial" },
  { label: "News & Regulations", href: "/news-and-regulations" },
  { label: "Who We Are", href: "/about" },
  { label: "Careers", href: "/career" },
];

const secondaryNavLinks = [
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const socialLinks = [
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "X (Twitter)", href: "#", Icon: FaXTwitter },
  { label: "TikTok", href: "#", Icon: FaTiktok },
  { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[52px] -top-[357px] hidden h-[955px] w-[103px] rotate-[29.59deg] bg-accent-light/20 blur-[50px] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[213px] -top-[217px] hidden h-[948px] w-[88px] rotate-[29.96deg] bg-accent-light/20 blur-[50px] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[510px] -top-[75px] hidden h-[948px] w-[88px] rotate-[29.96deg] bg-accent-light/20 blur-[50px] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[941px] -top-[172px] hidden h-[948px] w-[88px] rotate-[29.96deg] bg-accent-light/20 blur-[50px] min-[701px]:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-6 pt-8 max-[700px]:gap-6 min-[701px]:min-h-[374px] min-[701px]:px-6 min-[701px]:pb-8 min-[701px]:pt-6 lg:px-[127px]">
        <div className="flex flex-col items-center gap-8 max-[700px]:gap-6 lg:grid lg:grid-cols-[150px_1fr_94px] lg:items-start lg:gap-x-8">
          <div className="order-2 flex w-full max-w-xs flex-col gap-3 max-[700px]:items-center max-[700px]:text-center min-[701px]:gap-4 lg:order-1 lg:max-w-none lg:items-start lg:pt-12 lg:text-left">
            <h2 className="font-sans text-xl font-bold leading-[18px] text-white min-[701px]:text-2xl">
              Reach Us
            </h2>
            <address className="flex flex-col gap-3 font-sans text-sm leading-5 text-white not-italic min-[701px]:gap-4 min-[701px]:leading-4">
              <a href="tel:+971123123123" className="transition-opacity hover:opacity-80">
                +971 123 123 123
              </a>
              <a
                href="mailto:info@axisaura.com"
                className="transition-opacity hover:opacity-80"
              >
                info@axisaura.com
              </a>
              <span>
                Dubai, Barari Lagoons
                <br />
                Example city, 1234
              </span>
            </address>
          </div>

          <div className="order-1 flex w-full flex-col items-center gap-6 max-[700px]:gap-5 lg:order-2 lg:gap-8">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.svg"
                alt="Axis Aura Real Estate"
                width={148}
                height={143}
                className="h-[92px] w-[95px] min-[701px]:h-[143px] min-[701px]:w-[148px]"
              />
            </Link>

            <nav
              aria-label="Footer navigation"
              className="flex w-full flex-col items-center gap-4 max-[700px]:max-w-sm"
            >
              <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-3 max-[700px]:justify-items-center min-[701px]:flex min-[701px]:flex-wrap min-[701px]:items-center min-[701px]:justify-center min-[701px]:gap-x-6">
                {primaryNavLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[13px] leading-[15px] text-white transition-opacity hover:opacity-80"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {secondaryNavLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[13px] leading-[15px] text-white transition-opacity hover:opacity-80"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="order-3 flex w-full flex-col items-center gap-3 max-[700px]:pt-2 min-[701px]:gap-4 lg:items-end lg:pt-5">
            <h2 className="font-sans text-base font-bold leading-[18px] text-white lg:text-right">
              Social Links
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    className="flex size-[30px] items-center justify-center rounded-full border-[1.5px] border-accent-light text-white transition-opacity hover:opacity-80"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mx-auto mt-8 w-full max-w-[1184px] border-t-[1.5px] border-accent-light min-[701px]:mt-10"
          aria-hidden="true"
        />

        <div className="mx-auto mt-5 flex w-full max-w-[1100px] flex-col items-center gap-2 px-2 text-center min-[701px]:mt-6 sm:flex-row sm:justify-center sm:gap-4">
          <p className="font-sans text-xs leading-5 text-white min-[701px]:text-sm min-[701px]:leading-4">
            @2025 Axis Aura Real Estate. All rights reserved
          </p>
          <span
            className="hidden font-sans text-2xl leading-7 text-white sm:inline"
            aria-hidden="true"
          >
            |
          </span>
          <p className="font-sans text-xs leading-5 text-white min-[701px]:text-sm min-[701px]:leading-4">
            Designed &amp; Developed by SMB DigitalZone.
          </p>
        </div>
      </div>
    </footer>
  );
}
