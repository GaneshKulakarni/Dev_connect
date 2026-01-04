
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { Code2, User as UserIcon, Settings, LogOut, Menu, X, Search } from "lucide-react";
import GlobalSearch from "./GlobalSearch";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email;
    
  return (
    <nav className="bg-slate-950 border-b border-cyan-900/30 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
            {/* Left side: Logo + Nav Links */}
            <div className="flex items-center gap-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-mono font-bold text-xl hover:text-cyan-400 transition group">
                  <Code2 className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
                  <span><span className="text-cyan-400">Dev</span>Connect</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-10">
                  <Link to="/" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/home</Link>
                  <Link to="/create" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/create</Link>
                  <Link to="/communities" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/communities</Link>
                  <Link to="/communities/create" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/new-community</Link>
                </div>
            </div>

            {/* Right side: Search + Auth */}
            <div className="flex-1 flex items-center justify-end gap-10">
                {/* Global Search (desktop) */}
                <div className="hidden md:block w-full max-w-xs lg:max-w-md ml-8">
                  <GlobalSearch />
                </div>

                {/*Desktop Auth*/}
                <div className="hidden md:flex items-center">
                {user ? (
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-900 transition border border-transparent hover:border-cyan-900/50"
                        >
                            <div className="text-right hidden lg:block">
                                <div className="text-sm font-mono text-white leading-none">{displayName}</div>
                                <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-tighter mt-1">developer_profile</div>
                            </div>
                            {user?.user_metadata?.avatar_url ? (
                                <img 
                                    src={user.user_metadata.avatar_url}
                                    alt="User Avatar"
                                    className="w-9 h-9 rounded-full ring-2 ring-cyan-400/30"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-400/30">
                                    <UserIcon className="w-5 h-5 text-cyan-400" />
                                </div>
                            )}
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-cyan-900/50 rounded-xl shadow-2xl py-2 z-50">
                                <Link 
                                    to={`/profile/${user.id}`}
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-cyan-900/20 hover:text-white transition"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    <span>My Profile</span>
                                </Link>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-cyan-900/20 hover:text-white transition">
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </button>
                                <div className="border-t border-cyan-900/30 my-2" />
                                <button 
                                    onClick={() => {
                                        signOut();
                                        setIsProfileOpen(false);
                                        navigate("/");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (   
                    <Link 
                        to="/login"
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm font-bold rounded-lg transition shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                    >
                        sign in
                    </Link>
                )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center gap-4">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-300 hover:text-cyan-400 p-2"
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-cyan-900/30 py-4 px-4 space-y-4">
          <div className="mb-4">
            <GlobalSearch />
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition">~/home</Link>
            <Link to="/create" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition">~/create</Link>
            <Link to="/communities" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition">~/communities</Link>
            <Link to="/communities/create" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition">~/new-community</Link>
            
            <div className="border-t border-cyan-900/30 pt-4">
              {user ? (
                <div className="space-y-4">
                  <Link 
                    to={`/profile/${user.id}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="font-mono">{displayName}</span>
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 text-red-400 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-mono">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-2 bg-cyan-600 rounded-lg font-mono font-bold"
                >
                  sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;