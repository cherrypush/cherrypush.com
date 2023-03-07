import { Table } from 'flowbite-react'
import React from 'react'
import { useSortBy, useTable } from 'react-table/dist/react-table.development'

const SortedTable = ({ columns, data, onRowClick, Footer }) => {
  const table = useTable({ columns, data }, useSortBy)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table

  return (
    <Table {...getTableProps()}>
      {headerGroups.map((headerGroup) => (
        <Table.Head key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <Table.HeadCell key={column.getHeaderProps().key} {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render('Header')}
              <span>{column.isSorted ? (column.isSortedDesc ? ' 🔼' : ' 🔽') : ''}</span>
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
              {row.cells.map((cell) => {
                return (
                  <Table.Cell key={cell.getCellProps().key} {...cell.getCellProps()}>
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
