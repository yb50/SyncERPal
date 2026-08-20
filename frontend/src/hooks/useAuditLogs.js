import { useState } from "react";
import { exportAuditLogsCsv, getAuditLogs } from "../api/auditLogApi";

function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);

  function fetchAuditLogs() {
    return getAuditLogs().then((data) => {
      setAuditLogs(data);
    });
  }

  function exportAuditLogs() {
    exportAuditLogsCsv();
  }

  return {
    auditLogs,
    fetchAuditLogs,
    exportAuditLogs,
  };
}

export default useAuditLogs;