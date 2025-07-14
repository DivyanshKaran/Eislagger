import Link from "next/link";
import {
  ArrowRight,
  Users,
  Factory,
  Store,
  ShoppingCart,
  Star,
  CheckCircle,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🍦</div>
              <span className="text-xl font-bold text-gradient">
                EisLager Pro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/auth/login"
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Streamline Your
              <span className="text-gradient block">Ice Cream Empire</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Modern, multi-role platform that streamlines ice cream business
              operations from manufacturing to shop sales to customer purchases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/login"
                className="btn-primary px-8 py-3 rounded-lg text-lg font-semibold flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#demo"
                className="btn-secondary px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Every Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From executives to customers, everyone gets the tools they need to
              succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Executive */}
            <div className="card-modern p-6 text-center group hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Executive
              </h3>
              <p className="text-muted-foreground mb-4">
                Oversee operations, allocate budgets, and monitor performance
                across your entire ice cream empire.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Real-time analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Budget allocation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Performance monitoring
                </li>
              </ul>
            </div>

            {/* Manufacturer */}
            <div className="card-modern p-6 text-center group hover:shadow-glow-coral transition-all duration-300">
              <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Manufacturer
              </h3>
              <p className="text-muted-foreground mb-4">
                Produce stock efficiently, manage deliveries, and track
                production metrics with precision.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Stock registration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Delivery pipeline
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Production analytics
                </li>
              </ul>
            </div>

            {/* Clerk */}
            <div className="card-modern p-6 text-center group hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Store Clerk
              </h3>
              <p className="text-muted-foreground mb-4">
                Manage sales, track inventory, and provide excellent customer
                service with our POS system.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  POS interface
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Stock tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Sales analytics
                </li>
              </ul>
            </div>

            {/* Customer */}
            <div className="card-modern p-6 text-center group hover:shadow-glow-orchid transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orchid-light to-highlight rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Customer
              </h3>
              <p className="text-muted-foreground mb-4">
                Browse flavors, place orders, and discover the best ice cream
                experiences near you.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-highlight" />
                  Flavor browsing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-highlight" />
                  Order tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-highlight" />
                  Store finder
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-3xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Active Stores</div>
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-3xl font-bold text-gradient mb-2">50+</div>
              <div className="text-muted-foreground">Manufacturing Units</div>
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-3xl font-bold text-gradient mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-3xl font-bold text-gradient mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Ice Cream Business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of businesses already using EisLager Pro to streamline
            their operations.
          </p>
          <Link
            href="/auth/login"
            className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🍦</div>
                <span className="text-xl font-bold text-gradient">
                  EisLager Pro
                </span>
              </div>
              <p className="text-muted-foreground">
                Modern ice cream business management platform for the digital
                age.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#demo"
                    className="hover:text-foreground transition-colors"
                  >
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="#about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#careers"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="#help"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#docs"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#status"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 EisLager Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
