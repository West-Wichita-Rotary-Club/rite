import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";

export function History() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getTimeline);
  const milestones = data?.milestones ?? [];

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.historyTitle")}</h1>
      <p className="section-lede">{t("sections.historyIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <div className="timeline">
          {milestones.map((milestone) => (
            <article key={milestone.id} className="timeline-card">
              <p className="timeline-year">{milestone.year}</p>
              <div>
                <h2 className="card-title">{localize(milestone.title)}</h2>
                <p>{localize(milestone.body)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
