import React from 'react';
import type { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-heading text-red-700 uppercase tracking-[.2em]">
              Jiyuken Dojo
            </h1>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="text-gray-700 mr-4 hidden sm:block">
                Bem-vindo, {user.username}
              </span>
              <button
                onClick={onLogout}
                className="bg-transparent text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-red-600 transition duration-150 ease-in-out"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
