import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FilterDropdown, Filters } from '@/components/FilterDropdown';

const validateCarQuery = async (query: string): Promise<boolean> => {
  if (!query.trim()) return true;
  
  try {
    const { data, error } = await supabase.functions.invoke('validate-car-query', {
      body: { query }
    });
    
    if (error) {
      console.error('Validation error:', error);
      return true; // Allow on error
    }
    
    return data?.isCarRelated ?? true;
  } catch (error) {
    console.error('Validation error:', error);
    return true; // Allow on error
  }
};

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

export function SearchChat() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const hasActiveFilters = 
    filters.bodyTypes.length > 0 ||
    filters.makes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minYear ||
    filters.maxYear ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.maxMileage;

  const handleSearch = async () => {
    if (!query.trim() && !hasActiveFilters) {
      toast({
        title: "Please enter a description or select filters",
        description: "Tell us what kind of car you're looking for or use the filter options.",
        variant: "destructive",
      });
      return;
    }

    // Validate text input is car-related
    if (query.trim()) {
      setIsLoading(true);
      const isCarRelated = await validateCarQuery(query.trim());
      if (!isCarRelated) {
        setIsLoading(false);
        toast({
          title: "Query must be car-related",
          description: "Please describe what kind of car you're looking for. For example: 'I need a reliable family SUV under $35,000'",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // Save to search history if logged in
      if (user) {
        await supabase.from('search_history').insert([{
          user_id: user.id,
          query: query.trim(),
          filters: JSON.parse(JSON.stringify(filters)),
        }]);
      }

      // Build query params with filters
      const params = new URLSearchParams();
      params.set('q', query.trim());
      if (filters.bodyTypes.length > 0) params.set('bodyTypes', filters.bodyTypes.join(','));
      if (filters.makes.length > 0) params.set('makes', filters.makes.join(','));
      if (filters.minYear) params.set('minYear', filters.minYear);
      if (filters.maxYear) params.set('maxYear', filters.maxYear);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.colors.length > 0) params.set('colors', filters.colors.join(','));
      if (filters.maxMileage) params.set('maxMileage', filters.maxMileage);

      navigate(`/results?${params.toString()}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-card rounded-2xl shadow-elevated p-2 animate-scale-in">
        <div className="flex items-start gap-2">
          <Textarea
            placeholder="Describe your perfect car... e.g., 'I need a reliable family SUV under $35,000 with good fuel economy'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3">
            <FilterDropdown
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(initialFilters)}
            />
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-sm">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>AI-powered</span>
            </div>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <>Finding cars...</>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}