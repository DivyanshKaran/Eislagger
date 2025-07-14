"use client";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaFileExport,
  FaShoppingCart,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaFilePdf,
  FaRedo,
  FaExclamationTriangle,
  FaBoxOpen,
  FaReceipt,
  FaUserCircle,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const statusColors = {
  delivered: "border-green-400 bg-green-50 dark:bg-green-900",
  active: "border-blue-400 bg-blue-50 dark:bg-blue-900",
  out: "border-amber-400 bg-yellow-50 dark:bg-yellow-900",
  cancelled: "border-red-400 bg-red-50 dark:bg-red-900",
};
const statusLabels = {
  delivered: "Delivered",
  active: "In Progress",
  out: "Out for Delivery",
  cancelled: "Cancelled",
};
const ordersMock = [
  {
    id: 2451,
    status: "out",
    eta: "30 mins",
    items: 3,
    total: 489,
    date: "2025-07-02",
    address: "221B Baker St, Delhi",
    payment: "UPI - Paid",
    flavors: [
      { name: "Mango Nirvana", size: "500ml", price: 149 },
      { name: "ChocoCrater Volcano", size: "250ml", price: 199 },
      { name: "Kesar Mango Shakti", size: "100ml", price: 141 },
    ],
    timeline: [
      { label: "Order Placed", time: "09:00" },
      { label: "Preparing", time: "09:10" },
      { label: "Out for Delivery", time: "09:30" },
    ],
    deliveryPerson: { name: "Ravi Kumar", contact: "+91-9876543210" },
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
      { name: "Berry Carnival", size: "250ml", price: 199 },
      { name: "Hazelnut Dream", size: "100ml", price: 123 },
    ],
    timeline: [
      { label: "Order Placed", time: "10:00" },
      { label: "Preparing", time: "10:10" },
      { label: "Out for Delivery", time: "10:30" },
      { label: "Delivered", time: "11:00" },
    ],
    deliveryPerson: { name: "Priya Singh", contact: "+91-9123456780" },
  },
];

// --- Filter Toolbar ---
function FilterToolbar({ status, setStatus, search, setSearch }: any) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#18181b] rounded-t-2xl shadow flex flex-wrap items-center gap-4 px-8 py-4 mb-8">
      <h1 className="text-2xl font-bold text-pink-400 flex-1">🧾 My Orders</h1>
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
      <button className="flex items-center gap-2 bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-200 dark:border-zinc-700">
        <FaFileExport /> Export
      </button>
    </div>
  );
}

// --- Order Card ---
function OrderCard({ order, onView, onTrack }: any) {
  const statusColor =
    order.status === "delivered"
      ? statusColors.delivered
      : order.status === "out"
      ? statusColors.out
      : order.status === "active"
      ? statusColors.active
      : statusColors.cancelled;
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center md:items-stretch gap-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg border-l-8 border border-pink-100 dark:border-zinc-800 p-6 mb-4",
        statusColor
      )}
    >
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-lg font-bold text-pink-400">
          <FaBoxOpen /> Order #{order.id}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
          <span>
            Status:{" "}
            <span className="font-semibold text-pink-400">
              {statusLabels[order.status]}
            </span>
          </span>
          {order.status === "out" && (
            <span>
              ETA:{" "}
              <span className="font-semibold text-blue-400">{order.eta}</span>{" "}
              <FaTruck className="inline ml-1" />
            </span>
          )}
          {order.status === "delivered" && <span>{order.eta}</span>}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>🛒 Items: {order.items}</span>
          <span>
            Total: <span className="font-bold">₹{order.total.toFixed(2)}</span>
          </span>
          <span>Date: {new Date(order.date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:justify-center md:items-end">
        <button
          onClick={onView}
          className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-4 py-2 font-bold flex items-center gap-2 shadow"
        >
          <FaReceipt /> View Details
        </button>
        {order.status !== "delivered" && (
          <button
            onClick={onTrack}
            className="bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg px-4 py-2 font-bold flex items-center gap-2 shadow"
          >
            <FaTruck /> Track Order
          </button>
        )}
        {order.status === "delivered" && (
          <button className="bg-green-100 hover:bg-green-200 text-green-900 rounded-lg px-4 py-2 font-bold flex items-center gap-2 shadow">
            <FaRedo /> Reorder
          </button>
        )}
      </div>
    </div>
  );
}

