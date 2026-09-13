import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Receipt, Users,
  Plus, X, AlertTriangle, ArrowRight, TrendingUp, Boxes,
  RotateCcw, Trash2, ChevronRight, Search, Mail, Lock, Eye, EyeOff,
  LogIn, LogOut, Bell, ChevronDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

/* ----------------------------- Seed data ----------------------------- */

const CUSTOMERS = ["Acme Logistics", "Brightline Retail", "Cedar and Co", "Delta Manufacturing", "Evergreen Supplies"];
const SUPPLIERS = ["NorthPoint Distributors", "Pacific Components", "Summit Wholesale", "Granite Supply Co"];
const DEPARTMENTS = ["Sales", "Operations", "Purchasing", "Finance", "Management"];
const CHART_COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#38bdf8"];

const seedProducts = () => ([
  { id: "p1", sku: "SKU-1001", name: "Wireless Mouse", category: "Electronics", qty: 142, reorderPoint: 30, unitCost: 8.5, unitPrice: 19.99 },
  { id: "p2", sku: "SKU-1002", name: "Mechanical Keyboard", category: "Electronics", qty: 18, reorderPoint: 25, unitCost: 22, unitPrice: 49.99 },
  { id: "p3", sku: "SKU-1003", name: "USB-C Hub", category: "Electronics", qty: 64, reorderPoint: 20, unitCost: 11, unitPrice: 24.99 },
  { id: "p4", sku: "SKU-1004", name: "Office Chair", category: "Furniture", qty: 9, reorderPoint: 10, unitCost: 65, unitPrice: 149.99 },
  { id: "p5", sku: "SKU-1005", name: "Standing Desk", category: "Furniture", qty: 27, reorderPoint: 15, unitCost: 120, unitPrice: 299.99 },
  { id: "p6", sku: "SKU-1006", name: "Notebook Pack (12)", category: "Office Supplies", qty: 230, reorderPoint: 50, unitCost: 3.2, unitPrice: 7.99 },
  { id: "p7", sku: "SKU-1007", name: "Whiteboard Markers", category: "Office Supplies", qty: 0, reorderPoint: 40, unitCost: 1.1, unitPrice: 3.49 },
  { id: "p8", sku: "SKU-1008", name: "LED Desk Lamp", category: "Electronics", qty: 55, reorderPoint: 20, unitCost: 9.8, unitPrice: 22.99 },
]);

const seedSalesOrders = () => ([
  { id: "so1", orderNo: "SO-2001", customer: "Acme Logistics", date: "2026-06-18", status: "Draft", items: [{ productId: "p1", qty: 10 }, { productId: "p3", qty: 5 }] },
  { id: "so2", orderNo: "SO-2002", customer: "Brightline Retail", date: "2026-06-15", status: "Confirmed", items: [{ productId: "p5", qty: 2 }] },
  { id: "so3", orderNo: "SO-2003", customer: "Cedar and Co", date: "2026-06-10", status: "Shipped", items: [{ productId: "p6", qty: 20 }] },
  { id: "so4", orderNo: "SO-2004", customer: "Delta Manufacturing", date: "2026-06-05", status: "Invoiced", items: [{ productId: "p4", qty: 3 }] },
  { id: "so5", orderNo: "SO-2005", customer: "Evergreen Supplies", date: "2026-05-28", status: "Invoiced", items: [{ productId: "p1", qty: 14 }, { productId: "p8", qty: 6 }] },
  { id: "so6", orderNo: "SO-2006", customer: "Acme Logistics", date: "2026-05-20", status: "Cancelled", items: [{ productId: "p2", qty: 4 }] },
]);

const seedPurchaseOrders = () => ([
  { id: "po1", poNo: "PO-3001", supplier: "NorthPoint Distributors", date: "2026-06-17", status: "Draft", items: [{ productId: "p2", qty: 50 }] },
  { id: "po2", poNo: "PO-3002", supplier: "Pacific Components", date: "2026-06-12", status: "Sent", items: [{ productId: "p7", qty: 100 }] },
  { id: "po3", poNo: "PO-3003", supplier: "Summit Wholesale", date: "2026-06-01", status: "Received", items: [{ productId: "p8", qty: 30 }] },
]);

const seedInvoices = () => ([
  { id: "inv1", invoiceNo: "INV-4001", salesOrderId: "so4", customer: "Delta Manufacturing", amount: 449.97, issueDate: "2026-06-06", dueDate: "2026-06-21", status: "Unpaid" },
  { id: "inv2", invoiceNo: "INV-4002", salesOrderId: null, customer: "Evergreen Supplies", amount: 875.5, issueDate: "2026-05-10", dueDate: "2026-05-25", status: "Paid" },
  { id: "inv3", invoiceNo: "INV-4003", salesOrderId: null, customer: "Brightline Retail", amount: 320, issueDate: "2026-05-20", dueDate: "2026-06-04", status: "Unpaid" },
]);

