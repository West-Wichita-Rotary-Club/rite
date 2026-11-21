import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useAccount } from "../context/AccountContext.jsx";
import { api } from "../api.js";

export function Coordinator() {
  const { t } = useLanguage();
  const { account, status } = useAccount();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);
  // ps-018: the review queue, loaded alongside the user list above.
  const [pendingClaims, setPendingClaims] = useState(null);
  const [pendingMemories, setPendingMemories] = useState(null);
  const [reviewError, setReviewError] = useState("");
  const [reviewPendingId, setReviewPendingId] = useState(null);

  useEffect(() => {
    if (!account?.isCoordinator) {
      return;
    }
    let cancelled = false;
    api.listAccounts().then(({ ok, data }) => {
      if (cancelled) {
        return;
      }
      if (ok) {
        setUsers(data);
      } else {
        setError(t("labels.usersLoadError"));
      }
    });
    Promise.all([api.listPendingClaims(), api.listPendingMemories()]).then(([claimsResult, memoriesResult]) => {
      if (cancelled) {
        return;
      }
      if (claimsResult.ok && memoriesResult.ok) {
        setPendingClaims(claimsResult.data);
        setPendingMemories(memoriesResult.data);
      } else {
        setReviewError(t("labels.reviewLoadError"));
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.isCoordinator]);

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

  if (!account.isCoordinator) {
    return (
      <section className="section">
        <p className="status-panel warning">{t("labels.forbiddenNotice")}</p>
      </section>
    );
  }

  async function setActive(id, nextActive) {
    if (!nextActive && !window.confirm(t("labels.deactivateConfirm"))) {
      return;
    }
    setPendingId(id);
    const { ok, data } = nextActive ? await api.reactivateAccount(id) : await api.deactivateAccount(id);
    setPendingId(null);
    if (ok) {
      setUsers((existing) => existing.map((user) => (user.id === id ? data : user)));
    } else {
      setError(t("labels.usersLoadError"));
    }
  }

  async function approveClaim(id) {
    setReviewPendingId(id);
    const { ok } = await api.approveClaim(id);
    setReviewPendingId(null);
    if (ok) {
      setPendingClaims((existing) => existing.filter((claim) => claim.id !== id));
    } else {
      setReviewError(t("labels.reviewLoadError"));
    }
  }

  async function rejectClaim(id) {
    const reason = window.prompt(t("labels.rejectReasonPrompt"));
    if (reason === null) {
      return;
    }
    if (!reason.trim()) {
      setReviewError(t("labels.rejectReasonRequired"));
      return;
    }
    setReviewPendingId(id);
    const { ok } = await api.rejectClaim(id, reason);
    setReviewPendingId(null);
    if (ok) {
      setPendingClaims((existing) => existing.filter((claim) => claim.id !== id));
    } else {
      setReviewError(t("labels.reviewLoadError"));
    }
  }

  async function approveMemory(id) {
    setReviewPendingId(id);
    const { ok } = await api.approveMemory(id);
    setReviewPendingId(null);
    if (ok) {
      setPendingMemories((existing) => existing.filter((memory) => memory.id !== id));
    } else {
      setReviewError(t("labels.reviewLoadError"));
    }
  }

  async function rejectMemory(id) {
    const reason = window.prompt(t("labels.rejectReasonPrompt"));
    if (reason === null) {
      return;
    }
    if (!reason.trim()) {
      setReviewError(t("labels.rejectReasonRequired"));
      return;
    }
    setReviewPendingId(id);
    const { ok } = await api.rejectMemory(id, reason);
    setReviewPendingId(null);
    if (ok) {
      setPendingMemories((existing) => existing.filter((memory) => memory.id !== id));
    } else {
      setReviewError(t("labels.reviewLoadError"));
    }
  }

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.coordinatorTitle")}</h1>
      <p className="section-lede">{t("sections.coordinatorIntro")}</p>
      {error && <div className="status-panel warning">{error}</div>}
      {users === null ? (
        <p>{t("labels.loading")}</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("labels.userEmailColumn")}</th>
              <th>{t("labels.userRoleColumn")}</th>
              <th>{t("labels.userStatusColumn")}</th>
              <th>{t("labels.userActionsColumn")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.email}
                  {user.isCoordinator && <span className="pending-badge">{t("labels.coordinatorBadge")}</span>}
                </td>
                <td>{user.role}</td>
                <td>{user.isActive ? t("labels.statusActive") : t("labels.statusDeactivated")}</td>
                <td>
                  <button
                    className="button ghost"
                    type="button"
                    disabled={pendingId === user.id}
                    onClick={() => setActive(user.id, !user.isActive)}
                  >
                    {user.isActive ? t("labels.deactivateButton") : t("labels.reactivateButton")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="form-title">{t("sections.reviewQueueTitle")}</h2>
      <p className="section-lede">{t("sections.reviewQueueIntro")}</p>
      {reviewError && <div className="status-panel warning">{reviewError}</div>}

      <h3>{t("labels.reviewClaimsHeading")}</h3>
      {pendingClaims === null ? (
        <p>{t("labels.loading")}</p>
      ) : pendingClaims.length === 0 ? (
        <p className="empty-note">{t("labels.reviewQueueEmpty")}</p>
      ) : (
        pendingClaims.map((claim) => (
          <article className="profile-content-item" key={claim.id}>
            <p className="meta">
              {t("labels.reviewSubmitterLabel")}: {claim.submitterName} ({claim.submitterEmail})
            </p>
            <p>
              {claim.country} — {claim.selfDeclaredName}
            </p>
            <div className="form-actions">
              <button
                className="button gold"
                type="button"
                disabled={reviewPendingId === claim.id}
                onClick={() => approveClaim(claim.id)}
              >
                {t("labels.approveButton")}
              </button>
              <button
                className="button ghost"
                type="button"
                disabled={reviewPendingId === claim.id}
                onClick={() => rejectClaim(claim.id)}
              >
                {t("labels.rejectButton")}
              </button>
            </div>
          </article>
        ))
      )}

      <h3>{t("labels.reviewMemoriesHeading")}</h3>
      {pendingMemories === null ? (
        <p>{t("labels.loading")}</p>
      ) : pendingMemories.length === 0 ? (
        <p className="empty-note">{t("labels.reviewQueueEmpty")}</p>
      ) : (
        pendingMemories.map((memory) => (
          <article className="profile-content-item" key={memory.id}>
            <p className="meta">
              {t("labels.reviewSubmitterLabel")}: {memory.submitterName} ({memory.submitterEmail})
            </p>
            <h4>{memory.title}</h4>
            <p>{memory.text}</p>
            <div className="form-actions">
              <button
                className="button gold"
                type="button"
                disabled={reviewPendingId === memory.id}
                onClick={() => approveMemory(memory.id)}
              >
                {t("labels.approveButton")}
              </button>
              <button
                className="button ghost"
                type="button"
                disabled={reviewPendingId === memory.id}
                onClick={() => rejectMemory(memory.id)}
              >
                {t("labels.rejectButton")}
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
