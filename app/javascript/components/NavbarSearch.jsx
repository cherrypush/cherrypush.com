import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NavbarSearch = ({ items }) => {
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(items.find((item) => item.selected))
  const navigate = useNavigate()

  const navigateToItem = (item) => {
    setSelectedItem(item)
    navigate(item.href)
  }

  const filteredItems =
    query === '' ? items : items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Combobox value={selectedItem} onChange={navigateToItem}>
      <Combobox.Button>
        <Combobox.Input
          displayValue={(item) => item.name}
          onChange={(event) => setQuery(event.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for projects and metrics"
          autoComplete="off"
          style={{ width: '360px' }}
        />
      </Combobox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery('')}
      >
        <Combobox.Options className="mt-2 cursor-pointer absolute max-h-96 overflow-auto rounded bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredItems.map((item) => (
            <Combobox.Option
              key={item.name}
              value={item}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 block px-4 dark:hover:text-white ${
                  active ? 'bg-blue-800 text-white' : 'text-gray-900 dark:text-gray-400'
                }`
              }
            >
              {({ selected, active }) => (
                <div className="flex items-center">
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
                  {selected ? (
                    <span className={`flex items-center ml-2 ${active ? 'text-white' : 'text-blue-600'}`}>
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}

export default NavbarSearch
