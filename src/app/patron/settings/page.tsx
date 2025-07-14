"use client";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaArrowLeft,
  FaTrash,
  FaExclamationTriangle,
  FaMoon,
  FaSun,
  FaPalette,
  FaFont,
  FaBolt,
  FaCartPlus,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Sidebar Navigation ---
const sections = [
  { key: "account", label: "Account Settings" },
  { key: "communication", label: "Communication Settings" },
  { key: "notifications", label: "Notification Preferences" },
  { key: "privacy", label: "Privacy & Security" },
  { key: "appearance", label: "Appearance (Theme)" },
];

function SidebarNavigation({ active, setActive, collapsed }: any) {
  return (
    <aside className="w-full md:w-64 bg-[#FCE7F3] dark:bg-[#2a202b] rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-pink-100 dark:border-zinc-800 sticky top-4 h-fit max-h-[90vh] overflow-y-auto">
      {sections.map((sec) => (
        <button
          key={sec.key}
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-left transition-all",
            active === sec.key
              ? "bg-white dark:bg-zinc-900 text-pink-400 ring-2 ring-pink-300"
              : "bg-[#FFF1F9] dark:bg-zinc-800 text-pink-400 hover:bg-pink-100 dark:hover:bg-zinc-900"
          )}
          onClick={() => setActive(sec.key)}
        >
          <span>{sec.label}</span>
          {active === sec.key ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      ))}
      <div className="mt-8 pt-4 border-t border-pink-100 dark:border-zinc-800">
        <DangerZoneActions />
      </div>
    </aside>
  );
}

// --- Account Settings ---
function AccountSettings() {
  const [avatar, setAvatar] = useState("/window.svg");
  const [name, setName] = useState("Divyansh");
  const [email, setEmail] = useState("user@eislagger.com");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("en");
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-pink-100 dark:border-zinc-800">
      <div className="flex items-center gap-6">
        <img
          src={avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-pink-200"
        />
        <div>
          <label className="block text-xs text-pink-400 mb-1">
            Profile Picture
          </label>
          <input type="file" className="block text-xs" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs text-pink-400 mb-1">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-pink-400 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-pink-400 mb-1">
            Phone Number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-pink-400 mb-1">
            Preferred Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-pink-400 mb-1">
          Change Password
        </label>
        <input
          type="password"
          placeholder="Old Password"
          className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 mb-2"
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 mb-2"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-xs text-pink-400 mb-1">Address Book</label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
              placeholder="Home Address"
            />
            <button className="bg-pink-100 text-pink-400 px-3 py-2 rounded-lg font-bold">
              Pin
            </button>
            <button className="bg-pink-400 text-white px-3 py-2 rounded-lg font-bold">
              Default
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
              placeholder="Office Address"
            />
            <button className="bg-pink-100 text-pink-400 px-3 py-2 rounded-lg font-bold">
              Pin
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <button className="bg-red-100 text-red-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 w-fit">
          <FaTrash /> Delete Account
        </button>
      </div>
    </div>
  );
}

