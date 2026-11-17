import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { ContentStatus } from "../components/ContentStatus.jsx";
import { initials, participationYears } from "../lib/alumni.js";

export function Alumni() {
  const { t, localize } = useLanguage();
  const { status, data, error } = useContent(api.getAlumni);
  const [country, setCountry] = useState("all");
  const [role, setRole] = useState("all");

  const countries = data?.countries ?? {};
  const functions = data?.functions ?? {};
  const profiles = data?.profiles ?? [];

  const filtered = useMemo(() => {
    return profiles.filter((profile) => {
      const countryMatch = country === "all" || profile.country === country;
      const roleMatch = role === "all" || profile.participation?.some((p) => p.role === role);
      return countryMatch && roleMatch;
    });
  }, [profiles, country, role]);

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.directoryTitle")}</h1>
      <p className="section-lede">{t("sections.directoryIntro")}</p>
      <ContentStatus status={status} error={error} />
      {status === "ready" && (
        <>
          <div className="directory-filter-panel">
            <div>
              <p className="filter-label">{t("labels.countryFilter")}</p>
              <div className="filters">
                <button
                  type="button"
                  className={`filter-button${country === "all" ? " active" : ""}`}
                  onClick={() => setCountry("all")}
                >
                  {t("filters.all")}
                </button>
                {Object.entries(countries).map(([code, country_]) => (
                  <button
                    key={code}
                    type="button"
                    className={`filter-button${country === code ? " active" : ""}`}
                    onClick={() => setCountry(code)}
                  >
                    {localize(country_.label)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="filter-label">{t("labels.functionFilter")}</p>
              <div className="filters">
                <button
                  type="button"
                  className={`filter-button${role === "all" ? " active" : ""}`}
                  onClick={() => setRole("all")}
                >
                  {t("filters.all")}
                </button>
                {Object.entries(functions).map(([code, function_]) => (
                  <button
                    key={code}
                    type="button"
                    className={`filter-button${role === code ? " active" : ""}`}
                    onClick={() => setRole(code)}
                  >
                    {localize(function_.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-note">{t("labels.noResults")}</p>
          ) : (
            <div className="card-grid">
              {filtered.map((profile) => (
                <article key={profile.id} className="profile-card azure directory-card">
                  <div className="profile-heading">
                    <span className="avatar" aria-hidden="true">
                      {initials(profile.name)}
                    </span>
                    <div>
                      <h2 className="card-title">{profile.name}</h2>
                      <p className="meta">{localize(profile.place)}</p>
                    </div>
                  </div>
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
                  <div className="profile-card-actions">
                    <Link className="button ghost profile-link" to={`/alumni/${profile.id}`}>
                      {t("labels.viewProfile")}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
