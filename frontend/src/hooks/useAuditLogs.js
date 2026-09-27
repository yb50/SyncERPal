import { useState } from "react";
import { exportAuditLogsCsv, getAuditLogs } from "../api/auditLogApi";

function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);

  function fetchAuditLogs(token) {
    if (!token) {
      setAuditLogs([]);
      return Promise.resolve();
    }

    return getAuditLogs(token).then((data) => {
      setAuditLogs(data);
    });
  }

  function exportAuditLogs(token) {
    return exportAuditLogsCsv(token);
  }

  return {
    auditLogs,
    fetchAuditLogs,
    exportAuditLogs,
  };
}

export default useAuditLogs;