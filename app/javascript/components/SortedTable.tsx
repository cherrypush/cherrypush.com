import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { useSortBy, useTable } from 'react-table'

import { Table } from 'flowbite-react'
import React from 'react'

interface Props {
  columns: any
  data: any
  onRowClick: (row: any) => void
  Footer?: React.FC
}

const SortedTable = ({ columns, data, onRowClick, Footer }: Props) => {
  const table = useTable({ columns, data }, useSortBy)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table

  return (
    <Table {...getTableProps()}>
      {headerGroups.map((headerGroup) => (
        <Table.Head key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <Table.HeadCell key={column.getHeaderProps().key} {...column.getHeaderProps(column.getSortByToggleProps())}>
              <div className="flex items-center select-none">
                {column.render('Header')}
                <span>{column.isSorted ? column.isSortedDesc ? <FaSortUp /> : <FaSortDown /> : <FaSort />}</span>
              </div>
            </Table.HeadCell>
          ))}
        </Table.Head>
      ))}
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Table.Row
              onClick={() => onRowClick(row.original)}
              key={row.getRowProps().key}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              {...row.getRowProps()}
            >
              {row.cells.map((cell, index) => {
                return (
                  <Table.Cell
                    key={cell.getCellProps().key}
                    {...cell.getCellProps()}
                    className={index === 0 ? 'text-white font-bold' : undefined}
                  >
                    {cell.render('Cell')}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
        {Footer && <Footer />}
      </Table.Body>
    </Table>
  )
}

export default SortedTable
