export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  title: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    title: "Property Related",
    items: [
      {
        question:
          "What makes Suits and Sand Real Estate unique in Dubai’s property market?",
        answer:
          "We focus on offering a seamless experience through partnerships with top developers in Dubai. Our clients enjoy exclusive benefits like commission-free deals, developer-backed interest-free payment plans, guaranteed ROI during the construction phase (for upfront buyers), and premium properties with luxury amenities.",
      },
      {
        question: "Are the properties ready to move in or under construction?",
        answer:
          "We offer both ready-to-move-in and off-plan properties across Dubai. Our team will guide you based on your timeline, investment goals, and preferred payment structure.",
      },
      {
        question: "What types of properties do you offer?",
        answer:
          "Our portfolio includes apartments, villas, townhouses, penthouses, and commercial spaces in prime Dubai locations, sourced from trusted developers.",
      },
      {
        question: "How do I start the property purchase process?",
        answer:
          "Contact our team to book a consultation. We will shortlist properties matching your goals, arrange viewings, and support you through reservation, documentation, and handover.",
      },
    ],
  },
  {
    title: "Privacy Related",
    items: [
      {
        question: "What is the guaranteed ROI offer, and how does it work?",
        answer:
          "Eligible upfront buyers on selected off-plan projects can receive guaranteed returns during the construction period, as outlined in the developer agreement. Terms vary by project—we explain all conditions before you commit.",
      },
      {
        question:
          "Do I pay any commission if I buy a property through Suits and Sand Real Estate?",
        answer:
          "No. Buyers do not pay commission on properties purchased through Suits and Sand Real Estate. Our developer partnerships allow us to offer this benefit directly to our clients.",
      },
      {
        question:
          "Do you help with legal or documentation processes for property purchases?",
        answer:
          "Yes. We coordinate with developers, banks, and legal partners to guide you through SPA signing, Oqood registration, NOCs, and final transfer at the Dubai Land Department.",
      },
      {
        question: "Are flexible payment plans available for all properties?",
        answer:
          "Most off-plan projects include developer-backed payment plans. Availability and terms depend on the specific property and developer—our advisors will outline every option for your shortlisted units.",
      },
    ],
  },
  {
    title: "International Related",
    items: [
      {
        question:
          "Can international investors purchase properties through Suits and Sand Real Estate?",
        answer:
          "Yes. Dubai allows foreign nationals to own freehold property in designated areas. We assist international clients with remote consultations, documentation, and end-to-end purchase support.",
      },
      {
        question:
          "What makes Suits and Sand Real Estate unique in Dubai’s property market?",
        answer:
          "International clients benefit from our dedicated overseas buyer support, multilingual advisors, virtual viewings, and streamlined remote documentation—alongside the same commission-free developer deals available to local buyers.",
      },
      {
        question:
          "Can I purchase property remotely without visiting Dubai?",
        answer:
          "Yes. We support remote buyers with virtual tours, video consultations, digital documentation, and power-of-attorney arrangements where required, so you can complete your purchase from abroad.",
      },
      {
        question:
          "What documents do international buyers need to complete a purchase?",
        answer:
          "Typically you will need a valid passport, proof of address, and Emirates ID if you are a UAE resident. Our team provides a tailored checklist based on your nationality and the developer’s requirements.",
      },
    ],
  },
];
