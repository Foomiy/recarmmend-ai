import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal, X } from 'lucide-react';

export interface Filters {
  bodyTypes: string[];
  makes: string[];
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  colors: string[];
  maxMileage: string;
}

interface FilterDropdownProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

const BODY_TYPES = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Van', 'Wagon'];
const MAKES = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Nissan', 'Hyundai'];
const COLORS = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown'];

export function FilterDropdown({ filters, onFiltersChange, onClearFilters }: FilterDropdownProps) {
  const hasActiveFilters = 
    filters.bodyTypes.length > 0 ||
    filters.makes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minYear ||
    filters.maxYear ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.maxMileage;

  // For body type and make: single selection only
  const toggleSingleFilter = (key: 'bodyTypes' | 'makes', value: string) => {
    const current = filters[key];
    const updated = current.includes(value) ? [] : [value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  // For colors: multiple selection allowed
  const toggleArrayFilter = (key: 'colors', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">
                !
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4 bg-popover max-h-[70vh] overflow-y-auto" align="start">
          <DropdownMenuLabel className="text-base font-semibold">Advanced Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Body Type - Single selection */}
          <div className="py-2">
            <Label className="text-sm font-medium">Body Type (select one)</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {BODY_TYPES.map(type => (
                <Button
                  key={type}
                  variant={filters.bodyTypes.includes(type) ? 'secondary' : 'outline'}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => toggleSingleFilter('bodyTypes', type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Make - Single selection */}
          <div className="py-2">
            <Label className="text-sm font-medium">Make (select one)</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {MAKES.map(make => (
                <Button
                  key={make}
                  variant={filters.makes.includes(make) ? 'secondary' : 'outline'}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => toggleSingleFilter('makes', make)}
                >
                  {make}
                </Button>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Year Range */}
          <div className="py-2">
            <Label className="text-sm font-medium">Year Range</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input
                placeholder="Min Year"
                type="number"
                value={filters.minYear}
                onChange={(e) => onFiltersChange({ ...filters, minYear: e.target.value })}
                className="h-9"
              />
              <Input
                placeholder="Max Year"
                type="number"
                value={filters.maxYear}
                onChange={(e) => onFiltersChange({ ...filters, maxYear: e.target.value })}
                className="h-9"
              />
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Price Range */}
          <div className="py-2">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                className="h-9"
              />
              <Input
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                className="h-9"
              />
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Colors */}
          <div className="py-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {COLORS.map(color => (
                <Button
                  key={color}
                  variant={filters.colors.includes(color) ? 'secondary' : 'outline'}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => toggleArrayFilter('colors', color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Mileage */}
          <div className="py-2">
            <Label className="text-sm font-medium">Max Mileage</Label>
            <Input
              placeholder="e.g., 50000"
              type="number"
              value={filters.maxMileage}
              onChange={(e) => onFiltersChange({ ...filters, maxMileage: e.target.value })}
              className="h-9 mt-2"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1.5">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