// --- Communication Settings ---
function CommunicationSettings() {
  const [clerkMsg, setClerkMsg] = useState(true);
  const [promoEmail, setPromoEmail] = useState(true);
  const [contactChannel, setContactChannel] = useState("Email");
  const [orderSMS, setOrderSMS] = useState(true);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-pink-100 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="font-bold text-pink-400">
          Allow Clerk to message me
        </span>
        <input
          type="checkbox"
          checked={clerkMsg}
          onChange={() => setClerkMsg((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-pink-400">
          Receive Promotions via Email
        </span>
        <input
          type="checkbox"
          checked={promoEmail}
          onChange={() => setPromoEmail((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-pink-400">
          Preferred Contact Channel
        </span>
        <select
          value={contactChannel}
          onChange={(e) => setContactChannel(e.target.value)}
          className="rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
        >
          <option>Email</option>
          <option>SMS</option>
          <option>In-app Only</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-pink-400">
          Enable Order SMS Updates
        </span>
        <input
          type="checkbox"
          checked={orderSMS}
          onChange={() => setOrderSMS((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
    </div>
  );
}

// --- Notification Matrix ---
function NotificationMatrix() {
  const [muteAll, setMuteAll] = useState(false);
  const [prefs, setPrefs] = useState({
    email: { order: true, promo: true, app: true },
    sms: { order: true, promo: false, app: false },
    inapp: { order: true, promo: true, app: true },
  });
  function toggle(channel: string, type: string) {
    setPrefs((prev: any) => ({
      ...prev,
      [channel]: { ...prev[channel], [type]: !prev[channel][type] },
    }));
  }
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-pink-100 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-pink-400">Mute All Notifications</span>
        <input
          type="checkbox"
          checked={muteAll}
          onChange={() => setMuteAll((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-pink-400">
            <th className="text-left">Channel</th>
            <th>Order Status</th>
            <th>Promotions</th>
            <th>App Updates</th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: "email", label: "Email" },
            { key: "sms", label: "SMS" },
            { key: "inapp", label: "In-App Popups" },
          ].map((row) => (
            <tr
              key={row.key}
              className="border-t border-pink-100 dark:border-zinc-800"
            >
              <td className="py-2 font-semibold text-pink-400">{row.label}</td>
              <td>
                <input
                  type="checkbox"
                  checked={prefs[row.key].order}
                  onChange={() => toggle(row.key, "order")}
                  className="accent-pink-400 w-5 h-5 rounded"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={prefs[row.key].promo}
                  onChange={() => toggle(row.key, "promo")}
                  className="accent-pink-400 w-5 h-5 rounded"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={prefs[row.key].app}
                  onChange={() => toggle(row.key, "app")}
                  className="accent-pink-400 w-5 h-5 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Privacy & Security ---
function PrivacySettings() {
  const [twoFA, setTwoFA] = useState(false);
  const [shareData, setShareData] = useState(false);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-pink-100 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="font-bold text-pink-400">
          Two-Factor Authentication (2FA)
        </span>
        <input
          type="checkbox"
          checked={twoFA}
          onChange={() => setTwoFA((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-pink-400">Data Sharing Consent</span>
        <input
          type="checkbox"
          checked={shareData}
          onChange={() => setShareData((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
      <div>
        <span className="font-bold text-pink-400">Login History</span>
        <div className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
          <div>2024-06-10 09:01 • 192.168.1.1 • Chrome • Delhi</div>
          <div>2024-06-09 15:22 • 192.168.1.2 • Safari • Mumbai</div>
        </div>
      </div>
      <div>
        <span className="font-bold text-pink-400">Logged-in Devices</span>
        <div className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
          <div>iPhone 14 Pro • Active</div>
          <div>MacBook Pro • Active</div>
        </div>
        <button className="mt-2 text-xs text-pink-400 underline">
          Revoke All Sessions
        </button>
      </div>
      <div>
        <span className="font-bold text-pink-400">Export Personal Data</span>
        <button className="ml-4 px-3 py-1 rounded-lg bg-pink-100 text-pink-400 font-bold">
          Download JSON
        </button>
        <button className="ml-2 px-3 py-1 rounded-lg bg-pink-100 text-pink-400 font-bold">
          Download CSV
        </button>
      </div>
    </div>
  );
}

// --- Appearance ---
function AppearanceSelector() {
  const [theme, setTheme] = useState("auto");
  const [accent, setAccent] = useState("pink");
  const [fontSize, setFontSize] = useState("default");
  const [cardAnim, setCardAnim] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-pink-100 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <span className="font-bold text-pink-400">Theme</span>
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "rounded-lg px-3 py-2 flex items-center gap-2",
            theme === "light"
              ? "bg-pink-400 text-white"
              : "bg-pink-100 text-pink-400"
          )}
        >
          {" "}
          <FaSun /> Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "rounded-lg px-3 py-2 flex items-center gap-2",
            theme === "dark"
              ? "bg-pink-400 text-white"
              : "bg-pink-100 text-pink-400"
          )}
        >
          {" "}
          <FaMoon /> Dark
        </button>
        <button
          onClick={() => setTheme("auto")}
          className={cn(
            "rounded-lg px-3 py-2 flex items-center gap-2",
            theme === "auto"
              ? "bg-pink-400 text-white"
              : "bg-pink-100 text-pink-400"
          )}
        >
          {" "}
          <FaBolt /> Auto
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-pink-400">Accent Color</span>
        <button
          onClick={() => setAccent("pink")}
          className={cn(
            "rounded-full w-8 h-8 border-2",
            accent === "pink"
              ? "border-pink-400 bg-pink-200"
              : "border-pink-200 bg-white"
          )}
        ></button>
        <button
          onClick={() => setAccent("mint")}
          className={cn(
            "rounded-full w-8 h-8 border-2",
            accent === "mint"
              ? "border-green-400 bg-green-200"
              : "border-green-200 bg-white"
          )}
        ></button>
        <button
          onClick={() => setAccent("gold")}
          className={cn(
            "rounded-full w-8 h-8 border-2",
            accent === "gold"
              ? "border-yellow-400 bg-yellow-200"
              : "border-yellow-200 bg-white"
          )}
        ></button>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-pink-400">Font Size</span>
        <button
          onClick={() => setFontSize("default")}
          className={cn(
            "rounded-lg px-3 py-2",
            fontSize === "default"
              ? "bg-pink-400 text-white"
              : "bg-pink-100 text-pink-400"
          )}
        >
          Default
        </button>
        <button
          onClick={() => setFontSize("large")}
          className={cn(
            "rounded-lg px-3 py-2",
            fontSize === "large"
              ? "bg-pink-400 text-white"
              : "bg-pink-100 text-pink-400"
          )}
        >
          Large
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-pink-400">Card Animation</span>
        <input
          type="checkbox"
          checked={cardAnim}
          onChange={() => setCardAnim((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
        <span className="font-bold text-pink-400">Reduced Motion</span>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={() => setReducedMotion((v) => !v)}
          className="accent-pink-400 w-6 h-6 rounded"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-24 h-16 rounded-xl bg-pink-100 border-2 border-pink-400 flex items-center justify-center font-bold text-pink-400">
          Preview
        </div>
        <div className="w-24 h-16 rounded-xl bg-green-100 border-2 border-green-400 flex items-center justify-center font-bold text-green-400">
          Preview
        </div>
        <div className="w-24 h-16 rounded-xl bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-400">
          Preview
        </div>
      </div>
    </div>
  );
}

// --- Danger Zone ---
function DangerZoneActions() {
  return (
    <div className="flex flex-col gap-3">
      <button className="bg-pink-100 text-pink-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
        <FaCartPlus /> Clear Cart
      </button>
      <button className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
        <FaExclamationTriangle /> Reset Settings
      </button>
      <button className="bg-red-100 text-red-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
        <FaTrash /> Delete Account
      </button>
    </div>
  );
}

// --- Main Settings Page ---
export default function SettingsPage() {
  const [active, setActive] = useState("account");
  return (
    <div className="min-h-screen bg-[#FDF6FA] dark:bg-[#18181b] flex flex-col">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-[#18181b] shadow rounded-t-2xl mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-pink-400 cursor-pointer">
            🍦 EisLager
          </span>
        </div>
        <button className="flex items-center gap-2 text-pink-400 font-semibold">
          <FaArrowLeft /> Back to Dashboard
        </button>
      </header>
      <div className="flex-1 flex flex-row gap-8 px-8 pb-8">
        <SidebarNavigation active={active} setActive={setActive} />
        <main className="flex-1 min-w-0">
          {active === "account" && <AccountSettings />}
          {active === "communication" && <CommunicationSettings />}
          {active === "notifications" && <NotificationMatrix />}
          {active === "privacy" && <PrivacySettings />}
          {active === "appearance" && <AppearanceSelector />}
        </main>
      </div>
    </div>
  );
}