// --- Order Details Modal ---
function OrderDetailsModal({ order, open, onClose }: any) {
  if (!open) return null;
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
          <span className="font-semibold text-pink-400">{order.address}</span>
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
          Delivery Mode:{" "}
          <span className="font-semibold text-blue-400">Scheduled</span> | ETA:{" "}
          <span className="font-semibold text-blue-400">{order.eta}</span>
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
          Payment:{" "}
          <span className="font-semibold text-green-400">{order.payment}</span>
        </div>
        <div className="mb-4">
          <div className="font-bold text-pink-400 mb-2">Flavors:</div>
          <ul className="list-disc pl-6">
            {order.flavors.map((f: any, i: number) => (
              <li key={i} className="mb-1 text-gray-700 dark:text-zinc-200">
                <span className="font-semibold">{f.name}</span> ({f.size}) – ₹
                {f.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <span>
            Subtotal:{" "}
            <span className="font-bold">₹{order.total.toFixed(2)}</span>
          </span>
          <span>
            Taxes: <span className="font-bold">₹0.00</span>
          </span>
          <span>
            Delivery Fee: <span className="font-bold">₹0.00</span>
          </span>
          <span>
            Grand Total:{" "}
            <span className="font-bold text-pink-400">
              ₹{order.total.toFixed(2)}
            </span>
          </span>
        </div>
        <div className="flex gap-2 mt-6">
          <button className="bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <FaFilePdf /> Print Invoice
          </button>
          <button className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <FaRedo /> Reorder
          </button>
          <button className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <FaExclamationTriangle /> Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Track Order Modal ---
function TrackOrderModal({ order, open, onClose }: any) {
  if (!open) return null;
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
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {order.timeline.map((step: any, idx: number) => (
              <React.Fragment key={idx}>
                <div
                  className={cn(
                    "flex flex-col items-center",
                    idx === order.timeline.length - 1 ? "" : "mr-4"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center font-bold",
                      idx === order.timeline.length - 1
                        ? "bg-green-400 text-white"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                    )}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 dark:text-zinc-400">
                    {step.label}
                  </span>
                  <span className="text-xs text-pink-400">{step.time}</span>
                </div>
                {idx !== order.timeline.length - 1 && (
                  <div className="w-8 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
          Delivery Person:{" "}
          <span className="font-semibold text-pink-400">
            {order.deliveryPerson.name}
          </span>{" "}
          |{" "}
          <span className="text-blue-400">{order.deliveryPerson.contact}</span>
        </div>
        <div className="h-32 w-full bg-pink-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mt-4">
          <FaMapMarkerAlt className="text-pink-400 w-10 h-10" />
          <span className="ml-2 text-pink-400 font-bold">Map Preview</span>
        </div>
      </div>
    </div>
  );
}

// --- Empty State ---
function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <FaShoppingCart className="text-6xl text-pink-200 mb-4" />
      <div className="text-lg font-bold text-pink-400 mb-2">
        Looks like you haven’t placed an order yet!
      </div>
      <div className="text-gray-500 dark:text-zinc-400 mb-4">
        Explore flavors and treat yourself 🍨
      </div>
      <button className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-6 py-3 font-bold flex items-center gap-2 shadow">
        Browse Flavors
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
    (o) => o.status === "active" || o.status === "out"
  );
  let pastOrders = ordersMock.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );
  if (status !== "all") {
    activeOrders = activeOrders.filter((o) => o.status === status);
    pastOrders = pastOrders.filter((o) => o.status === status);
  }
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
    <div className="min-h-screen bg-[#FDF6FA] dark:bg-[#18181b] flex flex-col">
      <FilterToolbar
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />
      <div className="flex-1 flex flex-col gap-8 px-8 pb-8">
        {/* Active Orders */}
        {activeOrders.length === 0 && pastOrders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <>
            {activeOrders.length > 0 && (
              <div>
                <div className="text-lg font-bold text-blue-400 mb-4">
                  🟢 Active Orders
                </div>
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={() => setShowDetails(order)}
                    onTrack={() => setShowTrack(order)}
                  />
                ))}
              </div>
            )}
            {/* Past Orders Accordion */}
            <div>
              <button
                className="flex items-center gap-2 text-pink-400 font-bold mb-4 mt-8"
                onClick={() => setShowPast((v) => !v)}
              >
                {showPast ? <FaChevronDown /> : <FaChevronUp />} Past Orders
              </button>
              {showPast && (
                <div>
                  {pastOrders.length === 0 ? (
                    <div className="text-gray-400">No past orders.</div>
                  ) : (
                    pastOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onView={() => setShowDetails(order)}
                        onTrack={() => setShowTrack(order)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <OrderDetailsModal
        order={showDetails}
        open={!!showDetails}
        onClose={() => setShowDetails(null)}
      />
      <TrackOrderModal
        order={showTrack}
        open={!!showTrack}
        onClose={() => setShowTrack(null)}
      />
    </div>
  );
}
