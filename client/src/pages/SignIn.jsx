import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
// Google sign-in is disabled -- Google's SSO changes broke the old Firebase
// popup flow. Re-enable by uncommenting the import and the <OAuth /> line
// below once it's fixed.
// import OAuth from '../components/OAuth';

const BRAND = '#2eca6a';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (data) {
        dispatch(signInSuccess(data));
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userEmail', data.email);
        navigate('/');
      } else {
        dispatch(signInFailure('User email not found. Please sign in again.'));
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-6'>
          <div
            className='inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4'
            style={{ backgroundColor: `${BRAND}22`, color: BRAND }}
          >
            <FaSignInAlt size={22} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Welcome back</h1>
          <p className='text-gray-500 mt-1'>Sign in to continue to REHAISH</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-white border border-gray-100 rounded-2xl shadow-sm p-7 flex flex-col gap-4'
        >
          <div>
            <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Email</label>
            <div className='relative'>
              <FaEnvelope className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={14} />
              <input
                type='email'
                placeholder='you@example.com'
                className='w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2'
                style={{ '--tw-ring-color': BRAND }}
                id='email'
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Password</label>
            <div className='relative'>
              <FaLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={14} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className='w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2'
                style={{ '--tw-ring-color': BRAND }}
                id='password'
                onChange={handleChange}
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className='text-white font-semibold py-3 rounded-xl mt-2 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2'
            style={{ backgroundColor: BRAND }}
          >
            {loading ? (
              <>
                <span className='w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {error && (
            <div className='flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3'>
              <FaExclamationTriangle className='mt-0.5 shrink-0' size={13} />
              {error}
            </div>
          )}

          {/* <OAuth /> */}
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Don&apos;t have an account?{' '}
          <Link to='/sign-up' className='font-semibold' style={{ color: BRAND }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
