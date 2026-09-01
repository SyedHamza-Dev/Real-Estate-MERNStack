import { useState } from 'react';

const PRICE_API_URL = import.meta.env.VITE_PRICE_API_URL || 'http://localhost:8500';

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

const fields = [
  { name: 'median_income', label: 'Median area income ($10,000s)', step: '0.1' },
  { name: 'house_age', label: 'House age (years)', step: '1' },
  { name: 'avg_rooms', label: 'Average rooms per household', step: '0.1' },
  { name: 'avg_bedrooms', label: 'Average bedrooms per household', step: '0.1' },
  { name: 'population', label: 'Area population', step: '10' },
  { name: 'avg_occupancy', label: 'Average household size', step: '0.1' },
  { name: 'latitude', label: 'Latitude', step: '0.01' },
  { name: 'longitude', label: 'Longitude', step: '0.01' },
];

export default function PriceEstimator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${PRICE_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('Prediction request failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        'Could not reach the price estimator service. Make sure it is running (see ml-price-estimator/service).'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-2'>Price Estimator</h1>
      <p className='text-gray-500 mb-6'>
        Estimates a market price from a Random Forest model trained on the
        California Housing dataset. Real trained model, real prediction —
        not a lookup table.
      </p>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-6'
      >
        {fields.map((f) => (
          <div key={f.name} className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>{f.label}</label>
            <input
              type='number'
              step={f.step}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
              required
            />
          </div>
        ))}

        <div className='sm:col-span-2 flex justify-end'>
          <button
            type='submit'
            disabled={loading}
            className='bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium px-6 py-2 rounded-lg transition-colors'
          >
            {loading ? 'Estimating...' : 'Estimate Price'}
          </button>
        </div>
      </form>

      {error && (
        <div className='mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3'>
          {error}
        </div>
      )}

      {result && (
        <div className='mt-6 bg-green-50 border border-green-100 rounded-xl p-6 text-center'>
          <p className='text-sm text-gray-500 mb-1'>Estimated market price</p>
          <p className='text-4xl font-bold text-green-700'>
            ${result.estimated_price_usd.toLocaleString()}
          </p>
          <p className='text-xs text-gray-400 mt-2'>
            {result.model} trained on {result.dataset}
          </p>
        </div>
      )}
    </div>
  );
}
