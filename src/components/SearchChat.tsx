import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SearchChat() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a description",
        description: "Tell us what kind of car you're looking for.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save to search history if logged in
      if (user) {
        await supabase.from('search_history').insert({
          user_id: user.id,
          query: query.trim(),
        });
      }

      // Navigate to results with the query
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
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
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>AI-powered recommendations</span>
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
