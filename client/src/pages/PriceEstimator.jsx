import { useEffect, useRef, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaHome,
  FaBed,
  FaUsers,
  FaDoorOpen,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaRobot,
} from 'react-icons/fa';

const PRICE_API_URL = import.meta.env.VITE_PRICE_API_URL || 'http://localhost:8500';

const LOCATIONS = [
  { label: 'San Francisco', latitude: 37.77, longitude: -122.42, median_income: 11.5, population: 2200 },
  { label: 'Los Angeles', latitude: 34.05, longitude: -118.25, median_income: 6.2, population: 3400 },
  { label: 'San Diego', latitude: 32.72, longitude: -117.16, median_income: 7.1, population: 1800 },
  { label: 'Sacramento', latitude: 38.58, longitude: -121.49, median_income: 5.4, population: 1500 },
  { label: 'Fresno', latitude: 36.75, longitude: -119.77, median_income: 3.9, population: 1600 },
  { label: 'Oakland', latitude: 37.8, longitude: -122.27, median_income: 6.8, population: 2100 },
  { label: 'Custom', latitude: null, longitude: null, median_income: null, population: null },
];

const initialForm = {
  median_income: 6.5,
  house_age: 15,
  avg_rooms: 6,
  avg_bedrooms: 1.2,
  population: 1200,
  avg_occupancy: 3,
  latitude: 34.05,
  longitude: -118.25,
};

