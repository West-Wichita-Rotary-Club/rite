import { Link } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";

export function Home() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getImpact);
  const metrics = (data?.metrics ?? []).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">{t("motto")}</p>
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroBody")}</p>
            <div className="hero-actions">
              <Link className="button gold" to="/history">
                {t("heroPrimary")}
              </Link>
              <Link className="button outline" to="/stories">
                {t("heroSecondary")}
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <p>{t("sections.impactIntro")}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{t("sections.impactTitle")}</h2>
        <ContentStatus status={status} error={error} />
        {status === "ready" && (
          <div className="stats-grid">
            {metrics.map((metric) => (
              <div key={metric.id} className="stat-card">
                <p className="stat-number">{metric.value}</p>
                <p className="stat-label">{localize(metric.label)}</p>
                {metric.asOf && <p className="stat-asof">{localize(metric.asOf)}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
