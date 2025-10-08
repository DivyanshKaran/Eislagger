"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  CheckCircle,
  Cloud,
  Factory,
  FileText,
  Headphones,
  Moon,
  Play,
  Shield,
  ShoppingCart,
  Smartphone,
  Star,
  Store,
  Sun,
  Users,
  Zap,
} from "lucide-react";

// Lazy loading hook
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasIntersected) {
        setIsIntersecting(true);
        setHasIntersected(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options, hasIntersected]);

  return [ref, isIntersecting];
}

// Lazy Component Wrapper
function LazyComponent({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-1000 ease-out ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Testimonial Component
function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
  avatar,
}: {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-zinc-800">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
        &ldquo;{content}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {role} at {company}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <LazyComponent delay={delay}>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 group">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </LazyComponent>
  );
}

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled on page load
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "Frosty Delights",
      content:
        "EisLager Pro transformed our entire operation. We've seen a 40% increase in efficiency and our customers love the new ordering system.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Operations Manager",
      company: "Arctic Ice Cream",
      content:
        "The real-time analytics and inventory management features have saved us countless hours. Highly recommended for any ice cream business.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emma Rodriguez",
      role: "Store Manager",
      company: "Sweet Dreams",
      content:
        "Our staff loves the intuitive interface, and our customers appreciate the seamless ordering experience. It's a game-changer!",
      rating: 5,
      avatar: "ER",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance ensures your operations run smoothly without delays.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and compliance standards.",
    },
    {
      icon: Cloud,
      title: "Cloud Native",
      description:
        "Built for the cloud with automatic scaling and 99.9% uptime guarantee.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Responsive design that works perfectly on all devices and screen sizes.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support with dedicated account managers.",
    },
    {
      icon: FileText,
      title: "Comprehensive Docs",
      description:
        "Extensive documentation and video tutorials to get you started quickly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">
                <img src="./favicon.png" width="48px" alt="EisLager Logo" />
              </div>
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

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-foreground" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground" />
                )}
              </button>

              <Link
                href="/auth/login"
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Dark Mode Toggle for Mobile */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-foreground" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground" />
                )}
              </button>

              <Link
                href="/auth/login"
                className="btn-primary px-4 py-2 rounded-lg text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <LazyComponent>
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
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
                className="btn-secondary px-8 py-3 rounded-lg text-lg font-semibold flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>
          </div>
        </section>
      </LazyComponent>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <LazyComponent>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Powerful Features for Every Role
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From executives to customers, everyone gets the tools they need
                to succeed.
              </p>
            </div>
          </LazyComponent>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Executive */}
            <LazyComponent delay={0}>
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
            </LazyComponent>

            {/* Manufacturer */}
            <LazyComponent delay={100}>
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
            </LazyComponent>

            {/* Clerk */}
            <LazyComponent delay={200}>
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
            </LazyComponent>

            {/* Customer */}
            <LazyComponent delay={300}>
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
            </LazyComponent>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LazyComponent>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built for Modern Businesses
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enterprise-grade features designed to scale with your business
                growth.
              </p>
            </div>
          </LazyComponent>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <LazyComponent>
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-slide-up">
                <div className="text-3xl font-bold text-gradient mb-2">
                  500+
                </div>
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
                <div className="text-3xl font-bold text-gradient mb-2">
                  10K+
                </div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-3xl font-bold text-gradient mb-2">
                  99.9%
                </div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </LazyComponent>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LazyComponent>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Loved by Ice Cream Businesses
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our customers have to say about their experience with
                EisLager Pro.
              </p>
            </div>
          </LazyComponent>

          <LazyComponent>
            <div className="relative">
              <div className="flex gap-6 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-full md:w-1/3 transition-all duration-500 ${
                      index === currentTestimonial
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                  >
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "bg-pink-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </LazyComponent>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <LazyComponent>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your business needs. All plans include
                our core features.
              </p>
            </div>
          </LazyComponent>

          <div className="grid md:grid-cols-3 gap-8">
            <LazyComponent delay={0}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-pink-100 dark:border-zinc-800">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Starter
                </h3>
                <div className="text-4xl font-bold text-gradient mb-4">
                  $29
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Perfect for small ice cream shops just getting started.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Up to 2 stores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Basic analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Email support
                  </li>
                </ul>
                <Link
                  href="/auth/login"
                  className="w-full btn-primary py-3 rounded-lg text-center block"
                >
                  Get Started
                </Link>
              </div>
            </LazyComponent>

            <LazyComponent delay={100}>
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-2xl shadow-lg text-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold mb-4">
                  $79<span className="text-lg opacity-80">/month</span>
                </div>
                <p className="opacity-80 mb-6">
                  Ideal for growing businesses with multiple locations.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Up to 10 stores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Custom integrations
                  </li>
                </ul>
                <Link
                  href="/auth/login"
                  className="w-full bg-white text-pink-600 py-3 rounded-lg text-center block font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </LazyComponent>

            <LazyComponent delay={200}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-pink-100 dark:border-zinc-800">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold text-gradient mb-4">
                  $199
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  For large chains and enterprise operations.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Unlimited stores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Custom reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    24/7 phone support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Dedicated account manager
                  </li>
                </ul>
                <Link
                  href="/auth/login"
                  className="w-full btn-primary py-3 rounded-lg text-center block"
                >
                  Contact Sales
                </Link>
              </div>
            </LazyComponent>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LazyComponent>
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Ice Cream Business?
            </h2>
            <p className="text-xl text-foreground mb-4">
              Join hundreds of businesses already using EisLager Pro to
              streamline their operations.
            </p>
            <Link
              href="/auth/login"
              className="bg-white text-primary px-8 py-3 text-lg font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2 btn-primary rounded-lg"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </LazyComponent>

      {/* Footer */}
      <LazyComponent>
        <footer className="bg-card/50 border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="text-2xl">
                    <img src="./favicon.png" width="48px" alt="EisLager Logo" />
                  </div>
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
      </LazyComponent>
    </div>
  );
}
