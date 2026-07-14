import React from 'react';
import { LegalLayout, type LegalSection } from './legal/LegalLayout';

const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    paras: [
      'BitForBytes ("BitForBytes", "we", "us", or "our") is a free, interactive learning platform that helps students learn digital design, electronics, Verilog, and VLSI/chip design. This Privacy Policy explains what personal information we collect when you use bitforbytes.in and our tools, why we collect it, how we use and share it, and the choices and rights you have.',
      'By using BitForBytes you agree to the collection and use of information as described here. If you do not agree, please do not use the service.',
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information we collect',
    paras: ['We collect only what we need to run the platform and improve it. Specifically:'],
    bullets: [
      'Account information: if you create an account, we collect your name and email address. If you sign in with Google, LinkedIn, or GitHub, we receive your name, email, and profile identifier from that provider (we never receive your password).',
      'Guest sessions: if you continue as a guest, we store a display name you choose and a randomly generated device identifier in your browser so your progress can be saved locally and associated with anonymous usage.',
      'Learning and usage data: which modules and lessons you open, your progress, quiz/judge results, and the amount of time you spend engaging with a module (screen-time/engagement).',
      'Waitlist: if you joined the launch waitlist, we store the email address you provided.',
      'AI assistant content: the messages you send to our in-app assistant ("VoltMonkey") and a summary of the page you are on, so it can answer your questions (see the "AI assistant" section).',
      'Technical and analytics data: standard information such as device type, browser, approximate location, and interactions, collected through cookies and Google Analytics.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies, local storage & analytics',
    paras: [
      'We use browser local storage to remember your preferences (such as light/dark theme), your progress, your session, and a device identifier used for anonymous engagement measurement. These are essential to how the app works.',
      'We use Google Analytics (GA4) to understand how the site is used so we can improve it. Google Analytics sets its own cookies and may collect data such as your device, browser, pages viewed, and approximate location. You can opt out of Google Analytics across all sites using the Google Analytics Opt-out Browser Add-on, or by blocking cookies in your browser.',
      'Where required by law, we will ask for your consent before setting non-essential cookies.',
    ],
  },
  {
    id: 'how-we-use',
    heading: 'How we use your information',
    bullets: [
      'To provide the service — create your account, save and sync your progress, and personalize your learning.',
      'To operate features such as the Verilog judge, workbench, K-map lab, and the AI assistant.',
      'To measure engagement and improve our content, tools, and curriculum.',
      'To communicate with you about your account, important changes, or (if you opted in) launch and product updates.',
      'To keep the platform secure, prevent abuse, and debug problems.',
      'To comply with legal obligations.',
    ],
    paras: ['We do not sell your personal information, and we do not use it for third-party advertising.'],
  },
  {
    id: 'ai-assistant',
    heading: 'The AI assistant ("VoltMonkey")',
    paras: [
      'When you use the in-app assistant, the messages you send and a short summary of the page you are viewing are sent to a third-party AI model provider (currently Hugging Face) to generate a response. Your API keys and account credentials are never shared with the AI provider.',
      'Please do not share sensitive personal information, passwords, or confidential data in your messages to the assistant. Treat its answers as educational assistance, not professional advice.',
    ],
  },
  {
    id: 'sharing',
    heading: 'How we share information (service providers)',
    paras: ['We share personal information only with the service providers ("processors") that help us run BitForBytes, and only as needed to provide the service:'],
    bullets: [
      'Supabase — authentication, database, and backend infrastructure (stores your account and learning data).',
      'Google Analytics — usage analytics.',
      'Hugging Face — processing your messages to the AI assistant.',
      'Hostinger — website hosting and delivery.',
    ],
  },
  {
    id: 'retention',
    heading: 'Data retention',
    paras: [
      'We keep account and learning data for as long as your account is active or as needed to provide the service. Guest and locally stored data remains in your browser until you clear it. Waitlist emails are kept until launch communications are complete or you ask us to remove them. You can ask us to delete your data at any time (see "Your rights").',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights & choices',
    paras: [
      'Depending on where you live (including under the EU/UK GDPR and India\'s Digital Personal Data Protection Act, 2023), you may have the right to access, correct, export, or delete your personal information, to withdraw consent, and to object to or restrict certain processing.',
      'To exercise any of these rights, email us at info@bitforbytes.in and we will respond within a reasonable time. You can also clear locally stored data by clearing your browser storage, and opt out of analytics as described above.',
    ],
  },
  {
    id: 'children',
    heading: "Children's privacy",
    paras: [
      'BitForBytes is intended for students, including school and university learners. We do not knowingly collect personal information from children under 13 (or the minimum age required in your country) without appropriate consent. If you believe a child has provided us personal information without such consent, contact us and we will delete it.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    paras: [
      'We take reasonable technical and organizational measures to protect your information — data is transmitted over HTTPS, access to the database is restricted by row-level security so users can only read their own records, and secrets are kept server-side. No method of transmission or storage is 100% secure, so we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'international',
    heading: 'International data transfers',
    paras: [
      'Our service providers may process and store data in countries other than yours. Where we transfer personal information across borders, we rely on appropriate safeguards as required by applicable law.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    paras: [
      'We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you. Your continued use of BitForBytes after an update means you accept the revised policy.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact us',
    paras: [
      'If you have questions or requests about this Privacy Policy or your personal information, email us at info@bitforbytes.in.',
    ],
  },
];

export const PrivacyPolicyPage: React.FC = () => (
  <LegalLayout
    eyebrow="Privacy"
    title="Privacy Policy"
    updated="12 July 2026"
    intro="This policy explains what data BitForBytes collects, why, how we use and share it, and the choices you have. We collect the minimum needed to run the platform, we never sell your data, and you can ask us to delete it at any time."
    sections={SECTIONS}
    sibling={{ label: 'Terms of Service', to: '/terms' }}
  />
);
