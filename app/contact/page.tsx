import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";
import NewsletterSection from "@/components/NewsletterSection";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Contact Us | Axis Aura Real Estate",
  description:
    "Get in touch with Axis Aura. Send us a message about properties, projects, or partnership opportunities and our team will get back to you shortly.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col pt-[124px]">
      <ContactSection />
      <SectionDivider />
      <NewsletterSection />
    </main>
  );
}
