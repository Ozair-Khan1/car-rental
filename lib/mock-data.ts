export type VehicleCategory = 'Economy' | 'Sedan' | 'SUV' | 'Luxury' | 'Sports' | 'Van' | 'Electric';
export type Transmission = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

export interface Owner {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  joinedDate: string;
  responseRate: number;
  totalTrips: number;
}

export const mockOwners: Owner[] = [
  {
    id: 'owner-1',
    name: 'Michael T.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    joinedDate: '2023',
    responseRate: 98,
    totalTrips: 45
  },
  {
    id: 'owner-2',
    name: 'Sarah L.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5.0,
    joinedDate: '2024',
    responseRate: 100,
    totalTrips: 12
  },
  {
    id: 'owner-3',
    name: 'David W.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 4.7,
    joinedDate: '2022',
    responseRate: 92,
    totalTrips: 128
  }
];

export interface Vehicle {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  dailyPrice: number;
  locationId: string;
  availability: 'Available' | 'Limited' | 'Unavailable';
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  luggage: number;
  features: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  range?: number; // For EVs
}

export interface Location {
  id: string;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
}

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    city: 'San Francisco',
    country: 'USA',
    address: 'San Francisco International Airport (SFO)',
    latitude: 37.6213,
    longitude: -122.3790,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'loc-2',
    city: 'Los Angeles',
    country: 'USA',
    address: 'Los Angeles International Airport (LAX)',
    latitude: 33.9416,
    longitude: -118.4085,
    image: 'https://images.unsplash.com/photo-1533654793924-4fc4949ea786?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'loc-3',
    city: 'Miami',
    country: 'USA',
    address: 'Miami International Airport (MIA)',
    latitude: 25.7959,
    longitude: -80.2870,
    image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=2000&auto=format&fit=crop'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'v-1',
    ownerId: 'owner-1',
    brand: 'BMW',
    model: 'X5',
    year: 2025,
    category: 'SUV',
    dailyPrice: 129,
    locationId: 'loc-1',
    availability: 'Available',
    transmission: 'Automatic',
    fuel: 'Hybrid',
    seats: 5,
    luggage: 4,
    features: ['Apple CarPlay', 'GPS', 'Heated Seats', 'Panoramic Roof', 'Digital Key'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: 'v-2',
    ownerId: 'owner-2',
    brand: 'Porsche',
    model: 'Taycan',
    year: 2025,
    category: 'Electric',
    dailyPrice: 249,
    locationId: 'loc-2',
    availability: 'Limited',
    transmission: 'Automatic',
    fuel: 'Electric',
    seats: 4,
    luggage: 2,
    features: ['Fast Charging', 'Apple CarPlay', 'Premium Audio', 'Autopilot'],
    images: [
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop'
    ],
    rating: 5.0,
    reviewsCount: 84,
    range: 310
  },
  {
    id: 'v-3',
    ownerId: 'owner-3',
    brand: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2024,
    category: 'Luxury',
    dailyPrice: 199,
    locationId: 'loc-3',
    availability: 'Available',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    luggage: 3,
    features: ['Massage Seats', 'Rear Entertainment', 'Chauffeur Package', 'Digital Key'],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2000&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewsCount: 215
  },
  {
    id: 'v-4',
    ownerId: 'owner-1',
    brand: 'Audi',
    model: 'e-tron GT',
    year: 2025,
    category: 'Electric',
    dailyPrice: 189,
    locationId: 'loc-1',
    availability: 'Available',
    transmission: 'Automatic',
    fuel: 'Electric',
    seats: 4,
    luggage: 2,
    features: ['Apple CarPlay', 'Digital Key', 'Fast Charging', 'Sport Seats'],
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=2000&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewsCount: 92,
    range: 280
  },
  {
    id: 'v-5',
    ownerId: 'owner-2',
    brand: 'Toyota',
    model: 'Camry Hybrid',
    year: 2024,
    category: 'Sedan',
    dailyPrice: 65,
    locationId: 'loc-2',
    availability: 'Available',
    transmission: 'Automatic',
    fuel: 'Hybrid',
    seats: 5,
    luggage: 3,
    features: ['Apple CarPlay', 'Android Auto', 'Adaptive Cruise'],
    images: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2000&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewsCount: 342
  },
  {
    id: 'v-6',
    ownerId: 'owner-3',
    brand: 'Range Rover',
    model: 'Sport',
    year: 2025,
    category: 'SUV',
    dailyPrice: 175,
    locationId: 'loc-3',
    availability: 'Unavailable',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 5,
    luggage: 5,
    features: ['Air Suspension', 'Meridian Audio', 'Panoramic Roof'],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2000&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewsCount: 156
  }
];

export interface Booking {
  id: string;
  userId: string;
  ownerId: string;
  vehicleId: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string;
  returnDate: string;
  status: 'Pending Owner Approval' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Rejected';
  dailyRate: number;
  subtotal: number;
  platformFee: number;
  taxes: number;
  total: number;
}
