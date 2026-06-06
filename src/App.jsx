import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Archive,
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Box,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileBarChart,
  FileCheck2,
  FileText,
  FolderOpen,
  HelpCircle,
  Home,
  Landmark,
  LayoutGrid,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Upload,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currency = (value) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  })
    .format(Number(value || 0))
    .replace("AED", "AED");

const compactCurrency = (value) => currency(value).replace(".00", "");

const today = "06 Jun 2026";

const homeTabs = [
  { route: "home/dashboard", label: "Dashboard" },
  { route: "home/gettingstarted", label: "Getting Started" },
  { route: "home/announcement", label: "Announcements" },
  { route: "home/recentupdates", label: "Recent Updates" },
];

const children = {
  items: [
    { route: "inventory/items", label: "Items" },
    { route: "inventory/pricelists", label: "Price Lists" },
    { route: "inventory/adjustments", label: "Inventory Adjustments" },
  ],
  sales: [
    { route: "contacts", label: "Customers" },
    { route: "quotes", label: "Estimates" },
    { route: "retainerinvoices", label: "Retainer Invoices" },
    { route: "salesorders", label: "Sales Orders" },
    { route: "deliverychallans", label: "Delivery Challans" },
    { route: "invoices", label: "Invoices" },
    { route: "paymentsreceived", label: "Payments Received" },
    { route: "recurringinvoices", label: "Recurring Invoices" },
    { route: "creditnotes", label: "Credit Notes" },
  ],
  purchases: [
    { route: "vendors", label: "Vendors" },
    { route: "expenses", label: "Expenses" },
    { route: "recurringexpenses", label: "Recurring Expenses" },
    { route: "purchaseorders", label: "Purchase Orders" },
    { route: "bills", label: "Bills" },
    { route: "paymentsmade", label: "Payments Made" },
    { route: "recurringbills", label: "Recurring Bills" },
    { route: "vendorcredits", label: "Vendor Credits" },
  ],
  time: [
    { route: "timesheet/projects", label: "Projects" },
    { route: "timesheet/alltimeentries", label: "Timesheet" },
  ],
  accountant: [
    { route: "accountant/journals", label: "Manual Journals" },
    { route: "accountant/recurringjournals", label: "Recurring Journals" },
    { route: "accountant/bulkupdateaccounts", label: "Bulk Update" },
    { route: "taxreturnpayments/dues", label: "VAT Payments" },
    { route: "taxadjustment/list", label: "Tax Adjustments" },
    { route: "accountant/bcyadjustment/list", label: "Currency Adjustments" },
    { route: "accountant/chartofaccounts", label: "Chart of Accounts" },
    { route: "accountant/transactionlock", label: "Transaction Locking" },
  ],
};

const navItems = [
  { type: "link", route: "home/dashboard", label: "Home", icon: Home },
  { type: "group", key: "items", label: "Items", icon: Package, children: children.items },
  { type: "link", route: "banking", label: "Banking", icon: Landmark },
  { type: "group", key: "sales", label: "Sales", icon: ShoppingCart, children: children.sales },
  { type: "group", key: "purchases", label: "Purchases", icon: ShoppingBag, children: children.purchases },
  { type: "group", key: "time", label: "Time Tracking", icon: Clock3, children: children.time },
  { type: "group", key: "accountant", label: "Accountant", icon: FileCheck2, children: children.accountant },
  { type: "link", route: "reports", label: "Reports", icon: FileBarChart },
  { type: "link", route: "documents/inbox", label: "Documents", icon: FolderOpen },
];

