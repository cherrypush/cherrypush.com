import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

import { Table } from 'flowbite-react'
import React, { useState } from 'react'

interface Props {
  columns: ColumnDef<unknown>[]
  data: unknown[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick: (row: any) => void
  Footer?: React.FC
}

const SortedTable = ({ columns, data, onRowClick, Footer }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { getHeaderGroups, getRowModel } = table

  return (
    <Table>
      <Table.Head>
        {getHeaderGroups().map((headerGroup) => (
          <React.Fragment key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.HeadCell
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className="cursor-pointer"
              >
                <div className="flex items-center select-none">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <span>
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === 'desc' ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </span>
                </div>
              </Table.HeadCell>
            ))}
          </React.Fragment>
        ))}
      </Table.Head>
      <Table.Body>
        {getRowModel().rows.map((row) => (
          <Table.Row
            key={row.id}
            onClick={() => onRowClick(row.original)}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
          >
            {row.getVisibleCells().map((cell, index) => (
              <Table.Cell key={cell.id} className={index === 0 ? 'text-white font-bold' : undefined}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
        {Footer && <Footer />}
      </Table.Body>
    </Table>
  )
}

export default SortedTable
