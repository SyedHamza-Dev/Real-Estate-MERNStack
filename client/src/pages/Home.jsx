/* eslint-disable react/prop-types -- internal helper components below, not a shared/public API */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  FaHome,
  FaKey,
  FaHandHoldingUsd,
  FaSearch,
  FaQuoteLeft,
  FaStar,
} from 'react-icons/fa';
import slide1 from '../assets/images/slide-1.jpg';
import slide2 from '../assets/images/slide-2.jpg';
import slide3 from '../assets/images/slide-3.jpg';
import testimonial1 from '../assets/images/testimonial-1.jpg';
import testimonial2 from '../assets/images/testimonial-2.jpg';
import author1 from '../assets/images/author-1.jpg';
import author2 from '../assets/images/author-2.jpg';
import ListingItem from '../components/ListingItem';
import useCountUp from '../hooks/useCountUp';
import useOnScreen from '../hooks/useOnScreen';
import '../index.css';

const BRAND = '#2eca6a';

const heroSlides = [
  {
    img: slide1,
    place: 'Doral, Florida',
    title: ['204 Mount', 'Olive Road'],
    price: '$12,000',
  },
  {
    img: slide2,
    place: 'Doral, Florida',
    title: ['204 Rino', 'Venda Road'],
    price: '$9,500',
  },
  {
    img: slide3,
    place: 'Doral, Florida',
    title: ['204 Alira', 'Roan Road'],
    price: '$15,200',
  },
];

const services = [
  {
    icon: <FaHome size={26} />,
    title: 'Buy',
    text: 'Browse verified listings across every neighborhood and filter by budget, size, and type until you find the one.',
  },
  {
    icon: <FaKey size={26} />,
    title: 'Rent',
    text: 'From short-term stays to long leases, find a place that fits your life — with transparent pricing and no surprises.',
  },
  {
    icon: <FaHandHoldingUsd size={26} />,
    title: 'Sell',
    text: 'List your property in minutes and reach serious buyers with tools built to get you a fair price, faster.',
  },
];

const testimonials = [
  {
    photo: author1,
    name: 'Sarah Mitchell',
    role: 'Bought a home in Doral',
    text: 'Rehaish made finding our first home genuinely easy. The listings were accurate and the whole process felt transparent from start to finish.',
  },
  {
    photo: author2,
    name: 'James Carter',
    role: 'Rented an apartment',
    text: "I filtered by budget and location and had a shortlist in minutes. Moved in three weeks later — couldn't have been smoother.",
  },
  {
    photo: testimonial1,
    name: 'Priya Anand',
    role: 'Sold a property',
    text: 'Listed our property and had serious inquiries within days. The estimator tool alone gave us the confidence to price it right.',
  },
  {
    photo: testimonial2,
    name: 'Daniel Osei',
    role: 'Bought a rental investment',
    text: 'Clear photos, honest descriptions, no runaround. Exactly what you want when you are making a big decision.',
  },
];

const stats = [
  { label: 'Properties listed', value: 850, suffix: '+' },
  { label: 'Happy clients', value: 1200, suffix: '+' },
  { label: 'Cities covered', value: 40, suffix: '+' },
  { label: 'Years of experience', value: 10, suffix: '+' },
];

function StatCard({ value, suffix, label, active }) {
  const n = useCountUp(value, active);
  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 py-6 px-3 text-center'>
      <p className='text-3xl font-extrabold text-gray-900'>
        {Math.round(n)}
        <span style={{ color: BRAND }}>{suffix}</span>
      </p>
      <p className='text-xs md:text-sm text-gray-500 mt-1'>{label}</p>
    </div>
  );
}

