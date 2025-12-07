import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface SearchHistoryItem {
  id: string;
  query: string;
  created_at: string;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchHistory();
    }
  }, [user, authLoading, navigate]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load search history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Search removed from history.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete search.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Search History
          </h1>
          <p className="text-muted-foreground">
            Your previous car searches. Click on any search to see results again.
          </p>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card 
                key={item.id} 
                className="group hover:shadow-elevated transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <Link 
                    to={`/results?q=${encodeURIComponent(item.query)}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {item.query}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(item.created_at), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteHistoryItem(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No search history yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start searching for cars and your history will appear here.
            </p>
            <Button variant="hero" asChild>
              <Link to="/">Start Searching</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
