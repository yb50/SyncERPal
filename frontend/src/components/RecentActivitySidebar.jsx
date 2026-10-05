function RecentActivitySidebar({ auditLogs }) {
  const recentAuditLogs = auditLogs.slice(0, 5);

  function formatDateTime(value) {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  }

  return (
    <aside className="recent-activity-sidebar">
      <h2>Recent Activity</h2>

      {recentAuditLogs.length === 0 ? (
        <p className="empty-message">No recent activity yet.</p>
      ) : (
        <ul className="recent-activity-list">
          {recentAuditLogs.map((auditLog) => (
            <li key={auditLog.id}>
              <strong>{auditLog.action}</strong>

              <p>{auditLog.message}</p>

              <small>
                {auditLog.performedBy} - {formatDateTime(auditLog.createdAt)}
              </small>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default RecentActivitySidebar;