import { Outlet, NavLink } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Layout = () => {
  const { logout } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-bold text-blue-600">SpendWise</span>
              </div>
              <div className="mt-5 flex-1 flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Sign out button at the bottom */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              >
                <span className="flex items-center">
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Sign out
                </span>
                <span className="text-xs opacity-60">⌘Q</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile top header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;