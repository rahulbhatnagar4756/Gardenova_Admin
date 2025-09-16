import "./dataTable.css";

// Type for nested property keys (like "user.name")
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

interface Column<T extends Record<string, unknown>> {
  key: keyof T | NestedKeyOf<T>;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
  show?: (item: T) => boolean;
}

interface DataTableProps<T extends Record<string, unknown> & { _id: string }> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  className?: string;
  emptyMessage?: string;
}

export const DataTable = <T extends Record<string, unknown> & { _id: string }>({
  data,
  columns,
  actions = [],
  className = "",
  emptyMessage = "No data available",
}: DataTableProps<T>) => {
  // Helper function to get nested property value with proper typing
  const getNestedValue = (obj: T, key: string): unknown => {
    const keys = key.split(".");
    let value: unknown = obj;

    for (const k of keys) {
      if (value === null || value === undefined) {
        return undefined;
      }
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }

    return value;
  };

  // Helper function to render cell content with type safety
  const renderCellContent = (
    column: Column<T>,
    item: T,
    rowIndex: number
  ): React.ReactNode => {
    // Handle automatic row index rendering
    if (column.key === "__index") {
      return rowIndex + 1; // Convert 0-based index to 1-based
    }
    const value = getNestedValue(item, column.key as string);

    if (column.render) {
      return column.render(value, item);
    }

    // Handle different data types
    if (value === null || value === undefined) {
      return <span className="empty-value">-</span>;
    }

    if (Array.isArray(value)) {
      return value.map(String).join(", ");
    }

    if (typeof value === "boolean") {
      return (
        <span className={`boolean-value ${value ? "true" : "false"}`}>
          {value ? "Yes" : "No"}
        </span>
      );
    }

    if (typeof value === "number") {
      return <span className="number-value">{value.toLocaleString()}</span>;
    }

    return String(value);
  };

  // Type guard to check if actions exist
  const hasActions = actions.length > 0;

  return (
    <div className={`data-table-wrapper ${className}`}>
      <div className="data-table-container">
        <table className="data-table-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={column.className}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
              {hasActions && <th className="actions-header">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                {columns.map((column) => (
                  <td key={column.key as string} className={column.className}>
                    {renderCellContent(column, item, index)}
                  </td>
                ))}
                {hasActions && (
                  <td className="actions-cell">
                    <div className="data-table-actions">
                      {actions
                        .filter((action) => !action.show || action.show(item))
                        .map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={`btn ${
                              action.className || "btn-secondary"
                            }`}
                            title={action.label}
                            aria-label={action.label}
                            type="button"
                          >
                            {action.icon ?? action.label}
                          </button>
                        ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="no-data">
          <div className="no-data-content">
            <p className="no-data-message">{emptyMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
