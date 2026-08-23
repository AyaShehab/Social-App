import React, { useContext, useState } from 'react';
import { CounterContext } from '../../Context/CounterContext';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { HiHome, HiUser, HiBell, HiMenu, HiLogout, HiCog } from 'react-icons/hi';
import { AuthContext } from '../../Context/AuthContext';

export default function Navbar() {
  let { setcounter, counter } = useContext(CounterContext);
  const { userToken, setuserToken,userData } = useContext(AuthContext);
  const navigate = useNavigate();


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    setuserToken(null);
    setIsDropdownOpen(false);
    navigate('/');
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-3 sm:px-6 py-2.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold text-[10px] sm:text-xs px-2 py-1.5 rounded-lg shadow-sm">
            SOCIAL APP
          </div>
          <span className="hidden sm:inline font-extrabold text-xl text-slate-800 tracking-tight">
            Social Posts
          </span>
        </div>

        {userToken ? (
          <>
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-50/80 p-1 sm:p-1.5 rounded-2xl border border-gray-100">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <HiHome className="w-5 h-5" />
                <span className="hidden sm:inline">Feed</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <HiUser className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>

              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <HiBell className="w-5 h-5" />
                <span className="hidden sm:inline">Notifications</span>
              </NavLink>
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative">
              {/* Profile Card Button */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200/60 p-1 sm:pl-1.5 sm:pr-3 sm:py-1.5 rounded-full transition-all outline-none"
              >
                <img
                  src={userData?.photo}
                  alt="User Avatar"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-100 object-cover"
                />
                <span className="hidden sm:inline text-sm font-semibold text-gray-700">
                  {userData?.name}
                </span>
                <HiMenu className="w-5 h-5 text-gray-500" />
              </button>

              {/* 🎨 Dropdown Menu UI matching the screenshot */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 transition-all">
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HiUser className="w-4 h-4 text-gray-500" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HiCog className="w-4 h-4 text-gray-500" />
                    <span>Settings</span>
                  </Link>

                  <div className="my-1 border-t border-gray-100"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <HiLogout className="w-4 h-4 text-red-500" />
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`
              }
            >
              Register
            </NavLink>
          </div>
        )}

      </div>
    </nav>
  );
}