const seedEmployees = () => ([
  { id: "e1", name: "Maria Chen", role: "Sales Manager", department: "Sales", hireDate: "2022-03-14", status: "Active" },
  { id: "e2", name: "James Okafor", role: "Warehouse Lead", department: "Operations", hireDate: "2021-07-01", status: "Active" },
  { id: "e3", name: "Priya Nair", role: "Procurement Specialist", department: "Purchasing", hireDate: "2023-01-09", status: "Active" },
  { id: "e4", name: "Tom Becker", role: "Accountant", department: "Finance", hireDate: "2020-11-20", status: "Active" },
  { id: "e5", name: "Sara Lindqvist", role: "Operations Director", department: "Management", hireDate: "2019-05-05", status: "On Leave" },
  { id: "e6", name: "Diego Ramirez", role: "Customer Support", department: "Sales", hireDate: "2024-02-18", status: "Active" },
]);

const REVENUE_TREND = [
  { month: "Jan", revenue: 18200 },
  { month: "Feb", revenue: 21400 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 24600 },
  { month: "May", revenue: 27300 },
  { month: "Jun", revenue: 31100 },
];

/* ----------------------------- Helpers ----------------------------- */

const USD_TO_INR_RATE = 83.25;
const fmtRupees = (n) => `₹${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtMoney = (n) => fmtRupees(Number(n) * USD_TO_INR_RATE);
const convertUsdToInr = (usd, rate = USD_TO_INR_RATE) => Number(usd) * rate;
const fmtShortMoney = (n) => `₹${(Number(n) * USD_TO_INR_RATE / 1000).toFixed(0)}k`;
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const newId = (p) => `${p}${Date.now()}${Math.floor(Math.random() * 1000)}`;
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (dateStr, n) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const lineTotal = (items, products, priceField) =>
  items.reduce((sum, it) => {
    const p = products.find((x) => x.id === it.productId);
    return sum + (p ? p[priceField] * it.qty : 0);
  }, 0);

const stockStatus = (p) => {
  if (p.qty === 0) return { label: "Out of Stock", tone: "rose" };
  if (p.qty <= p.reorderPoint) return { label: "Low Stock", tone: "amber" };
  return { label: "In Stock", tone: "emerald" };
};

const getCategoryBreakdown = (products) => {
  const map: Record<string, number> = {};
  products.forEach((p) => { map[p.category] = (map[p.category] || 0) + p.qty * p.unitPrice; });
  return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) }));
};

const getOrderStatusBreakdown = (salesOrders) => {
  const map: Record<string, number> = {};
  salesOrders.forEach((o) => { map[o.status] = (map[o.status] || 0) + 1; });
  return Object.entries(map).map(([name, count]) => ({ name, count }));
};

const getTopProducts = (salesOrders, products) => {
  const map: Record<string, number> = {};
  salesOrders.forEach((o) => {
    o.items.forEach((it) => { map[it.productId] = (map[it.productId] || 0) + it.qty; });
  });
  return Object.entries(map)
    .map(([id, qty]) => ({ name: products.find((p) => p.id === id)?.name || id, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);
};

/* Single source of truth for tone colors — neon-on-dark variants */
const TONE_CLASSES = {
  emerald: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  rose: "bg-rose-500/10 text-rose-400 ring-rose-500/30",
  indigo: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/30",
  slate: "bg-slate-500/10 text-slate-400 ring-slate-500/30",
  sky: "bg-sky-500/10 text-sky-400 ring-sky-500/30",
};

const STATUS_TONE = {
  Draft: "slate", Confirmed: "sky", Sent: "sky", Shipped: "indigo",
  Received: "emerald", Invoiced: "indigo", Paid: "emerald", Unpaid: "amber",
  Overdue: "rose", Cancelled: "rose", Active: "emerald", "On Leave": "amber",
};

function StatusPill({ label }) {
  const tone = STATUS_TONE[label] || "slate";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}>
      {label}
    </span>
  );
}

function CurrencyConverter() {
  const [usd, setUsd] = useState("1.00");
  const parsedUsd = Number(usd) || 0;
  const inrValue = useMemo(() => convertUsdToInr(parsedUsd), [parsedUsd]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-100">USD to INR</p>
          <p className="text-xs text-slate-500 mt-1">Convert U.S. dollar amounts to Indian rupees at ₹{USD_TO_INR_RATE.toFixed(2)} per USD.</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full ring-1 ring-emerald-500/30">
          Static rate
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-xs text-slate-400">USD amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={usd}
            onChange={(e) => setUsd(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </label>
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-xs text-slate-400">INR value</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{fmtRupees(inrValue)}</p>
        </div>
      </div>
    </div>
  );
}

function invoiceDisplayStatus(inv) {
  if (inv.status === "Unpaid" && inv.dueDate < today()) return "Overdue";
  return inv.status;
}

/* ----------------------------- Login page ----------------------------- */

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email.trim());
    }, 550);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const fillDemo = () => {
    setEmail("admin@nucleuserp.com");
    setPassword("demo1234");
    setError("");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center px-4 py-10">
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-72 h-72 bg-violet-500/25 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-fuchsia-500/15 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 items-center justify-center ring-1 ring-white/20 mb-3 shadow-lg shadow-cyan-500/30">
            <span className="text-2xl font-bold text-white font-mono">N</span>
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Nucleus ERP</h1>
          <p className="text-cyan-200/70 text-sm mt-1">Sign in to manage your business</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl ring-1 ring-cyan-500/15 p-6 shadow-2xl">
          {error && (
            <div className="mb-4 text-xs font-medium text-rose-100 bg-rose-500/20 ring-1 ring-rose-400/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="block text-xs font-medium text-cyan-100/80 mb-1.5">Email</span>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/50" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="you@company.com" autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/5 text-white placeholder-slate-400/50 rounded-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </label>

          <label className="block mb-2">
            <span className="block text-xs font-medium text-cyan-100/80 mb-1.5">Password</span>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/50" />
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="••••••••" autoComplete="current-password"
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-white/5 text-white placeholder-slate-400/50 rounded-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200/50 hover:text-cyan-100">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between mb-5 mt-3">
            <label className="flex items-center gap-1.5 text-xs text-cyan-100/70">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <button type="button" className="text-xs text-cyan-200/70 hover:text-white">Forgot password?</button>
          </div>

          <button
            type="button" onClick={handleSubmit} disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white text-sm font-medium py-2.5 rounded-lg shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? "Signing in..." : <>Sign in <LogIn size={15} /></>}
          </button>

          <button type="button" onClick={fillDemo} className="w-full mt-3 text-xs font-medium text-cyan-200/70 hover:text-white py-1.5">
            Use demo credentials
          </button>
        </div>

        <p className="text-center text-cyan-300/40 text-xs mt-6">Demo build — any email &amp; password will sign you in.</p>
      </div>
    </div>
  );
}

/* ----------------------------- Small UI bits ----------------------------- */

function KPICard({ icon: Icon, label, value, sub, tone = "indigo" }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-slate-100 font-mono tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${TONE_CLASSES[tone]} ring-1 ring-inset`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({ onClick, children, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium px-3.5 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-3 py-2 text-sm border border-slate-800 bg-slate-800/60 text-slate-100 placeholder-slate-500 rounded-lg w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50"
      />
    </div>
  );
}

