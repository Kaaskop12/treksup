import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What this website collects and why.',
  alternates: { canonical: '/privacy' }
};

const sections = [
  {
    title: 'Who we are',
    text: 'Treksup, Belgium, company no. 1029.205.038, Aarschotstraat 5, 1820 Steenokkerzeel. We are responsible for the data described here.'
  },
  {
    title: 'Email you give us',
    text: 'If you leave your email for a waitlist, a GPX file or a guide, we use it only to email you about that one thing. If you request an operator sample, we use your company name, email and message only to reply about that offer. We do not sell or share it.'
  },
  {
    title: 'Anonymous usage counts',
    text: 'We count page views, button clicks and form submissions, with the page, the referring website and any campaign tag in the link. We store no cookies, nothing on your device and no user id, so we cannot tell visitors apart. We use these counts only to see which pages and offers people use.'
  },
  {
    title: 'Where it is stored',
    text: 'In our database at Supabase, hosted in the EU (Ireland). Waitlist and operator emails are kept until the offer they relate to has launched or ended, then deleted. Usage counts are kept for up to 24 months.'
  },
  {
    title: 'Your rights',
    text: 'You can ask us to show, correct or delete your data at any time by replying to any email from us or by writing to the address above. You can also complain to the Belgian Data Protection Authority (gegevensbeschermingsautoriteit.be).'
  }
];

export default function PrivacyPage() {
  return (
    <div className="px-5 pt-16 pb-8">
      <h1 className="text-[24px] font-extrabold text-ink mb-4">Privacy</h1>
      <div className="flex flex-col gap-3">
        {sections.map((s) => (
          <div key={s.title} className="bg-paper rounded-2xl shadow-card border border-forest/5 p-4">
            <p className="text-[14px] font-extrabold text-ink mb-1">{s.title}</p>
            <p className="text-[12.5px] text-inkSoft font-medium leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
