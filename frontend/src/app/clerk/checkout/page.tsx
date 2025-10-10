"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingCart,
  Receipt,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Skeleton Components
const SkeletonCard = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  </div>
);

const SkeletonCartItem = () => (
  <div className="flex items-center gap-4 p-4 bg-pink-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
    <div className="text-right">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-1"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
    </div>
  </div>
);

const SkeletonPaymentMethod = () => (
  <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

const SkeletonOrderSummary = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
    <div className="space-y-3 mb-6">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
        </div>
      </div>
    </div>
    <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
  </div>
);

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Visa, Mastercard, RuPay",
    enabled: true,
  },
  {
    id: "upi",
    name: "UPI Payment",
    icon: <Smartphone className="w-5 h-5" />,
    description: "PhonePe, Google Pay, Paytm",
    enabled: true,
  },
  {
    id: "cash",
    name: "Cash Payment",
    icon: <Banknote className="w-5 h-5" />,
    description: "Pay with cash",
    enabled: true,
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: <Wallet className="w-5 h-5" />,
    description: "Paytm, Mobikwik, Freecharge",
    enabled: false,
  },
];

function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [showBill, setShowBill] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from URL params or localStorage
  useEffect(() => {
    const cartData = searchParams.get("cart");
    if (cartData) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(cartData));
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        // Fallback to empty cart
        setCart([]);
      }
    }
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [searchParams]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call to sales service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate transaction ID
      const txId = `TXN${Date.now()}`;
      setTransactionId(txId);

      // Register sale with sales service
      const saleData = {
        transactionId: txId,
        items: cart,
        customer: customerInfo,
        paymentMethod: selectedPayment,
        subtotal,
        tax,
        total,
        timestamp: new Date().toISOString(),
      };

      console.log("Sale registered:", saleData);

      setIsCompleted(true);
      setShowBill(true);
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    router.push("/clerk/pos");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 dark:bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/30 dark:bg-rose-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 p-6">
          {/* Header Skeleton */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>

              {/* Right Column Skeleton */}
              <div className="space-y-6">
                <SkeletonOrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Cart is Empty
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please add items to your cart before checkout
          </p>
          <Button
            onClick={() => router.push("/clerk/pos")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to POS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 dark:bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/30 dark:bg-rose-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/clerk/pos")}
              className="hover:bg-pink-100 dark:hover:bg-pink-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Checkout
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Complete your purchase
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <Input
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      placeholder="Enter customer name"
                      className="border-pink-200 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <Input
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      className="border-pink-200 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <Input
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="Enter email address"
                      className="border-pink-200 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Items ({cart.length})
                </h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-pink-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-lg shadow-sm">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">
                          ₹{item.price * item.qty}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => method.enabled && setSelectedPayment(method.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? "border-pink-500 bg-pink-50 dark:bg-pink-500/20"
                          : method.enabled
                            ? "border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-400"
                            : "border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedPayment === method.id
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            {method.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        Total
                      </span>
                      <span className="text-lg font-bold text-pink-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!selectedPayment || isProcessing}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Complete Payment
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Transaction ID: {transactionId}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex-1 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-500/20"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Bill
                </Button>
                <Button
                  onClick={handleNewSale}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  New Sale
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Bill */}
      {showBill && (
        <div className="hidden print:block fixed inset-0 bg-white p-8">
          <div className="max-w-md mx-auto">
            {/* Bill Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">EisLagger</h1>
              <p className="text-gray-600">Ice Cream Parlor</p>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>123 Main Street</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="border-t border-b border-gray-300 py-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Transaction ID:</span>
                <span className="font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              {customerInfo.name && (
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span>{customerInfo.name}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="py-4">
              <div className="text-sm font-semibold mb-2">Items:</div>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-300 py-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>GST (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-gray-500">
              <p>Thank you for your purchase!</p>
              <p>Visit us again soon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}> 
      <CheckoutClient />
    </Suspense>
  );
}
