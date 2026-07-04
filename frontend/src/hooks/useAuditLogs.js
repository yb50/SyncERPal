import { useState } from "react";
import { getAuditLogs } from "../api/auditLogApi";

function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);

  function fetchAuditLogs() {
    return getAuditLogs().then((data) => {
      setAuditLogs(data);
    });
  }

  return {
    auditLogs,
    fetchAuditLogs,
  };
}

export default useAuditLogs;