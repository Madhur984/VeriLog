import React from 'react';
import { LegalLayout, type LegalSection } from './legal/LegalLayout';

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    heading: 'Acceptance of these terms',
    paras: [
      'These Terms of Service ("Terms") govern your access to and use of BitForBytes — the bitforbytes.in website, courses, and interactive tools (together, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, do not use the Service.',
    ],
  },
  {
    id: 'eligibility',
    heading: 'Eligibility',
    paras: [
      'The Service is intended for students and learners. You may use it if you can form a binding agreement under the law of your country, or if you are a minor and use it under the supervision of a parent, guardian, or school. If you are under the minimum age required in your country, please use BitForBytes only with appropriate consent.',
    ],
  },
  {
    id: 'accounts',
    heading: 'Accounts and guest access',
    bullets: [
      'You may use BitForBytes as a guest (progress is stored in your browser) or by creating an account with email or a supported provider (Google, LinkedIn, GitHub).',
      'You agree to provide accurate information and to keep your account credentials secure. You are responsible for activity that happens under your account.',
      'Notify us promptly at hello@bitforbytes.in if you believe your account has been accessed without authorization.',
    ],
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    paras: ['You agree not to misuse the Service. In particular, you will not:'],
    bullets: [
      'Break the law, infringe the rights of others, or upload harmful, hateful, or unlawful content.',
      'Attempt to disrupt, overload, attack, probe, or gain unauthorized access to the Service, its infrastructure, or other users\' data.',
      'Scrape, harvest, or bulk-download content, or abuse the AI assistant or any endpoint to generate excessive load or cost.',
      'Reverse engineer, resell, or use the Service to build a competing product, except where such restriction is prohibited by law.',
      'Impersonate others or misrepresent your affiliation.',
    ],
  },
  {
    id: 'education-only',
    heading: 'Educational purpose — no professional advice',
    paras: [
      'BitForBytes is a learning tool. Its content, simulations, graders, and AI assistant are provided for educational purposes and may contain errors or simplifications. They are not professional, engineering, academic, or career advice, and should not be relied upon for production, safety-critical, or commercial decisions. Always verify important information independently.',
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    paras: [
      'The Service and its content — including text, lessons, videos, graphics, code, and design — are owned by BitForBytes or its licensors and are protected by intellectual property laws. We grant you a personal, limited, non-exclusive, non-transferable, revocable license to access and use the content for your own non-commercial learning.',
      'Any content you submit (for example, code you write in the judge or a name you provide) remains yours, but you grant us a license to host, process, and display it as needed to operate and improve the Service.',
    ],
  },
  {
    id: 'third-parties',
    heading: 'Third-party services and links',
    paras: [
      'The Service relies on and may link to third-party services (such as Supabase, Google, Hugging Face, and hosting providers). We are not responsible for the content, policies, or practices of third parties. Your use of those services may be governed by their own terms.',
    ],
  },
  {
    id: 'ai-assistant',
    heading: 'The AI assistant',
    paras: [
      'The in-app assistant generates responses using third-party AI models. Its output may be inaccurate, incomplete, or out of date, and it does not represent the views of BitForBytes. Do not submit sensitive information to it, and independently verify anything important. We may limit, meter, or change the assistant at any time.',
    ],
  },
  {
    id: 'availability',
    heading: 'Availability, changes, and free service',
    paras: [
      'BitForBytes is currently provided free of charge. We may add, change, suspend, or discontinue any part of the Service — including features that are experimental or in beta — at any time, and we may set usage limits. We are not liable to you for changes to or discontinuation of the Service.',
    ],
  },
  {
    id: 'disclaimers',
    heading: 'Disclaimers',
    paras: [
      'The Service is provided "as is" and "as available", without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, secure, or that content is accurate or complete.',
    ],
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    paras: [
      'To the maximum extent permitted by law, BitForBytes and its team will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, use, or goodwill, arising from your use of (or inability to use) the Service. Because the Service is provided free of charge, our total aggregate liability for any claim relating to the Service is limited to the amount you paid us for it (which is zero) or the minimum permitted by applicable law.',
    ],
  },
  {
    id: 'indemnity',
    heading: 'Indemnification',
    paras: [
      'You agree to indemnify and hold harmless BitForBytes from any claims, damages, or expenses arising out of your misuse of the Service or your violation of these Terms or any law or third-party right.',
    ],
  },
  {
    id: 'termination',
    heading: 'Termination',
    paras: [
      'You may stop using the Service at any time. We may suspend or terminate your access if you violate these Terms or misuse the Service. Provisions that by their nature should survive termination (such as intellectual property, disclaimers, and limitation of liability) will continue to apply.',
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    paras: [
      'These Terms are governed by the laws of India, without regard to conflict-of-law rules. Subject to applicable law, disputes will be handled by the competent courts in India. Nothing in these Terms limits any consumer-protection rights you have that cannot be waived under your local law.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    paras: [
      'We may update these Terms from time to time. When we make material changes we will update the "Last updated" date above and, where appropriate, notify you. Your continued use of the Service after changes take effect means you accept the revised Terms.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact us',
    paras: ['Questions about these Terms? Email us at hello@bitforbytes.in.'],
  },
];

export const TermsPage: React.FC = () => (
  <LegalLayout
    eyebrow="Legal"
    title="Terms of Service"
    updated="12 July 2026"
    intro="These terms govern your use of BitForBytes. In short: use it to learn, don't abuse or attack the platform, our content stays ours and yours stays yours, the tools are educational (not professional advice), and the service is provided free and as-is."
    sections={SECTIONS}
    sibling={{ label: 'Privacy Policy', to: '/privacy' }}
  />
);
