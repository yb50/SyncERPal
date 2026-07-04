const BASE_URL = "http://localhost:8080";
const AUDIT_LOGS_URL = `${BASE_URL}/audit-logs`;

export function getAuditLogs() {
  return fetch(AUDIT_LOGS_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load audit logs.");
    }

    return response.json();
  });
}