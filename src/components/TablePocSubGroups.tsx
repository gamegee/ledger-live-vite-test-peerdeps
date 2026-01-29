import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

/* ----------------------------
   Row types
----------------------------- */

type SectionRow = {
  kind: 'section'
  label: string
}

type TxRow = {
  kind: 'tx'
  type: 'Send' | 'Receive'
  time: string
  amountUsd: string
  amountEth: string
}

type Row = SectionRow | TxRow

/* ----------------------------
   Raw transactions
----------------------------- */

const transactions = [
  { date: 'February 8th 2025', type: 'Send',    time: '5:13 pm', amountUsd: '$567,826,836', amountEth: '189,275.612 ETH' },
  { date: 'February 8th 2025', type: 'Receive', time: '5:13 pm', amountUsd: '$567,826,836', amountEth: '189,275.612 ETH' },

  { date: 'February 7th 2025', type: 'Receive', time: '5:13 pm', amountUsd: '$567,826,836', amountEth: '189,275.612 ETH' },

  { date: 'February 6th 2025', type: 'Send',    time: '5:13 pm', amountUsd: '$567,826,836', amountEth: '189,275.612 ETH' },
  { date: 'February 6th 2025', type: 'Receive', time: '5:13 pm', amountUsd: '$567,826,836', amountEth: '189,275.612 ETH' },
]

/* ----------------------------
   Build rows with sections
----------------------------- */

function buildRows(): Row[] {
  const rows: Row[] = []
  let lastDate = ''

  for (const tx of transactions) {
    if (tx.date !== lastDate) {
      rows.push({ kind: 'section', label: tx.date })
      lastDate = tx.date
    }

    rows.push({
      kind: 'tx',
      type: tx.type as TxRow['type'],
      time: tx.time,
      amountUsd: tx.amountUsd,
      amountEth: tx.amountEth,
    })
  }

  return rows
}

const data = buildRows()

/* ----------------------------
   Columns
----------------------------- */

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info =>
      info.row.original.kind === 'tx' ? info.getValue() : null,
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: info =>
      info.row.original.kind === 'tx' ? info.getValue() : null,
  },
  {
    accessorKey: 'amountUsd',
    header: 'USD',
    cell: info =>
      info.row.original.kind === 'tx' ? info.getValue() : null,
  },
  {
    accessorKey: 'amountEth',
    header: 'ETH',
    cell: info =>
      info.row.original.kind === 'tx' ? info.getValue() : null,
  },
]

/* ----------------------------
   Table component
----------------------------- */

export default function TransactionsTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <thead>
        <tr>
          {table.getFlatHeaders().map(header => (
            <th
              key={header.id}
              style={{
                textAlign: 'left',
                padding: '8px',
                borderBottom: '1px solid #ddd',
                fontWeight: 600,
              }}
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {table.getRowModel().rows.map(row => {
          const original = row.original

          // ✅ Grey date sub-header
          if (original.kind === 'section') {
            return (
              <tr key={row.id}>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '8px',
                    background: '#f4f5f7',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {original.label}
                </td>
              </tr>
            )
          }

          // ✅ Normal transaction row
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
