import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";
import { schoolSlug } from "../lib/schools.js";

export function SchoolProfile() {
  const { slug } = useParams();
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getSchools);
  const school = data?.schools?.find((s) => schoolSlug(s) === slug);

  return (
    <section className="section">
      <Link className="button ghost" to="/schools">
        {t("labels.backToSchools")}
      </Link>

      <ContentStatus status={status} error={error} />

      {status === "ready" && !school && <p className="error-note">{t("labels.notFound")}</p>}

      {status === "ready" && school && (
        <div className="profile-page">
          <div className={`profile-page-header ${school.band}`}>
            <div>
              <h1 className="section-title">{school.name}</h1>
              <p className="section-lede">{school.place}</p>
              <div className="function-badges">
                <span className="function-badge">{t(`schoolTypes.${school.type}`)}</span>
              </div>
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
