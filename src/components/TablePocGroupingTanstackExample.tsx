import React from 'react';



import {
  type GroupingState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { makeData, type Person } from './makeData';

export default function TablePocGroupingTanstackExample() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        header: 'Name',
        columns: [
          {
            accessorKey: 'firstName',
            header: 'First Name',
            cell: (info) => info.getValue(),
            /**
             * override the value used for row grouping
             * (otherwise, defaults to the value derived from accessorKey / accessorFn)
             */
            getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
          },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            header: () => <span>Last Name</span>,
            cell: (info) => info.getValue(),
          },
        ],
      },
      {
        header: 'Info',
        columns: [
          {
            accessorKey: 'age',
            header: () => 'Age',
            aggregatedCell: ({ getValue }) =>
              Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'median',
          },
          {
            header: 'More Info',
            columns: [
              {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                aggregationFn: 'sum',
                // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
              },
              {
                accessorKey: 'status',
                header: 'Status',
              },
              {
                accessorKey: 'progress',
                header: 'Profile Progress',
                cell: ({ getValue }) =>
                  Math.round(getValue<number>() * 100) / 100 + '%',
                aggregationFn: 'mean',
                aggregatedCell: ({ getValue }) =>
                  Math.round(getValue<number>() * 100) / 100 + '%',
              },
            ],
          },
        ],
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(100));
  const refreshData = () => setData(() => makeData(100));

  const [grouping, setGrouping] = React.useState<GroupingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
    },
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });


  return (
    <div className="p-2">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">TanStack Table Grouping Example</h3>
        <p className="text-sm">Click the 👊 button on any column header to group by that column.</p>
        {grouping.length > 0 && (
          <p className="text-sm mt-1 text-orange-600">
            ⚠️ Note: Pagination works on the final row structure (groups + children), not individual data rows.
          </p>
        )}
      </div>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        border: '1px solid #ddd',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th 
                    key={header.id} 
                    colSpan={header.colSpan}
                    style={{
                      padding: '12px 16px',
                      background: header.column.getIsGrouped() ? '#4CAF50' : '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: header.column.getIsGrouped() ? 'white' : '#495057',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {header.column.getCanGroup() ? (
                          // If the header can be grouped, let's add a toggle
                          <button
                            onClick={header.column.getToggleGroupingHandler()}
                            style={{
                              cursor: 'pointer',
                              padding: '4px 8px',
                              fontSize: '16px',
                              background: 'none',
                              border: 'none',
                              lineHeight: 1
                            }}
                            title={header.column.getIsGrouped() 
                              ? `Grouped (position ${header.column.getGroupedIndex()}). Click to ungroup.` 
                              : 'Click to group by this column'}
                          >
                            {header.column.getIsGrouped()
                              ? `🛑`
                              : `👊`}
                          </button>
                        ) : null}
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid #e9ecef',
                        background: cell.getIsGrouped()
                          ? '#e8f5e9'
                          : cell.getIsAggregated()
                          ? '#fff3e0'
                          : cell.getIsPlaceholder()
                          ? '#fafafa'
                          : 'white',
                      }}
                    >
                      {cell.getIsGrouped() ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <button
                            {...{
                              onClick: row.getToggleExpandedHandler(),
                              style: {
                                cursor: row.getCanExpand()
                                  ? 'pointer'
                                  : 'normal',
                              },
                            }}
                          >
                            {row.getIsExpanded() ? '👇' : '👉'}{' '}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}{' '}
                            ({row.subRows.length})
                          </button>
                        </>
                      ) : cell.getIsAggregated() ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
        <div className="font-semibold mb-2">Pagination Controls</div>
        <div className="flex items-center gap-2 flex-wrap">
        <button
          className="border rounded px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </div>
        
        {/* Info Section */}
        <div className="mt-3 pt-3 border-t border-gray-300 space-y-1 text-sm">
          <div>
            <strong>Showing:</strong> {table.getRowModel().rows.length} rows on this page
          </div>
          <div>
            <strong>Total data:</strong> {data.length} records
          </div>
          {grouping.length > 0 && (
            <div className="text-orange-600">
              <strong>Active grouping:</strong> {grouping.join(', ')}
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => rerender()}
          className="border rounded px-4 py-2 bg-white hover:bg-gray-50"
        >
          Force Rerender
        </button>
        <button 
          onClick={() => refreshData()}
          className="border rounded px-4 py-2 bg-white hover:bg-gray-50"
        >
          Refresh Data
        </button>
      </div>
      
      {/* Debug Info */}
      {grouping.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">Debug: Grouping State</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(grouping, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

