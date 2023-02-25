import React from 'react'
import classnames from 'classnames'
import { Table } from 'flowbite-react'

const Owners = ({ owners, selectedOwners, setSelectedOwners }) => {
  const isSelected = (owner) => selectedOwners.includes(owner.handle)
  const select = (owner) => setSelectedOwners(selectedOwners.concat([owner.handle]))
  const unselect = (owner) => setSelectedOwners(selectedOwners.filter((o) => o !== owner.handle))
  const toggleOwner = (owner) => (isSelected(owner) ? unselect(owner) : select(owner))

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Owners 👩🏻‍💻
        </caption>
        <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <Table.HeadCell>Owner</Table.HeadCell>
          <Table.HeadCell className="text-right">Count</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {owners.map((owner) => (
            <Table.Row
              key={owner.handle}
              className={classnames(
                'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer text-xs',
                {
                  'dark:bg-blue-900': isSelected(owner),
                }
              )}
              onClick={() => toggleOwner(owner)}
            >
              <Table.Cell>{owner.handle}</Table.Cell>
              <Table.Cell className="text-right">{owner.count.toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}

          {owners.length === 0 && (
            <Table.Row className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
              <Table.Cell colSpan="3" className="px-4 py-2">
                You can start using owners on your project by adding a CODEOWNERS file to your repository. Learn more
                about code owners through the official docs:{' '}
                <a
                  className="text-link"
                  href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners"
                >
                  About code owners
                </a>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Owners
