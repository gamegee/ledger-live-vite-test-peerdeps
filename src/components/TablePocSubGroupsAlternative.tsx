import React from 'react';



import {
  type ExpandedState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  flexRender,
  type GroupingState
} from '@tanstack/react-table';
import { makeData, type Person } from './makeData';

export default function TablePocSubGroupsAlternative() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
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
        header: 'Last Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        aggregatedCell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'median',
      },
      {
        accessorKey: 'visits',
        header: 'Visits',
        aggregationFn: 'sum',
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
    []
  );

  const [data, setData] = React.useState(() => makeData(100));
  const refreshData = () => setData(() => makeData(100));

  const [grouping, setGrouping] = React.useState<GroupingState>(['age']);
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);

  const table = useReactTable<Person>({
    data,
    columns,
    state: {
      grouping,
      expanded,
    },
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });


  return (
    <div className="p-2">
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => table.toggleAllRowsExpanded()}
          className="border rounded p-2 bg-blue-50 hover:bg-blue-100"
        >
          {table.getIsAllRowsExpanded() ? 'Collapse All Groups' : 'Expand All Groups'}
        </button>
        <button 
          onClick={() => setGrouping([])}
          className="border rounded p-2 bg-gray-50 hover:bg-gray-100"
        >
          Clear Grouping
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
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
                      background: '#fafafa',
                      borderBottom: '2px solid #ddd',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {header.column.getCanGroup() ? (
                          // If the header can be grouped, let's add a toggle
                          <button
                            onClick={header.column.getToggleGroupingHandler()}
                            style={{
                              cursor: 'pointer',
                              background: header.column.getIsGrouped() ? '#4CAF50' : '#e0e0e0',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              color: header.column.getIsGrouped() ? 'white' : '#666',
                              fontWeight: 600
                            }}
                            title={header.column.getIsGrouped() ? 'Remove grouping' : 'Group by this column'}
                          >
                            {header.column.getIsGrouped()
                              ? `Grouped (${header.column.getGroupedIndex()})`
                              : `Group`}
                          </button>
                        ) : null}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
            // Check if this row has any grouped cells
            const groupedCell = row.getVisibleCells().find(cell => cell.getIsGrouped());
            console.log({groupedCell})
            
            
            if (groupedCell) {
              // This is a group row - render a sub-header
              return (
                <React.Fragment key={row.id}>
                  <tr style={{ background: '#f4f5f7' }}>
                    <td 
                      colSpan={row.getVisibleCells().length}
                      style={{ 
                        padding: '12px 16px',
                        fontWeight: 600,
                        fontSize: '14px',
                        borderTop: '2px solid #ddd',
                        borderBottom: '1px solid #ddd'
                      }}
                    >
                      <button
                        onClick={row.getToggleExpandedHandler()}
                        style={{
                          cursor: 'pointer',
                          marginRight: '8px',
                          background: 'none',
                          border: 'none',
                          fontSize: '14px'
                        }}
                      >
                        {row.getIsExpanded() ? '▼' : '▶'}
                      </button>
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {flexRender(
                          groupedCell.column.columnDef.cell,
                          groupedCell.getContext()
                        )}
                      </span>
                      <span style={{ marginLeft: '8px', fontWeight: 400, color: '#666' }}>
                        ({row.subRows.length} {row.subRows.length === 1 ? 'row' : 'rows'})
                      </span>
                    </td>
                  </tr>
                  {/* Render child rows if expanded */}
                  {row.subRows.map((subRow) => (
                    <tr key={subRow.id}>
                      {subRow.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            padding: '8px 16px',
                            background: cell.getIsAggregated()
                              ? '#ffa50078'
                              : cell.getIsPlaceholder()
                              ? 'transparent'
                              : 'white',
                          }}
                        >
                          {cell.getIsAggregated() ? (
                            flexRender(
                              cell.column.columnDef.aggregatedCell ??
                                cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          ) : cell.getIsPlaceholder() ? null : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              );
            }
            
            // Regular row (no grouping)
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
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
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(grouping, null, 2)}</pre>
    </div>
  );
}

