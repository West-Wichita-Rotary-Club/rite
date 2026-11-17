import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";

export function Faq() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getFaq);
  const faqs = data?.faqs ?? [];

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.faqTitle")}</h1>
      <p className="section-lede">{t("sections.faqIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <div className="faq-list">
          {faqs.map((faq) => (
            <article key={faq.id} className="faq-item">
              <h2 className="card-title">{localize(faq.question)}</h2>
              <p>{localize(faq.answer)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
