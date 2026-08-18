function AuditLogTable({
  auditLogs,
  emptyMessage = "No audit logs found.",
}) {
  function formatDateTime(dateTimeText) {
    if (!dateTimeText) {
      return "";
    }

    const date = new Date(dateTimeText);

    return date.toLocaleString();
  }

  if (auditLogs.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Action</th>
          <th>Entity Type</th>
          <th>Entity ID</th>
          <th>Message</th>
          <th>Performed By</th>
          <th>Created At</th>
        </tr>
      </thead>

      <tbody>
        {auditLogs.map((auditLog) => (
          <tr key={auditLog.id}>
            <td>{auditLog.id}</td>
            <td>{auditLog.action}</td>
            <td>{auditLog.entityType}</td>
            <td>{auditLog.entityId}</td>
            <td>{auditLog.message}</td>
            <td>{auditLog.performedBy}</td>
            <td>{formatDateTime(auditLog.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AuditLogTable;