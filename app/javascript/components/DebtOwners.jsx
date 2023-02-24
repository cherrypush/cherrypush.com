import React from 'react'
import classnames from 'classnames'

const DebtOwners = ({ owners, selectedOwners, setSelectedOwners }) => {
  const isSelected = (owner) => selectedOwners.includes(owner.handle)
  const select = (owner) => setSelectedOwners((owners) => owners.concat([owner.handle]))
  const unselect = (owner) => setSelectedOwners((owners) => owners.filter((o) => o !== owner.handle))
  const toggleOwner = (owner) => (isSelected(owner) ? unselect(owner) : select(owner))

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Debt Owners 🧹
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Owner
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr
              key={owner.handle}
              className={classnames(
                'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer text-xs',
                {
                  'dark:bg-blue-900': isSelected(owner),
                }
              )}
              onClick={() => toggleOwner(owner)}
            >
              <td scope="row" className="pl-3 px-4 py-2">
                <div className="flex items-center">{owner.handle}</div>
              </td>
              <td className="px-4 py-2 text-right">{owner.count.toLocaleString()}</td>
            </tr>
          ))}

          {owners.length === 0 && (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
              <td colSpan="3" className="px-4 py-2">
                You can start using owners on your project by adding a CODEOWNERS file to your repository. Learn more
                about code owners through the official docs:{' '}
                <a
                  className="text-link"
                  href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners"
                >
                  About code owners
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DebtOwners
