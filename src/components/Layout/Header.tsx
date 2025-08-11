import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import UserMenu from './UserMenu';
import SchoolSelector from './SchoolSelector';
import AcademicYearSelector from './AcademicYearSelector';
import { useAuth } from '../Auth/AuthProvider';
import { useSchool } from '../../contexts/SchoolContext';
import { useAcademicYear } from '../../contexts/AcademicYearContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isMobile }) => {
  const { user } = useAuth();
  const { currentSchool } = useSchool();
  const { currentAcademicYear, availableYears, setCurrentAcademicYear } = useAcademicYear();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Rechercher dans ${currentSchool?.name || 'l\'école'}...`}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* School Selector */}
          <div className="hidden lg:block">
            <SchoolSelector />
          </div>

          {/* Year Selector */}
          <div className="hidden md:block">
            <AcademicYearSelector />
          </div>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;