import { useMemo, useState } from "react";
import AuditLogTable from "./AuditLogTable";
import PaginationControls from "../PaginationControls";
import SortControls from "../SortControls";

function AuditLogSection({ 
  auditLogs, 
  exportAuditLogs, 
  authToken 
}) {
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [selectedPerformedBy, setSelectedPerformedBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const pageSize = 10;

  const actions = [...new Set(auditLogs.map((auditLog) => auditLog.action))];
  const entityTypes = [
    ...new Set(auditLogs.map((auditLog) => auditLog.entityType)),
  ];
  const performedByUsers = [
    ...new Set(auditLogs.map((auditLog) => auditLog.performedBy)),
  ];

  // + Filtering

  const filteredAuditLogs = auditLogs.filter((auditLog) => {
    const matchesAction =
      selectedAction === "" || auditLog.action === selectedAction;

    const matchesEntityType =
      selectedEntityType === "" ||
      auditLog.entityType === selectedEntityType;

    const matchesPerformedBy =
      selectedPerformedBy === "" ||
      auditLog.performedBy === selectedPerformedBy;

    return matchesAction && matchesEntityType && matchesPerformedBy;
  });

  // - Filtering

  // + Sorting

  function getAuditLogSortValue(auditLog) {
    switch (sortBy) {
      case "createdAt":
        return auditLog.createdAt ? new Date(auditLog.createdAt).getTime() : 0;
      case "action":
        return auditLog.action ?? "";
      case "entityType":
        return auditLog.entityType ?? "";
      case "entityId":
        return auditLog.entityId ?? 0;
      case "performedBy":
        return auditLog.performedBy ?? "";
      default:
        return auditLog.createdAt ? new Date(auditLog.createdAt).getTime() : 0;
    }
  }

  const sortedAuditLogs = useMemo(() => {
    return [...filteredAuditLogs].sort((a, b) => {
      const aValue = getAuditLogSortValue(a);
      const bValue = getAuditLogSortValue(b);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const aText = String(aValue).toLowerCase();
      const bText = String(bValue).toLowerCase();

      return sortDirection === "asc"
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });
  }, [filteredAuditLogs, sortBy, sortDirection]);

  // - Sorting

  // + Pagination

  const totalPages = Math.ceil(sortedAuditLogs.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAuditLogs = sortedAuditLogs.slice(
    startIndex,
    startIndex + pageSize
  );

  function resetToFirstPage() {
    setCurrentPage(1);
  }
  
  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }
  
  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination
  
  function clearFilters() {
    setSelectedAction("");
    setSelectedEntityType("");
    setSelectedPerformedBy("");
    setCurrentPage(1);
  }

  return (
    <>
      <h2>Audit Logs</h2>

      <button type="button" onClick={() => exportAuditLogs(authToken)}>
        Export Audit Logs CSV
      </button>

      <div>
        <label>Filter by action: </label>

        <select
          value={selectedAction}
          onChange={(event) => {
            setSelectedAction(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All actions</option>

          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by entity type: </label>

        <select
          value={selectedEntityType}
          onChange={(event) => {
            setSelectedEntityType(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All entity types</option>

          {entityTypes.map((entityType) => (
            <option key={entityType} value={entityType}>
              {entityType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by performed by: </label>

        <select
          value={selectedPerformedBy}
          onChange={(event) => {
            setSelectedPerformedBy(event.target.value);
            resetToFirstPage();
          }}
        >
          <option value="">All users</option>

          {performedByUsers.map((performedBy) => (
            <option key={performedBy} value={performedBy}>
              {performedBy}
            </option>
          ))}
        </select>
      </div>

      <SortControls
        sortBy={sortBy}
        sortDirection={sortDirection}
        sortOptions={[
          { value: "createdAt", label: "Created at" },
          { value: "action", label: "Action" },
          { value: "entityType", label: "Entity type" },
          { value: "entityId", label: "Entity ID" },
          { value: "performedBy", label: "Performed by" },
        ]}
        onSortByChange={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        onSortDirectionChange={(value) => {
          setSortDirection(value);
          setCurrentPage(1);
        }}
      />

      <button type="button" onClick={clearFilters}>
        Clear Audit Filters
      </button>

      <p className="table-summary">
        Showing {paginatedAuditLogs.length} of {filteredAuditLogs.length} audit
        logs
      </p>

      <AuditLogTable
        auditLogs={paginatedAuditLogs}
        emptyMessage="No audit logs match the selected filters."
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </>
  );
}

export default AuditLogSection;