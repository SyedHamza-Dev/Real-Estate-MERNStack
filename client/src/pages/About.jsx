/* eslint-disable react/prop-types -- internal helper components below, not a shared/public API */
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaSearchLocation, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import about1 from '../assets/images/about-1.jpg';
import about2 from '../assets/images/about-2.jpg';
import slideAbout1 from '../assets/images/slide-about-1.jpg';
import agent1 from '../assets/images/agent-1.jpg';
import agent2 from '../assets/images/agent-2.jpg';
import agent3 from '../assets/images/agent-3.jpg';
import agent4 from '../assets/images/agent-4.jpg';
import useCountUp from '../hooks/useCountUp';
import useOnScreen from '../hooks/useOnScreen';

const BRAND = '#2eca6a';

const stats = [
  { label: 'Years of experience', value: 10, suffix: '+' },
  { label: 'Properties sold', value: 3200, suffix: '+' },
  { label: 'Happy clients', value: 1200, suffix: '+' },
  { label: 'Agents nationwide', value: 45, suffix: '+' },
];

const values = [
  {
    icon: <FaSearchLocation size={22} />,
    title: 'Local expertise',
    text: 'Every listing is reviewed by agents who actually know the neighborhood — not just the address.',
  },
  {
    icon: <FaShieldAlt size={22} />,
    title: 'Verified listings',
    text: "No ghost listings, no bait-and-switch. What you see is what's actually available.",
  },
  {
    icon: <FaHandshake size={22} />,
    title: 'Fair pricing',
    text: 'Our price estimator uses real market data so buyers and sellers start from the same page.',
  },
  {
    icon: <FaCheckCircle size={22} />,
    title: 'End-to-end support',
    text: "From the first search to closing day, someone's always a message away.",
  },
];

const team = [
  { photo: agent1, name: 'Alex Rivera', role: 'Founder & CEO' },
  { photo: agent2, name: 'Maria Chen', role: 'Head of Sales' },
  { photo: agent3, name: 'David Okoye', role: 'Senior Agent' },
  { photo: agent4, name: 'Lena Novak', role: 'Client Relations' },
];

function StatCard({ value, suffix, label, active }) {
  const n = useCountUp(value, active);
  return (
    <div className='text-center'>
      <p className='text-3xl md:text-4xl font-extrabold text-gray-900'>
        {Math.round(n).toLocaleString()}
        <span style={{ color: BRAND }}>{suffix}</span>
      </p>
      <p className='text-sm text-gray-500 mt-1'>{label}</p>
    </div>
  );
}

export default function About() {
  const [statsRef, statsVisible] = useOnScreen({ threshold: 0.4 });

  return (
    <div>
      {/* Hero */}
      <div className='relative h-[320px] md:h-[380px]'>
        <img src={slideAbout1} alt='' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-black/55 flex items-center'>
          <div className='max-w-4xl mx-auto px-6 text-center w-full'>
            <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
              About us
            </p>
            <h1 className='text-3xl md:text-5xl font-extrabold text-white mt-2'>
              A real estate company that keeps things simple
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className='max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
        <div className='grid grid-cols-2 gap-4'>
          <img src={about1} alt='' className='rounded-2xl object-cover h-64 w-full mt-8' />
          <img src={about2} alt='' className='rounded-2xl object-cover h-64 w-full' />
        </div>
        <div>
          <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
            Our story
          </p>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4'>
            Real estate, without the runaround
          </h2>
          <p className='text-gray-600 leading-relaxed mb-4'>
            REHAISH started with a simple frustration: property listings that
            were outdated, prices nobody could explain, and a process that
            felt harder than it needed to be. So we built the site we wished
            existed — accurate listings, transparent pricing, and tools that
            actually help you decide.
          </p>
          <p className='text-gray-600 leading-relaxed'>
            Today our team helps people buy, rent, and sell across dozens of
            cities, backed by an estimator that grounds every price in real
            data instead of guesswork.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className='py-14' style={{ backgroundColor: `${BRAND}0d` }}>
        <div
          ref={statsRef}
          className='max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8'
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} active={statsVisible} />
          ))}
        </div>
      </section>

      {/* Values */}
      <section className='max-w-6xl mx-auto px-4 py-16'>
        <div className='text-center mb-10'>
          <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
            Why choose us
          </p>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mt-1'>
            What makes REHAISH different
          </h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {values.map((v) => (
            <div
              key={v.title}
              className='bg-white border border-gray-100 shadow-sm hover:shadow-lg rounded-2xl p-6 transition-shadow duration-300'
            >
              <div
                className='w-12 h-12 rounded-xl flex items-center justify-center mb-4'
                style={{ backgroundColor: `${BRAND}22`, color: BRAND }}
              >
                {v.icon}
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>{v.title}</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className='bg-gray-50 py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-10'>
            <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
              Our team
            </p>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mt-1'>
              The people behind REHAISH
            </h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {team.map((m) => (
              <div
                key={m.name}
                className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group'
              >
                <div className='overflow-hidden'>
                  <img
                    src={m.photo}
                    alt={m.name}
                    className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                </div>
                <div className='p-4 text-center'>
                  <p className='font-semibold text-gray-900'>{m.name}</p>
                  <p className='text-xs text-gray-400'>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className='py-16 text-center px-4'
        style={{ background: `linear-gradient(135deg, ${BRAND}, #1f9c53)` }}
      >
        <h2 className='text-2xl md:text-3xl font-bold text-white mb-3'>
          Let&apos;s find your next place
        </h2>
        <p className='text-white/85 mb-6 max-w-md mx-auto'>
          Browse listings or reach out — our team is ready to help.
        </p>
        <div className='flex flex-wrap gap-3 justify-center'>
          <Link
            to='/search'
            className='bg-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform'
            style={{ color: BRAND }}
          >
            Browse listings
          </Link>
          <Link
            to='/contactus'
            className='border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors'
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
