import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useContent } from "../hooks/useContent.js";
import { api } from "../api.js";
import { useAccount } from "../context/AccountContext.jsx";
import {
  CLAIM_ROLES,
  MAX_MEMORIES_PER_MEMBER,
  MAX_PHOTOS_PER_MEMORY,
  StorageBudgetError,
  blankClaimDraft,
  blankMemoryDraft,
  blankParticipationRow,
  candidateProfilesForClaim,
  downscalePhoto,
  findAlumniProfile,
  getCountryLabel,
  profileCompleteness,
  validateParticipationRow
} from "../lib/account.js";

const ROLES = ["teacher", "host", "leader", "coordinator", "school"];

export function Account() {
  const { t, localize } = useLanguage();
  const {
    account,
    status,
    storageAvailable,
    updateProfile,
    saveClaim,
    withdrawClaim,
    saveMemory,
    deleteMemory,
    clearAccountData
  } = useAccount();
  const { data: alumniContent } = useContent(api.getAlumni);
  const [profileNotice, setProfileNotice] = useState("");

  // "loading" covers the one-time GET /api/account/me AccountProvider makes on
  // mount to restore an existing session cookie — redirecting to /login before
  // that resolves would bounce an already-signed-in person on every page load.
  if (status === "loading") {
    return (
      <section className="section">
        <p>{t("labels.loading")}</p>
      </section>
    );
  }

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  async function handleDetailsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ok = await updateProfile(Object.fromEntries(formData.entries()));
    if (ok) {
      setProfileNotice(t("labels.detailsSaved"));
    }
  }

  return (
    <section className="section account-page">
      <h1 className="section-title">{t("sections.accountTitle")}</h1>
      <p className="section-lede">{t("sections.accountIntro")}</p>
      {!storageAvailable && <div className="status-panel warning">{t("labels.storageUnavailableNotice")}</div>}

      <DashboardSummary account={account} t={t} />

      <form className="form-card" onSubmit={handleDetailsSubmit}>
        <h2 className="form-title">{t("labels.fullName")}</h2>
        <div className="form-grid">
          <label className="field">
            {t("labels.role")}
            <select name="role" defaultValue={account.role || ROLES[0]}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`roles.${role}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("labels.fullName")}
            <input name="name" autoComplete="name" defaultValue={account.name} />
          </label>
          <label className="field">
            {t("labels.country")}
            <input name="country" defaultValue={account.country} />
          </label>
          <label className="field">
            {t("labels.city")}
            <input name="city" defaultValue={account.city} />
          </label>
          <label className="field">
            {t("labels.languages")}
            <input name="languages" defaultValue={account.languages} />
          </label>
          <label className="field">
            {t("labels.years")}
            <input name="years" defaultValue={account.years} />
          </label>
          <label className="field full">
            {t("labels.bio")}
            <textarea name="bio" defaultValue={account.bio} />
          </label>
        </div>
        <div className="form-actions">
          <button className="button gold" type="submit">
            {t("labels.saveDetails")}
          </button>
          {profileNotice && <span className="privacy-note">{profileNotice}</span>}
        </div>
      </form>

      <ClaimSection
        account={account}
        alumniContent={alumniContent}
        t={t}
        localize={localize}
        saveClaim={saveClaim}
        withdrawClaim={withdrawClaim}
      />

      <MemoriesSection account={account} t={t} saveMemory={saveMemory} deleteMemory={deleteMemory} />

      <div className="account-danger">
        <button
          className="button ghost"
          type="button"
          onClick={() => {
            if (window.confirm(t("labels.clearDataConfirm"))) {
              clearAccountData();
            }
          }}
        >
          {t("labels.clearDataButton")}
        </button>
      </div>
    </section>
  );
}

function DashboardSummary({ account, t }) {
  const claimStatusLabel = account.claim ? t("labels.pendingReviewBadge") : t("labels.dashboardClaimStatusNone");
  const memoriesCount = (account.memories || []).length;
  const completeness = profileCompleteness(account);
  return (
    <section className="dashboard-summary" aria-label={t("sections.dashboardSummaryTitle")}>
      <h2 className="form-title">{t("sections.dashboardSummaryTitle")}</h2>
      <div className="stats-grid dashboard-summary-grid">
        <article className="stat-card">
          <div className="stat-number">{claimStatusLabel}</div>
          <div className="stat-label">{t("labels.dashboardClaimStatusLabel")}</div>
        </article>
        <article className="stat-card">
          <div className="stat-number">{memoriesCount}</div>
          <div className="stat-label">{t("labels.dashboardMemoriesLabel")}</div>
        </article>
        <article className="stat-card">
          <div className="stat-number">{completeness}%</div>
          <div className="stat-label">{t("labels.dashboardCompletenessLabel")}</div>
        </article>
      </div>
    </section>
  );
}

function ClaimSection({ account, alumniContent, t, localize, saveClaim, withdrawClaim }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(false);

  if (editing) {
    return (
      <ClaimForm
        account={account}
        alumniContent={alumniContent}
        t={t}
        localize={localize}
        draft={draft}
        setDraft={setDraft}
        error={error}
        onCancel={() => {
          setEditing(false);
          setDraft(null);
          setError(false);
        }}
        onSave={(claim) => {
          const invalid = draft.participation.some((row) => validateParticipationRow(row));
          if (!draft.country || !draft.participation.length || invalid) {
            setError(true);
            return;
          }
          try {
            saveClaim(claim);
            setEditing(false);
            setDraft(null);
            setError(false);
          } catch (saveError) {
            if (!(saveError instanceof StorageBudgetError)) {
              throw saveError;
            }
          }
        }}
      />
    );
  }

  if (!account.claim) {
    return (
      <article className="profile-panel">
        <h2>{t("sections.claimTitle")}</h2>
        <p>{t("labels.claimNoneYet")}</p>
        <div className="form-actions">
          <button
            className="button gold"
            type="button"
            onClick={() => {
              setDraft(blankClaimDraft(null));
              setEditing(true);
              setError(false);
            }}
          >
            {t("sections.claimTitle")}
          </button>
        </div>
      </article>
    );
  }

  const claim = account.claim;
  const sortedParticipation = claim.participation.slice().sort((a, b) => a.yearFrom - b.yearFrom);
  const matchedProfile = claim.matchedProfileId ? findAlumniProfile(claim.matchedProfileId, alumniContent) : null;

  return (
    <article className="profile-panel">
      <h2>{t("sections.claimTitle")}</h2>
      <p className="meta">
        {getCountryLabel(claim.country, alumniContent, localize)} <span className="pending-badge">{t("labels.pendingReviewBadge")}</span>
      </p>
      <div className="year-list">
        {sortedParticipation.map((row, index) => (
          <span key={index} className="year-pill">
            {t(`roles.${row.role}`)} · {row.yearTo && row.yearTo !== row.yearFrom ? `${row.yearFrom}–${row.yearTo}` : row.yearFrom}
          </span>
        ))}
      </div>
      <p className="meta">{matchedProfile ? matchedProfile.name : claim.selfDeclaredName}</p>
      <div className="form-actions">
        <button
          className="button ghost"
          type="button"
          onClick={() => {
            setDraft(blankClaimDraft(claim));
            setEditing(true);
            setError(false);
          }}
        >
          {t("labels.claimEditButton")}
        </button>
        <button className="button ghost" type="button" onClick={() => withdrawClaim()}>
          {t("labels.claimWithdrawButton")}
        </button>
      </div>
    </article>
  );
}

function ClaimForm({ account, alumniContent, t, localize, draft, setDraft, error, onCancel, onSave }) {
  const draftRoles = draft.participation.map((row) => row.role).filter(Boolean);
  const candidates = draft.country && draftRoles.length
    ? draftRoles
        .reduce((acc, role) => acc.concat(candidateProfilesForClaim(draft.country, role, alumniContent)), [])
        .filter((profile, index, arr) => arr.findIndex((p) => p.id === profile.id) === index)
    : [];

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSave({
      country: draft.country,
      participation: draft.participation.map((row) => ({ ...row })),
      matchedProfileId: formData.get("matchedProfileId") || "",
      selfDeclaredName: formData.get("selfDeclaredName") || ""
    });
  }

  function updateRow(index, field, value) {
    setDraft({
      ...draft,
      participation: draft.participation.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 className="form-title">{t("sections.claimTitle")}</h2>
      <p className="section-lede">{t("sections.claimIntro")}</p>
      <div className="form-grid">
        <label className="field">
          {t("labels.claimCountryLabel")}
          <select
            value={draft.country}
            onChange={(event) => setDraft({ ...draft, country: event.target.value, matchedProfileId: "" })}
          >
            <option value="">-</option>
            {Object.entries(alumniContent?.countries || {}).map(([key, country]) => (
              <option key={key} value={key}>
                {localize(country.label)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {draft.participation.map((row, index) => (
        <div className="form-grid claim-row" key={index}>
          <label className="field">
            {t("labels.claimRoleLabel")}
            <select value={row.role} onChange={(event) => updateRow(index, "role", event.target.value)}>
              <option value="">-</option>
              {CLAIM_ROLES.map((role) => (
                <option key={role} value={role}>
                  {alumniContent?.functions ? localize(alumniContent.functions[role].label) : role}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("labels.claimYearFromLabel")}
            <input type="number" value={row.yearFrom} onChange={(event) => updateRow(index, "yearFrom", event.target.value)} />
          </label>
          <label className="field">
            {t("labels.claimYearToLabel")}
            <input type="number" value={row.yearTo} onChange={(event) => updateRow(index, "yearTo", event.target.value)} />
          </label>
          <div className="form-actions">
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                const next = draft.participation.filter((_row, i) => i !== index);
                setDraft({ ...draft, participation: next.length ? next : [blankParticipationRow()] });
              }}
            >
              {t("labels.claimRemoveRow")}
            </button>
          </div>
        </div>
      ))}
      <div className="form-actions">
        <button
          className="button ghost"
          type="button"
          onClick={() => setDraft({ ...draft, participation: draft.participation.concat(blankParticipationRow()) })}
        >
          {t("labels.claimAddRow")}
        </button>
      </div>
      {candidates.length > 0 && (
        <div className="claim-match">
          <p className="filter-label">{t("labels.claimMatchTitle")}</p>
          {candidates.map((profile) => (
            <label className="field claim-match-option" key={profile.id}>
              <input
                type="radio"
                name="matchedProfileId"
                value={profile.id}
                defaultChecked={draft.matchedProfileId === profile.id}
              />
              {profile.name}
            </label>
          ))}
          <label className="field claim-match-option">
            <input type="radio" name="matchedProfileId" value="" defaultChecked={!draft.matchedProfileId} />
            {t("labels.claimMatchNone")}
          </label>
        </div>
      )}
      <label className="field full">
        {t("labels.claimSelfDeclareNameLabel")}
        <input name="selfDeclaredName" defaultValue={draft.selfDeclaredName} />
      </label>
      {error && <div className="status-panel warning">{t("labels.claimRangeError")}</div>}
      <div className="form-actions">
        <button className="button gold" type="submit">
          {t("labels.claimSaveButton")}
        </button>
        <button className="button ghost" type="button" onClick={onCancel}>
          {t("labels.cancelButton")}
        </button>
      </div>
    </form>
  );
}

function MemoriesSection({ account, t, saveMemory, deleteMemory }) {
  const [draft, setDraft] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const memories = account.memories || [];

  async function handlePhotoChange(event) {
    const files = Array.from(event.target.files || []);
    let error = "";
    let photos = draft.photos.slice();
    for (const file of files) {
      if (photos.length >= MAX_PHOTOS_PER_MEMORY) {
        error = t("labels.memoryPhotoCapReached");
        break;
      }
      try {
        const dataUrl = await downscalePhoto(file);
        photos = photos.concat(dataUrl);
      } catch (_error) {
        error = t("labels.memoryNonImageFile");
      }
    }
    setPhotoError(error);
    setDraft({ ...draft, photos });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isNew = !draft.id;
    if (isNew && memories.length >= MAX_MEMORIES_PER_MEMBER) {
      setPhotoError(t("labels.memoryCapReached"));
      return;
    }
    const memory = {
      id: draft.id || `memory-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      title: formData.get("title") || "",
      text: formData.get("text") || "",
      photos: draft.photos.slice()
    };
    try {
      saveMemory(memory, isNew);
      setDraft(null);
      setPhotoError("");
    } catch (error) {
      if (!(error instanceof StorageBudgetError)) {
        throw error;
      }
      setPhotoError(t("labels.memoryStorageFull"));
    }
  }

  return (
    <article className="profile-panel">
      <h2>{t("labels.memories")}</h2>
      {memories.length === 0 && !draft && <p className="empty-note">{t("labels.memoryNoneYet")}</p>}
      {memories.map((memory) => (
        <div className="profile-content-item" key={memory.id}>
          <h3>
            {memory.title} <span className="pending-badge">{t("labels.pendingReviewBadge")}</span>
          </h3>
          <p>{memory.text}</p>
          {memory.photos.length > 0 && (
            <div className="memory-photo-row">
              {memory.photos.map((src, index) => (
                <img className="memory-photo-thumb" src={src} alt="" key={index} />
              ))}
            </div>
          )}
          <div className="form-actions">
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                setDraft(blankMemoryDraft(memory));
                setPhotoError("");
              }}
            >
              {t("labels.memoryEditButton")}
            </button>
            <button className="button ghost" type="button" onClick={() => deleteMemory(memory.id)}>
              {t("labels.memoryDeleteButton")}
            </button>
          </div>
        </div>
      ))}
      {draft ? (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{t("sections.memoriesComposerTitle")}</h2>
          <div className="form-grid">
            <label className="field full">
              {t("labels.memoryTitleLabel")}
              <input name="title" defaultValue={draft.title} required />
            </label>
            <label className="field full">
              {t("labels.memoryTextLabel")}
              <textarea name="text" defaultValue={draft.text} required />
            </label>
            <label className="field full">
              {t("labels.memoryPhotosLabel")}
              <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
            </label>
          </div>
          {draft.photos.length > 0 && (
            <div className="memory-photo-row">
              {draft.photos.map((src, index) => (
                <span className="memory-photo-draft" key={index}>
                  <img className="memory-photo-thumb" src={src} alt="" />
                  <button
                    className="button ghost"
                    type="button"
                    onClick={() => setDraft({ ...draft, photos: draft.photos.filter((_p, i) => i !== index) })}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
          {photoError && <div className="status-panel warning">{photoError}</div>}
          <div className="form-actions">
            <button className="button gold" type="submit">
              {t("labels.memorySaveButton")}
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                setDraft(null);
                setPhotoError("");
              }}
            >
              {t("labels.cancelButton")}
            </button>
          </div>
        </form>
      ) : memories.length >= MAX_MEMORIES_PER_MEMBER ? (
        <p className="empty-note">{t("labels.memoryCapReached")}</p>
      ) : (
        <div className="form-actions">
          <button
            className="button gold"
            type="button"
            onClick={() => {
              setDraft(blankMemoryDraft(null));
              setPhotoError("");
            }}
          >
            {t("sections.memoriesComposerTitle")}
          </button>
        </div>
      )}
    </article>
  );
}
