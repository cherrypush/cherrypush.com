import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

import { SiNpm } from 'react-icons/si'

const Footer = () => (
  <>
    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

    <footer className="sm:flex sm:items-center sm:justify-between pb-9">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © {new Date().getFullYear()} Cherry™. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400 ml-auto mr-2 mt-4 md:mt-0">
        <li>
          <a href="/privacy" className="mr-4 hover:underline md:mr-6">
            Privacy
          </a>
        </li>
        <li>
          <a href="/terms" className="mr-4 hover:underline md:mr-6">
            Terms
          </a>
        </li>
      </ul>
      <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
        <a
          href="https://x.com/fwuensche"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <FaXTwitter className="w-5 h-5" />
        </a>
        <a
          href="https://npmjs.com/package/cherrypush"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <SiNpm className="w-5 h-5" />
        </a>
        <a
          href="https://github.com/cherrypush/cherrypush.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <FaGithub className="w-5 h-5" />
        </a>
      </div>
    </footer>
  </>
)

export default Footer
