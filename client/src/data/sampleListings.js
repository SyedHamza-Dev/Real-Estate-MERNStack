import property1 from '../assets/images/property-1.jpg';
import property2 from '../assets/images/property-2.jpg';
import property3 from '../assets/images/property-3.jpg';
import property4 from '../assets/images/property-4.jpg';
import property5 from '../assets/images/property-5.jpg';
import property6 from '../assets/images/property-6.jpg';
import property7 from '../assets/images/property-7.jpg';
import property8 from '../assets/images/property-8.jpg';
import property9 from '../assets/images/property-9.jpg';
import property10 from '../assets/images/property-10.jpg';

// Sample listings shown when the API has no data yet (e.g. an empty/
// disconnected database). Clearly not real inventory — used only as a
// fallback so the Search page isn't blank during local development or
// before any listings have been added.
const sampleListings = [
  {
    _id: 'sample-1',
    name: 'Modern Lakeside Villa',
    address: '212 Lakeview Drive, Doral, FL',
    description: 'A bright, open-plan villa with floor-to-ceiling windows and direct lake access.',
    imageUrls: [property1],
    regularPrice: 480000,
    discountPrice: 450000,
    offer: true,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    _id: 'sample-2',
    name: 'Downtown Loft Apartment',
    address: '88 5th Avenue, New York, NY',
    description: 'Industrial-style loft in the heart of downtown, walking distance to everything.',
    imageUrls: [property2],
    regularPrice: 3200,
    discountPrice: 3200,
    offer: false,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    _id: 'sample-3',
    name: 'Suburban Family Home',
    address: '45 Maple Street, Austin, TX',
    description: 'Spacious family home with a large backyard, close to top-rated schools.',
    imageUrls: [property3],
    regularPrice: 395000,
    discountPrice: 395000,
    offer: false,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    _id: 'sample-4',
    name: 'Beachfront Studio',
    address: '9 Ocean Boulevard, San Diego, CA',
    description: 'Compact studio steps from the beach — perfect for a weekend escape.',
    imageUrls: [property4],
    regularPrice: 2100,
    discountPrice: 1850,
    offer: true,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    _id: 'sample-5',
    name: 'Hillside Modern Retreat',
    address: '301 Ridgecrest Road, Los Angeles, CA',
    description: 'A minimalist hillside home with panoramic city views and a private pool.',
    imageUrls: [property5],
    regularPrice: 890000,
    discountPrice: 890000,
    offer: false,
    type: 'sale',
    bedrooms: 5,
    bathrooms: 4,
  },
  {
    _id: 'sample-6',
    name: 'Cozy Garden Cottage',
    address: '17 Willow Lane, Portland, OR',
    description: 'A charming cottage surrounded by mature gardens, quiet and walkable.',
    imageUrls: [property6],
    regularPrice: 1650,
    discountPrice: 1650,
    offer: false,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    _id: 'sample-7',
    name: 'Riverside Penthouse',
    address: '500 Riverwalk Way, Chicago, IL',
    description: 'Top-floor penthouse with a private terrace overlooking the river.',
    imageUrls: [property7],
    regularPrice: 720000,
    discountPrice: 675000,
    offer: true,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 3,
  },
  {
    _id: 'sample-8',
    name: 'Downtown Studio Rental',
    address: '64 Market Street, Seattle, WA',
    description: 'Efficient studio in a well-connected building, close to transit.',
    imageUrls: [property8],
    regularPrice: 1580,
    discountPrice: 1580,
    offer: false,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    _id: 'sample-9',
    name: 'Classic Brownstone',
    address: '22 Heritage Row, Boston, MA',
    description: 'A restored brownstone blending original details with modern comfort.',
    imageUrls: [property9],
    regularPrice: 610000,
    discountPrice: 610000,
    offer: false,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    _id: 'sample-10',
    name: 'Skyline View Apartment',
    address: '150 Highrise Ave, Miami, FL',
    description: 'High-floor apartment with wraparound skyline views and a resort-style pool.',
    imageUrls: [property10],
    regularPrice: 2800,
    discountPrice: 2500,
    offer: true,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
  },
];

export default sampleListings;
