type ContentSectionDefault = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type ContentPageDefault = {
  slug: 'privacy-policy' | 'terms-and-conditions';
  introText: string;
  hero: {
    title: string;
    image: string;
    imageAlt: string;
  };
  sections: ContentSectionDefault[];
};

export const contentPageDefaults: ContentPageDefault[] = [
  {
    slug: 'privacy-policy',
    introText:
      'Your privacy matters to us. This policy explains how Axis Aura Real Estate collects, uses, and protects your personal information when you explore properties, connect with our team, or use our services.',
    hero: {
      title: 'Privacy Policy',
      image: '/Aboutus/main.svg',
      imageAlt: 'Axis Aura Real Estate privacy and data protection',
    },
    sections: [
      {
        title: '1. Introduction',
        paragraphs: [
          'Axis Aura Real Estate ("Axis Aura", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you visit our website, browse property listings, submit enquiries, subscribe to our newsletter, or interact with our services in the United Arab Emirates.',
          'By using our platform, you agree to the practices described in this policy. If you do not agree, please discontinue use of our website and services.',
        ],
      },
      {
        title: '2. Information We Collect',
        paragraphs: [
          'We may collect the following types of information when you use Axis Aura:',
        ],
        bullets: [
          'Personal details such as your name, email address, phone number, and country of residence.',
          'Property preferences including budget range, preferred locations, and residential or commercial interests.',
          'Enquiry and contact form submissions, including messages you send to our team.',
          'Career application information when you apply for roles listed on our website.',
          'Technical data such as IP address, browser type, device information, and pages visited.',
          'Newsletter subscription details when you opt in to receive updates from us.',
        ],
      },
      {
        title: '3. How We Use Your Information',
        paragraphs: [
          'Axis Aura uses your information to deliver a seamless property discovery experience and to respond to your requests professionally and efficiently. Specifically, we may use your data to:',
        ],
        bullets: [
          'Respond to property enquiries, viewing requests, and general contact messages.',
          'Share relevant project updates, market insights, and promotional communications where permitted.',
          'Improve our website, listings, and customer experience.',
          'Process job applications and manage recruitment communications.',
          'Comply with applicable laws, regulations, and legitimate business requirements in the UAE.',
        ],
      },
      {
        title: '4. Property Enquiries & Communications',
        paragraphs: [
          'When you enquire about a residential, commercial, or off-plan project through Axis Aura, your details may be shared with our internal advisors or trusted developer partners solely for the purpose of assisting with your request. We do not sell your personal information to unrelated third parties.',
          'If you contact us by phone, email, or through our online forms, we retain correspondence records to provide follow-up support and maintain service quality.',
        ],
      },
      {
        title: '5. Cookies & Analytics',
        paragraphs: [
          'Our website may use cookies and similar technologies to remember preferences, understand visitor behaviour, and improve performance. These tools help us analyse traffic patterns and enhance how users explore properties, developers, and market content on Axis Aura.',
          'You can manage or disable cookies through your browser settings. Please note that some features of the website may not function optimally if cookies are turned off.',
        ],
      },
      {
        title: '6. Data Sharing & Third Parties',
        paragraphs: [
          'We may share limited information with service providers who support our operations, such as hosting providers, email platforms, analytics tools, and cloud storage services. These partners are required to handle data securely and only for authorised purposes.',
          'We may also disclose information where required by law, regulation, court order, or to protect the rights, safety, and integrity of Axis Aura, our users, and our partners.',
        ],
      },
      {
        title: '7. Data Security',
        paragraphs: [
          'We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, misuse, or alteration. While we take reasonable steps to safeguard data, no online transmission or storage system can be guaranteed to be completely secure.',
        ],
      },
      {
        title: '8. Your Rights',
        paragraphs: [
          'Depending on applicable data protection laws, you may have the right to request access to, correction of, or deletion of your personal information. You may also withdraw consent for marketing communications at any time.',
          'To exercise your rights or ask questions about how your data is handled, please contact us using the details below. We will respond within a reasonable timeframe.',
        ],
      },
      {
        title: '9. Contact Us',
        paragraphs: [
          'If you have any questions about this Privacy Policy or how Axis Aura processes your information, please reach out to us:',
          'Email: info@axisaura.com',
          'Phone: +971 123 123 123',
          'Address: Dubai, Barari Lagoons, Example city, 1234, United Arab Emirates',
        ],
      },
      {
        title: '10. Updates to This Policy',
        paragraphs: [
          'We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices. Any updates will be posted on this page with a revised effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.',
          'Last updated: July 2026',
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    introText:
      'Please read these terms carefully before using Axis Aura Real Estate. They outline the rules, responsibilities, and conditions that apply when you browse listings or engage with our services.',
    hero: {
      title: 'Terms & Conditions',
      image: '/properties/properties.svg',
      imageAlt: 'Axis Aura Real Estate terms and conditions',
    },
    sections: [
      {
        title: '1. Acceptance of Terms',
        paragraphs: [
          'Welcome to Axis Aura Real Estate. By accessing or using our website, property listings, enquiry forms, newsletter, career portal, or any related services (collectively, the "Platform"), you agree to be bound by these Terms & Conditions.',
          'If you do not agree with any part of these terms, you must not use the Platform. We may update these terms from time to time, and continued use after changes are posted constitutes acceptance of the revised terms.',
        ],
      },
      {
        title: '2. About Axis Aura',
        paragraphs: [
          'Axis Aura Real Estate provides an online platform for discovering residential, commercial, and off-plan property opportunities in the United Arab Emirates. We connect buyers, investors, and tenants with projects, developers, and advisory support.',
          'Unless expressly stated otherwise, Axis Aura acts as a facilitator and marketing platform. We do not guarantee the availability, pricing, or completion of any property listed on the Platform.',
        ],
      },
      {
        title: '3. Use of the Platform',
        paragraphs: [
          'You agree to use the Platform only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the services. You must not:',
        ],
        bullets: [
          'Provide false, misleading, or incomplete information in enquiries or applications.',
          'Attempt to gain unauthorised access to our systems, accounts, or data.',
          'Copy, scrape, or redistribute Platform content without prior written consent.',
          'Use the Platform to transmit harmful, abusive, or unlawful material.',
          'Misrepresent your affiliation with Axis Aura or any listed developer.',
        ],
      },
      {
        title: '4. Property Listings & Information',
        paragraphs: [
          'Property details, images, floor plans, pricing, payment plans, handover dates, and amenities displayed on Axis Aura are provided for general information purposes. While we strive for accuracy, information may be supplied by third-party developers or agents and may change without notice.',
          'Axis Aura does not warrant that any listing is error-free, current, or complete. You should independently verify all property details, regulatory approvals, and contractual terms before making any purchase, reservation, or investment decision.',
        ],
      },
      {
        title: '5. Enquiries & Appointments',
        paragraphs: [
          'Submitting an enquiry through Axis Aura does not create a binding agreement to purchase, lease, or reserve a property. Our team or partner representatives may contact you to discuss your requirements and arrange viewings or consultations.',
          'We reserve the right to decline or discontinue communication where enquiries appear fraudulent, abusive, or outside the scope of our services.',
        ],
      },
      {
        title: '6. Intellectual Property',
        paragraphs: [
          'All content on the Platform — including logos, branding, text, graphics, photographs, videos, layouts, and software — is owned by or licensed to Axis Aura Real Estate and is protected by applicable intellectual property laws.',
          'You may view and download content for personal, non-commercial use only. Any other reproduction, distribution, or modification requires our prior written permission.',
        ],
      },
      {
        title: '7. Third-Party Links & Developers',
        paragraphs: [
          'The Platform may include links to third-party websites, developer pages, or external resources. Axis Aura is not responsible for the content, policies, or practices of third parties.',
          'Any transaction entered into with a developer, landlord, broker, or service provider is solely between you and that party. Axis Aura shall not be liable for disputes arising from such arrangements unless explicitly agreed in writing.',
        ],
      },
      {
        title: '8. Disclaimer of Warranties',
        paragraphs: [
          'The Platform and all content are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Axis Aura disclaims all warranties, whether express or implied, including fitness for a particular purpose and non-infringement.',
          'We do not guarantee uninterrupted access to the Platform or that it will be free from errors, viruses, or security vulnerabilities.',
        ],
      },
      {
        title: '9. Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by applicable law, Axis Aura Real Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or reliance on any property information.',
          'Our total liability for any claim relating to the Platform shall not exceed the amount, if any, paid by you directly to Axis Aura for the specific service giving rise to the claim.',
        ],
      },
      {
        title: '10. Governing Law',
        paragraphs: [
          'These Terms & Conditions are governed by the laws of the United Arab Emirates. Any disputes arising from or relating to these terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE, unless otherwise required by mandatory law.',
        ],
      },
      {
        title: '11. Contact Information',
        paragraphs: [
          'For questions regarding these Terms & Conditions, please contact Axis Aura Real Estate:',
          'Email: info@axisaura.com',
          'Phone: +971 123 123 123',
          'Address: Dubai, Barari Lagoons, Example city, 1234, United Arab Emirates',
          'Last updated: July 2026',
        ],
      },
    ],
  },
];

export function getContentPageDefault(slug: string) {
  return contentPageDefaults.find((page) => page.slug === slug);
}
