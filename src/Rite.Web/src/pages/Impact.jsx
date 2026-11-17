import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";

export function Impact() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getImpact);
  const metrics = data?.metrics ?? [];

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.impactTitle")}</h1>
      <p className="section-lede">{t("sections.impactIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <div className="stats-grid">
          {metrics.map((metric) => (
            <div key={metric.id} className="stat-card">
              <p className="stat-number">{metric.value}</p>
              <p className="stat-label">{localize(metric.label)}</p>
              {metric.asOf && (
                <p className="stat-asof">
                  {t("labels.asOfLabel")}: {localize(metric.asOf)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
