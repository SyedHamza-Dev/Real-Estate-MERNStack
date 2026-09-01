import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaSlidersH,
  FaInfoCircle,
  FaCarSide,
  FaCouch,
  FaTags,
} from 'react-icons/fa';
import ListingItem from '../components/ListingItem';
import sampleListings from '../data/sampleListings';

const BRAND = '#2eca6a';

const typeOptions = [
  { id: 'all', label: 'All' },
  { id: 'rent', label: 'Rent' },
  { id: 'sale', label: 'Sale' },
];

function SkeletonCard() {
  return (
    <div className='w-full sm:w-[330px] rounded-2xl overflow-hidden border border-gray-100 animate-pulse'>
      <div className='h-[220px] bg-gray-200' />
      <div className='p-4 space-y-2'>
        <div className='h-4 bg-gray-200 rounded w-3/4' />
        <div className='h-3 bg-gray-100 rounded w-1/2' />
        <div className='h-3 bg-gray-100 rounded w-full' />
        <div className='h-4 bg-gray-200 rounded w-1/3 mt-3' />
      </div>
    </div>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [usingSample, setUsingSample] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      setUsingSample(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        const results = Array.isArray(data) ? data : [];
        if (results.length > 0) {
          setShowMore(results.length > 8);
          setListings(results);
        } else {
          setListings(sampleListings);
          setUsingSample(true);
        }
      } catch (error) {
        setListings(sampleListings);
        setUsingSample(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked });
    }
    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort: sort || 'created_at', order: order || 'desc' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
    setFiltersOpen(false);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  const toggleChip = (id, value) => (
    <label
      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border cursor-pointer transition-colors ${
        value ? 'text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
      style={value ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
    >
      <input
        type='checkbox'
        id={id}
        className='hidden'
        onChange={handleChange}
        checked={value}
      />
      {id === 'parking' && <FaCarSide size={13} />}
      {id === 'furnished' && <FaCouch size={13} />}
      {id === 'offer' && <FaTags size={13} />}
      {id === 'parking' ? 'Parking' : id === 'furnished' ? 'Furnished' : 'Offer'}
    </label>
  );

  const FilterPanel = (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div>
        <label className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block'>
          Search
        </label>
        <div className='relative'>
          <FaSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={14} />
          <input
            type='text'
            id='searchTerm'
            placeholder='City, neighborhood, or address...'
            className='w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2'
            style={{ '--tw-ring-color': BRAND }}
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block'>
          Type
        </label>
        <div className='flex bg-gray-100 rounded-xl p-1'>
          {typeOptions.map((t) => (
            <button
              type='button'
              key={t.id}
              id={t.id}
              onClick={handleChange}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                sidebardata.type === t.id ? 'text-white' : 'text-gray-600'
              }`}
              style={sidebardata.type === t.id ? { backgroundColor: BRAND } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block'>
          Amenities
        </label>
        <div className='flex flex-wrap gap-2'>
          {toggleChip('parking', sidebardata.parking)}
          {toggleChip('furnished', sidebardata.furnished)}
          {toggleChip('offer', sidebardata.offer)}
        </div>
      </div>

      <div>
        <label className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block'>
          Sort by
        </label>
        <select
          onChange={handleChange}
          defaultValue='created_at_desc'
          id='sort_order'
          className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2'
          style={{ '--tw-ring-color': BRAND }}
        >
          <option value='regularPrice_desc'>Price: high to low</option>
          <option value='regularPrice_asc'>Price: low to high</option>
          <option value='createdAt_desc'>Newest first</option>
          <option value='createdAt_asc'>Oldest first</option>
        </select>
      </div>

      <button
        type='submit'
        className='text-white font-semibold py-3 rounded-xl transition-transform hover:scale-[1.02]'
        style={{ backgroundColor: BRAND }}
      >
        Apply Filters
      </button>
    </form>
  );

  return (
    <div className='bg-gray-50 min-h-[calc(100vh-64px)]'>
      <div className='max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8'>
        {/* Desktop filter sidebar */}
        <aside className='hidden lg:block w-72 shrink-0'>
          <div className='sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
            {FilterPanel}
          </div>
        </aside>

        {/* Mobile filter toggle */}
        <div className='lg:hidden'>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm'
          >
            <FaSlidersH style={{ color: BRAND }} /> Filters
          </button>
          {filtersOpen && (
            <div className='mt-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
              {FilterPanel}
            </div>
          )}
        </div>

        {/* Results */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {loading ? 'Searching...' : `${listings.length} listing${listings.length === 1 ? '' : 's'} found`}
            </h1>
          </div>

          {usingSample && !loading && (
            <div className='flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-5'>
              <FaInfoCircle className='shrink-0' />
              No listings matched yet, so these are sample properties to show
              how results look.
            </div>
          )}

          <div className='flex flex-wrap gap-6'>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

            {!loading &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>

          {showMore && (
            <div className='text-center mt-8'>
              <button
                onClick={onShowMoreClick}
                className='text-sm font-semibold px-6 py-2.5 rounded-full border transition-colors'
                style={{ color: BRAND, borderColor: BRAND }}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
