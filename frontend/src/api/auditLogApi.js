import { handleApiResponse } from "./apiError";
import { BASE_URL } from "./config";

const AUDIT_LOGS_URL = `${BASE_URL}/audit-logs`;

export function getAuditLogs() {
  return fetch(AUDIT_LOGS_URL)
    .then((response) =>
      handleApiResponse(response, "Failed to fetch audit logs.")
    )
    .then((response) => response.json());
}

export function exportAuditLogsCsv() {
  return fetch(`${AUDIT_LOGS_URL}/export`)
    .then((response) =>
      handleApiResponse(response, "Failed to export audit logs.")
    )
    .then((response) => response.blob())
    .then((blob) => {
      downloadBlob(blob, "audit-logs.csv");
    });
}

function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  window.URL.revokeObjectURL(url);
}