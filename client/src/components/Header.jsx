import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logo from "../assets/images/tlf.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Function to close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className='bg-white shadow-md border-b border-gray-200 '>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-2 md:p-2'>
              
        <Link to='/' className='no-underline'>
        <img src={logo} alt="" className= 'ml-14' />
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-gray-600 focus:outline-none'
          >
            <FaBars className='text-2xl' />
          </button>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <form
          onSubmit={handleSubmit}
          className='hidden md:flex items-center bg-gray-100 p-2 rounded-full shadow-sm'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent border-none focus:outline-none w-48 sm:w-80 lg:w-96 px-4 py-2 rounded-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='ml-2'>
            <FaSearch className='text-gray-600 text-xl' />
          </button>
        </form>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex items-center gap-6 bg-white absolute md:static top-16 left-0 w-full md:w-auto p-4 md:p-0 border-b md:border-none z-10`}
        >
          <Link to='/' className='no-underline' onClick={handleLinkClick}>
            <li className='text-gray-800 text-lg font-semibold hover:text-green-500 transition-colors'>Home</li>
          </Link>
          <Link to='/about' className='no-underline' onClick={handleLinkClick}>
            <li className='text-gray-800 text-lg font-semibold hover:text-green-500 transition-colors'>About</li>
          </Link>
          <Link to='/Contactus' className='no-underline' onClick={handleLinkClick}>
            <li className='text-gray-800 text-lg font-semibold hover:text-green-500 transition-colors'>Contact</li>
          </Link>
          <Link to='/price-estimator' className='no-underline' onClick={handleLinkClick}>
            <li className='text-gray-800 text-lg font-semibold hover:text-green-500 transition-colors'>Price Estimator</li>
          </Link>
          <Link to='/profile' className='flex items-center no-underline' onClick={handleLinkClick}>
            {currentUser ? (
              <img
                className='rounded-full h-10 w-10 object-cover border-2 border-gray-200'
                src={currentUser.avatar}
                alt='profile'
                onError={(e) => {
                  console.error('Failed to load image:', e);
                  e.target.src = 'default-avatar.png'; // Ensure default image exists in public folder
                }}
              />
            ) : (
              <li className='text-gray-800 text-lg font-semibold hover:text-green-500 transition-colors'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>

      {/* Mobile Search Bar (Visible only on mobile) */}
      <div className='md:hidden mt-2 px-4'>
        <form
          onSubmit={handleSubmit}
          className='flex items-center bg-gray-100 p-2 rounded-full shadow-sm'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent border-none focus:outline-none w-full px-4 py-2 rounded-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='ml-2'>
            <FaSearch className='text-gray-600 text-xl' />
          </button>
        </form>
      </div>
    </header>
  );
}
