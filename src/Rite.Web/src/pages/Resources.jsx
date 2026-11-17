import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";

export function Resources() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getResources);
  const resources = data?.resources ?? [];

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.resourcesTitle")}</h1>
      <p className="section-lede">{t("sections.resourcesIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <div className="resource-grid">
          {resources.map((resource) => (
            <article key={resource.id} className="card royal">
              <h2 className="card-title">{localize(resource.title)}</h2>
              <p>{localize(resource.body)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
