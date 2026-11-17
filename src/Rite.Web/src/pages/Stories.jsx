import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";

export function Stories() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getStories);
  const stories = data?.stories ?? [];

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.storiesTitle")}</h1>
      <p className="section-lede">{t("sections.storiesIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <div className="card-grid">
          {stories.map((story) => (
            <article key={story.id} className="card azure">
              <h2 className="card-title">{localize(story.title)}</h2>
              <p>{localize(story.body)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
