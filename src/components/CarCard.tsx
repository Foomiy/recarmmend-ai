import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, Gauge, Calendar, MapPin } from 'lucide-react';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  bodyType: string;
  color: string;
  image: string;
  location: string;
}

interface CarCardProps {
  car: Car;
  index: number;
}

export function CarCard({ car, index }: CarCardProps) {
  return (
    <Card 
      className="group overflow-hidden border-border/50 bg-card shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
          {car.bodyType}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5" />
              {car.location}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              ${car.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {car.color}
          </Badge>
          <Button variant="default" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
