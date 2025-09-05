import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Analytics', href: '/analytics', current: location.pathname === '/analytics' },
  ];

  return (
    <Disclosure as="nav" className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-700">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300">
                    <span className="text-blue-700 dark:text-blue-400">Spend</span>
                    <span className="text-yellow-500 dark:text-yellow-400">Wise</span>
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'text-blue-700 dark:text-white border-b-2 border-yellow-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:border-yellow-300',
                        'inline-flex items-center px-2 pt-1 pb-1 text-sm transition-colors duration-200'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:scale-[1.03] transition shadow-sm">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 dark:text-blue-600 font-semibold ring-1 ring-blue-200">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md'
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md'
                            )}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 rounded-md'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 dark:text-gray-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 transition">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white/95 dark:bg-gray-900/80 backdrop-blur-md rounded-b-xl shadow-lg">
            <div className="px-2 pt-3 pb-4 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 border-l-4 border-transparent',
                    'block px-3 py-2 rounded-md text-base transition-colors duration-200'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold ring-1 ring-blue-200">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-100">{user?.name || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">{user?.email || ''}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  >
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  >
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
