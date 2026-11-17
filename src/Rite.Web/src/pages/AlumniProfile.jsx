import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";
import { initials, participationYears } from "../lib/alumni.js";

export function AlumniProfile() {
  const { id } = useParams();
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getAlumni);
  const profile = data?.profiles?.find((p) => p.id === id);

  return (
    <section className="section">
      <Link className="button ghost" to="/alumni">
        {t("labels.backToDirectory")}
      </Link>

      <ContentStatus status={status} error={error} />

      {status === "ready" && !profile && <p className="error-note">{t("labels.notFound")}</p>}

      {status === "ready" && profile && (
        <div className="profile-page">
          <div className="profile-page-header azure">
            <span className="avatar large" aria-hidden="true">
              {initials(profile.name)}
            </span>
            <div>
              <h1 className="section-title">{profile.name}</h1>
              <p className="section-lede">{localize(profile.place)}</p>
              <p>{localize(profile.summary)}</p>
              <div className="function-badges">
                {(profile.participation ?? []).map((p) => (
                  <span key={p.role} className={`function-badge ${p.role}`}>
                    {t(`roles.${p.role}`)}
                  </span>
                ))}
              </div>
              <p className="meta">
                {t("labels.participationYears")}: {participationYears(profile)}
              </p>
            </div>
          </div>

          <div className="profile-page-grid">
            <div className="profile-panel">
              <h2>{t("labels.memories")}</h2>
              {(profile.memories ?? []).length === 0 ? (
                <p className="empty-note">{t("labels.noMemories")}</p>
              ) : (
                profile.memories.map((memory, index) => (
                  <div key={memory.id ?? index} className="profile-content-item">
                    <h3>{localize(memory.title)}</h3>
                    <p>{localize(memory.text)}</p>
                  </div>
                ))
              )}
            </div>
            <div className="profile-panel">
              <h2>{t("labels.pictures")}</h2>
              {(profile.pictures ?? []).length === 0 ? (
                <p className="empty-note">{t("labels.noPictures")}</p>
              ) : (
                <div className="function-badges">
                  {profile.pictures.map((picture, index) => (
                    <span key={index} className="year-pill">
                      {localize(picture.caption) ?? picture.url}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="profile-panel">
              <h2>{t("labels.suggestions")}</h2>
              {(profile.suggestions ?? []).length === 0 ? (
                <p className="empty-note">{t("labels.noSuggestions")}</p>
              ) : (
                profile.suggestions.map((suggestion, index) => (
                  <p key={index} className="profile-content-item">
                    {localize(suggestion.text)}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
