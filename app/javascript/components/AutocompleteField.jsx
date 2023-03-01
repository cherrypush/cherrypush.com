import React, { useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

// TODO: Type this component
// items = [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }]
const AutocompleteField = ({ items, name, onSelect, placeholder }) => {
  const [selected, setSelected] = useState()
  const [query, setQuery] = useState('')

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className="top-16">
      <Combobox
        value={selected}
        onChange={(item) => {
          setSelected(item)
          onSelect?.(item)
        }}
      >
        <div className="relative mt-1">
          <Combobox.Button className="w-full">
            <Combobox.Input
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              displayValue={(item) => item.name}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder || 'Start typing to autocomplete...'}
              type="search"
              spellCheck="off"
              autoComplete="off"
              autoCorrect="off"
              required
            />
            <input type="text" className="hidden" name={name} value={selected?.id} />
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-10 mt-2 cursor-pointer absolute max-h-60 w-full overflow-auto rounded bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredItems.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
              ) : (
                filteredItems.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 block px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                        active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-400'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center">
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {item.name}
                        </span>
                        {selected ? (
                          <span
                            className={`flex items-center ml-2 inset-y-0 left-0 ${
                              active ? 'bg-teal-600 text-white' : 'text-gray-900 dark:text-gray-400'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default AutocompleteField