function ModalShell({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4">
      <div className={`bg-slate-900 rounded-xl shadow-2xl ring-1 ring-slate-800 w-full ${wide ? "max-w-2xl" : "max-w-md"} my-8`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3.5">
      <span className="block text-xs font-medium text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full text-sm border border-slate-800 bg-slate-800/60 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50";
const tooltipStyle = { fontSize: 12, borderRadius: 10, border: "1px solid #1e293b", background: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.5)" };
const tooltipItemStyle = { color: "#e2e8f0" };
const tooltipLabelStyle = { color: "#94a3b8", marginBottom: 4 };
const axisTick = { fontSize: 11, fill: "#94a3b8" };
const gridStroke = "#1e293b";

/* ----------------------------- Navigation ----------------------------- */

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "sales", label: "Sales", icon: ShoppingCart },
  { key: "purchasing", label: "Purchasing", icon: Truck },
  { key: "invoicing", label: "Invoicing", icon: Receipt },
  { key: "hr", label: "HR", icon: Users },
];

const NAV_TITLES = {
  dashboard: "Dashboard", inventory: "Inventory", sales: "Sales Orders",
  purchasing: "Purchase Orders", invoicing: "Invoicing", hr: "HR",
};

function Sidebar({ active, setActive, onReset }) {
  return (
    <div className="hidden md:flex md:flex-col w-56 fixed left-0 top-0 bottom-0 z-20 bg-slate-950 text-slate-300 border-r border-slate-800">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-slate-800">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm font-mono">N</div>
        <span className="text-white font-semibold tracking-tight">Nucleus ERP</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = active === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setActive(n.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors border-l-2 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/5 text-cyan-300 border-cyan-400"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 border-transparent"
              }`}
            >
              <Icon size={16} />
              {n.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={onReset}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-colors"
        >
          <RotateCcw size={14} />
          Reset demo data
        </button>
      </div>
    </div>
  );
}

function MobileNav({ active, setActive }) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950 border-t border-slate-800 flex z-40">
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = active === n.key;
        return (
          <button
            key={n.key}
            onClick={() => setActive(n.key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium ${
              isActive ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            <Icon size={18} />
            {n.label}
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ title, userEmail, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs font-mono">N</div>
        <span className="font-semibold text-slate-100 text-sm">{title}</span>
      </div>
      <h2 className="hidden md:block font-semibold text-slate-100 text-sm">{title}</h2>
      <div className="flex items-center gap-3">
        <button className="text-slate-500 hover:text-cyan-400 relative">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-fuchsia-400 rounded-full" />
        </button>
        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30 flex items-center justify-center text-xs font-semibold">
              {userEmail?.[0]?.toUpperCase() || "A"}
            </div>
            <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-2xl ring-1 ring-slate-800 py-1 text-sm z-20">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-slate-200 font-medium truncate text-xs">{userEmail}</p>
                </div>
                <button onClick={onLogout} className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Dashboard ----------------------------- */

function Dashboard({ products, salesOrders, purchaseOrders, invoices, employees, setActive, userEmail }) {
  const stats = useMemo(() => {
    const openOrders = salesOrders.filter((o) => o.status !== "Invoiced" && o.status !== "Cancelled");
    const openOrderValue = openOrders.reduce((s, o) => s + lineTotal(o.items, products, "unitPrice"), 0);
    const unpaidInvoices = invoices.filter((i) => i.status === "Unpaid");
    const unpaidValue = unpaidInvoices.reduce((s, i) => s + i.amount, 0);
    const lowStock = products.filter((p) => p.qty <= p.reorderPoint);
    const activeEmployees = employees.filter((e) => e.status === "Active");
    const pendingPOs = purchaseOrders.filter((p) => p.status !== "Received" && p.status !== "Cancelled");
    return { openOrders, openOrderValue, unpaidInvoices, unpaidValue, lowStock, activeEmployees, pendingPOs };
  }, [products, salesOrders, purchaseOrders, invoices, employees]);

  const categoryData = useMemo(() => getCategoryBreakdown(products), [products]);
  const statusData = useMemo(() => getOrderStatusBreakdown(salesOrders), [salesOrders]);
  const topProducts = useMemo(() => getTopProducts(salesOrders, products), [salesOrders, products]);
  const recentOrders = [...salesOrders].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = userEmail ? userEmail.split("@")[0] : "Admin";

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 p-5 sm:p-6 mb-6 text-white shadow-lg shadow-cyan-950/40 relative overflow-hidden">
        <div className="absolute -right-6 -top-10 w-36 h-36 bg-white/10 rounded-full" />
        <div className="absolute right-16 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />
        <p className="text-xs uppercase tracking-wide text-cyan-50/80 font-medium relative">{greeting}</p>
        <h1 className="text-xl sm:text-2xl font-semibold mt-1 relative capitalize">Welcome back, {firstName} 👋</h1>
        <p className="text-cyan-50/80 text-sm mt-1 relative">Here's what's happening across your business today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard icon={ShoppingCart} label="Open Orders" value={stats.openOrders.length} sub={fmtMoney(stats.openOrderValue) + " in value"} tone="indigo" />
        <KPICard icon={AlertTriangle} label="Low Stock SKUs" value={stats.lowStock.length} sub="At or below reorder point" tone="amber" />
        <KPICard icon={Receipt} label="Unpaid Invoices" value={stats.unpaidInvoices.length} sub={fmtMoney(stats.unpaidValue) + " outstanding"} tone="rose" />
        <KPICard icon={Users} label="Active Staff" value={stats.activeEmployees.length} sub={`of ${employees.length} total`} tone="emerald" />
      </div>

      {/* Charts row 1: revenue trend + category pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-sm font-semibold text-slate-100">Revenue trend</p>
              <p className="text-xs text-slate-500">Last 6 months</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full ring-1 ring-emerald-500/30">
              <TrendingUp size={12} /> +18.4%
            </span>
          </div>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={fmtShortMoney} />
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 p-5">
          <p className="text-sm font-semibold text-slate-100">Inventory value</p>
          <p className="text-xs text-slate-500 mb-1">By category</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={3} strokeWidth={0}>
                  {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-1">
            {categoryData.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2: order status + top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 p-5">
          <p className="text-sm font-semibold text-slate-100">Orders by status</p>
          <p className="text-xs text-slate-500 mb-1">All sales orders</p>
          <div className="h-44 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={{ ...axisTick }} axisLine={false} tickLine={false} interval={0} angle={-10} textAnchor="end" height={30} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 p-5">
          <p className="text-sm font-semibold text-slate-100">Top moving products</p>
          <p className="text-xs text-slate-500 mb-1">By units ordered</p>
          <div className="h-44 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 16, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={96} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="qty" fill="#a78bfa" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg shadow-black/20 mb-6">
        <CurrencyConverter />
      </div>

      {/* Pipeline */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg shadow-black/20 mb-6">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">Procure-to-cash pipeline</p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {[
            { label: "Purchasing", value: stats.pendingPOs.length, unit: "POs in progress", icon: Truck, key: "purchasing" },
            { label: "Inventory", value: products.reduce((s, p) => s + p.qty, 0), unit: "units on hand", icon: Boxes, key: "inventory" },
            { label: "Sales", value: stats.openOrders.length, unit: "orders open", icon: ShoppingCart, key: "sales" },
            { label: "Invoicing", value: stats.unpaidInvoices.length, unit: "awaiting payment", icon: Receipt, key: "invoicing" },
          ].map((stage, idx, arr) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.key}>
                <button
                  onClick={() => setActive(stage.key)}
                  className="flex-1 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors rounded-lg p-3.5 border border-slate-800"
                >
                  <Icon size={16} className="text-cyan-400 mb-2" />
                  <p className="text-lg font-semibold text-slate-100 font-mono leading-none">{stage.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stage.unit}</p>
                  <p className="text-xs font-medium text-slate-300 mt-2">{stage.label}</p>
                </button>
                {idx < arr.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center text-slate-700 shrink-0">
                    <ArrowRight size={16} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <p className="font-medium text-sm text-slate-100">Recent sales orders</p>
            <button onClick={() => setActive("sales")} className="text-xs text-cyan-400 font-medium flex items-center gap-0.5 hover:text-cyan-300 hover:underline">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {recentOrders.map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-mono text-xs text-slate-500">{o.orderNo}</p>
                  <p className="text-slate-200">{o.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-slate-200">{fmtMoney(lineTotal(o.items, products, "unitPrice"))}</p>
                  <StatusPill label={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <p className="font-medium text-sm text-slate-100">Stock attention needed</p>
            <button onClick={() => setActive("inventory")} className="text-xs text-cyan-400 font-medium flex items-center gap-0.5 hover:text-cyan-300 hover:underline">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {stats.lowStock.length === 0 && <p className="px-5 py-6 text-sm text-slate-500">Everything is well stocked.</p>}
            {stats.lowStock.map((p) => {
              const s = stockStatus(p);
              return (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-mono text-xs text-slate-500">{p.sku}</p>
                    <p className="text-slate-200">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-slate-200">{p.qty} on hand</p>
                    <StatusPill label={s.label} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Inventory ----------------------------- */

function AddProductModal({ onClose, onSave }) {
  const [form, setForm] = useState({ sku: "", name: "", category: "Electronics", qty: 0, reorderPoint: 10, unitCost: 0, unitPrice: 0 });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.sku.trim() && form.name.trim();
  return (
    <ModalShell title="Add product" onClose={onClose}>
      <Field label="SKU"><input className={inputCls} value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="SKU-1009" /></Field>
      <Field label="Name"><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Product name" /></Field>
      <Field label="Category">
        <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {["Electronics", "Furniture", "Office Supplies"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Qty on hand"><input type="number" className={inputCls} value={form.qty} onChange={(e) => set("qty", Number(e.target.value))} /></Field>
        <Field label="Reorder point"><input type="number" className={inputCls} value={form.reorderPoint} onChange={(e) => set("reorderPoint", Number(e.target.value))} /></Field>
        <Field label="Unit cost"><input type="number" step="0.01" className={inputCls} value={form.unitCost} onChange={(e) => set("unitCost", Number(e.target.value))} /></Field>
        <Field label="Unit price"><input type="number" step="0.01" className={inputCls} value={form.unitPrice} onChange={(e) => set("unitPrice", Number(e.target.value))} /></Field>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} className="px-3.5 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-lg">Cancel</button>
        <button
          disabled={!valid}
          onClick={() => onSave({ id: newId("p"), ...form })}
          className="px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg disabled:opacity-40 hover:from-cyan-400 hover:to-blue-500"
        >
          Add product
        </button>
      </div>
    </ModalShell>
  );
}

function InventoryView({ products, setProducts }) {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = products.filter((p) => (p.name + p.sku + p.category).toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <SectionHeader
        title="Inventory"
        subtitle={`${products.length} SKUs tracked`}
        action={
          <div className="flex items-center gap-2">
            <SearchBox value={query} onChange={setQuery} placeholder="Search products" />
            <PrimaryButton icon={Plus} onClick={() => setShowAdd(true)}>Add product</PrimaryButton>
          </div>
        }
      />
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-800">
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">On hand</th>
              <th className="px-5 py-3 font-medium">Unit price</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((p) => {
              const s = stockStatus(p);
              return (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{p.sku}</td>
                  <td className="px-5 py-3 text-slate-200 whitespace-nowrap">{p.name}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{p.category}</td>
                  <td className="px-5 py-3 font-mono text-slate-200 whitespace-nowrap">{p.qty}</td>
                  <td className="px-5 py-3 font-mono text-slate-200 whitespace-nowrap">{fmtMoney(p.unitPrice)}</td>
                  <td className="px-5 py-3 whitespace-nowrap"><StatusPill label={s.label} /></td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No products match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onSave={(p) => { setProducts((prev) => [p, ...prev]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

/* ----------------------------- Line item editor (shared by SO / PO) ----------------------------- */

function LineItemsEditor({ items, setItems, products, priceField }) {
  const updateLine = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };
  const removeLine = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const addLine = () => setItems((prev) => [...prev, { productId: products[0]?.id, qty: 1 }]);
  const total = lineTotal(items, products, priceField);

  return (
    <div>
      <span className="block text-xs font-medium text-slate-400 mb-1.5">Line items</span>
      <div className="space-y-2">
        {items.map((it, idx) => {
          const p = products.find((x) => x.id === it.productId);
          return (
            <div key={idx} className="flex items-center gap-2">
              <select className={inputCls + " flex-1"} value={it.productId} onChange={(e) => updateLine(idx, "productId", e.target.value)}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input
                type="number" min={1} className={inputCls + " w-20"} value={it.qty}
                onChange={(e) => updateLine(idx, "qty", Math.max(1, Number(e.target.value)))}
              />
              <span className="font-mono text-xs text-slate-500 w-20 text-right shrink-0">{p ? fmtMoney(p[priceField] * it.qty) : ""}</span>
              <button onClick={() => removeLine(idx)} className="text-slate-600 hover:text-rose-400 shrink-0"><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>
      <button onClick={addLine} className="mt-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1">
        <Plus size={13} /> Add line
      </button>
      <div className="flex justify-end mt-3 pt-3 border-t border-slate-800">
        <p className="text-sm font-semibold text-slate-100">Total: <span className="font-mono">{fmtMoney(total)}</span></p>
      </div>
    </div>
  );
}

/* ----------------------------- Sales ----------------------------- */

function AddSalesOrderModal({ onClose, onSave, products }) {
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [items, setItems] = useState([{ productId: products[0]?.id, qty: 1 }]);
  return (
    <ModalShell title="New sales order" onClose={onClose} wide>
      <Field label="Customer">
        <select className={inputCls} value={customer} onChange={(e) => setCustomer(e.target.value)}>
          {CUSTOMERS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <LineItemsEditor items={items} setItems={setItems} products={products} priceField="unitPrice" />
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-3.5 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-lg">Cancel</button>
        <button
          onClick={() => onSave({ id: newId("so"), orderNo: `SO-${Math.floor(2000 + Math.random() * 8999)}`, customer, date: today(), status: "Draft", items })}
          className="px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500"
        >
          Create order
        </button>
      </div>
    </ModalShell>
  );
}

function nextSOStatus(status) {
  return { Draft: "Confirmed", Confirmed: "Shipped", Shipped: "Invoiced" }[status] || null;
}

function SalesView({ salesOrders, setSalesOrders, products, setProducts, setInvoices }) {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = salesOrders.filter((o) => (o.orderNo + o.customer).toLowerCase().includes(query.toLowerCase()));

  const advance = (order) => {
    const next = nextSOStatus(order.status);
    if (!next) return;

    if (next === "Shipped") {
      setProducts((prev) => prev.map((p) => {
        const line = order.items.find((it) => it.productId === p.id);
        return line ? { ...p, qty: Math.max(0, p.qty - line.qty) } : p;
      }));
    }
    if (next === "Invoiced") {
      const amount = lineTotal(order.items, products, "unitPrice");
      setInvoices((prev) => [
        { id: newId("inv"), invoiceNo: `INV-${Math.floor(4000 + Math.random() * 8999)}`, salesOrderId: order.id, customer: order.customer, amount, issueDate: today(), dueDate: addDays(today(), 14), status: "Unpaid" },
        ...prev,
      ]);
    }
    setSalesOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
  };

  const cancel = (order) => setSalesOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "Cancelled" } : o)));

  const actionLabel = { Draft: "Confirm", Confirmed: "Mark shipped", Shipped: "Generate invoice" };

  return (
    <div>
      <SectionHeader
        title="Sales Orders"
        subtitle="Confirm, ship, and invoice — inventory updates automatically"
        action={
          <div className="flex items-center gap-2">
            <SearchBox value={query} onChange={setQuery} placeholder="Search orders" />
            <PrimaryButton icon={Plus} onClick={() => setShowAdd(true)}>New order</PrimaryButton>
          </div>
        }
      />
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-800">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/40">
                <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{o.orderNo}</td>
                <td className="px-5 py-3 text-slate-200 whitespace-nowrap">{o.customer}</td>
                <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{fmtDate(o.date)}</td>
                <td className="px-5 py-3 font-mono text-slate-200 whitespace-nowrap">{fmtMoney(lineTotal(o.items, products, "unitPrice"))}</td>
                <td className="px-5 py-3 whitespace-nowrap"><StatusPill label={o.status} /></td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  {actionLabel[o.status] && (
                    <div className="flex justify-end gap-2">
                      {o.status === "Draft" && (
                        <button onClick={() => cancel(o)} className="text-xs font-medium text-slate-500 hover:text-rose-400">Cancel</button>
                      )}
                      <button onClick={() => advance(o)} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline">{actionLabel[o.status]}</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No orders match your search.</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <AddSalesOrderModal
          products={products}
          onClose={() => setShowAdd(false)}
          onSave={(o) => { setSalesOrders((prev) => [o, ...prev]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

/* ----------------------------- Purchasing ----------------------------- */

function AddPOModal({ onClose, onSave, products }) {
  const [supplier, setSupplier] = useState(SUPPLIERS[0]);
  const [items, setItems] = useState([{ productId: products[0]?.id, qty: 1 }]);
  return (
    <ModalShell title="New purchase order" onClose={onClose} wide>
      <Field label="Supplier">
        <select className={inputCls} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
          {SUPPLIERS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <LineItemsEditor items={items} setItems={setItems} products={products} priceField="unitCost" />
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-3.5 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-lg">Cancel</button>
        <button
          onClick={() => onSave({ id: newId("po"), poNo: `PO-${Math.floor(3000 + Math.random() * 8999)}`, supplier, date: today(), status: "Draft", items })}
          className="px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500"
        >
          Create PO
        </button>
      </div>
    </ModalShell>
  );
}

function nextPOStatus(status) {
  return { Draft: "Sent", Sent: "Received" }[status] || null;
}

function PurchasingView({ purchaseOrders, setPurchaseOrders, products, setProducts }) {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = purchaseOrders.filter((o) => (o.poNo + o.supplier).toLowerCase().includes(query.toLowerCase()));

  const advance = (order) => {
    const next = nextPOStatus(order.status);
    if (!next) return;
    if (next === "Received") {
      setProducts((prev) => prev.map((p) => {
        const line = order.items.find((it) => it.productId === p.id);
        return line ? { ...p, qty: p.qty + line.qty } : p;
      }));
    }
    setPurchaseOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
  };
  const cancel = (order) => setPurchaseOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "Cancelled" } : o)));
  const actionLabel = { Draft: "Send to supplier", Sent: "Mark received" };

  return (
    <div>
      <SectionHeader
        title="Purchase Orders"
        subtitle="Receiving a PO restocks inventory automatically"
        action={
          <div className="flex items-center gap-2">
            <SearchBox value={query} onChange={setQuery} placeholder="Search POs" />
            <PrimaryButton icon={Plus} onClick={() => setShowAdd(true)}>New PO</PrimaryButton>
          </div>
        }
      />
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-800">
              <th className="px-5 py-3 font-medium">PO</th>
              <th className="px-5 py-3 font-medium">Supplier</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/40">
                <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{o.poNo}</td>
                <td className="px-5 py-3 text-slate-200 whitespace-nowrap">{o.supplier}</td>
                <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{fmtDate(o.date)}</td>
                <td className="px-5 py-3 font-mono text-slate-200 whitespace-nowrap">{fmtMoney(lineTotal(o.items, products, "unitCost"))}</td>
                <td className="px-5 py-3 whitespace-nowrap"><StatusPill label={o.status} /></td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  {actionLabel[o.status] && (
                    <div className="flex justify-end gap-2">
                      {o.status === "Draft" && (
                        <button onClick={() => cancel(o)} className="text-xs font-medium text-slate-500 hover:text-rose-400">Cancel</button>
                      )}
                      <button onClick={() => advance(o)} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline">{actionLabel[o.status]}</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No purchase orders match your search.</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <AddPOModal
          products={products}
          onClose={() => setShowAdd(false)}
          onSave={(o) => { setPurchaseOrders((prev) => [o, ...prev]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

/* ----------------------------- Invoicing ----------------------------- */

function InvoicingView({ invoices, setInvoices }) {
  const [query, setQuery] = useState("");
  const filtered = invoices.filter((i) => (i.invoiceNo + i.customer).toLowerCase().includes(query.toLowerCase()));
  const markPaid = (inv) => setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, status: "Paid" } : i)));
  const totalOutstanding = invoices.filter((i) => i.status === "Unpaid").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <SectionHeader
        title="Invoicing"
        subtitle={`${fmtMoney(totalOutstanding)} outstanding across ${invoices.filter((i) => i.status === "Unpaid").length} invoices`}
        action={<SearchBox value={query} onChange={setQuery} placeholder="Search invoices" />}
      />
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-800">
              <th className="px-5 py-3 font-medium">Invoice</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Issued</th>
              <th className="px-5 py-3 font-medium">Due</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((i) => {
              const display = invoiceDisplayStatus(i);
              return (
                <tr key={i.id} className="hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{i.invoiceNo}</td>
                  <td className="px-5 py-3 text-slate-200 whitespace-nowrap">{i.customer}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{fmtDate(i.issueDate)}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{fmtDate(i.dueDate)}</td>
                  <td className="px-5 py-3 font-mono text-slate-200 whitespace-nowrap">{fmtMoney(i.amount)}</td>
                  <td className="px-5 py-3 whitespace-nowrap"><StatusPill label={display} /></td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    {i.status === "Unpaid" && (
                      <button onClick={() => markPaid(i)} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline">Mark paid</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-500">No invoices match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------- HR ----------------------------- */

function AddEmployeeModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", role: "", department: DEPARTMENTS[0], hireDate: today(), status: "Active" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.role.trim();
  return (
    <ModalShell title="Add employee" onClose={onClose}>
      <Field label="Full name"><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jordan Lee" /></Field>
      <Field label="Role"><input className={inputCls} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Sales Associate" /></Field>
      <Field label="Department">
        <select className={inputCls} value={form.department} onChange={(e) => set("department", e.target.value)}>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Hire date"><input type="date" className={inputCls} value={form.hireDate} onChange={(e) => set("hireDate", e.target.value)} /></Field>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} className="px-3.5 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-lg">Cancel</button>
        <button
          disabled={!valid}
          onClick={() => onSave({ id: newId("e"), ...form })}
          className="px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg disabled:opacity-40 hover:from-cyan-400 hover:to-blue-500"
        >
          Add employee
        </button>
      </div>
    </ModalShell>
  );
}

function HRView({ employees, setEmployees }) {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = employees.filter((e) => (e.name + e.role + e.department).toLowerCase().includes(query.toLowerCase()));
  const toggleStatus = (emp) => setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: e.status === "Active" ? "On Leave" : "Active" } : e)));

  return (
    <div>
      <SectionHeader
        title="HR"
        subtitle={`${employees.length} employees`}
        action={
          <div className="flex items-center gap-2">
            <SearchBox value={query} onChange={setQuery} placeholder="Search staff" />
            <PrimaryButton icon={Plus} onClick={() => setShowAdd(true)}>Add employee</PrimaryButton>
          </div>
        }
      />
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-800">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Hired</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40">
                <td className="px-5 py-3 text-slate-200 whitespace-nowrap">{e.name}</td>
                <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{e.role}</td>
                <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{e.department}</td>
                <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{fmtDate(e.hireDate)}</td>
                <td className="px-5 py-3 whitespace-nowrap"><StatusPill label={e.status} /></td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button onClick={() => toggleStatus(e)} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
                    {e.status === "Active" ? "Set on leave" : "Set active"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No employees match your search.</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onSave={(e) => { setEmployees((prev) => [e, ...prev]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

/* ----------------------------- App shell ----------------------------- */

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [products, setProducts] = useState(seedProducts);
  const [salesOrders, setSalesOrders] = useState(seedSalesOrders);
  const [purchaseOrders, setPurchaseOrders] = useState(seedPurchaseOrders);
  const [invoices, setInvoices] = useState(seedInvoices);
  const [employees, setEmployees] = useState(seedEmployees);
  const [active, setActive] = useState("dashboard");

  const reset = () => {
    setProducts(seedProducts());
    setSalesOrders(seedSalesOrders());
    setPurchaseOrders(seedPurchaseOrders());
    setInvoices(seedInvoices());
    setEmployees(seedEmployees());
    setActive("dashboard");
  };

  if (!isAuthed) {
    return <LoginPage onLogin={(email) => { setUserEmail(email); setIsAuthed(true); }} />;
  }

  const handleLogout = () => {
    setIsAuthed(false);
    setUserEmail("");
    setActive("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar active={active} setActive={setActive} onReset={reset} />
      <div className="md:pl-56 min-h-screen flex flex-col">
        <TopBar title={NAV_TITLES[active]} userEmail={userEmail} onLogout={handleLogout} />
        <main className="flex-1">
          <div className="px-4 sm:px-6 py-6 pb-24 md:pb-6 max-w-6xl mx-auto w-full">
            {active === "dashboard" && (
              <Dashboard products={products} salesOrders={salesOrders} purchaseOrders={purchaseOrders} invoices={invoices} employees={employees} setActive={setActive} userEmail={userEmail} />
            )}
            {active === "inventory" && <InventoryView products={products} setProducts={setProducts} />}
            {active === "sales" && (
              <SalesView salesOrders={salesOrders} setSalesOrders={setSalesOrders} products={products} setProducts={setProducts} setInvoices={setInvoices} />
            )}
            {active === "purchasing" && (
              <PurchasingView purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} products={products} setProducts={setProducts} />
            )}
            {active === "invoicing" && <InvoicingView invoices={invoices} setInvoices={setInvoices} />}
            {active === "hr" && <HRView employees={employees} setEmployees={setEmployees} />}
          </div>
        </main>
      </div>
      <MobileNav active={active} setActive={setActive} />
    </div>
  );
}
