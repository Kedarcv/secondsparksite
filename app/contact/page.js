import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';
import Close from '@/components/Close';
import { SITE } from '@/lib/content';

export const metadata = {
  title: 'Contact',
  description: `Talk to Second Spark Intelligence about battery testing and certification, the MiKi payment rail, or a software and AI project. Email ${SITE.email}.`,
  alternates: { canonical: '/contact/' },
};

export default function Contact() {
  return (
    <>
      <PageHero
        fieldId="ct"
        division="Contact"
        title="Start a conversation."
        lede="Batteries to test, a payment problem to solve, or software to build. Tell us which and we will come back to you ourselves — there is no queue to sit in."
      />

      <section className="section">
        <div className="shell grid-2">
          <div className="reveal">
            <p className="label">Send a message</p>
            <h2 style={{ fontSize: 'clamp(26px,3.4vw,40px)', margin: '16px 0 32px' }}>
              Tell us what you need.
            </h2>
            <ContactForm />
          </div>

          <div className="reveal reveal-d1">
            <p className="label">Direct</p>
            <h2 style={{ fontSize: 'clamp(26px,3.4vw,40px)', margin: '16px 0 32px' }}>
              Or reach us straight away.
            </h2>

            <div className="contact-list">
              <a href={`mailto:${SITE.email}`}>
                <span className="label">Email</span>
                <span className="v">{SITE.email}</span>
              </a>
              <div>
                <span className="label">Based in</span>
                <span className="v">{SITE.place}</span>
              </div>
              <div>
                <span className="label">Working</span>
                <span className="v">On-site and remote</span>
              </div>
            </div>

            <div style={{ marginTop: 'clamp(36px,5vw,56px)' }}>
              <p className="label">Helps us answer faster</p>
              <div className="steps" style={{ marginTop: 20 }}>
                <div className="step">
                  <div>
                    <h3 style={{ fontSize: 'clamp(17px,2vw,22px)' }}>For battery testing</h3>
                    <p>How many packs, what chemistry and configuration if you know it, and whether they are in service or in stock.</p>
                  </div>
                </div>
                <div className="step">
                  <div>
                    <h3 style={{ fontSize: 'clamp(17px,2vw,22px)' }}>For MiKi</h3>
                    <p>Whether you are a prospective customer, a merchant, or a partner — and which corridor matters to you.</p>
                  </div>
                </div>
                <div className="step">
                  <div>
                    <h3 style={{ fontSize: 'clamp(17px,2vw,22px)' }}>For software or AI</h3>
                    <p>What exists today, what needs to exist, and roughly when you need it. Rough is fine.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Close
        title="Three divisions. One engineering team."
        fine="Battery diagnostics and certification, payment infrastructure, and the software and models underneath both."
        primary={{ href: '/battery-passport/', label: 'Battery Passport' }}
        secondary={{ href: '/miki/', label: 'MiKi' }}
      />
    </>
  );
}
