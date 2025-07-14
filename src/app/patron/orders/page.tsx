"use client";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaFileExport,
  FaSearch,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBoxOpen,
  FaFilePdf,
  FaRedo,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaPrint,
  FaExclamationTriangle,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const statusColors = {
  delivered: "border-green-400 bg-green-50 dark:bg-green-900",
  active: "border-blue-400 bg-blue-50 dark:bg-blue-900",
  out: "border-amber-400 bg-yellow-50 dark:bg-yellow-900",
  cancelled: "border-red-400 bg-red-50 dark:bg-red-900",
};
const ordersMock = [
  {
    id: 2451,
    status: "out",
    eta: "30 mins",
    items: 3,
    total: 489,
    date: "2025-07-02",
    address: "221B Baker St, Delhi 110001",
    payment: "UPI - Paid",
    flavors: [
      { name: "Mango Nirvana", size: "500ml", price: 149 },
      { name: "ChocoCrater Volcano", size: "250ml", price: 199 },
      { name: "Kesar Mango Shakti", size: "100ml", price: 141 },
    ],
    timeline: [
      { label: "Order Placed", time: "09:00" },
      { label: "Preparing", time: "09:05" },
      { label: "Out for Delivery", time: "09:30" },
    ],
    deliveryPerson: { name: "Ravi Kumar", phone: "+91 98765 43210" },
  },
  {
    id: 2432,
    status: "delivered",
    eta: "Delivered on 2025-06-28",
    items: 2,
    total: 322,
    date: "2025-06-28",
    address: "Home, 123 Main St, Mumbai",
    payment: "Card - Paid",
    flavors: [
      { name: "Berry Carnival", size: "500ml", price: 180 },
      { name: "Hazelnut Dream", size: "250ml", price: 142 },
    ],
    timeline: [
      { label: "Order Placed", time: "10:00" },
      { label: "Preparing", time: "10:10" },
      { label: "Out for Delivery", time: "10:30" },
      { label: "Delivered", time: "11:00" },
    ],
    deliveryPerson: { name: "Priya Singh", phone: "+91 91234 56789" },
  },
];

// --- Filter Toolbar ---
function FilterToolbar({ status, setStatus, search, setSearch }: any) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#18181b] rounded-t-2xl shadow flex flex-wrap items-center gap-4 px-6 py-4 mb-6 border-b border-pink-100 dark:border-zinc-800">
      <span className="text-2xl font-bold text-pink-400">🧾 My Orders</span>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <div className="flex items-center gap-2">
        <FaSearch className="text-pink-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2"
        />
      </div>
      <button className="ml-auto flex items-center gap-2 bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-200 dark:border-zinc-700">
        <FaFileExport /> Export
      </button>
    </div>
  );
}

