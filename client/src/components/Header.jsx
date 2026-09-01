import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logo from '../assets/images/tlf.png';

const BRAND = '#2eca6a';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contactus', label: 'Contact' },
  { to: '/price-estimator', label: 'Price Estimator' },
];

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setSearchOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname === to);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? 'shadow-sm border-b border-gray-100' : 'border-b border-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6'>
        <Link to='/' className='no-underline flex items-center shrink-0'>
          <img src={logo} alt='Rehaish' className='h-14' />
        </Link>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center gap-1'>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-3.5 py-2 text-sm font-medium no-underline transition-colors ${
                isActive(link.to) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span
                  className='absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full'
                  style={{ backgroundColor: BRAND }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className='hidden md:flex items-center gap-2 shrink-0'>
          <div className='relative'>
            {searchOpen ? (
              <form
                onSubmit={handleSubmit}
                className='flex items-center bg-gray-100 rounded-full pl-4 pr-1.5 py-1.5 animate__animated animate__fadeIn animate__faster'
              >
                <input
                  autoFocus
                  type='text'
                  placeholder='Search properties...'
                  className='bg-transparent border-none focus:outline-none w-52 text-sm'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => !searchTerm && setSearchOpen(false)}
                />
                <button
                  type='submit'
                  className='w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0'
                  style={{ backgroundColor: BRAND }}
                >
                  <FaSearch size={11} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className='w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors'
              >
                <FaSearch size={14} />
              </button>
            )}
          </div>

          <Link to='/profile' className='no-underline'>
            {currentUser ? (
              <img
                className='rounded-full h-9 w-9 object-cover border-2 border-gray-100'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <span
                className='text-sm font-semibold px-4 py-2 rounded-full text-white transition-transform hover:scale-105 inline-block'
                style={{ backgroundColor: BRAND }}
              >
                Sign In
              </span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className='md:hidden text-gray-700 p-1'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes className='text-xl' /> : <FaBars className='text-xl' />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 px-5 py-4 animate__animated animate__fadeIn animate__faster'>
          <form
            onSubmit={handleSubmit}
            className='flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4'
          >
            <input
              type='text'
              placeholder='Search properties...'
              className='bg-transparent border-none focus:outline-none flex-1 text-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type='submit'>
              <FaSearch className='text-gray-500' size={14} />
            </button>
          </form>

          <div className='flex flex-col gap-1'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                  isActive(link.to) ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={isActive(link.to) ? { backgroundColor: BRAND } : {}}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to='/profile'
              onClick={() => setIsOpen(false)}
              className='px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-900 no-underline border-t border-gray-100 mt-2 pt-4'
            >
              {currentUser ? 'My Profile' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
