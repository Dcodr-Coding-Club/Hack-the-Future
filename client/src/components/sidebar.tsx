import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Settings,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [location] = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Job Listings', icon: FileText, href: '/jobs' },
    { name: 'Candidates', icon: Users, href: '/candidates' },
    { name: 'Analytics', icon: BarChart2, href: '/analytics' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  // Mobile sidebar with overlay
  if (isMobileMenuOpen) {
    return (
      <>
        {/* Background overlay */}
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 flex flex-col z-50 max-w-xs w-full bg-white">
          <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-2 text-xl font-semibold text-dark">ResuMatch AI</h1>
            </div>
            <button 
              className="h-10 w-10 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.name} className="w-full">
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={cn(
                        item.href === location
                          ? 'bg-primary bg-opacity-10 text-primary'
                          : 'text-gray-600 hover:bg-gray-100',
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer'
                      )}
                    >
                      <item.icon
                        className={cn(
                          item.href === location
                            ? 'text-primary'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 h-5 w-5'
                        )}
                      />
                      {item.name}
                    </div>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    HACK THE PRESENT
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Recruiter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-2 text-xl font-semibold text-dark">ResuMatch AI</h1>
            </div>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.name} className="w-full">
                <Link
                  href={item.href}
                >
                  <div
                    className={cn(
                      item.href === location
                        ? 'bg-primary bg-opacity-10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100',
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer'
                    )}
                  >
                    <item.icon
                      className={cn(
                        item.href === location
                          ? 'text-primary'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 h-5 w-5'
                      )}
                    />
                    {item.name}
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100">
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  HACK THE PRESENT
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Recruiter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
