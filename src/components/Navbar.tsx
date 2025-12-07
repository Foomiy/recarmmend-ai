import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Car, LogOut, User, History } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Re<span className="text-secondary">Car</span>mmend
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button 
            variant={isActive('/') ? 'navActive' : 'nav'} 
            size="sm" 
            asChild
          >
            <Link to="/">Home</Link>
          </Button>

          {user ? (
            <>
              <Button 
                variant={isActive('/history') ? 'navActive' : 'nav'} 
                size="sm" 
                asChild
              >
                <Link to="/history" className="flex items-center gap-1.5">
                  <History className="h-4 w-4" />
                  History
                </Link>
              </Button>
              <div className="ml-2 flex items-center gap-2 border-l border-border pl-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button 
                variant={isActive('/login') ? 'navActive' : 'nav'} 
                size="sm" 
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
