import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CarCard, Car } from '@/components/CarCard';
import { FilterDropdown, Filters } from '@/components/FilterDropdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

// Mock car data - in production this would come from your AI backend
const MOCK_CARS: Car[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    price: 32500,
    mileage: 15000,
    fuelType: 'Hybrid',
    bodyType: 'SUV',
    color: 'Silver',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop',
    location: 'Los Angeles, CA',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    price: 28900,
    mileage: 22000,
    fuelType: 'Gasoline',
    bodyType: 'Sedan',
    color: 'Black',
    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=400&fit=crop',
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    price: 45000,
    mileage: 8000,
    fuelType: 'Electric',
    bodyType: 'SUV',
    color: 'White',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop',
    location: 'Seattle, WA',
  },
  {
    id: '4',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    price: 38500,
    mileage: 30000,
    fuelType: 'Gasoline',
    bodyType: 'Truck',
    color: 'Blue',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    location: 'Austin, TX',
  },
  {
    id: '5',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    price: 42000,
    mileage: 12000,
    fuelType: 'Gasoline',
    bodyType: 'Sedan',
    color: 'Gray',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
    location: 'Miami, FL',
  },
  {
    id: '6',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2023,
    price: 29500,
    mileage: 18000,
    fuelType: 'Hybrid',
    bodyType: 'SUV',
    color: 'Red',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
    location: 'Denver, CO',
  },
];

const initialFilters: Filters = {
  bodyTypes: [],
  makes: [],
  minYear: '',
  maxYear: '',
  minPrice: '',
  maxPrice: '',
  colors: [],
  maxMileage: '',
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const filteredCars = useMemo(() => {
    return MOCK_CARS.filter(car => {
      if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(car.bodyType)) return false;
      if (filters.makes.length > 0 && !filters.makes.includes(car.make)) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(car.color)) return false;
      if (filters.minYear && car.year < parseInt(filters.minYear)) return false;
      if (filters.maxYear && car.year > parseInt(filters.maxYear)) return false;
      if (filters.minPrice && car.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && car.price > parseInt(filters.maxPrice)) return false;
      if (filters.maxMileage && car.mileage > parseInt(filters.maxMileage)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Search Results
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-4 w-4" />
                <p className="text-sm">"{query}"</p>
                <span className="text-border">•</span>
                <p className="text-sm">{filteredCars.length} cars found</p>
              </div>
            </div>
            
            <FilterDropdown 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(initialFilters)}
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No cars found
            </h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search with different criteria.
            </p>
            <Button variant="outline" onClick={() => setFilters(initialFilters)}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
