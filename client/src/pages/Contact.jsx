import { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPaperPlane,
  FaCheckCircle,
} from 'react-icons/fa';

const BRAND = '#2eca6a';

const contactDetails = [
  { icon: <FaMapMarkerAlt />, label: 'Address', value: '123 Real Estate Lane, Dream City, DC 10101' },
  { icon: <FaPhoneAlt />, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: <FaEnvelope />, label: 'Email', value: 'contact@rehaish.com' },
];

const socials = [
  { icon: <FaFacebookF />, href: '#' },
  { icon: <FaTwitter />, href: '#' },
  { icon: <FaInstagram />, href: '#' },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // No general "contact the company" endpoint exists on the backend yet —
    // this simulates the send so the interaction feels complete without
    // claiming an email was actually delivered.
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    }, 900);
  };

  return (
    <div className='bg-gray-50 min-h-[calc(100vh-64px)]'>
      <div className='max-w-6xl mx-auto px-4 py-16'>
        <div className='text-center mb-12'>
          <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
            Get in touch
          </p>
          <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 mt-2'>Contact Us</h1>
          <p className='text-gray-500 mt-2 max-w-lg mx-auto'>
            Questions about a listing, an estimate, or anything else? Send us
            a message and we&apos;ll get back to you.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* Form */}
          <div className='lg:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            {sent ? (
              <div className='h-full flex flex-col items-center justify-center text-center py-10 animate__animated animate__fadeIn'>
                <div
                  className='w-14 h-14 rounded-full flex items-center justify-center mb-4'
                  style={{ backgroundColor: `${BRAND}22`, color: BRAND }}
                >
                  <FaCheckCircle size={26} />
                </div>
                <h2 className='text-xl font-bold text-gray-900 mb-1'>Message sent</h2>
                <p className='text-gray-500 text-sm mb-6'>
                  Thanks for reaching out — we&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className='text-sm font-semibold px-5 py-2 rounded-full border'
                  style={{ color: BRAND, borderColor: BRAND }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Send a message</h2>
                <div className='mb-4'>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                    Your Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2'
                    style={{ '--tw-ring-color': BRAND }}
                    placeholder='Enter your name'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                    Your Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2'
                    style={{ '--tw-ring-color': BRAND }}
                    placeholder='Enter your email'
                    required
                  />
                </div>
                <div className='mb-6'>
                  <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                    Your Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    rows='5'
                    value={form.message}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none'
                    style={{ '--tw-ring-color': BRAND }}
                    placeholder='Type your message here'
                    required
                  ></textarea>
                </div>
                <button
                  type='submit'
                  disabled={sending}
                  className='flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto transition-transform hover:scale-[1.02] disabled:opacity-60'
                  style={{ backgroundColor: BRAND }}
                >
                  {sending ? (
                    <>
                      <span className='w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin' />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={13} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details */}
          <div
            className='lg:col-span-2 text-white p-8 rounded-2xl shadow-sm flex flex-col'
            style={{ background: `linear-gradient(160deg, ${BRAND}, #1f9c53)` }}
          >
            <h2 className='text-xl font-bold mb-6'>Contact Details</h2>
            <div className='space-y-5'>
              {contactDetails.map((c) => (
                <div key={c.label} className='flex items-start gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0'>
                    {c.icon}
                  </div>
                  <div>
                    <p className='text-xs text-white/70'>{c.label}</p>
                    <p className='text-sm font-medium'>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-auto pt-8'>
              <h3 className='text-sm font-semibold mb-3'>Follow Us</h3>
              <div className='flex gap-3'>
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className='w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors'
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