const moduleInfo = {
  contacts: { title: "Customers", singular: "Customer", nameColumn: "CustomerName", icon: UsersRound, accent: "#2563eb" },
  quotes: { title: "Estimates", singular: "Estimate", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  retainerinvoices: { title: "Retainer Invoices", singular: "Retainer Invoice", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  salesorders: { title: "Sales Orders", singular: "Sales Order", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  deliverychallans: { title: "Delivery Challans", singular: "Delivery Challan", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  invoices: { title: "Invoices", singular: "Invoice", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  paymentsreceived: { title: "Payments Received", singular: "Payment Received", nameColumn: "CustomerName", icon: CircleDollarSign, accent: "#16a34a" },
  recurringinvoices: { title: "Recurring Invoices", singular: "Recurring Invoice", nameColumn: "CustomerName", icon: RefreshCw, accent: "#0ea5e9" },
  creditnotes: { title: "Credit Notes", singular: "Credit Note", nameColumn: "CustomerName", icon: FileText, accent: "#f59e0b" },
  vendors: { title: "Vendors", singular: "Vendor", nameColumn: "VendorName", icon: UsersRound, accent: "#7c3aed" },
  expenses: { title: "Expenses", singular: "Expense", nameColumn: "Expense Account", icon: CreditCard, accent: "#f97316" },
  recurringexpenses: { title: "Recurring Expenses", singular: "Recurring Expense", nameColumn: "Expense Account", icon: RefreshCw, accent: "#f97316" },
  purchaseorders: { title: "Purchase Orders", singular: "Purchase Order", nameColumn: "VendorName", icon: FileText, accent: "#7c3aed" },
  bills: { title: "Bills", singular: "Bill", nameColumn: "VendorName", icon: FileText, accent: "#7c3aed" },
  paymentsmade: { title: "Payments Made", singular: "Payment Made", nameColumn: "VendorName", icon: CircleDollarSign, accent: "#16a34a" },
  recurringbills: { title: "Recurring Bills", singular: "Recurring Bill", nameColumn: "VendorName", icon: RefreshCw, accent: "#7c3aed" },
  vendorcredits: { title: "Vendor Credits", singular: "Vendor Credit", nameColumn: "VendorName", icon: FileText, accent: "#f59e0b" },
  "inventory/items": { title: "Items", singular: "Item", nameColumn: "Item Details", icon: Box, accent: "#0891b2" },
  "inventory/pricelists": { title: "Price Lists", singular: "Price List", nameColumn: "Name", icon: Archive, accent: "#0891b2" },
  "inventory/adjustments": { title: "Inventory Adjustments", singular: "Adjustment", nameColumn: "Reason", icon: SlidersHorizontal, accent: "#0891b2" },
  "timesheet/projects": { title: "Projects", singular: "Project", nameColumn: "Project Name", icon: FolderOpen, accent: "#2563eb" },
  "timesheet/alltimeentries": { title: "Timesheet", singular: "Time Entry", nameColumn: "Task", icon: Clock3, accent: "#2563eb" },
  "accountant/journals": { title: "Manual Journals", singular: "Journal", nameColumn: "Journal Type", icon: BookOpen, accent: "#475569" },
  "accountant/recurringjournals": { title: "Recurring Journals", singular: "Recurring Journal", nameColumn: "Journal Type", icon: RefreshCw, accent: "#475569" },
  "accountant/bulkupdateaccounts": { title: "Bulk Update", singular: "Bulk Update", nameColumn: "Account", icon: SlidersHorizontal, accent: "#475569" },
  "taxreturnpayments/dues": { title: "VAT Payments", singular: "VAT Payment", nameColumn: "Tax Return", icon: FileCheck2, accent: "#dc2626" },
  "taxadjustment/list": { title: "Tax Adjustments", singular: "Tax Adjustment", nameColumn: "Adjustment", icon: FileCheck2, accent: "#dc2626" },
  "accountant/bcyadjustment/list": { title: "Currency Adjustments", singular: "Currency Adjustment", nameColumn: "Currency", icon: CircleDollarSign, accent: "#475569" },
  "accountant/chartofaccounts": { title: "Chart of Accounts", singular: "Account", nameColumn: "Account Name", icon: BookOpen, accent: "#475569" },
  "accountant/transactionlock": { title: "Transaction Locking", singular: "Lock Rule", nameColumn: "Lock Date", icon: FileCheck2, accent: "#475569" },
  banking: { title: "Banking", singular: "Bank Account", nameColumn: "Account Details", icon: Landmark, accent: "#2563eb" },
  reports: { title: "Reports", singular: "Report", nameColumn: "Report Name", icon: FileBarChart, accent: "#2563eb" },
  documents: { title: "Documents", singular: "Document", nameColumn: "Document Name", icon: FolderOpen, accent: "#2563eb" },
};

const reportCategories = [
  "Favorites",
  "Business Overview",
  "Sales",
  "Inventory",
  "Receivables",
  "Payments Received",
  "Recurring Invoices",
  "Payables",
  "Purchases and Expenses",
  "Projects and Timesheet",
  "Accountant",
  "Currency",
  "Activity",
];

const statusClass = (status = "") => {
  const key = status.toLowerCase();
  if (key.includes("paid") || key.includes("cleared") || key.includes("active") || key.includes("accepted")) return "good";
  if (key.includes("overdue") || key.includes("due")) return "danger";
  if (key.includes("draft") || key.includes("open") || key.includes("initiated")) return "warning";
  return "neutral";
};

const getHashPath = () => {
  const hash = window.location.hash || "#/home/dashboard";
  return hash.replace(/^#\/?/, "").split("?")[0] || "home/dashboard";
};

const setRoute = (route) => {
  window.location.hash = `#/${route}`;
};

const iconFor = (Icon, className = "") => <Icon className={className} size={18} strokeWidth={1.9} />;

function IconButton({ label, children, className = "", ...props }) {
  return (
    <button className={`icon-button ${className}`} title={label} aria-label={label} type="button" {...props}>
      {children}
    </button>
  );
}

function App() {
  const [route, setRouteState] = useState(getHashPath);
  const [bootstrap, setBootstrap] = useState(null);
  const [records, setRecords] = useState({});
  const [expanded, setExpanded] = useState({ sales: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [quickCreate, setQuickCreate] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toast, setToast] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    fetch("/api/bootstrap")
      .then((response) => response.json())
      .then((payload) => {
        setBootstrap(payload);
        setRecords(payload.records);
      });
  }, []);

  useEffect(() => {
    const sync = () => {
      const nextRoute = getHashPath();
      setRouteState(nextRoute);
      setSidebarOpen(false);
      const group = Object.entries(children).find(([, items]) => items.some((item) => item.route === nextRoute || nextRoute.startsWith(`${item.route}/`)));
      if (group) setExpanded((current) => ({ ...current, [group[0]]: true }));
    };
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuickCreate(false);
        setDrawer(null);
        setSelectedRecord(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const currentModule = useMemo(() => {
    if (route.startsWith("documents")) return "documents";
    if (route.startsWith("reports")) return "reports";
    if (route.startsWith("banking")) return "banking";
    if (route.startsWith("invoices/new")) return "invoices";
    return route;
  }, [route]);

  const currentInfo = route.startsWith("home") ? moduleInfo.contacts : moduleInfo[currentModule] || moduleInfo.invoices;

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const needle = query.trim().toLowerCase();
    return Object.entries(records)
      .flatMap(([key, rows]) =>
        rows.map((row) => ({
          ...row,
          moduleKey: key,
          moduleTitle: moduleInfo[key]?.title || key,
        })),
      )
      .filter((row) => [row.name, row.number, row.status, row.owner].some((value) => String(value || "").toLowerCase().includes(needle)))
      .slice(0, 8);
  }, [query, records]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2600);
  };

  const refreshBootstrap = async () => {
    const payload = await fetch("/api/bootstrap").then((response) => response.json());
    setBootstrap(payload);
    setRecords(payload.records);
    showToast("Data refreshed");
  };

  const saveRecord = async (moduleKey, form) => {
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/records/${moduleKey}/${form.id}` : `/api/records/${moduleKey}`;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    setRecords((current) => {
      const rows = current[moduleKey] || [];
      const nextRows = form.id ? rows.map((row) => (row.id === form.id ? payload.record : row)) : [payload.record, ...rows];
      return { ...current, [moduleKey]: nextRows };
    });
    setModal(null);
    showToast(`${moduleInfo[moduleKey]?.singular || "Record"} saved`);
    return payload.record;
  };

  const deleteRecord = async (moduleKey, id) => {
    await fetch(`/api/records/${moduleKey}/${id}`, { method: "DELETE" });
    setRecords((current) => ({
      ...current,
      [moduleKey]: (current[moduleKey] || []).filter((row) => row.id !== id),
    }));
    setSelectedRecord(null);
    showToast("Record deleted");
  };

  if (!bootstrap) {
    return (
      <div className="loading-screen">
        <div className="loader-logo">B</div>
        <span>Loading Books...</span>
      </div>
    );
  }

  const openNew = (moduleKey = currentModule) => {
    if (moduleKey === "invoices") {
      setRoute("invoices/new");
      return;
    }
    setModal({ moduleKey, record: null });
  };

  return (
    <div className="app-shell">
      <DemoBanner onSignup={() => showToast("Demo action only. Full signup is disabled here.")} />
      <TopBar
        organization={bootstrap.organization}
        currentInfo={currentInfo}
        query={query}
        onQuery={setQuery}
        searchRef={searchRef}
        searchResults={searchResults}
        onNavigate={(moduleKey) => {
          setQuery("");
          setRoute(moduleKey);
        }}
        onMenu={() => setSidebarOpen(true)}
        quickCreate={quickCreate}
        onQuickCreate={() => setQuickCreate((value) => !value)}
        onNew={openNew}
        onDrawer={setDrawer}
      />
      <div className="workspace">
        <Sidebar
          route={route}
          expanded={expanded}
          onExpanded={setExpanded}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="content-area">
          <RouteContent
            route={route}
            bootstrap={bootstrap}
            records={records}
            currentModule={currentModule}
            currentInfo={currentInfo}
            onRefresh={refreshBootstrap}
            onNew={openNew}
            onEdit={(moduleKey, record) => setModal({ moduleKey, record })}
            onDelete={deleteRecord}
            onSelectRecord={(moduleKey, record) => setSelectedRecord({ moduleKey, record })}
            onSave={saveRecord}
            showToast={showToast}
          />
        </main>
      </div>
      {drawer && (
        <SideDrawer title={drawerTitle(drawer)} onClose={() => setDrawer(null)}>
          {drawer === "activities" && <Activities activities={bootstrap.activities} />}
          {drawer === "notifications" && <Notifications />}
          {drawer === "settings" && <SettingsPanel />}
        </SideDrawer>
      )}
      {modal && (
        <RecordModal
          moduleKey={modal.moduleKey}
          record={modal.record}
          onClose={() => setModal(null)}
          onSave={(form) => saveRecord(modal.moduleKey, form)}
        />
      )}
      {selectedRecord && (
        <RecordDrawer
          data={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onEdit={() => setModal(selectedRecord)}
          onDelete={() => deleteRecord(selectedRecord.moduleKey, selectedRecord.record.id)}
          showToast={showToast}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function drawerTitle(drawer) {
  return {
    activities: "Recent Activities",
    notifications: "Notifications",
    settings: "Settings",
  }[drawer];
}

function DemoBanner({ onSignup }) {
  return (
    <div className="demo-banner">
      <div className="demo-mark">DEMO<br />ACCOUNT</div>
      <div className="demo-copy">
        Experience how Books works before you sign up. <strong>However, the actions you can perform in this account are limited.</strong> Sign up for the free trial to access all features.
      </div>
      <button type="button" className="signup-button" onClick={onSignup}>Sign Up<br />Now</button>
    </div>
  );
}

function TopBar({
  organization,
  currentInfo,
  query,
  onQuery,
  searchRef,
  searchResults,
  onNavigate,
  onMenu,
  quickCreate,
  onQuickCreate,
  onNew,
  onDrawer,
}) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <IconButton label="Open navigation" className="mobile-menu" onClick={onMenu}>
          <Menu size={20} />
        </IconButton>
        <div className="brand-logo" aria-hidden="true">
          <BookOpen size={24} />
        </div>
        <span className="brand-name">Books</span>
        <IconButton label="Refresh">
          <RefreshCw size={17} />
        </IconButton>
      </div>
      <div className="search-wrap">
        <Search size={18} />
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={`Search in ${currentInfo.title} ( / )`}
          aria-label={`Search in ${currentInfo.title}`}
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => onQuery("")} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
        {searchResults.length > 0 && (
          <div className="search-popover">
            {searchResults.map((result) => (
              <button key={`${result.moduleKey}-${result.id}`} type="button" onClick={() => onNavigate(result.moduleKey)}>
                <span>
                  <strong>{result.number}</strong>
                  {result.name}
                </span>
                <em>{result.moduleTitle}</em>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="top-actions">
        <button type="button" className="org-button">
          {organization.name}
          <ChevronDown size={15} />
        </button>
        <div className="quick-create-wrap">
          <IconButton label="Quick Create" className="primary-icon" onClick={onQuickCreate}>
            <Plus size={22} />
          </IconButton>
          {quickCreate && <QuickCreateMenu onNew={onNew} />}
        </div>
        <IconButton label="Recent Activities" onClick={() => onDrawer("activities")}>
          <Activity size={18} />
        </IconButton>
        <IconButton label="Notifications" onClick={() => onDrawer("notifications")}>
          <Bell size={18} />
        </IconButton>
        <IconButton label="Settings" onClick={() => onDrawer("settings")}>
          <Settings size={18} />
        </IconButton>
        <IconButton label="Demo User" className="avatar-button">
          <UserRound size={19} />
        </IconButton>
        <IconButton label="Apps">
          <LayoutGrid size={18} />
        </IconButton>
      </div>
    </header>
  );
}

function QuickCreateMenu({ onNew }) {
  const quickItems = [
    { label: "Customer", module: "contacts", icon: UsersRound },
    { label: "Invoice", module: "invoices", icon: FileText },
    { label: "Bill", module: "bills", icon: FileCheck2 },
    { label: "Expense", module: "expenses", icon: CreditCard },
    { label: "Journal", module: "accountant/journals", icon: BookOpen },
    { label: "Project", module: "timesheet/projects", icon: FolderOpen },
  ];
  return (
    <div className="quick-menu">
      <div className="quick-title">Quick Create</div>
      {quickItems.map((item) => (
        <button key={item.module} type="button" onClick={() => onNew(item.module)}>
          {iconFor(item.icon)}
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Sidebar({ route, expanded, onExpanded, open, onClose }) {
  const toggleGroup = (key) => onExpanded((current) => ({ ...current, [key]: !current[key] }));
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.type === "link") {
              const active = route === item.route || (item.route === "home/dashboard" && route.startsWith("home"));
              return (
                <a key={item.route} className={`nav-row ${active ? "active" : ""}`} href={`#/${item.route}`}>
                  {iconFor(Icon)}
                  <span>{item.label}</span>
                </a>
              );
            }
            const isExpanded = expanded[item.key];
            const activeGroup = item.children.some((child) => route === child.route || route.startsWith(`${child.route}/`));
            return (
              <div key={item.key} className={`nav-group ${activeGroup ? "group-active" : ""}`}>
                <button type="button" className="nav-row" onClick={() => toggleGroup(item.key)}>
                  {iconFor(Icon)}
                  <span>{item.label}</span>
                  {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </button>
                {isExpanded && (
                  <div className="subnav">
                    {item.children.map((child) => (
                      <a key={child.route} className={route === child.route || route.startsWith(`${child.route}/`) ? "active" : ""} href={`#/${child.route}`}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <button type="button" className="collapse-button" title="Collapse sidebar">
          <ChevronsLeft size={18} />
        </button>
      </aside>
      {open && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={onClose} />}
    </>
  );
}

function RouteContent(props) {
  const { route, bootstrap } = props;

  if (route === "invoices/new") {
    return <InvoiceForm onSave={props.onSave} onCancel={() => setRoute("invoices")} showToast={props.showToast} />;
  }

  if (route.startsWith("home")) {
    return <HomePage tab={route} bootstrap={bootstrap} onNew={props.onNew} showToast={props.showToast} />;
  }

  if (route === "banking") {
    return <BankingPage bootstrap={bootstrap} showToast={props.showToast} />;
  }

  if (route === "reports" || route.startsWith("reports/")) {
    return <ReportsPage route={route} reports={bootstrap.reports} metrics={bootstrap.metrics} showToast={props.showToast} />;
  }

  if (route.startsWith("documents")) {
    return (
      <DocumentsPage
        rows={props.records.documents || []}
        onNew={() => props.onNew("documents")}
        onEdit={(record) => props.onEdit("documents", record)}
        onSelect={(record) => props.onSelectRecord("documents", record)}
        showToast={props.showToast}
      />
    );
  }

  return (
    <ModulePage
      route={route}
      rows={props.records[route] || []}
      info={moduleInfo[route] || props.currentInfo}
      onRefresh={props.onRefresh}
      onNew={() => props.onNew(route)}
      onEdit={(record) => props.onEdit(route, record)}
      onDelete={(id) => props.onDelete(route, id)}
      onSelect={(record) => props.onSelectRecord(route, record)}
      showToast={props.showToast}
    />
  );
}

function HomePage({ tab, bootstrap, onNew, showToast }) {
  return (
    <div className="page-stack dashboard-page">
      <section className="welcome-strip">
        <div className="welcome-icon">
          <Building2 size={25} />
        </div>
        <div>
          <h1>Hello, {bootstrap.organization.user}</h1>
          <p>{bootstrap.organization.name}</p>
        </div>
        <a className="vat-link" href="#/taxreturnpayments/dues">VAT Resources</a>
        <div className="support-chip">
          <span>Books Helpline: <strong>{bootstrap.organization.support}</strong></span>
          <small>Sun - Fri - 9:00 AM - 6:00 PM</small>
        </div>
      </section>
      <div className="tabs">
        {homeTabs.map((item) => (
          <a key={item.route} className={tab === item.route ? "active" : ""} href={`#/${item.route}`}>
            {item.label}
          </a>
        ))}
      </div>
      {tab === "home/gettingstarted" && <GettingStarted showToast={showToast} />}
      {tab === "home/announcement" && <Announcements />}
      {tab === "home/recentupdates" && <RecentUpdates />}
      {tab === "home/dashboard" && <Dashboard metrics={bootstrap.metrics} bankingAccounts={bootstrap.bankingAccounts} onNew={onNew} />}
    </div>
  );
}

function Dashboard({ metrics, bankingAccounts, onNew }) {
  return (
    <>
      <div className="kpi-grid">
        <AmountCard
          title="Total Receivables"
          caption={`Total Unpaid Invoices ${currency(metrics.receivables.total)}`}
          total={metrics.receivables.total}
          current={metrics.receivables.current}
          overdue={metrics.receivables.overdue}
          onNew={() => onNew("invoices")}
        />
        <AmountCard
          title="Total Payables"
          caption={`Total Unpaid Bills ${currency(metrics.payables.total)}`}
          total={metrics.payables.total}
          current={metrics.payables.current}
          overdue={metrics.payables.overdue}
          onNew={() => onNew("bills")}
        />
      </div>
      <section className="panel cash-flow-panel">
        <div className="panel-header">
          <h2>Cash Flow <HelpCircle size={14} /></h2>
          <button type="button" className="link-button">Previous Fiscal Year <ChevronDown size={14} /></button>
        </div>
        <div className="cash-grid">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metrics.cashFlow.series} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cashBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38a3df" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#38a3df" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#edf1f7" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value} K`} />
                <Tooltip formatter={(value) => [`${value} K`, "Cash"]} />
                <Area type="monotone" dataKey="value" stroke="#2794d2" strokeWidth={2} fill="url(#cashBlue)" dot={{ r: 4, fill: "#2794d2" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="cash-summary">
            <MetricLine label="Cash as on 01/01/2026" value={metrics.cashFlow.opening} />
            <MetricLine label="Incoming" value={metrics.cashFlow.incoming} tone="green" operator="+" />
            <MetricLine label="Outgoing" value={metrics.cashFlow.outgoing} tone="red" operator="-" />
            <MetricLine label="Cash as on 31/12/2026" value={metrics.cashFlow.closing} operator="=" />
          </div>
        </div>
      </section>
      <div className="dashboard-lower">
        <section className="panel">
          <div className="panel-header">
            <h2>Income and Expense</h2>
            <div className="segmented">
              <button className="active" type="button">Accrual</button>
              <button type="button">Cash</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={metrics.incomeExpense}>
              <CartesianGrid stroke="#edf1f7" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mini-ledger">
            <span>Total Income <strong>{currency(metrics.incomeExpense[0].value)}</strong></span>
            <span>Total Expenses <strong>{currency(metrics.incomeExpense[1].value)}</strong></span>
          </div>
        </section>
        <section className="panel">
          <div className="panel-header">
            <h2>Top Expenses</h2>
            <button type="button" className="link-button">This Fiscal Year <ChevronDown size={14} /></button>
          </div>
          <div className="expense-layout">
            <ResponsiveContainer width="42%" height={190}>
              <PieChart>
                <Pie data={metrics.expenses} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2}>
                  {metrics.expenses.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="expense-bars">
              {metrics.expenses.map((item) => (
                <div key={item.name}>
                  <span><i style={{ background: item.color }} />{item.name}</span>
                  <b>{currency(item.value)}</b>
                  <div className="bar-track"><span style={{ width: `${(item.value / metrics.expenses[0].value) * 100}%`, background: item.color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="dashboard-lower">
        <ProjectsPanel projects={metrics.projects} />
        <BankMiniPanel accounts={bankingAccounts} />
      </div>
    </>
  );
}

function AmountCard({ title, caption, total, current, overdue, onNew }) {
  const currentWidth = total ? Math.max(2, (current / total) * 100) : 0;
  return (
    <section className="panel amount-card">
      <div className="panel-header compact">
        <h2>{title} <HelpCircle size={14} /></h2>
        <button className="link-button new-link" type="button" onClick={onNew}>
          <Plus size={15} /> New
        </button>
      </div>
      <p>{caption}</p>
      <div className="progress-stack">
        <span className="current" style={{ width: `${currentWidth}%` }} />
        <span className="overdue" />
      </div>
      <div className="amount-split">
        <div>
          <small>Current</small>
          <strong>{currency(current)}</strong>
        </div>
        <div>
          <small>Overdue</small>
          <strong>{currency(overdue)} <ChevronDown size={13} /></strong>
        </div>
      </div>
    </section>
  );
}

function MetricLine({ label, value, tone, operator }) {
  return (
    <div className="metric-line">
      <span>{label}</span>
      <strong className={tone || ""}>{currency(value)}</strong>
      {operator && <em>{operator}</em>}
    </div>
  );
}

function ProjectsPanel({ projects }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Projects</h2>
        <a className="link-button" href="#/timesheet/projects">View All</a>
      </div>
      <div className="project-stats">
        <span><strong>12:00</strong> Unbilled Hours</span>
        <span><strong>AED100.00</strong> Unbilled Expenses</span>
      </div>
      <div className="mini-table">
        {projects.map((project) => (
          <a key={project.name} href="#/timesheet/projects">
            <span>
              <strong>{project.name}</strong>
              <small>{project.customer}</small>
            </span>
            <em>{project.budget}</em>
          </a>
        ))}
      </div>
    </section>
  );
}

function BankMiniPanel({ accounts }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Bank and Credit Cards</h2>
        <a className="link-button" href="#/banking">Go to Banking</a>
      </div>
      <div className="bank-mini-grid">
        {accounts.map((account) => (
          <div key={account.id}>
            <span>{account.type}</span>
            <strong>{compactCurrency(account.booksAmount)}</strong>
            <small>{account.uncategorized || "No"} uncategorized</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function GettingStarted({ showToast }) {
  const tasks = [
    ["Organization Profile", "Completed"],
    ["Taxes", "Configured"],
    ["Opening Balances", "Pending"],
    ["Payment Gateway", "Pending"],
    ["Invoice Template", "Completed"],
    ["Bank Feeds", "Pending"],
  ];
  return (
    <section className="panel onboarding-panel">
      <div className="panel-header">
        <h2>Getting Started</h2>
        <button type="button" className="primary-button" onClick={() => showToast("Setup checklist updated")}>
          <Check size={16} /> Save Progress
        </button>
      </div>
      <div className="setup-grid">
        {tasks.map(([name, state]) => (
          <button key={name} type="button">
            <span className={state === "Pending" ? "setup-dot pending" : "setup-dot"} />
            <strong>{name}</strong>
            <em>{state}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function Announcements() {
  return (
    <section className="panel feed-panel">
      <h2>Announcements</h2>
      {["VAT return filing improvements are available in the tax module.", "New invoice template gallery is ready for UAE organizations.", "Bank statement auto-upload now supports forwarding rules."].map((item) => (
        <article key={item}>
          <CalendarDays size={18} />
          <span>{item}</span>
          <small>June 2026</small>
        </article>
      ))}
    </section>
  );
}

function RecentUpdates() {
  return (
    <section className="panel feed-panel">
      <h2>Recent Updates</h2>
      {["Bulk update supports contact owner changes.", "Reports center remembers the last category you opened.", "Documents inbox extracts totals from supplier bills."].map((item) => (
        <article key={item}>
          <RefreshCw size={18} />
          <span>{item}</span>
          <small>Updated</small>
        </article>
      ))}
    </section>
  );
}

function ModulePage({ route, rows, info, onRefresh, onNew, onEdit, onDelete, onSelect, showToast }) {
  const [filter, setFilter] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const filters = ["All", "Draft", "Open", "Sent", "Overdue", "Paid", "Active"];
  const visibleRows = rows.filter((row) => {
    const matchesFilter = filter === "All" || row.status === filter;
    const matchesSearch = [row.name, row.number, row.status, row.owner].some((value) => String(value || "").toLowerCase().includes(localSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
  const Icon = info.icon || FileText;
  const summary = buildModuleSummary(route, rows);

  return (
    <div className="page-stack">
      <section className="module-header">
        <div>
          <h1>All {info.title}</h1>
          <p>{summary.caption}</p>
        </div>
        <div className="module-actions">
          <button type="button" className="primary-button" onClick={onNew}>
            <Plus size={16} /> New
          </button>
          <IconButton label="Refresh" onClick={onRefresh}>
            <RefreshCw size={17} />
          </IconButton>
          <IconButton label="More">
            <MoreHorizontal size={18} />
          </IconButton>
        </div>
      </section>
      <div className="summary-strip">
        {summary.items.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <section className="panel list-panel">
        <div className="list-toolbar">
          <div className="filter-group">
            <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter records">
              {filters.map((item) => <option key={item}>{item}</option>)}
            </select>
            <span>{visibleRows.length} records</span>
          </div>
          <div className="toolbar-search">
            <Search size={16} />
            <input value={localSearch} onChange={(event) => setLocalSearch(event.target.value)} placeholder={`Search ${info.title}`} />
          </div>
          <button type="button" className="secondary-button" onClick={() => showToast("Columns customized")}>
            <SlidersHorizontal size={16} /> Columns
          </button>
        </div>
        {visibleRows.length === 0 ? (
          <EmptyState Icon={Icon} title={`No ${info.title.toLowerCase()} found`} onNew={onNew} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" aria-label="Select all" /></th>
                  <th>Date</th>
                  <th>{info.singular}#</th>
                  <th>{info.nameColumn}</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Balance Due</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id}>
                    <td><input type="checkbox" aria-label={`Select ${row.number}`} /></td>
                    <td>{row.date}</td>
                    <td><button type="button" className="table-link" onClick={() => onSelect(row)}>{row.number}</button></td>
                    <td>
                      <button type="button" className="name-cell" onClick={() => onSelect(row)}>
                        <span>{row.name}</span>
                        {row.order && <small>{row.order}</small>}
                      </button>
                    </td>
                    <td><span className={`status ${statusClass(row.status)}`}>{row.status}</span></td>
                    <td>{row.dueDate}</td>
                    <td>{currency(row.amount)}</td>
                    <td>{currency(row.balance)}</td>
                    <td>
                      <div className="row-actions">
                        <IconButton label="Edit" onClick={() => onEdit(row)}>
                          <FileText size={16} />
                        </IconButton>
                        <IconButton label="Delete" onClick={() => onDelete(row.id)}>
                          <X size={16} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function buildModuleSummary(route, rows) {
  const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const balance = rows.reduce((sum, row) => sum + Number(row.balance || 0), 0);
  const overdue = rows.filter((row) => String(row.status).toLowerCase().includes("overdue")).reduce((sum, row) => sum + Number(row.balance || 0), 0);
  const paid = rows.filter((row) => ["Paid", "Cleared"].includes(row.status)).reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const salesLike = ["contacts", "quotes", "retainerinvoices", "salesorders", "deliverychallans", "invoices", "paymentsreceived", "recurringinvoices", "creditnotes"].includes(route);
  const purchaseLike = ["vendors", "expenses", "purchaseorders", "bills", "paymentsmade", "vendorcredits", "recurringexpenses", "recurringbills"].includes(route);
  return {
    caption: salesLike ? "Payment Summary" : purchaseLike ? "Payable Summary" : "Overview",
    items: [
      { label: salesLike ? "Total Outstanding Receivables" : purchaseLike ? "Total Outstanding Payables" : "Total Value", value: currency(balance || total) },
      { label: "Due Today", value: currency(0) },
      { label: "Due Within 30 Days", value: currency(Math.max(0, balance - overdue)) },
      { label: salesLike ? "Overdue Invoice" : purchaseLike ? "Overdue Bill" : "Open", value: currency(overdue) },
      { label: "Paid / Cleared", value: currency(paid) },
    ],
  };
}

function EmptyState({ Icon, title, onNew }) {
  return (
    <div className="empty-state">
      <Icon size={36} />
      <h2>{title}</h2>
      <button type="button" className="primary-button" onClick={onNew}>
        <Plus size={16} /> New
      </button>
    </div>
  );
}

function BankingPage({ bootstrap, showToast }) {
  const [chartVisible, setChartVisible] = useState(true);
  const totals = [
    ["Bank Balance", -5045],
    ["Card Balance", -2972],
    ["Cash In Hand", 8776],
    ["Payment Clearing", -6920],
  ];
  return (
    <div className="page-stack">
      <section className="module-header">
        <div>
          <h1>Banking Overview</h1>
          <p>All Accounts</p>
        </div>
        <div className="module-actions">
          <button className="secondary-button" type="button" onClick={() => showToast("Statement import started")}>
            <Upload size={16} /> Import Statement
          </button>
          <button className="primary-button" type="button" onClick={() => showToast("Bank connection wizard opened")}>
            <Plus size={16} /> Add Bank or Credit Card
          </button>
        </div>
      </section>
      <section className="panel banking-callout">
        <FileText size={24} />
        <div>
          <h2>Auto-upload bank statements from email</h2>
          <p>Enable auto-upload, set up forwarding, and add statements to a bank account.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => showToast("Auto-upload setup opened")}>Set up Now</button>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>All Accounts</h2>
          <button type="button" className="link-button">Last 30 days <ChevronDown size={14} /></button>
        </div>
        <div className="banking-stats">
          {totals.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong className={value < 0 ? "negative" : ""}>{compactCurrency(value)}</strong>
            </div>
          ))}
        </div>
        <div className="uncategorized-banner">
          <strong>27295</strong>
          <span>Uncategorized Transactions</span>
          <button type="button" className="link-button" onClick={() => showToast("Categorization queue opened")}>Categorize now</button>
          <button type="button" className="secondary-button" onClick={() => setChartVisible((value) => !value)}>
            {chartVisible ? "Hide Chart" : "Show Chart"}
          </button>
        </div>
        {chartVisible && (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={totals.map(([name, value]) => ({ name, value }))}>
              <CartesianGrid stroke="#edf1f7" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
      <section className="panel list-panel">
        <div className="panel-header">
          <h2>Active Accounts</h2>
          <IconButton label="Search">
            <Search size={16} />
          </IconButton>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Account Details</th>
                <th>Uncategorized</th>
                <th>Amount in Bank</th>
                <th>Amount in Books</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bootstrap.bankingAccounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <button type="button" className="name-cell" onClick={() => showToast(`${account.name} opened`)}>
                      <span>{account.name}</span>
                      <small>{account.number}</small>
                    </button>
                  </td>
                  <td>{account.uncategorized ? `${account.uncategorized} transactions` : "-"}</td>
                  <td>{compactCurrency(account.bankAmount)}</td>
                  <td>{compactCurrency(account.booksAmount)}</td>
                  <td><IconButton label="More"><MoreHorizontal size={16} /></IconButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReportsPage({ route, reports, metrics, showToast }) {
  const [category, setCategory] = useState("Business Overview");
  const [query, setQuery] = useState("");
  if (route.startsWith("reports/")) {
    const report = reports.find((item) => route.endsWith(item.id)) || reports[0];
    return <ReportDetail report={report} metrics={metrics} onBack={() => setRoute("reports")} showToast={showToast} />;
  }
  const visible = reports.filter((report) => {
    const matchesCategory = category === "Favorites" ? true : report.group === category;
    return matchesCategory && report.name.toLowerCase().includes(query.toLowerCase());
  });
  return (
    <div className="reports-layout">
      <aside className="reports-sidebar">
        <h1>Reports Center</h1>
        <div className="toolbar-search report-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports" />
        </div>
        <h2>Report Category</h2>
        {reportCategories.map((item) => (
          <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </aside>
      <section className="panel reports-table">
        <div className="panel-header">
          <h2>All Reports</h2>
          <button className="secondary-button" type="button" onClick={() => showToast("Favorite reports updated")}>
            <Check size={16} /> Save View
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Created By</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((report) => (
                <tr key={report.id}>
                  <td><button type="button" className="table-link" onClick={() => setRoute(`reports/${report.id}`)}>{report.name}</button></td>
                  <td>{report.type}</td>
                  <td>{report.createdBy}</td>
                  <td><IconButton label="More"><MoreHorizontal size={16} /></IconButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReportDetail({ report, metrics, onBack, showToast }) {
  const rows = [
    ["Operating Income", metrics.incomeExpense[0].value],
    ["Cost of Goods Sold", -824000],
    ["Gross Profit", metrics.incomeExpense[0].value - 824000],
    ["Operating Expenses", -metrics.incomeExpense[1].value],
    ["Net Profit", metrics.incomeExpense[0].value - metrics.incomeExpense[1].value - 824000],
  ];
  return (
    <div className="page-stack">
      <section className="module-header">
        <div>
          <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} /> Reports</button>
          <h1>{report.name}</h1>
          <p>Basis: Accrual | Previous Fiscal Year</p>
        </div>
        <div className="module-actions">
          <button className="secondary-button" type="button" onClick={() => showToast("Report exported")}>Export</button>
          <button className="primary-button" type="button" onClick={() => showToast("Report customized")}>Customize Report</button>
        </div>
      </section>
      <section className="panel report-detail">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rows.map(([name, value]) => ({ name, value }))}>
            <CartesianGrid stroke="#edf1f7" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
            <Tooltip formatter={(value) => currency(value)} />
            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="report-ledger">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td>{label}</td>
                <td className={value < 0 ? "negative" : ""}>{currency(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function DocumentsPage({ rows, onNew, onEdit, onSelect, showToast }) {
  return (
    <div className="page-stack">
      <section className="module-header">
        <div>
          <h1>Documents</h1>
          <p>Inbox</p>
        </div>
        <div className="module-actions">
          <button className="secondary-button" type="button" onClick={() => showToast("Statement inbox opened")}>
            <FileText size={16} /> Statement Inbox
          </button>
          <button className="primary-button" type="button" onClick={onNew}>
            <Upload size={16} /> Upload
          </button>
        </div>
      </section>
      <section className="panel documents-drop" onClick={() => showToast("Upload dialog opened")}>
        <Upload size={30} />
        <strong>Drop receipts, bills, and statements here</strong>
        <span>Uploaded files appear in the inbox for extraction and matching.</span>
      </section>
      <section className="panel list-panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Status</th>
                <th>Uploaded On</th>
                <th>Amount</th>
                <th>Owner</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><button type="button" className="table-link" onClick={() => onSelect(row)}>{row.name}</button></td>
                  <td><span className={`status ${statusClass(row.status)}`}>{row.status}</span></td>
                  <td>{row.date}</td>
                  <td>{currency(row.amount)}</td>
                  <td>{row.owner}</td>
                  <td>
                    <IconButton label="Edit" onClick={() => onEdit(row)}>
                      <FileText size={16} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function InvoiceForm({ onSave, onCancel, showToast }) {
  const [draft, setDraft] = useState({
    customer: "",
    number: "Inv-0000",
    order: "",
    invoiceDate: today,
    dueDate: today,
    salesperson: "",
    warehouse: "",
    priceList: "",
    notes: "Thanks for your business.",
    terms: "",
    shipping: 0,
    adjustmentDescription: "Adjustment",
    adjustment: 0,
  });
  const [items, setItems] = useState([{ id: "line-1", name: "", quantity: 1, rate: 0, discount: 0, tax: 0 }]);
  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateLine = (id, key, value) => setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  const addLine = () => setItems((current) => [...current, { id: `line-${current.length + 1}`, name: "", quantity: 1, rate: 0, discount: 0, tax: 0 }]);
  const subtotal = items.reduce((sum, item) => {
    const base = Number(item.quantity || 0) * Number(item.rate || 0);
    const discounted = base - base * (Number(item.discount || 0) / 100);
    return sum + discounted + discounted * (Number(item.tax || 0) / 100);
  }, 0);
  const total = subtotal + Number(draft.shipping || 0) + Number(draft.adjustment || 0);
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const save = async (status) => {
    await onSave("invoices", {
      number: draft.number,
      name: draft.customer || "Walk-in Customer",
      order: draft.order,
      date: draft.invoiceDate,
      dueDate: draft.dueDate,
      amount: total,
      balance: status === "Paid" ? 0 : total,
      status,
      owner: draft.salesperson || "Demo User",
    });
    showToast(status === "Sent" ? "Invoice saved and queued to send" : "Invoice saved as draft");
    setRoute("invoices");
  };

  return (
    <div className="invoice-screen">
      <section className="invoice-header">
        <button type="button" className="back-button" onClick={onCancel}>
          <ArrowLeft size={16} /> Invoices
        </button>
        <h1>New Invoice</h1>
      </section>
      <section className="invoice-form panel">
        <div className="form-grid">
          <label className="span-2">
            <span>Customer Name*</span>
            <select value={draft.customer} onChange={(event) => updateDraft("customer", event.target.value)}>
              <option value="">Select or add a customer</option>
              <option>John Smith Customer</option>
              <option>Bright Star Trading</option>
              <option>Marina Supplies</option>
              <option>Palm Route Cafe</option>
            </select>
          </label>
          <label>
            <span>Invoice#*</span>
            <input value={draft.number} onChange={(event) => updateDraft("number", event.target.value)} />
          </label>
          <label>
            <span>Order Number</span>
            <input value={draft.order} onChange={(event) => updateDraft("order", event.target.value)} />
          </label>
          <label>
            <span>Invoice Date*</span>
            <input value={draft.invoiceDate} onChange={(event) => updateDraft("invoiceDate", event.target.value)} />
          </label>
          <label>
            <span>Terms</span>
            <select value="Due on Receipt" onChange={() => {}}>
              <option>Due on Receipt</option>
              <option>Net 15</option>
              <option>Net 30</option>
            </select>
          </label>
          <label>
            <span>Due Date</span>
            <input value={draft.dueDate} onChange={(event) => updateDraft("dueDate", event.target.value)} />
          </label>
          <label>
            <span>Salesperson</span>
            <input value={draft.salesperson} placeholder="Select or Add Salesperson" onChange={(event) => updateDraft("salesperson", event.target.value)} />
          </label>
          <label>
            <span>Warehouse</span>
            <select value={draft.warehouse} onChange={(event) => updateDraft("warehouse", event.target.value)}>
              <option value="">Select a warehouse</option>
              <option>Main Warehouse</option>
              <option>Dubai Branch</option>
            </select>
          </label>
          <label>
            <span>Select Price List</span>
            <select value={draft.priceList} onChange={(event) => updateDraft("priceList", event.target.value)}>
              <option value="">Retail AED</option>
              <option>Wholesale AED</option>
            </select>
          </label>
        </div>
        <div className="item-table-head">
          <h2>Item Table</h2>
          <button type="button" className="secondary-button">Bulk Actions <ChevronDown size={14} /></button>
        </div>
        <div className="table-wrap">
          <table className="data-table invoice-lines">
            <thead>
              <tr>
                <th />
                <th>Item Details</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const base = Number(item.quantity || 0) * Number(item.rate || 0);
                const discounted = base - base * (Number(item.discount || 0) / 100);
                const amount = discounted + discounted * (Number(item.tax || 0) / 100);
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td><input value={item.name} placeholder="Type or click to select an item." onChange={(event) => updateLine(item.id, "name", event.target.value)} /></td>
                    <td><input type="number" value={item.quantity} onChange={(event) => updateLine(item.id, "quantity", event.target.value)} /></td>
                    <td><input type="number" value={item.rate} onChange={(event) => updateLine(item.id, "rate", event.target.value)} /></td>
                    <td><input type="number" value={item.discount} onChange={(event) => updateLine(item.id, "discount", event.target.value)} /></td>
                    <td>
                      <select value={item.tax} onChange={(event) => updateLine(item.id, "tax", event.target.value)}>
                        <option value={0}>Select a Tax</option>
                        <option value={5}>VAT 5%</option>
                        <option value={0}>Zero Rate</option>
                      </select>
                    </td>
                    <td>{amount.toFixed(3)}</td>
                    <td>
                      <IconButton label="Remove line" onClick={() => setItems((current) => current.filter((line) => line.id !== item.id))}>
                        <X size={15} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="line-actions">
          <button type="button" className="link-button" onClick={addLine}>Add New Row</button>
          <button type="button" className="secondary-button" onClick={() => showToast("Bulk item selector opened")}>Add Items in Bulk</button>
          <button type="button" className="secondary-button">30 Unbilled Bills</button>
        </div>
        <div className="invoice-bottom">
          <div className="notes-stack">
            <label>
              <span>Customer Notes</span>
              <textarea value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} />
              <small>Will be displayed on the invoice</small>
            </label>
            <label>
              <span>Terms & Conditions</span>
              <textarea value={draft.terms} placeholder="Enter the terms and conditions of your business to be displayed in your transaction" onChange={(event) => updateDraft("terms", event.target.value)} />
            </label>
            <div className="attachment-box">
              <FileText size={20} />
              <strong>Attach File(s) to Invoice</strong>
              <button type="button" className="secondary-button" onClick={() => showToast("File chooser opened")}>Choose File</button>
              <span>You can upload a maximum of 10 files, 10MB each</span>
            </div>
          </div>
          <div className="total-card">
            <TotalRow label="Sub Total" value={subtotal} />
            <label>
              <span>Shipping Charges</span>
              <input type="number" value={draft.shipping} onChange={(event) => updateDraft("shipping", event.target.value)} />
            </label>
            <label>
              <span>{draft.adjustmentDescription}</span>
              <input type="number" value={draft.adjustment} onChange={(event) => updateDraft("adjustment", event.target.value)} />
            </label>
            <TotalRow label="Round Off" value={0} />
            <TotalRow label="Total ( AED )" value={total} strong />
            <div className="gateway-box">
              <strong>Want to get paid faster?</strong>
              <span>Configure payment gateways and receive payments online.</span>
              <button type="button" onClick={() => showToast("Payment gateway setup opened")}>Set up Payment Gateway</button>
            </div>
          </div>
        </div>
      </section>
      <div className="invoice-footer">
        <div className="footer-actions">
          <button type="button" className="primary-button" onClick={() => save("Draft")}>Save as Draft</button>
          <button type="button" className="primary-button send" onClick={() => save("Sent")}>Save and Send</button>
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
          <button type="button" className="secondary-button" onClick={() => showToast("Recurring schedule created")}>Make Recurring</button>
        </div>
        <div className="footer-total">
          <span>Total Amount: AED {total.toFixed(3)}</span>
          <span>Total Quantity: {quantity}</span>
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, value, strong }) {
  return (
    <div className={`total-row ${strong ? "strong" : ""}`}>
      <span>{label}</span>
      <b>{Number(value || 0).toFixed(3)}</b>
    </div>
  );
}

function RecordModal({ moduleKey, record, onClose, onSave }) {
  const info = moduleInfo[moduleKey] || { singular: "Record", title: "Records" };
  const [form, setForm] = useState(
    record || {
      name: "",
      number: "",
      date: today,
      dueDate: today,
      status: "Draft",
      amount: 0,
      balance: 0,
      owner: "Demo User",
    },
  );
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="modal-backdrop">
      <section className="modal-card">
        <div className="modal-header">
          <h2>{record ? "Edit" : "New"} {info.singular}</h2>
          <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
        </div>
        <div className="form-grid modal-form">
          <label className="span-2">
            <span>{info.nameColumn || "Name"}</span>
            <input value={form.name} onChange={(event) => setField("name", event.target.value)} autoFocus />
          </label>
          <label>
            <span>{info.singular}#</span>
            <input value={form.number} onChange={(event) => setField("number", event.target.value)} />
          </label>
          <label>
            <span>Status</span>
            <select value={form.status} onChange={(event) => setField("status", event.target.value)}>
              {["Draft", "Open", "Sent", "Active", "Overdue", "Paid", "Cleared"].map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <span>Date</span>
            <input value={form.date} onChange={(event) => setField("date", event.target.value)} />
          </label>
          <label>
            <span>Due Date</span>
            <input value={form.dueDate} onChange={(event) => setField("dueDate", event.target.value)} />
          </label>
          <label>
            <span>Amount</span>
            <input type="number" value={form.amount} onChange={(event) => setField("amount", Number(event.target.value))} />
          </label>
          <label>
            <span>Balance</span>
            <input type="number" value={form.balance} onChange={(event) => setField("balance", Number(event.target.value))} />
          </label>
          <label className="span-2">
            <span>Owner</span>
            <input value={form.owner} onChange={(event) => setField("owner", event.target.value)} />
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="button" className="primary-button" onClick={() => onSave(form)}>Save</button>
        </div>
      </section>
    </div>
  );
}

function SideDrawer({ title, children, onClose }) {
  return (
    <div className="drawer-shell">
      <button className="drawer-scrim" type="button" aria-label="Close drawer" onClick={onClose} />
      <aside className="drawer-panel">
        <div className="drawer-header">
          <h2>{title}</h2>
          <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
        </div>
        {children}
      </aside>
    </div>
  );
}

function RecordDrawer({ data, onClose, onEdit, onDelete, showToast }) {
  const { moduleKey, record } = data;
  const info = moduleInfo[moduleKey] || moduleInfo.invoices;
  return (
    <SideDrawer title={record.number} onClose={onClose}>
      <div className="record-preview">
        <div className="preview-title">
          <strong>{record.name}</strong>
          <span className={`status ${statusClass(record.status)}`}>{record.status}</span>
        </div>
        <dl>
          <div><dt>{info.singular} Date</dt><dd>{record.date}</dd></div>
          <div><dt>Due Date</dt><dd>{record.dueDate}</dd></div>
          <div><dt>Amount</dt><dd>{currency(record.amount)}</dd></div>
          <div><dt>Balance Due</dt><dd>{currency(record.balance)}</dd></div>
          <div><dt>Owner</dt><dd>{record.owner}</dd></div>
        </dl>
        <div className="preview-actions">
          <button className="primary-button" type="button" onClick={onEdit}>Edit</button>
          <button className="secondary-button" type="button" onClick={() => showToast("Email queued")}>Email</button>
          <button className="secondary-button danger-action" type="button" onClick={onDelete}>Delete</button>
        </div>
        <div className="timeline">
          <h3>Timeline</h3>
          <p>{info.singular} created by {record.owner}.</p>
          <p>Status changed to {record.status}.</p>
        </div>
      </div>
    </SideDrawer>
  );
}

function Activities({ activities }) {
  return (
    <div className="activity-list">
      {activities.map((item) => (
        <article key={item}>
          <Activity size={17} />
          <span>{item}</span>
          <small>Today</small>
        </article>
      ))}
    </div>
  );
}

function Notifications() {
  return (
    <div className="activity-list">
      {["3 invoices need follow-up.", "VAT payment due this month.", "29 bank transactions are uncategorized.", "Two documents are ready for review."].map((item) => (
        <article key={item}>
          <Bell size={17} />
          <span>{item}</span>
          <small>Unread</small>
        </article>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const settings = [
    ["Organization Profile", "Demo Org"],
    ["Taxes", "UAE VAT enabled"],
    ["Templates", "Standard Invoice"],
    ["Users & Roles", "4 active users"],
    ["Preferences", "AED base currency"],
  ];
  return (
    <div className="settings-list">
      {settings.map(([name, value]) => (
        <button key={name} type="button">
          <span>{name}</span>
          <em>{value}</em>
          <ChevronRight size={16} />
        </button>
      ))}
    </div>
  );
}

export default App;
