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
    </section>
  );
}
