import { Link } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";
import { schoolSlug } from "../lib/schools.js";

export function Schools() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getSchools);
  const schools = data?.schools ?? [];

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.schoolsTitle")}</h1>
      <p className="section-lede">{t("sections.schoolsIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <div className="card-grid">
          {schools.map((school) => (
            <article key={schoolSlug(school)} className={`card ${school.band}`}>
              <h2 className="card-title">{school.name}</h2>
              <p className="meta">{school.place}</p>
              <p>{localize(school.desc)}</p>
              <div className="school-metrics">
                <div className="school-metric">
                  <strong>{school.since}</strong>
                  <span>{t("labels.partnerSince")}</span>
                </div>
                <div className="school-metric">
                  <strong>{school.hosted}</strong>
                  <span>{t("labels.teachersHosted")}</span>
                </div>
              </div>
              <Link className="button ghost" to={`/schools/${schoolSlug(school)}`}>
                {t("labels.viewProfile")}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
