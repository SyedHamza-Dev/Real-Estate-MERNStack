import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  FaBed,
  FaBath,
  FaCarSide,
  FaCouch,
  FaMapMarkerAlt,
  FaHeart,
  FaPlay,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCheckCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaTag,
  FaHome,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import Reveal from '../components/Reveal';
import ListingItem from '../components/ListingItem';
import sampleListings from '../data/sampleListings';

const BRAND = '#2eca6a';

const AMENITY_LABELS = {
  balcony: 'Balcony',
  outdoorKitchen: 'Outdoor Kitchen',
  cableTv: 'Cable TV',
  deck: 'Deck',
  tennisCourts: 'Tennis Courts',
  internet: 'Internet',
  concreteFlooring: 'Concrete Flooring',
  sunRoom: 'Sun Room',
};

function GallerySkeleton() {
  return (
    <div className='grid grid-cols-4 grid-rows-2 gap-2 h-[320px] md:h-[520px] rounded-2xl overflow-hidden animate-pulse'>
      <div className='col-span-4 md:col-span-2 row-span-2 bg-gray-200' />
      <div className='hidden md:block bg-gray-200' />
      <div className='hidden md:block bg-gray-200' />
      <div className='hidden md:block bg-gray-200' />
      <div className='hidden md:block bg-gray-200' />
    </div>
  );
}

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem('favorites')) || []
  );
  const [heartPulse, setHeartPulse] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setListing(null);

    // Sample listings live only on the frontend and have no matching
    // record on the backend, so they're looked up locally instead of
    // being fetched.
    if (params.listingId.startsWith('sample-')) {
      const sample = sampleListings.find((l) => l._id === params.listingId);
      setListing(sample || null);
      setError(!sample);
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setListing(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // Escape key closes the lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => e.key === 'Escape' && setLightboxOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const media = useMemo(() => {
    if (!listing) return [];
    const items = (listing.imageUrls || []).map((src) => ({ type: 'image', src }));
    if (listing.videoUrl) {
      items.splice(1, 0, { type: 'video', src: listing.videoUrl, poster: listing.imageUrls?.[1] });
    }
    return items;
  }, [listing]);

  const isFavorite = listing && favorites.some((fav) => fav._id === listing._id);

  const handleFavorite = () => {
    if (!listing) return;
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 350);
    if (isFavorite) {
      const updated = favorites.filter((fav) => fav._id !== listing._id);
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } else {
      const updated = [...favorites, listing];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const isSample = params.listingId.startsWith('sample-');

  const relatedListings = useMemo(() => {
    if (!listing) return [];
    return sampleListings
      .filter((l) => l._id !== listing._id && l.type === listing.type)
      .slice(0, 4);
  }, [listing]);

  const activeAmenities = listing
    ? Object.keys(AMENITY_LABELS).filter((key) => listing[key])
    : [];

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <GallerySkeleton />
        <div className='mt-8 h-6 w-1/3 bg-gray-200 rounded animate-pulse' />
        <div className='mt-3 h-4 w-1/2 bg-gray-100 rounded animate-pulse' />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className='max-w-2xl mx-auto px-4 py-24 text-center'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Listing not found</h2>
        <p className='text-gray-500 mb-6'>
          This property may have been removed or the link is incorrect.
        </p>
        <Link
          to='/search'
          className='inline-block text-white font-semibold px-6 py-2.5 rounded-full transition-transform hover:scale-105'
          style={{ backgroundColor: BRAND }}
        >
          Back to search
        </Link>
      </div>
    );
  }

  const price = listing.offer ? listing.discountPrice : listing.regularPrice;
  const savings = listing.offer ? listing.regularPrice - listing.discountPrice : 0;

  return (
    <div className='bg-gray-50'>
      <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
        {/* Gallery */}
        <div className='relative'>
          {/* Desktop grid */}
          <div className='hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[520px] rounded-2xl overflow-hidden'>
            {media.slice(0, 5).map((item, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className={`relative group overflow-hidden ${
                  i === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                {item.type === 'video' ? (
                  <>
                    <img
                      src={item.poster}
                      alt=''
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                      <span className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform'>
                        <FaPlay size={16} className='ml-0.5' />
                      </span>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt=''
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                )}
                {i === 4 && media.length > 5 && (
                  <div className='absolute inset-0 bg-black/55 flex items-center justify-center text-white font-semibold text-lg'>
                    +{media.length - 5} more
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile swipe strip */}
          <div className='md:hidden rounded-2xl overflow-hidden'>
            <Swiper spaceBetween={0} slidesPerView={1} className='h-[300px]'>
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  <button className='w-full h-full' onClick={() => openLightbox(i)}>
                    {item.type === 'video' ? (
                      <div className='relative w-full h-full'>
                        <img src={item.poster} alt='' className='w-full h-full object-cover' />
                        <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                          <span className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-gray-900'>
                            <FaPlay size={16} className='ml-0.5' />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img src={item.src} alt='' className='w-full h-full object-cover' />
                    )}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button
            onClick={() => openLightbox(0)}
            className='absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 hover:bg-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition-colors'
          >
            <FaExpand size={12} /> View all {media.length} photos
          </button>

          <button
            onClick={handleFavorite}
            className={`absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-md transition-transform ${
              heartPulse ? 'scale-125' : 'scale-100'
            }`}
          >
            <FaHeart className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
          </button>
        </div>

        {/* Title row */}
        <Reveal className='mt-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>{listing.name}</h1>
          <p className='flex items-center gap-1.5 text-gray-500 mt-1.5'>
            <FaMapMarkerAlt style={{ color: BRAND }} /> {listing.address}
          </p>
        </Reveal>

        {/* Quick facts */}
        <Reveal delay={80}>
          <div className='flex flex-wrap gap-3 mt-5'>
            {[
              { icon: <FaBed />, label: `${listing.bedrooms} bed${listing.bedrooms > 1 ? 's' : ''}` },
              { icon: <FaBath />, label: `${listing.bathrooms} bath${listing.bathrooms > 1 ? 's' : ''}` },
              { icon: <FaHome />, label: listing.type === 'rent' ? 'For Rent' : 'For Sale' },
              { icon: <FaCarSide />, label: listing.parking ? 'Parking' : 'No parking' },
              { icon: <FaCouch />, label: listing.furnished ? 'Furnished' : 'Unfurnished' },
            ].map((f) => (
              <div
                key={f.label}
                className='flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm'
              >
                <span style={{ color: BRAND }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Body */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8'>
          <div className='lg:col-span-2 space-y-8'>
            <Reveal>
              <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-3'>Description</h2>
                <p className='text-gray-600 leading-relaxed'>{listing.description}</p>
              </div>
            </Reveal>

            {activeAmenities.length > 0 && (
              <Reveal delay={80}>
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                  <h2 className='text-lg font-semibold text-gray-900 mb-4'>Amenities</h2>
                  <div className='flex flex-wrap gap-2.5'>
                    {activeAmenities.map((key) => (
                      <span
                        key={key}
                        className='flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-full'
                        style={{ backgroundColor: `${BRAND}15`, color: '#1f9c53' }}
                      >
                        <FaCheckCircle size={12} /> {AMENITY_LABELS[key]}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={120}>
              <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-3'>Location</h2>
                <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-4'>
                  <div
                    className='w-11 h-11 rounded-full flex items-center justify-center shrink-0'
                    style={{ backgroundColor: `${BRAND}22`, color: BRAND }}
                  >
                    <FaMapMarkerAlt />
                  </div>
                  <p className='text-gray-700 text-sm'>{listing.address}</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='lg:sticky lg:top-24 space-y-5'>
              <Reveal delay={60}>
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span
                      className='text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full'
                      style={{ backgroundColor: `${BRAND}15`, color: '#1f9c53' }}
                    >
                      <FaTag className='inline mr-1' size={10} />
                      {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    {listing.offer && (
                      <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600'>
                        Save ${savings.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className='text-3xl font-extrabold text-gray-900 mt-2'>
                    ${price.toLocaleString()}
                    {listing.type === 'rent' && (
                      <span className='text-base font-medium text-gray-400'> /month</span>
                    )}
                  </p>
                  <button
                    onClick={() => setContactOpen(true)}
                    className='w-full mt-5 text-white font-semibold py-3 rounded-xl transition-transform hover:scale-[1.02]'
                    style={{ backgroundColor: BRAND }}
                  >
                    Contact Agent
                  </button>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                  {isSample ? (
                    <div className='text-center text-sm text-gray-500'>
                      <p className='font-semibold text-gray-800 mb-1'>Sample listing</p>
                      <p>
                        This is a demo property, so there&apos;s no real agent to contact —
                        real listings will show a working contact form here.
                      </p>
                    </div>
                  ) : currentUser && listing.userRef !== currentUser._id ? (
                    contactOpen ? (
                      <Contact listing={listing} />
                    ) : (
                      <div className='text-center'>
                        <FaEnvelope className='mx-auto mb-2' style={{ color: BRAND }} size={20} />
                        <p className='text-sm text-gray-500 mb-3'>
                          Have a question about this property?
                        </p>
                        <button
                          onClick={() => setContactOpen(true)}
                          className='text-sm font-semibold px-5 py-2 rounded-full border'
                          style={{ color: BRAND, borderColor: BRAND }}
                        >
                          <FaPhoneAlt className='inline mr-1.5' size={11} />
                          Message the landlord
                        </button>
                      </div>
                    )
                  ) : (
                    <p className='text-sm text-gray-400 text-center'>
                      Sign in to contact the landlord.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Related listings */}
        {relatedListings.length > 0 && (
          <Reveal delay={0} className='mt-14'>
            <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-5'>
              You might also like
            </h2>
            <div className='flex flex-wrap gap-6'>
              {relatedListings.map((l) => (
                <ListingItem key={l._id} listing={l} />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className='fixed inset-0 z-[100] bg-black flex flex-col'>
          <div className='relative z-10 flex items-center justify-between px-5 py-4 text-white/80 text-sm'>
            <span>
              {lightboxIndex + 1} / {media.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className='w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center'
            >
              <FaTimes size={18} />
            </button>
          </div>

          <Swiper
            modules={[Navigation, Keyboard]}
            navigation={{ prevEl: '.lb-prev', nextEl: '.lb-next' }}
            keyboard={{ enabled: true }}
            initialSlide={lightboxIndex}
            onSlideChange={(s) => setLightboxIndex(s.activeIndex)}
            className='flex-1 w-full'
          >
            {media.map((item, i) => (
              <SwiperSlide key={i} className='flex items-center justify-center'>
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    controls
                    autoPlay
                    muted
                    className='max-h-[75vh] max-w-full'
                  />
                ) : (
                  <img
                    src={item.src}
                    alt=''
                    className='max-h-[75vh] max-w-full object-contain'
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <button className='lb-prev absolute z-10 left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center'>
            <FaChevronLeft />
          </button>
          <button className='lb-next absolute z-10 right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center'>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
