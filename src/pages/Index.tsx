import { Navbar } from '@/components/Navbar';
import { SearchChat } from '@/components/SearchChat';
import { Car, Shield, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative container py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Find Your Perfect Car with{' '}
              <span className="text-secondary">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Simply describe what you're looking for, and our AI will recommend 
              the best cars tailored to your needs.
            </p>
            
            <SearchChat />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ReCarmmend?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make finding your next car simple, smart, and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                AI-Powered Search
              </h3>
              <p className="text-muted-foreground">
                Our intelligent system understands your needs and finds the perfect match from thousands of listings.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Car className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Vast Selection
              </h3>
              <p className="text-muted-foreground">
                Access to a comprehensive database of vehicles from trusted dealers and private sellers.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Save Your Searches
              </h3>
              <p className="text-muted-foreground">
                Create an account to save your search history and easily revisit your favorite finds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2024 ReCarmmend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
