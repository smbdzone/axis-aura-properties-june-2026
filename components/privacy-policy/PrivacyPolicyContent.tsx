import type { PrivacyPolicySection } from "@/components/data/privacyPolicy";

type PrivacyPolicyContentProps = {
  sections: PrivacyPolicySection[];
};

const defaultIntroText =
  "Your privacy matters to us. This policy explains how Axis Aura Real Estate collects, uses, and protects your personal information when you explore properties, connect with our team, or use our services.";

export default function PrivacyPolicyContent({ sections }: PrivacyPolicyContentProps) {
  if (sections.length === 0) {
    return (
      <section className="flex w-full justify-center px-6 py-12 lg:px-24">
        <p className="text-center font-sans text-base text-primary/70">
          Privacy policy content is currently unavailable. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Privacy policy content"
      className="flex w-full justify-center px-6 lg:px-24"
    >
      <div className="flex w-full max-w-[1248px] flex-col gap-8">
        <div
          className="rounded-2xl border-[1.5px] border-accent-light px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.08)] min-[701px]:px-10 min-[701px]:py-10"
          style={{ background: "var(--gradient-dark-metallic)" }}
        >
          <p className="text-center font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-[140%] text-white">
            {defaultIntroText}
          </p>
        </div>

        <div className="flex flex-col gap-8 pb-8">
          {sections.map((section) => (
            <article
              key={section.title}
              className="flex flex-col gap-4 rounded-2xl border-[1.5px] border-accent-light bg-white px-6 py-6 shadow-[0_0_30px_rgba(0,0,0,0.06)] min-[701px]:px-8 min-[701px]:py-8"
            >
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[120%] text-primary">
                {section.title}
              </h2>

              <div className="flex flex-col gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-sans text-[15px] leading-7 text-primary/80 min-[701px]:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.bullets ? (
                <ul className="flex flex-col gap-3 pl-1">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={`${section.title}-bullet-${bulletIndex}`}
                      className="flex gap-3 font-sans text-[15px] leading-7 text-primary/80 min-[701px]:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-2 shrink-0 rounded-full bg-accent-light"
                      />
                      <span
                        className="legal-rich-text min-w-0 flex-1"
                        dangerouslySetInnerHTML={{ __html: bullet }}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