function StatsRow() {
  const [ref, visible] = useOnScreen({ threshold: 0.4 });
  return (
    <div
      ref={ref}
      className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto -mt-14 md:-mt-16 relative z-10 px-4'
    >
      {stats.map((s) => (
        <StatCard key={s.label} {...s} active={visible} />
      ))}
    </div>
  );
}

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [dealType, setDealType] = useState('sale');
  const navigate = useNavigate();

  const heroSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=3').then((r) => r.json()).catch(() => []),
          fetch('/api/listing/get?type=rent&limit=3').then((r) => r.json()).catch(() => []),
          fetch('/api/listing/get?type=sale&limit=3').then((r) => r.json()).catch(() => []),
        ]);
        setOfferListings(Array.isArray(offerRes) ? offerRes : []);
        setRentListings(Array.isArray(rentRes) ? rentRes : []);
        setSaleListings(Array.isArray(saleRes) ? saleRes : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingListings(false);
      }
    };
    load();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchTerm', searchTerm);
    params.set('type', dealType);
    navigate(`/search?${params.toString()}`);
  };

  const hasAnyListings =
    offerListings.length > 0 || rentListings.length > 0 || saleListings.length > 0;

  return (
    <>
      {/* Hero */}
      <div className='relative'>
        <Slider {...heroSettings} className='hero-slider'>
          {heroSlides.map((slide, i) => (
            <div key={i} className='relative w-full h-[460px] md:h-[560px]'>
              <img src={slide.img} alt='' className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10' />
              <div className='absolute inset-0 flex items-center'>
                <div className='max-w-6xl mx-auto px-6 md:px-10 w-full'>
                  <p className='text-white/80 text-sm md:text-base mb-2 tracking-wide'>
                    {slide.place}
                  </p>
                  <h1 className='text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-xl'>
                    <span style={{ color: BRAND }}>{slide.title[0]} </span>
                    {slide.title[1]}
                  </h1>
                  <Link
                    to='/search'
                    className='inline-block mt-5 text-white font-semibold px-6 py-2.5 rounded-full transition-transform hover:scale-105'
                    style={{ backgroundColor: BRAND }}
                  >
                    {slide.price} · View listing
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Floating search card */}
        <div className='hidden md:block absolute left-0 right-0 -bottom-10 z-20'>
          <form
            onSubmit={handleHeroSearch}
            className='max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex items-center gap-2'
          >
            <div className='flex bg-gray-100 rounded-xl p-1 shrink-0'>
              {['sale', 'rent'].map((t) => (
                <button
                  type='button'
                  key={t}
                  onClick={() => setDealType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                    dealType === t ? 'text-white' : 'text-gray-600'
                  }`}
                  style={dealType === t ? { backgroundColor: BRAND } : {}}
                >
                  {t === 'sale' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>
            <input
              type='text'
              placeholder='Search by city, neighborhood, or address...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1 px-3 py-2 text-sm focus:outline-none'
            />
            <button
              type='submit'
              className='flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl shrink-0 transition-transform hover:scale-105'
              style={{ backgroundColor: BRAND }}
            >
              <FaSearch size={14} /> Search
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className='pt-16 md:pt-24 pb-4 bg-gray-50'>
        <StatsRow />
      </div>

      {/* Services */}
      <section className='max-w-6xl mx-auto px-4 py-16'>
        <div className='text-center mb-10'>
          <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
            What we do
          </p>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mt-1'>
            Everything you need, in one place
          </h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {services.map((s) => (
            <div
              key={s.title}
              className='bg-white border border-gray-100 shadow-sm hover:shadow-lg rounded-2xl p-6 transition-shadow duration-300'
            >
              <div
                className='w-14 h-14 rounded-xl flex items-center justify-center mb-4'
                style={{ backgroundColor: `${BRAND}22`, color: BRAND }}
              >
                {s.icon}
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>{s.title}</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Listings */}
      <div className='max-w-6xl mx-auto px-4 py-6'>
        {!loadingListings && !hasAnyListings && (
          <div className='text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50'>
            <p className='text-gray-500 text-sm'>
              No listings yet — check back soon, or{' '}
              <Link to='/create-listing' style={{ color: BRAND }} className='font-semibold'>
                list the first property
              </Link>
              .
            </p>
          </div>
        )}

        {offerListings.length > 0 && (
          <ListingsRow
            title='Recent offers'
            link='/search?offer=true'
            listings={offerListings}
          />
        )}
        {rentListings.length > 0 && (
          <ListingsRow
            title='Recent places for rent'
            link='/search?type=rent'
            listings={rentListings}
          />
        )}
        {saleListings.length > 0 && (
          <ListingsRow
            title='Recent places for sale'
            link='/search?type=sale'
            listings={saleListings}
          />
        )}
      </div>

      {/* Testimonials */}
      <section className='bg-gray-50 py-16'>
        <div className='max-w-5xl mx-auto px-4'>
          <div className='text-center mb-10'>
            <p className='text-sm font-semibold uppercase tracking-wide' style={{ color: BRAND }}>
              Testimonials
            </p>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mt-1'>
              What our clients say
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className='testimonial-swiper pb-10'
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col'>
                  <FaQuoteLeft style={{ color: BRAND }} size={20} className='mb-3' />
                  <p className='text-gray-600 text-sm leading-relaxed flex-1'>{t.text}</p>
                  <div className='flex items-center gap-3 mt-5'>
                    <img
                      src={t.photo}
                      alt={t.name}
                      className='w-11 h-11 rounded-full object-cover'
                    />
                    <div>
                      <p className='font-semibold text-gray-900 text-sm'>{t.name}</p>
                      <p className='text-xs text-gray-400'>{t.role}</p>
                    </div>
                    <div className='ml-auto flex gap-0.5' style={{ color: BRAND }}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={12} />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA */}
      <section
        className='py-16 text-center px-4'
        style={{ background: `linear-gradient(135deg, ${BRAND}, #1f9c53)` }}
      >
        <h2 className='text-2xl md:text-3xl font-bold text-white mb-3'>
          Ready to find your place?
        </h2>
        <p className='text-white/85 mb-6 max-w-md mx-auto'>
          Search hundreds of listings or get an instant price estimate before you commit.
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
            to='/price-estimator'
            className='border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors'
          >
            Estimate a price
          </Link>
        </div>
      </section>
    </>
  );
}

function ListingsRow({ title, link, listings }) {
  return (
    <div className='mb-12'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl md:text-2xl font-bold text-gray-900'>{title}</h2>
        <Link
          to={link}
          className='text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors'
          style={{ color: BRAND, borderColor: BRAND }}
        >
          View all
        </Link>
      </div>
      <div className='flex flex-wrap gap-6'>
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  );
}
