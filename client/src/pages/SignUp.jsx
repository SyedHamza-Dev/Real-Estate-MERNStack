import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
// Google sign-up is disabled -- Google's SSO changes broke the old Firebase
// popup flow. Re-enable by uncommenting the import and the <OAuth /> line
// below once it's fixed.
// import OAuth from '../components/OAuth';

const BRAND = '#2eca6a';

const checkPasswordStrength = (password) => {
  let strength = 0;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[\W]/.test(password);

  if (password.length >= 8) strength += 1;
  if (hasUppercase) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecialChar) strength += 1;

  return { strength, hasUppercase, hasNumber, hasSpecialChar };
};

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordStrength.hasUppercase ||
      !passwordStrength.hasNumber ||
      !passwordStrength.hasSpecialChar
    ) {
      setError('Password must include at least one uppercase letter, one number, and one special character.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setSuccess(data.message);
      setLoading(false);
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const strengthColor =
    passwordStrength.strength >= 3
      ? BRAND
      : passwordStrength.strength === 2
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-6'>
          <div
            className='inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4'
            style={{ backgroundColor: `${BRAND}22`, color: BRAND }}
          >
            <FaUserPlus size={22} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Create an account</h1>
          <p className='text-gray-500 mt-1'>Join REHAISH to save listings and message agents</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-white border border-gray-100 rounded-2xl shadow-sm p-7 flex flex-col gap-4'
        >
          <div>
            <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Username</label>
            <div className='relative'>
              <FaUser className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={14} />
              <input
                type='text'
                placeholder='yourname'
                className='w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2'
                style={{ '--tw-ring-color': BRAND }}
                name='username'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Email</label>
            <div className='relative'>
              <FaEnvelope className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={14} />
              <input
                type='email'
                placeholder='you@example.com'
                className='w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2'
                style={{ '--tw-ring-color': BRAND }}
                name='email'
                value={formData.email}
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
                name='password'
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
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

            {formData.password.length > 0 && (
              <div className='mt-2'>
                <div className='flex gap-1'>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className='h-1.5 flex-1 rounded-full'
                      style={{
                        backgroundColor:
                          i < passwordStrength.strength ? strengthColor : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p className='text-xs font-medium mt-1' style={{ color: strengthColor }}>
                  {STRENGTH_LABELS[passwordStrength.strength]}
                </p>
              </div>
            )}

            {showPasswordRequirements && (
              <div className='mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1'>
                {[
                  { ok: passwordStrength.hasUppercase, label: 'An uppercase letter' },
                  { ok: passwordStrength.hasNumber, label: 'A number' },
                  { ok: passwordStrength.hasSpecialChar, label: 'A special character' },
                ].map((req) => (
                  <div
                    key={req.label}
                    className={`flex items-center gap-2 text-xs ${
                      req.ok ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {req.ok ? (
                      <FaCheck size={10} style={{ color: BRAND }} />
                    ) : (
                      <FaTimes size={10} className='text-gray-300' />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className='text-white font-semibold py-3 rounded-xl mt-2 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2'
            style={{ backgroundColor: BRAND }}
          >
            {loading ? (
              <>
                <span className='w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin' />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

          {error && (
            <div className='flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3'>
              <FaExclamationTriangle className='mt-0.5 shrink-0' size={13} />
              {error}
            </div>
          )}
          {success && (
            <div className='flex items-start gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl p-3'>
              <FaCheckCircle className='mt-0.5 shrink-0' size={13} />
              {success}
            </div>
          )}

          {/* <OAuth /> */}
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link to='/sign-in' className='font-semibold' style={{ color: BRAND }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