// --- Order Card ---
function OrderCard({ order, onView, onTrack }: any) {
  const statusMap: any = {
    delivered: {
      label: "Delivered",
      icon: <FaCheckCircle className="text-green-400" />,
    },
    active: { label: "Active", icon: <FaTruck className="text-blue-400" /> },
    out: {
      label: "Out for Delivery",
      icon: <FaClock className="text-amber-400" />,
    },
    cancelled: {
      label: "Cancelled",
      icon: <FaTimesCircle className="text-red-400" />,
    },
  };
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center md:items-stretch gap-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg border-l-8 p-6 border border-pink-100 dark:border-zinc-800 mb-4",
        order.status === "delivered" && "border-l-green-400",
        order.status === "active" && "border-l-blue-400",
        order.status === "out" && "border-l-amber-400",
        order.status === "cancelled" && "border-l-red-400"
      )}
    >
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FaBoxOpen className="text-pink-400" />
          <span className="font-bold text-lg">Order #{order.id}</span>
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border border-pink-200 dark:border-zinc-700"
            style={{ background: statusColors[order.status] }}
          >
            {statusMap[order.status]?.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-zinc-400">
          {order.status === "out" && (
            <span>
              ETA: <span className="font-bold text-amber-500">{order.eta}</span>{" "}
              🚚
            </span>
          )}
          <span>🛒 Items: {order.items}</span>
          <span>
            Total:{" "}
            <span className="font-bold text-pink-400">
              ₹{order.total.toFixed(2)}
            </span>
          </span>
          <span>Date: {new Date(order.date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:items-end">
        <div className="flex gap-2">
          <button
            className="bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-200 dark:border-zinc-700"
            onClick={() => onView(order)}
          >
            View Details
          </button>
          {order.status === "out" || order.status === "active" ? (
            <button
              className="bg-blue-100 text-blue-400 px-4 py-2 rounded-lg font-bold border border-blue-200 dark:border-blue-700"
              onClick={() => onTrack(order)}
            >
              Track Order
            </button>
          ) : null}
          {order.status === "delivered" && (
            <button className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-bold border border-green-200 dark:border-green-700">
              <FaRedo className="inline mr-1" /> Reorder
            </button>
          )}
          {order.status === "delivered" && (
            <button className="bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-200 dark:border-pink-700">
              <FaFilePdf className="inline mr-1" /> View Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Order Details Modal ---
function OrderDetailsModal({ order, onClose }: any) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-pink-100 dark:border-zinc-800">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-400"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-pink-400 mb-4">
          Order #{order.id} – Details
        </h2>
        <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
          Delivery Address:{" "}
          <span className="font-bold text-pink-400">{order.address}</span>
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
          Delivery Mode:{" "}
          <span className="font-bold text-pink-400">Scheduled</span> | ETA:{" "}
          <span className="font-bold text-pink-400">{order.eta}</span>
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
          Payment:{" "}
          <span className="font-bold text-pink-400">{order.payment}</span>
        </div>
        <div className="mb-4">
          <div className="font-bold text-pink-400 mb-2">Flavors:</div>
          <ul className="list-disc pl-6">
            {order.flavors.map((f: any, i: number) => (
              <li key={i} className="mb-1 text-gray-700 dark:text-zinc-200">
                🍦 {f.name}{" "}
                <span className="text-xs text-gray-400">({f.size})</span> –{" "}
                <span className="font-bold">₹{f.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div>
            Subtotal:{" "}
            <span className="font-bold">₹{order.total.toFixed(2)}</span>
          </div>
          <div>
            Taxes: <span className="font-bold">₹0.00</span>
          </div>
          <div>
            Delivery Fee: <span className="font-bold">₹0.00</span>
          </div>
          <div>
            Grand Total:{" "}
            <span className="font-bold text-pink-400">
              ₹{order.total.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button className="bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-200 dark:border-pink-700">
            <FaPrint className="inline mr-1" /> Print Invoice
          </button>
          <button className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-bold border border-green-200 dark:border-green-700">
            <FaRedo className="inline mr-1" /> Reorder
          </button>
          <button className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-lg font-bold border border-yellow-200 dark:border-yellow-700">
            <FaExclamationTriangle className="inline mr-1" /> Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Track Order Modal ---
function TrackOrderModal({ order, onClose }: any) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-pink-100 dark:border-zinc-800">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-400"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-pink-400 mb-4">
          Track Order #{order.id}
        </h2>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2">
            {order.timeline.map((step: any, i: number) => (
              <React.Fragment key={i}>
                <div
                  className={cn(
                    "flex flex-col items-center",
                    i < order.timeline.length - 1 && "flex-1"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                      i === order.timeline.length - 1
                        ? "bg-green-400"
                        : "bg-pink-400"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-400">{step.time}</span>
                </div>
                {i < order.timeline.length - 1 && (
                  <div className="flex-1 h-1 bg-pink-100 dark:bg-zinc-800 mx-2 rounded" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <FaUser className="text-pink-400" />
          <span className="font-bold">{order.deliveryPerson.name}</span>
          <FaPhone className="text-pink-400 ml-2" />
          <span>{order.deliveryPerson.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-pink-400" />
          <span className="text-sm text-gray-500 dark:text-zinc-400">
            Map preview (static)
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Empty State ---
function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center gap-4">
      <span className="text-5xl">🛒</span>
      <span className="text-lg font-bold text-pink-400">
        Looks like you haven’t placed an order yet!
      </span>
      <span className="text-gray-500 dark:text-zinc-400">
        Explore flavors and treat yourself 🍨
      </span>
      <button className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-6 py-3 font-bold mt-2">
        Go to Browse Flavors
      </button>
    </div>
  );
}

// --- Main Orders Page ---
export default function PatronOrdersPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [showDetails, setShowDetails] = useState<any>(null);
  const [showTrack, setShowTrack] = useState<any>(null);
  const [showPast, setShowPast] = useState(true);

  // Filter logic (mock)
  let activeOrders = ordersMock.filter(
    (o) =>
      (status === "all" ||
        o.status === status ||
        (status === "active" &&
          (o.status === "active" || o.status === "out"))) &&
      o.status !== "delivered" &&
      o.status !== "cancelled"
  );
  let pastOrders = ordersMock.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );
  if (search) {
    activeOrders = activeOrders.filter(
      (o) =>
        o.id.toString().includes(search) ||
        o.flavors.some((f: any) =>
          f.name.toLowerCase().includes(search.toLowerCase())
        )
    );
    pastOrders = pastOrders.filter(
      (o) =>
        o.id.toString().includes(search) ||
        o.flavors.some((f: any) =>
          f.name.toLowerCase().includes(search.toLowerCase())
        )
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6FA] dark:bg-[#18181b] flex flex-col px-0 md:px-8 py-8">
      <FilterToolbar
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-lg font-bold text-green-500">
            🟢 Active Orders
          </span>
          {activeOrders.length === 0 ? (
            <EmptyOrdersState />
          ) : (
            activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={setShowDetails}
                onTrack={setShowTrack}
              />
            ))
          )}
        </div>
        <div className="mb-8">
          <button
            className="flex items-center gap-2 text-pink-400 font-bold mb-4"
            onClick={() => setShowPast((v) => !v)}
          >
            <span className="text-lg">
              {showPast ? <FaChevronDown /> : <FaChevronUp />}
            </span>
            <span>Past Orders</span>
          </button>
          {showPast &&
            (pastOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              pastOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={setShowDetails}
                  onTrack={setShowTrack}
                />
              ))
            ))}
        </div>
      </div>
      <OrderDetailsModal
        order={showDetails}
        onClose={() => setShowDetails(null)}
      />
      <TrackOrderModal order={showTrack} onClose={() => setShowTrack(null)} />
    </div>
  );
}