function useCountUp(target, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 700;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

// eslint-disable-next-line react/prop-types -- internal helper, not a shared component
function SliderField({ icon, label, unit, value, min, max, step, onChange }) {
  return (
    <div className='mb-5 last:mb-0'>
      <div className='flex items-center justify-between mb-2'>
        <span className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          <span className='text-[#2eca6a]'>{icon}</span>
          {label}
        </span>
        <span className='text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full'>
          {value}
          {unit}
        </span>
      </div>
      <input
        type='range'
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className='price-slider w-full'
        style={{
          background: `linear-gradient(to right, #2eca6a ${
            ((value - min) / (max - min)) * 100
          }%, #e5e7eb ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}

export default function PriceEstimator() {
  const [form, setForm] = useState(initialForm);
  const [locationIdx, setLocationIdx] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  const handleLocationSelect = (idx) => {
    setLocationIdx(idx);
    const loc = LOCATIONS[idx];
    if (loc.latitude !== null) {
      setForm((f) => ({
        ...f,
        latitude: loc.latitude,
        longitude: loc.longitude,
        median_income: loc.median_income,
        population: loc.population,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${PRICE_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Prediction request failed');
      const data = await res.json();
      setResult(data);
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      setError(
        'Could not reach the price estimator service. Make sure it is running (see ml-price-estimator/service).'
      );
    } finally {
      setLoading(false);
    }
  };

  const animatedPrice = useCountUp(result?.estimated_price_usd ?? 0, !!result);

  return (
    <div className='bg-gray-50 min-h-[calc(100vh-64px)]'>
      {/* Hero */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-5xl mx-auto px-6 py-10 text-center animate__animated animate__fadeIn'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2eca6a]/15 text-[#2eca6a] mb-4'>
            <FaChartLine size={26} />
          </div>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Price Estimator</h1>
          <p className='text-gray-500 mt-2 max-w-xl mx-auto'>
            A Random Forest model trained on real housing data estimates a
            market price from the details below — a genuine prediction, not
            a lookup table.
          </p>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8'>
        {/* Form */}
        <form onSubmit={handleSubmit} className='lg:col-span-3 space-y-6'>
          <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6'>
            <h2 className='flex items-center gap-2 text-base font-semibold text-gray-800 mb-4'>
              <FaMapMarkerAlt className='text-[#2eca6a]' /> Location
            </h2>

            <div className='flex flex-wrap gap-2 mb-5'>
              {LOCATIONS.map((loc, idx) => (
                <button
                  type='button'
                  key={loc.label}
                  onClick={() => handleLocationSelect(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    locationIdx === idx
                      ? 'bg-[#2eca6a] border-[#2eca6a] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#2eca6a] hover:text-[#26a356]'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-xs font-medium text-gray-500'>Latitude</label>
                <input
                  type='number'
                  step='0.01'
                  value={form.latitude}
                  onChange={(e) => {
                    setLocationIdx(LOCATIONS.length - 1);
                    set('latitude')(parseFloat(e.target.value));
                  }}
                  className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2eca6a]'
                />
              </div>
              <div>
                <label className='text-xs font-medium text-gray-500'>Longitude</label>
                <input
                  type='number'
                  step='0.01'
                  value={form.longitude}
                  onChange={(e) => {
                    setLocationIdx(LOCATIONS.length - 1);
                    set('longitude')(parseFloat(e.target.value));
                  }}
                  className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2eca6a]'
                />
              </div>
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6'>
            <h2 className='flex items-center gap-2 text-base font-semibold text-gray-800 mb-5'>
              <FaHome className='text-[#2eca6a]' /> Property &amp; Area Details
            </h2>

            <SliderField
              icon={<FaMoneyBillWave />}
              label='Median area income'
              unit='0k / yr'
              value={form.median_income}
              min={0.5}
              max={15}
              step={0.1}
              onChange={set('median_income')}
            />
            <SliderField
              icon={<FaCalendarAlt />}
              label='House age'
              unit=' yrs'
              value={form.house_age}
              min={0}
              max={60}
              step={1}
              onChange={set('house_age')}
            />
            <SliderField
              icon={<FaDoorOpen />}
              label='Avg. rooms per household'
              unit=''
              value={form.avg_rooms}
              min={1}
              max={12}
              step={0.1}
              onChange={set('avg_rooms')}
            />
            <SliderField
              icon={<FaBed />}
              label='Avg. bedrooms per household'
              unit=''
              value={form.avg_bedrooms}
              min={0.5}
              max={4}
              step={0.1}
              onChange={set('avg_bedrooms')}
            />
            <SliderField
              icon={<FaUsers />}
              label='Area population'
              unit=''
              value={form.population}
              min={100}
              max={5000}
              step={50}
              onChange={set('population')}
            />
            <SliderField
              icon={<FaUsers />}
              label='Avg. household size'
              unit=''
              value={form.avg_occupancy}
              min={1}
              max={8}
              step={0.1}
              onChange={set('avg_occupancy')}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#2eca6a] hover:bg-[#26a356] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <span className='w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin' />
                Estimating...
              </>
            ) : (
              'Estimate Price'
            )}
          </button>

          {error && (
            <div className='flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-4 animate__animated animate__fadeIn'>
              <FaExclamationTriangle className='mt-0.5 shrink-0' />
              {error}
            </div>
          )}
        </form>

        {/* Result panel */}
        <div className='lg:col-span-2'>
          <div ref={resultRef} className='lg:sticky lg:top-24'>
            {!result && !loading && (
              <div className='bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-400'>
                <FaRobot size={34} className='mx-auto mb-3 text-gray-300' />
                <p className='text-sm'>
                  Adjust the details and click <b>Estimate Price</b> to get a
                  real model prediction.
                </p>
              </div>
            )}

            {loading && (
              <div className='bg-white border border-gray-200 rounded-2xl p-10 text-center animate-pulse'>
                <div className='h-4 w-32 bg-gray-200 rounded mx-auto mb-4' />
                <div className='h-10 w-48 bg-gray-200 rounded mx-auto mb-3' />
                <div className='h-3 w-40 bg-gray-100 rounded mx-auto' />
              </div>
            )}

            {result && !loading && (
              <div className='bg-gradient-to-br from-[#2eca6a]/10 to-[#2eca6a]/5 border border-[#2eca6a]/25 rounded-2xl p-8 text-center shadow-sm animate__animated animate__fadeInUp animate__faster'>
                <p className='text-sm font-medium text-[#1f9c53]/90 mb-1'>
                  Estimated market price
                </p>
                <p className='text-5xl font-extrabold text-[#1f9c53] tracking-tight'>
                  $
                  {Math.round(animatedPrice).toLocaleString()}
                </p>
                <div className='mt-5 pt-5 border-t border-[#2eca6a]/25 text-xs text-gray-500 space-y-1'>
                  <p className='flex items-center justify-center gap-1.5'>
                    <FaRobot className='text-[#2eca6a]' /> {result.model}
                  </p>
                  <p>{result.dataset}</p>
                  <p className='text-gray-400'>~$34k average error (MAE) on held-out test data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
