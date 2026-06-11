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
  CirclePlus,
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
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
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
const appName = "Aqua Best Accounts";
const shortBrand = "Aqua Best";
const defaultUser = "Accounts Admin";

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
    { route: "quotes", label: "Quotations" },
    { route: "retainerinvoices", label: "Retainer Invoices" },
    { route: "salesorders", label: "Sales Orders" },
    { route: "deliverychallans", label: "Delivery Challans" },
    { route: "invoices", label: "Tax Invoices" },
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
  quotes: { title: "Quotations", singular: "Quotation", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  retainerinvoices: { title: "Retainer Invoices", singular: "Retainer Invoice", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  salesorders: { title: "Sales Orders", singular: "Sales Order", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  deliverychallans: { title: "Delivery Challans", singular: "Delivery Challan", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  invoices: { title: "Tax Invoices", singular: "Tax Invoice", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
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
  users: { title: "Users", singular: "User", nameColumn: "User Name", icon: UserRound, accent: "#2563eb" },
  weeklylogs: { title: "Weekly Log", singular: "Weekly Log", nameColumn: "Week", icon: CalendarDays, accent: "#2563eb" },
  retailinvoices: { title: "Retail Invoices", singular: "Retail Invoice", nameColumn: "CustomerName", icon: FileText, accent: "#0ea5e9" },
  banktransfers: { title: "Bank Transfers", singular: "Bank Transfer", nameColumn: "Transfer Details", icon: Landmark, accent: "#2563eb" },
  "employee-reimbursements": { title: "Employee Reimbursements", singular: "Employee Reimbursement", nameColumn: "Employee", icon: UserRound, accent: "#2563eb" },
  cardpayments: { title: "Card Payments", singular: "Card Payment", nameColumn: "Card Account", icon: CreditCard, accent: "#2563eb" },
  ownerdrawings: { title: "Owner Drawings", singular: "Owner Drawing", nameColumn: "Owner", icon: CircleDollarSign, accent: "#2563eb" },
  otherincome: { title: "Other Income", singular: "Other Income", nameColumn: "Income Account", icon: CircleDollarSign, accent: "#16a34a" },
  reports: { title: "Reports", singular: "Report", nameColumn: "Report Name", icon: FileBarChart, accent: "#2563eb" },
  documents: { title: "Documents", singular: "Document", nameColumn: "Document Name", icon: FolderOpen, accent: "#2563eb" },
  settings: { title: "Settings", singular: "Setting", nameColumn: "Setting", icon: Settings, accent: "#2563eb" },
  admin: { title: "Admin Panel", singular: "User", nameColumn: "User", icon: ShieldCheck, accent: "#2563eb" },
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

const settingsSections = [
  {
    id: "organization",
    title: "Organization",
    icon: Building2,
    tone: "green",
    items: [
      { id: "profile", label: "Profile", summary: "Aqua Best UAE", route: "settings/orgprofile" },
      { id: "branding", label: "Branding", summary: "Logo and document identity", route: "settings/preferences/branding" },
      { id: "currencies", label: "Currencies", summary: "AED base currency", route: "settings/currencies" },
      { id: "opening-balances", label: "Opening Balances", summary: "Starting balances", route: "settings/openingbalance/setup" },
      { id: "manage-subscription", label: "Manage Subscription", summary: "Official account" },
    ],
  },
  {
    id: "taxes",
    title: "Taxes & Compliance",
    icon: FileCheck2,
    tone: "blue",
    items: [
      { id: "tax-rates", label: "Tax Rates", summary: "UAE VAT enabled", route: "settings/taxes/taxrates" },
      { id: "tax-return-settings", label: "Tax Return Settings", summary: "VAT return filing rules", route: "settings/taxes/taxreturnsettings" },
    ],
  },
  {
    id: "users-roles",
    title: "Users & Roles",
    icon: UsersRound,
    tone: "red",
    items: [
      { id: "users", label: "Users", summary: "Manage secure users", route: "settings/users" },
      { id: "roles", label: "Roles", summary: "Admin and staff permissions", route: "settings/roles" },
    ],
  },
  {
    id: "preferences",
    title: "Preferences",
    icon: SlidersHorizontal,
    tone: "orange",
    items: [
      { id: "general", label: "General", summary: "Dates, language and numbers", route: "settings/preferences" },
      { id: "contacts", label: "Customers and Vendors", summary: "Portal and contact defaults", route: "settings/preferences/contacts" },
      { id: "accountant", label: "Accountant", summary: "Books and tax defaults", route: "settings/preferences/accountant" },
      { id: "timesheet", label: "Timesheet", summary: "Project billing rules", route: "settings/preferences/timesheet" },
      { id: "customer-portal", label: "Customer Portal", summary: "Customer self service", route: "settings/preferences/portal/general" },
      { id: "vendor-portal", label: "Vendor Portal", summary: "Vendor self service", route: "settings/preferences/portal/vendorportal" },
    ],
  },
  {
    id: "sales",
    title: "Sales",
    icon: ShoppingCart,
    tone: "green",
    items: [
      { id: "quotations", label: "Quotations", summary: "QUO numbering and print template", route: "settings/preferences/quotes" },
      { id: "retainer-invoices", label: "Retainer Invoices", summary: "Retainer defaults", route: "settings/preferences/retainerinvoices" },
      { id: "sales-orders", label: "Sales Orders", summary: "Order approval and numbering", route: "settings/preferences/salesorders" },
      { id: "shipments", label: "Shipments", summary: "Shipment tracking", route: "settings/preferences/shipments" },
      { id: "delivery-challans", label: "Delivery Challans", summary: "Delivery documentation", route: "settings/preferences/deliverychallans" },
      { id: "tax-invoices", label: "Tax Invoices", summary: "TAX-INV numbering and print template", route: "settings/preferences/invoices" },
      { id: "recurring-invoices", label: "Recurring Invoices", summary: "Automated billing", route: "settings/preferences/recurringinvoices" },
      { id: "credit-notes", label: "Credit Notes", summary: "Returns and credits", route: "settings/preferences/creditnotes" },
      { id: "delivery-notes", label: "Delivery Notes", summary: "Delivery note format", route: "settings/preferences/deliverynotes" },
      { id: "packing-slips", label: "Packing Slips", summary: "Packing slip format", route: "settings/preferences/packingslips" },
    ],
  },
  {
    id: "purchases",
    title: "Purchases",
    icon: ShoppingBag,
    tone: "green",
    items: [
      { id: "expenses", label: "Expenses", summary: "Expense claim defaults", route: "settings/preferences/expenses" },
      { id: "recurring-expenses", label: "Recurring Expenses", summary: "Scheduled expenses", route: "settings/preferences/recurringexpenses" },
      { id: "recurring-bills", label: "Recurring Bills", summary: "Scheduled vendor bills", route: "settings/preferences/recurringbills" },
      { id: "purchase-orders", label: "Purchase Orders", summary: "PO numbering", route: "settings/preferences/purchaseorders" },
    ],
  },
  {
    id: "items",
    title: "Items",
    icon: Package,
    tone: "red",
    items: [{ id: "items", label: "Items", summary: "Inventory and service defaults", route: "settings/preferences/items" }],
  },
  {
    id: "online-payments",
    title: "Online Payments",
    icon: CreditCard,
    tone: "orange",
    items: [{ id: "customer-online-payments", label: "Customer Online Payments", summary: "Customer payment gateways", route: "settings/onlinepayments/customer-onlinepayments" }],
  },
  {
    id: "customisation",
    title: "Customisation",
    icon: Settings,
    tone: "orange",
    items: [
      { id: "reporting-tags", label: "Reporting Tags", summary: "Branches and departments", route: "settings/reportingtags" },
      { id: "transaction-number-series", label: "Transaction Number Series", summary: "Document prefixes", route: "settings/preferences/txnnumbering/autonumbering-series" },
      { id: "pdf-templates", label: "PDF Templates", summary: "Tax invoice and quotation PDF", route: "settings/templates" },
    ],
  },
  {
    id: "reminders",
    title: "Reminders & Notifications",
    icon: Bell,
    tone: "blue",
    items: [{ id: "email-notifications", label: "Email Templates", summary: "Invoice notification emails", route: "settings/emails/templates" }],
  },
  {
    id: "custom-modules",
    title: "Custom Modules",
    icon: LayoutGrid,
    tone: "blue",
    items: [{ id: "overview", label: "Overview", summary: "Extra business modules", route: "settings/preferences/custommodule-getstarted" }],
  },
  {
    id: "developer-data",
    title: "Developer & Data",
    icon: FileText,
    tone: "orange",
    items: [
      { id: "api-usage", label: "API Usage", summary: "Connected API limits", route: "settings/developerspace/apidashboard" },
      { id: "data-backup", label: "Data Backup", summary: "Export and backup schedule", route: "settings/databackup" },
      { id: "backup-documents", label: "Backup Documents", summary: "Backup files and documents", route: "settings/backupdocs" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: Archive,
    tone: "green",
    items: [{ id: "other-apps", label: "Other Apps", summary: "Connected applications", route: "settings/integrations/otherapps" }],
  },
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

const findSettingSelection = (sectionId, itemId) => {
  const section = settingsSections.find((entry) => entry.id === sectionId);
  if (!section) return null;
  const item = section.items.find((entry) => entry.id === itemId) || section.items[0];
  return { section, item };
};

const settingRoute = (sectionId, itemId) => findSettingSelection(sectionId, itemId)?.item.route || `settings/${sectionId}/${itemId}`;

const findSettingByDefinedRoute = (route) => {
  for (const section of settingsSections) {
    for (const item of section.items) {
      if ((item.route || settingRoute(section.id, item.id)) === route) {
        return { section, item };
      }
    }
  }
  return null;
};

const settingSubRouteLabels = {
  custombuttons: "Custom Buttons",
  relatedlists: "Related Lists",
  customfields: "Custom Fields",
};

const settingsRouteAliases = {
  "settings/orgprofile": ["organization", "profile"],
  "settings/currencies": ["organization", "currencies"],
  "settings/openingbalance/setup": ["organization", "opening-balances"],
  "settings/preferences/branding": ["organization", "branding"],
  "settings/organization/profile": ["organization", "profile"],
  "settings/organization/currencies": ["organization", "currencies"],
  "settings/organization/opening-balances": ["organization", "opening-balances"],
  "settings/organization/branding": ["organization", "branding"],
  "settings/taxes": ["taxes", "tax-rates"],
  "settings/taxes/taxrates": ["taxes", "tax-rates"],
  "settings/taxes/taxreturnsettings": ["taxes", "tax-return-settings"],
  "settings/users": ["users-roles", "users"],
  "settings/roles": ["users-roles", "roles"],
  "settings/preferences": ["preferences", "general"],
  "settings/preferences/general": ["preferences", "general"],
  "settings/preferences/contacts": ["preferences", "contacts"],
  "settings/preferences/customers-vendors": ["preferences", "contacts"],
  "settings/preferences/customers-vendors/custombuttons": ["preferences", "contacts", "Custom Buttons"],
  "settings/preferences/customers-vendors/relatedlists": ["preferences", "contacts", "Related Lists"],
  "settings/preferences/contacts/custombuttons": ["preferences", "contacts", "Custom Buttons"],
  "settings/preferences/contacts/relatedlists": ["preferences", "contacts", "Related Lists"],
  "settings/preferences/accountant": ["preferences", "accountant"],
  "settings/preferences/timesheet": ["preferences", "timesheet"],
  "settings/preferences/portal/general": ["preferences", "customer-portal"],
  "settings/preferences/portal/vendorportal": ["preferences", "vendor-portal"],
  "settings/preferences/quotes": ["sales", "quotations"],
  "settings/preferences/quotes/custombuttons": ["sales", "quotations", "Custom Buttons"],
  "settings/preferences/quotes/relatedlists": ["sales", "quotations", "Related Lists"],
  "settings/preferences/retainerinvoices": ["sales", "retainer-invoices"],
  "settings/preferences/retainerinvoices/custombuttons": ["sales", "retainer-invoices", "Custom Buttons"],
  "settings/preferences/retainerinvoices/relatedlists": ["sales", "retainer-invoices", "Related Lists"],
  "settings/preferences/salesorders": ["sales", "sales-orders"],
  "settings/preferences/salesorders/custombuttons": ["sales", "sales-orders", "Custom Buttons"],
  "settings/preferences/salesorders/relatedlists": ["sales", "sales-orders", "Related Lists"],
  "settings/preferences/shipments": ["sales", "shipments"],
  "settings/preferences/deliverychallans": ["sales", "delivery-challans"],
  "settings/preferences/deliverychallans/custombuttons": ["sales", "delivery-challans", "Custom Buttons"],
  "settings/preferences/invoices": ["sales", "tax-invoices"],
  "settings/preferences/invoices/custombuttons": ["sales", "tax-invoices", "Custom Buttons"],
  "settings/preferences/invoices/relatedlists": ["sales", "tax-invoices", "Related Lists"],
  "settings/preferences/recurringinvoices": ["sales", "recurring-invoices"],
  "settings/preferences/recurringinvoices/custombuttons": ["sales", "recurring-invoices", "Custom Buttons"],
  "settings/preferences/creditnotes": ["sales", "credit-notes"],
  "settings/preferences/creditnotes/custombuttons": ["sales", "credit-notes", "Custom Buttons"],
  "settings/preferences/creditnotes/relatedlists": ["sales", "credit-notes", "Related Lists"],
  "settings/preferences/deliverynotes": ["sales", "delivery-notes"],
  "settings/preferences/packingslips": ["sales", "packing-slips"],
  "settings/preferences/expenses": ["purchases", "expenses"],
  "settings/preferences/expenses/customfields": ["purchases", "expenses", "Custom Fields"],
  "settings/preferences/expenses/relatedlists": ["purchases", "expenses", "Related Lists"],
  "settings/preferences/recurringexpenses": ["purchases", "recurring-expenses"],
  "settings/preferences/recurringexpenses/custombuttons": ["purchases", "recurring-expenses", "Custom Buttons"],
  "settings/preferences/recurringbills": ["purchases", "recurring-bills"],
  "settings/preferences/recurringbills/custombuttons": ["purchases", "recurring-bills", "Custom Buttons"],
  "settings/preferences/purchaseorders": ["purchases", "purchase-orders"],
  "settings/preferences/purchaseorders/custombuttons": ["purchases", "purchase-orders", "Custom Buttons"],
  "settings/preferences/purchaseorders/relatedlists": ["purchases", "purchase-orders", "Related Lists"],
  "settings/preferences/items": ["items", "items"],
  "settings/preferences/items/custombuttons": ["items", "items", "Custom Buttons"],
  "settings/preferences/items/relatedlists": ["items", "items", "Related Lists"],
  "settings/onlinepayments/customer-onlinepayments": ["online-payments", "customer-online-payments"],
  "settings/reportingtags": ["customisation", "reporting-tags"],
  "settings/preferences/txnnumbering/autonumbering-series": ["customisation", "transaction-number-series"],
  "settings/templates": ["customisation", "pdf-templates"],
  "settings/emails/templates": ["reminders", "email-notifications"],
  "settings/preferences/custommodule-getstarted": ["custom-modules", "overview"],
  "settings/developerspace/apidashboard": ["developer-data", "api-usage"],
  "settings/databackup": ["developer-data", "data-backup"],
  "settings/backupdocs": ["developer-data", "backup-documents"],
  "settings/integrations/otherapps": ["integrations", "other-apps"],
};

const getSettingSelection = (route) => {
  const alias = settingsRouteAliases[route];
  if (alias) {
    const selection = findSettingSelection(alias[0], alias[1]);
    if (!selection) return null;
    return {
      section: selection.section,
      item: {
        ...selection.item,
        baseRoute: selection.item.route || settingRoute(alias[0], alias[1]),
        route,
        view: alias[2] || "",
      },
    };
  }

  const directSelection = findSettingByDefinedRoute(route);
  if (directSelection) return directSelection;

  const subRoute = route.match(/^(.*)\/(custombuttons|relatedlists|customfields)$/);
  if (subRoute) {
    const baseRoute = subRoute[1];
    const subSelection = settingsRouteAliases[baseRoute]
      ? findSettingSelection(settingsRouteAliases[baseRoute][0], settingsRouteAliases[baseRoute][1])
      : findSettingByDefinedRoute(baseRoute);
    if (subSelection) {
      return {
        section: subSelection.section,
        item: {
          ...subSelection.item,
          baseRoute: subSelection.item.route || baseRoute,
          route,
          view: settingSubRouteLabels[subRoute[2]],
        },
      };
    }
  }

  const [root, sectionId, itemId] = route.split("/");
  if (root !== "settings" || !sectionId) return null;
  return findSettingSelection(sectionId, itemId);
};

const normalizeLocalRecord = (moduleKey, form) => ({
  id: form.id || `${moduleKey.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}`,
  date: form.date || today,
  number: form.number || `NEW-${Math.floor(Math.random() * 9000 + 1000)}`,
  name: form.name || "New record",
  status: form.status || "Draft",
  dueDate: form.dueDate || today,
  amount: Number(form.amount || 0),
  balance: Number(form.balance ?? form.amount ?? 0),
  owner: form.owner || defaultUser,
  order: form.order || "",
});

const apiJson = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "Request failed");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
};

const fetchSession = () => apiJson("/api/session");

const fetchBootstrap = async () => apiJson("/api/bootstrap");

const brandLogoStorageKey = "aqua-best-brand-logo";

const readStoredBrandLogo = () => {
  try {
    const rawLogo = window.localStorage.getItem(brandLogoStorageKey);
    return rawLogo ? JSON.parse(rawLogo) : null;
  } catch {
    return null;
  }
};

const writeStoredBrandLogo = (logo) => {
  try {
    window.localStorage.setItem(brandLogoStorageKey, JSON.stringify(logo));
  } catch {
    // Static hosting may block storage in rare private-browser cases; the live preview still works for the session.
  }
};

const printCurrency = (value) => `AED ${Number(value || 0).toFixed(2)}`;

const escapePrintText = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const openPrintableDocument = ({
  documentTitle,
  number,
  customer,
  date,
  dueDate,
  order,
  items = [],
  taxableSubtotal,
  vatTotal,
  total,
  notes,
  terms,
  owner,
  status,
}) => {
  const printWindow = window.open("", "_blank", "width=980,height=760");
  if (!printWindow) return false;

  const rows = items.length
    ? items
    : [{ name: "Sales and services", quantity: 1, rate: Number(total || 0), discount: 0, tax: 0 }];
  const rowsHtml = rows
    .map((item, index) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const base = quantity * rate;
      const discount = Number(item.discount || 0);
      const taxable = base - base * (discount / 100);
      const tax = taxable * (Number(item.tax || 0) / 100);
      const amount = taxable + tax;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapePrintText(item.name || "Sales and services")}</td>
          <td class="num">${quantity.toFixed(2)}</td>
          <td class="num">${printCurrency(rate)}</td>
          <td class="num">${discount.toFixed(2)}%</td>
          <td class="num">${Number(item.tax || 0).toFixed(2)}%</td>
          <td class="num">${printCurrency(amount)}</td>
        </tr>
      `;
    })
    .join("");

  const savedLogo = readStoredBrandLogo();
  const safeLogo = savedLogo?.dataUrl ? escapePrintText(savedLogo.dataUrl) : "";
  const printLogoHtml = safeLogo ? `<img src="${safeLogo}" alt="Aqua Best logo" />` : `<span>AB</span>`;
  const safeTitle = escapePrintText(documentTitle);
  const documentHtml = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${safeTitle} ${escapePrintText(number)}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #eef2f7; color: #111827; font-family: Arial, sans-serif; }
          .sheet { width: 210mm; min-height: 297mm; margin: 18px auto; background: #fff; padding: 28px; box-shadow: 0 18px 48px rgba(15, 23, 42, .18); }
          .top { display: flex; justify-content: space-between; gap: 24px; border-bottom: 3px solid #1f2a44; padding-bottom: 18px; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand h1 { margin: 0; font-size: 26px; letter-spacing: 0; }
          .brand p, .meta p, .bill-to p, .notes p { margin: 4px 0; color: #4b5563; font-size: 13px; }
          .print-logo { display: grid; width: 58px; height: 58px; flex: 0 0 auto; place-items: center; overflow: hidden; border-radius: 8px; background: #1f2a44; color: #fff; font-weight: 800; }
          .print-logo img { width: 100%; height: 100%; object-fit: contain; background: #fff; }
          .doc-title { text-align: right; }
          .doc-title h2 { margin: 0 0 8px; color: #0f4c81; font-size: 24px; }
          .status { display: inline-block; border: 1px solid #cbd5e1; border-radius: 999px; padding: 4px 10px; color: #334155; font-size: 12px; font-weight: 700; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
          .box { border: 1px solid #e5e7eb; padding: 14px; }
          .box h3 { margin: 0 0 8px; font-size: 13px; color: #64748b; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #f1f5f9; color: #334155; font-size: 12px; text-align: left; padding: 10px; border: 1px solid #e2e8f0; }
          td { padding: 10px; border: 1px solid #e5e7eb; font-size: 13px; vertical-align: top; }
          .num { text-align: right; white-space: nowrap; }
          .totals { width: 320px; margin-left: auto; margin-top: 18px; border: 1px solid #e5e7eb; }
          .totals div { display: flex; justify-content: space-between; padding: 9px 12px; border-bottom: 1px solid #e5e7eb; }
          .totals div:last-child { border-bottom: 0; background: #1f2a44; color: #fff; font-weight: 700; }
          .notes { display: grid; gap: 12px; margin-top: 24px; }
          .actions { position: sticky; top: 0; display: flex; justify-content: flex-end; gap: 8px; padding: 10px; background: #eef2f7; }
          .actions button { border: 0; border-radius: 4px; background: #2563eb; color: #fff; padding: 9px 14px; font-weight: 700; cursor: pointer; }
          @media print {
            body { background: #fff; }
            .actions { display: none; }
            .sheet { width: auto; min-height: auto; margin: 0; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="actions"><button onclick="window.print()">Print / Save PDF</button></div>
        <main class="sheet">
          <section class="top">
            <div class="brand">
              <div class="print-logo">${printLogoHtml}</div>
              <div>
                <h1>Aqua Best UAE</h1>
                <p>Office 202266, United Arab Emirates</p>
                <p>VAT enabled accounting document</p>
              </div>
            </div>
            <div class="doc-title">
              <h2>${safeTitle}</h2>
              <p><strong>${escapePrintText(number)}</strong></p>
              <span class="status">${escapePrintText(status || "Draft")}</span>
            </div>
          </section>
          <section class="grid">
            <div class="box bill-to">
              <h3>Bill To</h3>
              <p><strong>${escapePrintText(customer || "Walk-in Customer")}</strong></p>
              <p>Customer account</p>
            </div>
            <div class="box meta">
              <h3>Document Details</h3>
              <p>Date: <strong>${escapePrintText(date)}</strong></p>
              <p>Due Date: <strong>${escapePrintText(dueDate)}</strong></p>
              <p>Order Number: <strong>${escapePrintText(order || "-")}</strong></p>
              <p>Prepared By: <strong>${escapePrintText(owner || defaultUser)}</strong></p>
            </div>
          </section>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Details</th>
                <th class="num">Qty</th>
                <th class="num">Rate</th>
                <th class="num">Discount</th>
                <th class="num">VAT</th>
                <th class="num">Amount</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <section class="totals">
            <div><span>Taxable Sub Total</span><strong>${printCurrency(taxableSubtotal)}</strong></div>
            <div><span>VAT Total</span><strong>${printCurrency(vatTotal)}</strong></div>
            <div><span>Total</span><strong>${printCurrency(total)}</strong></div>
          </section>
          <section class="notes">
            <div class="box">
              <h3>Customer Notes</h3>
              <p>${escapePrintText(notes || "Thank you for your business.")}</p>
            </div>
            <div class="box">
              <h3>Terms & Conditions</h3>
              <p>${escapePrintText(terms || "This document was generated by Aqua Best Accounts.")}</p>
            </div>
          </section>
        </main>
      </body>
    </html>`;

  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 350);
  return true;
};

const iconFor = (Icon, className = "") => <Icon className={className} size={18} strokeWidth={1.9} />;

function IconButton({ label, children, className = "", ...props }) {
  return (
    <button className={`icon-button ${className}`} title={label} aria-label={label} type="button" {...props}>
      {children}
    </button>
  );
}

function AuthScreen({ mode, error, onAuthenticated }) {
  const isSetup = mode === "setup";
  const [form, setForm] = useState({
    name: "Accounts Admin",
    email: "admin@aquabest.site",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(error || "");
  const [submitting, setSubmitting] = useState(false);
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (isSetup && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      const payload = await apiJson(isSetup ? "/api/auth/setup" : "/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      await onAuthenticated(payload.user);
    } catch (authError) {
      setMessage(authError.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <BookOpen size={28} />
          </div>
          <div>
            <h1>{isSetup ? "Create Admin Account" : "Aqua Best Login"}</h1>
            <p>{isSetup ? "First admin controls all users and roles." : "Sign in to continue to Aqua Best Accounts."}</p>
          </div>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {isSetup && (
            <label>
              <span>Admin Name</span>
              <input value={form.name} onChange={(event) => setField("name", event.target.value)} autoComplete="name" required />
            </label>
          )}
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} autoComplete="email" required autoFocus={!isSetup} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => setField("password", event.target.value)} autoComplete={isSetup ? "new-password" : "current-password"} required minLength={8} />
          </label>
          {isSetup && (
            <label>
              <span>Confirm Password</span>
              <input type="password" value={form.confirmPassword} onChange={(event) => setField("confirmPassword", event.target.value)} autoComplete="new-password" required minLength={8} />
            </label>
          )}
          {message && <div className="auth-message">{message}</div>}
          <button type="submit" className="primary-button" disabled={submitting}>
            <ShieldCheck size={16} />
            {submitting ? "Please wait..." : isSetup ? "Create Secure Admin" : "Secure Login"}
          </button>
        </form>
        <div className="auth-security-note">
          <strong>Protected login</strong>
          <span>Passwords are hashed on the server and sessions use HttpOnly cookies.</span>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [auth, setAuth] = useState({ loading: true, user: null, setupRequired: false, error: "" });
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

  const loadBootstrap = async () => {
    const payload = await fetchBootstrap();
    setBootstrap(payload);
    setRecords(payload.records);
    return payload;
  };

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const session = await fetchSession();
        if (cancelled) return;
        setAuth({ loading: false, user: session.user || null, setupRequired: Boolean(session.setupRequired), error: "" });
        if (session.user) await loadBootstrap();
      } catch {
        if (!cancelled) {
          setAuth({ loading: false, user: null, setupRequired: false, error: "Secure login server is not available" });
        }
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
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

  useEffect(() => {
    if (!quickCreate) return undefined;
    const onPointerDown = (event) => {
      if (!event.target.closest(".quick-create-wrap")) setQuickCreate(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [quickCreate]);

  const currentModule = useMemo(() => {
    if (route.startsWith("documents")) return "documents";
    if (route.startsWith("reports")) return "reports";
    if (route.startsWith("banking")) return "banking";
    if (route.startsWith("settings")) return "settings";
    if (route.startsWith("admin")) return "admin";
    if (route.startsWith("invoices/new")) return "invoices";
    if (route.startsWith("quotes/new")) return "quotes";
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
    await loadBootstrap();
    showToast("Data refreshed");
  };

  const completeAuth = async (user) => {
    setAuth({ loading: false, user, setupRequired: false, error: "" });
    await loadBootstrap();
    setRoute("home/dashboard");
  };

  const logout = async () => {
    await apiJson("/api/auth/logout", { method: "POST" }).catch(() => null);
    setAuth({ loading: false, user: null, setupRequired: false, error: "" });
    setBootstrap(null);
    setRecords({});
    setRoute("home/dashboard");
  };

  const saveRecord = async (moduleKey, form) => {
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/records/${moduleKey}/${form.id}` : `/api/records/${moduleKey}`;
    const payload = await apiJson(url, {
      method,
      body: JSON.stringify(form),
    });
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
    await apiJson(`/api/records/${moduleKey}/${id}`, { method: "DELETE" });
    setRecords((current) => ({
      ...current,
      [moduleKey]: (current[moduleKey] || []).filter((row) => row.id !== id),
    }));
    setSelectedRecord(null);
    showToast("Record deleted");
  };

  if (auth.loading) {
    return (
      <div className="loading-screen">
        <div className="loader-logo">A</div>
        <span>Checking secure login...</span>
      </div>
    );
  }

  if (auth.setupRequired) {
    return <AuthScreen mode="setup" error={auth.error} onAuthenticated={completeAuth} />;
  }

  if (!auth.user) {
    return <AuthScreen mode="login" error={auth.error} onAuthenticated={completeAuth} />;
  }

  if (!bootstrap) {
    return (
      <div className="loading-screen">
        <div className="loader-logo">A</div>
        <span>Loading {appName}...</span>
      </div>
    );
  }

  const openNew = (moduleKey = currentModule) => {
    if (moduleKey === "invoices" || moduleKey === "quotes") {
      setRoute(`${moduleKey}/new`);
      return;
    }
    setModal({ moduleKey, record: null });
  };

  return (
    <div className="app-shell">
      <TopBar
        organization={bootstrap.organization}
        currentUser={auth.user}
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
        onNew={(moduleKey) => {
          setQuickCreate(false);
          openNew(moduleKey);
        }}
        onDrawer={setDrawer}
        onLogout={logout}
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
            currentUser={auth.user}
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

function TopBar({
  organization,
  currentUser,
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
  onLogout,
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
        <span className="brand-name">{shortBrand}</span>
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
          <IconButton label="Quick Create" className={`primary-icon ${quickCreate ? "is-open" : ""}`} onClick={onQuickCreate}>
            <Plus size={22} />
          </IconButton>
          {quickCreate && <span className="quick-tooltip">Quick Create</span>}
          {quickCreate && <QuickCreateMenu onNew={onNew} />}
        </div>
        <IconButton label="Recent Activities" onClick={() => onDrawer("activities")}>
          <Activity size={18} />
        </IconButton>
        <IconButton label="Notifications" onClick={() => onDrawer("notifications")}>
          <Bell size={18} />
        </IconButton>
        <IconButton label="Settings" onClick={() => setRoute("settings")}>
          <Settings size={18} />
        </IconButton>
        {currentUser?.role === "Admin" && (
          <IconButton label="Admin Panel" onClick={() => setRoute("admin/users")}>
            <ShieldCheck size={18} />
          </IconButton>
        )}
        <IconButton label={`${organization.user || defaultUser} (${currentUser?.role || "User"})`} className="avatar-button">
          <UserRound size={19} />
        </IconButton>
        <IconButton label="Logout" onClick={onLogout}>
          <LogOut size={18} />
        </IconButton>
        <IconButton label="Apps">
          <LayoutGrid size={18} />
        </IconButton>
      </div>
    </header>
  );
}

function QuickCreateMenu({ onNew }) {
  const groups = [
    {
      title: "General",
      icon: LayoutGrid,
      items: [
        { label: "Add Users", module: "users" },
        { label: "Item", module: "inventory/items" },
        { label: "Inventory Adjustments", module: "inventory/adjustments" },
        { label: "Journal Entry", module: "accountant/journals" },
        { label: "Log Time", module: "timesheet/alltimeentries" },
        { label: "Weekly Log", module: "weeklylogs" },
      ],
    },
    {
      title: "Sales",
      icon: ShoppingCart,
      items: [
        { label: "Customer", module: "contacts" },
        { label: "Estimates", module: "quotes" },
        { label: "Delivery Challan", module: "deliverychallans" },
        { label: "Invoices", module: "invoices" },
        { label: "Recurring Invoice", module: "recurringinvoices" },
        { label: "Retail Invoice", module: "retailinvoices" },
        { label: "Retainer Invoices", module: "retainerinvoices" },
        { label: "Sales Order", module: "salesorders" },
        { label: "Customer Payment", module: "paymentsreceived" },
        { label: "Credit Notes", module: "creditnotes" },
      ],
    },
    {
      title: "Purchases",
      icon: ShoppingBag,
      items: [
        { label: "Vendor", module: "vendors" },
        { label: "Expenses", module: "expenses" },
        { label: "Recurring Expense", module: "recurringexpenses" },
        { label: "Bills", module: "bills" },
        { label: "Recurring Bills", module: "recurringbills" },
        { label: "Purchase Orders", module: "purchaseorders" },
        { label: "Vendor Payment", module: "paymentsmade" },
        { label: "Vendor Credits", module: "vendorcredits" },
      ],
    },
    {
      title: "Banking",
      icon: Landmark,
      items: [
        { label: "Bank Transfer", module: "banktransfers" },
        { label: "Employee Reimbursements", module: "employee-reimbursements" },
        { label: "Card Payment", module: "cardpayments" },
        { label: "Owner Drawings", module: "ownerdrawings" },
        { label: "Other Income", module: "otherincome" },
      ],
    },
  ];
  return (
    <div className="quick-menu" role="menu" aria-label="Quick Create">
      {groups.map((group) => (
        <section key={group.title} className="quick-column">
          <div className="quick-title">
            {iconFor(group.icon, 16)}
            <span>{group.title}</span>
          </div>
          <div className="quick-items">
            {group.items.map((item) => (
              <button key={item.module} type="button" role="menuitem" onClick={() => onNew(item.module)}>
                <CirclePlus size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
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
    return <InvoiceForm key="tax-invoice-form" moduleKey="invoices" documentLabel="Tax Invoice" onSave={props.onSave} onCancel={() => setRoute("invoices")} showToast={props.showToast} />;
  }

  if (route === "quotes/new") {
    return <InvoiceForm key="quotation-form" moduleKey="quotes" documentLabel="Quotation" onSave={props.onSave} onCancel={() => setRoute("quotes")} showToast={props.showToast} />;
  }

  if (route === "settings" || route.startsWith("settings/")) {
    return <SettingsPage route={route} showToast={props.showToast} />;
  }

  if (route === "admin/users" || route.startsWith("admin/")) {
    return <AdminUsersPage currentUser={props.currentUser} showToast={props.showToast} />;
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

const adminRoles = ["Admin", "Sales", "Purchases", "Accountant", "Staff"];

function AdminUsersPage({ currentUser, showToast }) {
  const [users, setUsers] = useState([]);
  const [passwordDrafts, setPasswordDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Staff",
    status: "Active",
    password: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const payload = await apiJson("/api/admin/users");
      setUsers(payload.users || []);
    } catch (error) {
      showToast(error.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "Admin") loadUsers();
  }, [currentUser?.role]);

  if (currentUser?.role !== "Admin") {
    return (
      <div className="page-stack">
        <section className="panel admin-denied">
          <ShieldCheck size={28} />
          <h1>Admin access required</h1>
          <p>Only an active admin can manage users and roles.</p>
        </section>
      </div>
    );
  }

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const adminUsers = users.filter((user) => user.role === "Admin").length;
  const setFormField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setUserField = (id, key, value) => setUsers((current) => current.map((user) => (user.id === id ? { ...user, [key]: value } : user)));
  const setPasswordDraft = (id, value) => setPasswordDrafts((current) => ({ ...current, [id]: value }));

  const createUser = async (event) => {
    event.preventDefault();
    try {
      const payload = await apiJson("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setUsers((current) => [...current, payload.user]);
      setForm({ name: "", email: "", role: "Staff", status: "Active", password: "" });
      showToast("User created");
    } catch (error) {
      showToast(error.message || "Unable to create user");
    }
  };

  const saveUser = async (user) => {
    try {
      const payload = await apiJson(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          password: passwordDrafts[user.id] || "",
        }),
      });
      setUsers((current) => current.map((entry) => (entry.id === user.id ? payload.user : entry)));
      setPasswordDraft(user.id, "");
      showToast("User updated");
    } catch (error) {
      showToast(error.message || "Unable to update user");
    }
  };

  const deactivateUser = async (user) => {
    try {
      const payload = await apiJson(`/api/admin/users/${user.id}`, { method: "DELETE" });
      setUsers((current) => current.map((entry) => (entry.id === user.id ? payload.user : entry)));
      showToast("User deactivated");
    } catch (error) {
      showToast(error.message || "Unable to deactivate user");
    }
  };

  return (
    <div className="page-stack admin-page">
      <section className="module-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Create users, assign roles, reset passwords, and disable access.</p>
        </div>
        <button type="button" className="secondary-button" onClick={loadUsers}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      <section className="summary-strip admin-summary">
        <div><span>Total Users</span><strong>{users.length}</strong></div>
        <div><span>Active Users</span><strong>{activeUsers}</strong></div>
        <div><span>Admins</span><strong>{adminUsers}</strong></div>
        <div><span>Signed In</span><strong>{currentUser.name}</strong></div>
      </section>

      <section className="panel admin-create-panel">
        <div className="panel-header">
          <h2><UsersRound size={18} /> Create User</h2>
        </div>
        <form className="admin-user-form" onSubmit={createUser}>
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setFormField("name", event.target.value)} required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setFormField("email", event.target.value)} required />
          </label>
          <label>
            <span>Role</span>
            <select value={form.role} onChange={(event) => setFormField("role", event.target.value)}>
              {adminRoles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={form.status} onChange={(event) => setFormField("status", event.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <label>
            <span>Temporary Password</span>
            <input type="password" value={form.password} minLength={8} onChange={(event) => setFormField("password", event.target.value)} required />
          </label>
          <button type="submit" className="primary-button">
            <Plus size={16} />
            Create User
          </button>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="panel-header">
          <h2>User Access</h2>
          <span className="status good">Secure sessions enabled</span>
        </div>
        <div className="table-wrap">
          <table className="data-table admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>New Password</th>
                <th>Last Login</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7">Loading users...</td>
                </tr>
              )}
              {!loading && users.map((user) => (
                <tr key={user.id}>
                  <td><input value={user.name} onChange={(event) => setUserField(user.id, "name", event.target.value)} /></td>
                  <td><input type="email" value={user.email} onChange={(event) => setUserField(user.id, "email", event.target.value)} /></td>
                  <td>
                    <select value={user.role} onChange={(event) => setUserField(user.id, "role", event.target.value)}>
                      {adminRoles.map((role) => <option key={role}>{role}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={user.status} onChange={(event) => setUserField(user.id, "status", event.target.value)}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </td>
                  <td>
                    <input type="password" placeholder="Leave unchanged" minLength={8} value={passwordDrafts[user.id] || ""} onChange={(event) => setPasswordDraft(user.id, event.target.value)} />
                  </td>
                  <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="secondary-button" onClick={() => saveUser(user)}>Save</button>
                      <button type="button" className="secondary-button danger-action" onClick={() => deactivateUser(user)}>Disable</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="7">No users yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
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
          <span>Aqua Best Support: <strong>{bootstrap.organization.support}</strong></span>
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
  const incomeTotal = metrics.incomeExpense?.[0]?.value || 0;
  const expenseTotal = metrics.incomeExpense?.[1]?.value || 0;
  return (
    <>
      <div className="kpi-grid">
        <AmountCard
          title="Total Receivables"
          caption={`Total Unpaid Tax Invoices ${currency(metrics.receivables.total)}`}
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
            <span>Total Income <strong>{currency(incomeTotal)}</strong></span>
            <span>Total Expenses <strong>{currency(expenseTotal)}</strong></span>
          </div>
        </section>
        <section className="panel">
          <div className="panel-header">
            <h2>Top Expenses</h2>
            <button type="button" className="link-button">This Fiscal Year <ChevronDown size={14} /></button>
          </div>
          {metrics.expenses.length > 0 ? (
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
                    <div className="bar-track"><span style={{ width: `${(item.value / (metrics.expenses[0]?.value || 1)) * 100}%`, background: item.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyPanelMessage title="No expenses yet" text="Create expenses or bills and this chart will update automatically." />
          )}
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
  const unbilledHours = projects.reduce((sum, project) => sum + Number(String(project.unbilledHours || "0").split(":")[0] || 0), 0);
  const unbilledExpenses = projects.reduce((sum, project) => sum + Number(project.unbilledExpenses || 0), 0);
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Projects</h2>
        <a className="link-button" href="#/timesheet/projects">View All</a>
      </div>
      <div className="project-stats">
        <span><strong>{String(unbilledHours).padStart(2, "0")}:00</strong> Unbilled Hours</span>
        <span><strong>{currency(unbilledExpenses)}</strong> Unbilled Expenses</span>
      </div>
      <div className="mini-table">
        {projects.length > 0 ? (
          projects.map((project) => (
            <a key={project.name} href="#/timesheet/projects">
              <span>
                <strong>{project.name}</strong>
                <small>{project.customer}</small>
              </span>
              <em>{project.budget}</em>
            </a>
          ))
        ) : (
          <EmptyPanelMessage title="No projects yet" text="Create your first project from Time Tracking." />
        )}
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
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id}>
              <span>{account.type}</span>
              <strong>{compactCurrency(account.booksAmount)}</strong>
              <small>{account.uncategorized || "No"} uncategorized</small>
            </div>
          ))
        ) : (
          <EmptyPanelMessage title="No bank accounts yet" text="Add a bank account when you are ready to reconcile." />
        )}
      </div>
    </section>
  );
}

function EmptyPanelMessage({ title, text }) {
  return (
    <div className="empty-panel-message">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function GettingStarted({ showToast }) {
  const tasks = [
    ["Organization Profile", "Completed"],
    ["Taxes", "Configured"],
    ["Opening Balances", "Pending"],
    ["Payment Gateway", "Pending"],
    ["Tax Invoice Template", "Completed"],
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
      {["Secure login and admin user management are enabled.", "New invoice template gallery is ready for UAE organizations.", "Fresh account setup starts with clean books and zero balances."].map((item) => (
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
      { label: route === "quotes" ? "Open Quotation" : salesLike ? "Overdue Tax Invoice" : purchaseLike ? "Overdue Bill" : "Open", value: currency(overdue) },
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
                <th>Amount in Ledger</th>
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
  const income = metrics.incomeExpense?.[0]?.value || 0;
  const expenses = metrics.incomeExpense?.[1]?.value || 0;
  const costOfGoods = 0;
  const rows = [
    ["Operating Income", income],
    ["Cost of Goods Sold", -costOfGoods],
    ["Gross Profit", income - costOfGoods],
    ["Operating Expenses", -expenses],
    ["Net Profit", income - expenses - costOfGoods],
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

function InvoiceForm({ moduleKey = "invoices", documentLabel = "Tax Invoice", onSave, onCancel, showToast }) {
  const isQuotation = moduleKey === "quotes";
  const documentTitle = isQuotation ? "Quotation" : "Tax Invoice";
  const documentNumber = isQuotation ? "QUO-0000" : "TAX-INV-0000";
  const moduleTitle = moduleInfo[moduleKey]?.title || "Tax Invoices";
  const [draft, setDraft] = useState({
    customer: "",
    number: documentNumber,
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
  const taxableSubtotal = items.reduce((sum, item) => {
    const base = Number(item.quantity || 0) * Number(item.rate || 0);
    return sum + base - base * (Number(item.discount || 0) / 100);
  }, 0);
  const vatTotal = items.reduce((sum, item) => {
    const base = Number(item.quantity || 0) * Number(item.rate || 0);
    const discounted = base - base * (Number(item.discount || 0) / 100);
    return sum + discounted * (Number(item.tax || 0) / 100);
  }, 0);
  const subtotal = taxableSubtotal + vatTotal;
  const total = subtotal + Number(draft.shipping || 0) + Number(draft.adjustment || 0);
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const save = async (status) => {
    await onSave(moduleKey, {
      number: draft.number,
      name: draft.customer || "Walk-in Customer",
      order: draft.order,
      date: draft.invoiceDate,
      dueDate: draft.dueDate,
      amount: total,
      balance: status === "Paid" ? 0 : total,
      status,
      owner: draft.salesperson || defaultUser,
    });
    showToast(status === "Sent" ? `${documentTitle} saved and queued to send` : `${documentTitle} saved as draft`);
    setRoute(moduleKey);
  };

  const printCurrent = () => {
    const opened = openPrintableDocument({
      documentTitle,
      number: draft.number,
      customer: draft.customer || "Walk-in Customer",
      date: draft.invoiceDate,
      dueDate: draft.dueDate,
      order: draft.order,
      items,
      taxableSubtotal,
      vatTotal,
      total,
      notes: draft.notes,
      terms: draft.terms,
      owner: draft.salesperson || defaultUser,
      status: "Draft",
    });
    showToast(opened ? `${documentTitle} print preview opened` : "Allow pop-ups to print this document");
  };

  return (
    <div className="invoice-screen">
      <section className="invoice-header">
        <button type="button" className="back-button" onClick={onCancel}>
          <ArrowLeft size={16} /> {moduleTitle}
        </button>
        <h1>New {documentTitle}</h1>
      </section>
      <section className="invoice-form panel">
        <div className="form-grid">
          <label className="span-2">
            <span>Customer Name*</span>
            <select value={draft.customer} onChange={(event) => updateDraft("customer", event.target.value)}>
              <option value="">Select or add a customer</option>
            </select>
          </label>
          <label>
            <span>{documentTitle}#*</span>
            <input value={draft.number} onChange={(event) => updateDraft("number", event.target.value)} />
          </label>
          <label>
            <span>Order Number</span>
            <input value={draft.order} onChange={(event) => updateDraft("order", event.target.value)} />
          </label>
          <label>
            <span>{documentTitle} Date*</span>
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
              <small>Will be displayed on the {documentTitle.toLowerCase()}</small>
            </label>
            <label>
              <span>Terms & Conditions</span>
              <textarea value={draft.terms} placeholder="Enter the terms and conditions of your business to be displayed in your transaction" onChange={(event) => updateDraft("terms", event.target.value)} />
            </label>
            <div className="attachment-box">
              <FileText size={20} />
              <strong>Attach File(s) to {documentTitle}</strong>
              <button type="button" className="secondary-button" onClick={() => showToast("File chooser opened")}>Choose File</button>
              <span>You can upload a maximum of 10 files, 10MB each</span>
            </div>
          </div>
          <div className="total-card">
            <TotalRow label="Taxable Sub Total" value={taxableSubtotal} />
            <TotalRow label="VAT Total" value={vatTotal} />
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
          <button type="button" className="secondary-button" onClick={printCurrent}>
            <Printer size={16} /> Print / PDF
          </button>
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
      owner: defaultUser,
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
  const canPrint = moduleKey === "invoices" || moduleKey === "quotes";
  const printRecord = () => {
    const total = Number(record.amount || 0);
    const taxableSubtotal = total ? total / 1.05 : 0;
    const vatTotal = total - taxableSubtotal;
    const opened = openPrintableDocument({
      documentTitle: info.singular,
      number: record.number,
      customer: record.name,
      date: record.date,
      dueDate: record.dueDate,
      order: record.order || "",
      items: [{ name: record.order ? `Sales/services - ${record.order}` : "Sales and services", quantity: 1, rate: taxableSubtotal, discount: 0, tax: total ? 5 : 0 }],
      taxableSubtotal,
      vatTotal,
      total,
      notes: "Thank you for your business.",
      terms: "This document was generated by Aqua Best Accounts.",
      owner: record.owner,
      status: record.status,
    });
    showToast(opened ? `${info.singular} print preview opened` : "Allow pop-ups to print this document");
  };
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
          {canPrint && (
            <button className="secondary-button" type="button" onClick={printRecord}>
              <Printer size={16} /> Print / PDF
            </button>
          )}
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

function SettingsPage({ route, showToast }) {
  const selected = getSettingSelection(route);
  const [query, setQuery] = useState("");
  const filteredSections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return settingsSections;
    return settingsSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => `${section.title} ${item.label} ${item.summary}`.toLowerCase().includes(needle)),
      }))
      .filter((section) => section.items.length || section.title.toLowerCase().includes(needle));
  }, [query]);

  if (selected) {
    return <SettingsDetail section={selected.section} item={selected.item} showToast={showToast} />;
  }

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <h1>All Settings</h1>
        <div className="settings-page-tools">
          <label className="settings-search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your settings" aria-label="Search your settings" />
          </label>
          <button type="button" className="secondary-button" onClick={() => setRoute("home/dashboard")}>
            Close Settings
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="settings-grid">
        {filteredSections.map((section) => (
          <section key={section.id} className="settings-card">
            <div className="settings-card-title">
              <span className={`setting-icon ${section.tone}`}>{iconFor(section.icon)}</span>
              <h2>{section.title}</h2>
            </div>
            <div className="settings-card-items">
              {section.items.map((item) => (
                <a key={item.id} href={`#/${settingRoute(section.id, item.id)}`}>
                  <span>{item.label}</span>
                  <ChevronRight size={15} />
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
      {filteredSections.length === 0 && (
        <div className="empty-state">
          <h2>No settings found</h2>
          <button type="button" className="secondary-button" onClick={() => setQuery("")}>Clear Search</button>
        </div>
      )}
    </div>
  );
}

function SettingsDetail({ section, item, showToast }) {
  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button type="button" className="back-button" onClick={() => setRoute("settings")}>
          <ArrowLeft size={16} />
          All Settings
        </button>
        <div>
          <h1>{settingDisplayName(item)}</h1>
          <p>{section.title}</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => setRoute("home/dashboard")}>
          Close Settings
          <X size={14} />
        </button>
      </div>
      <div className="settings-detail-layout">
        <aside className="settings-detail-sidebar">
          <div className="settings-side-title">
            <span className={`setting-icon ${section.tone}`}>{iconFor(section.icon)}</span>
            <strong>{section.title}</strong>
          </div>
          {section.items.map((sideItem) => (
            <a key={sideItem.id} className={sideItem.id === item.id ? "active" : ""} href={`#/${settingRoute(section.id, sideItem.id)}`}>
              {sideItem.label}
            </a>
          ))}
        </aside>
        <SettingEditor section={section} item={item} showToast={showToast} />
      </div>
    </div>
  );
}

const settingDisplayName = (item) => (item.view ? `${item.label} ${item.view}` : item.label);

const settingsSubPagesFor = (section, item) => {
  const baseRoute = item.baseRoute || item.route || settingRoute(section.id, item.id);
  const suffixes = [];
  if (section.id === "sales" || section.id === "purchases" || section.id === "items" || (section.id === "preferences" && item.id === "contacts")) {
    suffixes.push(["custombuttons", "Custom Buttons"], ["relatedlists", "Related Lists"]);
  }
  if (["contacts", "expenses", "items", "purchase-orders", "tax-invoices", "quotations"].includes(item.id)) {
    suffixes.push(["customfields", "Custom Fields"]);
  }
  if (!suffixes.length) return [];
  return [
    { label: "Main Settings", route: baseRoute, active: !item.view },
    ...suffixes.map(([suffix, label]) => ({
      label,
      route: `${baseRoute}/${suffix}`,
      active: item.view === label,
    })),
  ];
};

function defaultSettingValues(section, item) {
  const documentPrefix = {
    quotations: "QUO",
    "tax-invoices": "TAX-INV",
    "retainer-invoices": "RET",
    "sales-orders": "SO",
    shipments: "SHP",
    "delivery-challans": "DC",
    "recurring-invoices": "REC-INV",
    "credit-notes": "CN",
    "delivery-notes": "DN",
    "packing-slips": "PS",
    expenses: "EXP",
    "recurring-expenses": "REC-EXP",
    "recurring-bills": "REC-BILL",
    "purchase-orders": "PO",
  }[item.id];
  return {
    organizationName: "Aqua Best UAE",
    legalName: "Aqua Best UAE",
    email: "accounts@aquabestuae.com",
    phone: "+971 50 000 0000",
    address: "Dubai, United Arab Emirates",
    trn: "100000000000003",
    industry: "Water Treatment & Trading",
    fiscalYear: "January - December",
    timeZone: "(GMT +04:00) Gulf Standard Time",
    portalName: "aquabestuae",
    city: "Dubai",
    emirate: "Dubai",
    country: "United Arab Emirates",
    postalCode: "00000",
    baseCurrency: "AED",
    language: "English",
    dateFormat: "dd MMM yyyy",
    displayName: item.label,
    status: "Enabled",
    owner: defaultUser,
    prefix: documentPrefix || "AB",
    nextNumber: documentPrefix === "TAX-INV" ? "0001" : documentPrefix === "QUO" ? "0001" : "001",
    template: item.id === "quotations" ? "Aqua Best Quotation" : item.id === "pdf-templates" ? "Aqua Best Tax Invoice and Quotation" : "Aqua Best Tax Invoice",
    paymentTerms: "Due on Receipt",
    vatRate: "5",
    filingFrequency: "Quarterly",
    filingMonths: "January, April, July, October",
    taxBasis: "Accrual",
    reminderDays: "7",
    portalAccess: true,
    approvals: true,
    autoEmail: ["email-notifications", "recurring-invoices", "recurring-expenses", "recurring-bills"].includes(item.id),
    printPdf: true,
    showVat: true,
    lockFiledTransactions: true,
  };
}

function SettingEditor({ section, item, showToast }) {
  const [values, setValues] = useState(() => defaultSettingValues(section, item));

  useEffect(() => {
    setValues(defaultSettingValues(section, item));
  }, [section.id, item.id]);

  const updateField = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const displayLabel = settingDisplayName(item);
  const editorHeading = displayLabel.endsWith("Settings") ? displayLabel : `${displayLabel} Settings`;
  const saveSettings = () => showToast(displayLabel.endsWith("Settings") ? `${displayLabel} saved` : `${displayLabel} settings saved`);
  const field = (label, key, type = "text") => (
    <label>
      <span>{label}</span>
      <input type={type} value={values[key]} onChange={(event) => updateField(key, event.target.value)} />
    </label>
  );
  const selectField = (label, key, options) => (
    <label>
      <span>{label}</span>
      <select value={values[key]} onChange={(event) => updateField(key, event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
  const switchRow = (label, key, caption) => (
    <label className="settings-switch-row">
      <input type="checkbox" checked={values[key]} onChange={(event) => updateField(key, event.target.checked)} />
      <span>
        <strong>{label}</strong>
        <em>{caption}</em>
      </span>
    </label>
  );

  const openSamplePrint = () => {
    const isQuote = item.id === "quotations";
    const isTaxInvoice = item.id === "tax-invoices" || item.id === "pdf-templates";
    const documentTitle = isQuote ? "Quotation" : isTaxInvoice ? "Tax Invoice" : item.label;
    const opened = openPrintableDocument({
      documentTitle,
      number: `${values.prefix}-${values.nextNumber}`,
      customer: "Sample Customer",
      date: today,
      dueDate: today,
      order: isQuote ? "QUO-SAMPLE" : "AQUA-SAMPLE",
      items: [
        { name: "Water purification service", quantity: 1, rate: 1200, discount: 0, tax: Number(values.vatRate || 0) },
        { name: "Maintenance visit", quantity: 1, rate: 350, discount: 0, tax: Number(values.vatRate || 0) },
      ],
      taxableSubtotal: 1550,
      vatTotal: 1550 * (Number(values.vatRate || 0) / 100),
      total: 1550 + 1550 * (Number(values.vatRate || 0) / 100),
      notes: "Thank you for your business.",
      terms: values.paymentTerms,
      owner: defaultUser,
      status: "Draft",
    });
    showToast(opened ? `${documentTitle} sample opened` : "Popup blocked. Please allow popups to print.");
  };

  const isCustomButtons = item.view === "Custom Buttons";
  const isRelatedLists = item.view === "Related Lists";
  const isCustomFields = item.view === "Custom Fields";
  const isDocumentSetting = (section.id === "sales" || section.id === "purchases" || item.id === "pdf-templates" || item.id === "transaction-number-series") && !isCustomButtons && !isRelatedLists && !isCustomFields;
  const isOrganization = section.id === "organization";
  const isOrgProfile = section.id === "organization" && item.id === "profile";
  const isBranding = section.id === "organization" && item.id === "branding";
  const isCurrencies = section.id === "organization" && item.id === "currencies";
  const isOpeningBalances = section.id === "organization" && item.id === "opening-balances";
  const isGenericOrganization = isOrganization && !isOrgProfile && !isBranding && !isCurrencies && !isOpeningBalances;
  const isTaxRates = item.id === "tax-rates";
  const isTaxReturnSettings = item.id === "tax-return-settings";
  const isTaxes = section.id === "taxes" && !isTaxRates && !isTaxReturnSettings;
  const isUsers = item.id === "users";
  const isRoles = item.id === "roles";
  const isOnlinePayment = section.id === "online-payments";
  const isDeveloperData = section.id === "developer-data";
  const moduleRoute = {
    quotations: "quotes/new",
    "tax-invoices": "invoices/new",
  }[item.id];
  const subPages = settingsSubPagesFor(section, item);

  return (
    <section className="settings-editor">
      <div className="settings-editor-title">
        <div>
          <h2>{editorHeading}</h2>
          <p>{item.summary}</p>
        </div>
        <button type="button" className="primary-button" onClick={saveSettings}>
          <Check size={16} />
          Save
        </button>
      </div>

      {subPages.length > 0 && (
        <div className="settings-subpage-tabs" aria-label={`${item.label} settings sections`}>
          {subPages.map((subPage) => (
            <button
              key={subPage.route}
              type="button"
              className={subPage.active ? "active" : ""}
              onClick={() => setRoute(subPage.route)}
            >
              {subPage.label}
            </button>
          ))}
        </div>
      )}

      {isUsers && <UsersSettingBlock showToast={showToast} />}
      {isRoles && <RolesSettingBlock />}
      {isOnlinePayment && <PaymentGatewayBlock showToast={showToast} />}
      {isDeveloperData && <DeveloperDataBlock item={item} showToast={showToast} />}
      {isTaxRates && <TaxRatesSettingBlock showToast={showToast} />}
      {isTaxReturnSettings && <TaxReturnSettingsBlock values={values} field={field} selectField={selectField} switchRow={switchRow} />}
      {isCustomButtons && <CustomButtonsSettingBlock item={item} showToast={showToast} />}
      {isRelatedLists && <RelatedListsSettingBlock item={item} showToast={showToast} />}
      {isCustomFields && <CustomFieldsSettingBlock item={item} showToast={showToast} />}
      {isOrgProfile && <OrgProfileSettingBlock values={values} updateField={updateField} field={field} selectField={selectField} />}
      {isBranding && <BrandingSettingBlock values={values} updateField={updateField} showToast={showToast} />}
      {isCurrencies && <CurrenciesSettingBlock showToast={showToast} />}
      {isOpeningBalances && <OpeningBalancesSettingBlock showToast={showToast} />}

      {isGenericOrganization && (
        <>
          <div className="settings-editor-section">
            <h3>Organization Details</h3>
            <div className="settings-form-grid">
              {field("Organization Name", "organizationName")}
              {field("Legal Name", "legalName")}
              {field("Email", "email", "email")}
              {field("Phone", "phone")}
              <label className="span-2">
                <span>Address</span>
                <textarea rows="3" value={values.address} onChange={(event) => updateField("address", event.target.value)} />
              </label>
              {field("TRN", "trn")}
              {selectField("Base Currency", "baseCurrency", ["AED", "USD", "EUR", "GBP"])}
            </div>
          </div>
          <div className="settings-editor-section">
            <h3>Controls</h3>
            <div className="settings-switch-list">
              {switchRow("Use Aqua Best branding on documents", "printPdf", "Tax invoices, quotations and purchase documents")}
              {switchRow("Allow opening balance edits", "approvals", "Available to admin users")}
            </div>
          </div>
        </>
      )}

      {isTaxes && (
        <>
          <div className="settings-editor-section">
            <h3>UAE VAT</h3>
            <div className="settings-form-grid">
              {field("TRN", "trn")}
              {field("VAT Rate (%)", "vatRate", "number")}
              {selectField("Tax Basis", "taxBasis", ["Accrual", "Cash"])}
              {selectField("Filing Frequency", "filingFrequency", ["Monthly", "Quarterly", "Yearly"])}
            </div>
          </div>
          <div className="settings-editor-section">
            <h3>Controls</h3>
            <div className="settings-switch-list">
              {switchRow("Show VAT on Tax Invoice PDF", "showVat", "Prints VAT columns and totals")}
              {switchRow("Lock filed VAT transactions", "lockFiledTransactions", "Protects tax periods after return filing")}
            </div>
          </div>
        </>
      )}

      {isDocumentSetting && (
        <>
          <div className="settings-editor-section">
            <h3>Document Numbering</h3>
            <div className="settings-form-grid">
              {field("Prefix", "prefix")}
              {field("Next Number", "nextNumber")}
              {selectField("Default Status", "status", ["Draft", "Open", "Approved", "Sent"])}
              {selectField("Payment Terms", "paymentTerms", ["Due on Receipt", "Net 7", "Net 15", "Net 30"])}
            </div>
          </div>
          <div className="settings-editor-section">
            <h3>PDF & Print</h3>
            <div className="settings-form-grid">
              {field("PDF Template", "template")}
              {field("VAT Rate (%)", "vatRate", "number")}
            </div>
            <div className="settings-switch-list">
              {switchRow("Show Print / PDF button", "printPdf", "Available on saved Tax Invoices and Quotations")}
              {switchRow("Show VAT summary", "showVat", "Displays taxable amount, VAT and grand total")}
            </div>
            <div className="settings-template-preview">
              <div>
                <strong>{values.template}</strong>
                <span>{values.prefix}-{values.nextNumber}</span>
              </div>
              <em>Aqua Best UAE</em>
            </div>
            <div className="settings-action-row">
              {moduleRoute && (
                <button type="button" className="primary-button" onClick={() => setRoute(moduleRoute)}>
                  <Plus size={16} />
                  New {item.label === "Tax Invoices" ? "Tax Invoice" : "Quotation"}
                </button>
              )}
              <button type="button" className="secondary-button" onClick={openSamplePrint}>
                <Printer size={16} />
                Print Sample
              </button>
            </div>
          </div>
        </>
      )}

      {!isOrganization && !isTaxes && !isTaxRates && !isTaxReturnSettings && !isDocumentSetting && !isUsers && !isRoles && !isOnlinePayment && !isDeveloperData && !isCustomButtons && !isRelatedLists && !isCustomFields && (
        <>
          <div className="settings-editor-section">
            <h3>Details</h3>
            <div className="settings-form-grid">
              {field("Display Name", "displayName")}
              {selectField("Status", "status", ["Enabled", "Disabled", "Admin Only"])}
              {field("Default Owner", "owner")}
              {selectField("Language", "language", ["English", "Arabic"])}
            </div>
          </div>
          <div className="settings-editor-section">
            <h3>Controls</h3>
            <div className="settings-switch-list">
              {switchRow("Require approval", "approvals", "Applies before records are final")}
              {switchRow("Send email notifications", "autoEmail", "Uses Aqua Best account email")}
              {switchRow("Portal access", "portalAccess", "Available for approved contacts")}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function OrgProfileSettingBlock({ values, updateField, field, selectField }) {
  return (
    <>
      <div className="settings-profile-summary">
        <div className="settings-avatar">AB</div>
        <div>
          <h3>{values.organizationName}</h3>
          <p>{values.industry}</p>
        </div>
        <span className="status good">Active Organization</span>
      </div>
      <div className="settings-two-column">
        <div className="settings-editor-section">
          <h3>Organization Details</h3>
          <div className="settings-form-grid">
            {field("Organization Name", "organizationName")}
            {field("Legal Name", "legalName")}
            {field("Industry", "industry")}
            {field("TRN", "trn")}
            {selectField("Fiscal Year", "fiscalYear", ["January - December", "April - March", "July - June"])}
            {selectField("Time Zone", "timeZone", ["(GMT +04:00) Gulf Standard Time", "(GMT +00:00) UTC", "(GMT +05:30) India Standard Time"])}
            {field("Portal Name", "portalName")}
            {selectField("Base Currency", "baseCurrency", ["AED", "USD", "EUR", "GBP"])}
            {selectField("Date Format", "dateFormat", ["dd MMM yyyy", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"])}
            {selectField("Language", "language", ["English", "Arabic"])}
          </div>
        </div>
        <div className="settings-editor-section">
          <h3>Contact Details</h3>
          <div className="settings-form-grid single">
            {field("Email", "email", "email")}
            {field("Phone", "phone")}
            <label>
              <span>Organization Address</span>
              <textarea rows="4" value={values.address} onChange={(event) => updateField("address", event.target.value)} />
            </label>
            <div className="settings-form-grid">
              {field("City", "city")}
              {field("Emirate", "emirate")}
              {field("Country", "country")}
              {field("Postal Code", "postalCode")}
            </div>
          </div>
        </div>
      </div>
      <div className="settings-definition-grid">
        <div><span>Organization ID</span><strong>AB-UAE-2026</strong></div>
        <div><span>Edition</span><strong>Aqua Best Accounts</strong></div>
        <div><span>VAT Status</span><strong>UAE VAT enabled</strong></div>
        <div><span>Primary User</span><strong>{defaultUser}</strong></div>
      </div>
    </>
  );
}

function BrandingSettingBlock({ values, updateField, showToast }) {
  const colors = ["#2f80ed", "#16a34a", "#0f9f9a", "#f59e0b", "#dc2626"];
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [logo, setLogo] = useState(() => readStoredBrandLogo());
  const fileInputRef = useRef(null);
  const logoName = values.organizationName || "Aqua Best UAE";
  const formatFileSize = (bytes = 0) => `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const uploadLogo = () => fileInputRef.current?.click();
  const previewBranding = () => {
    const opened = openPrintableDocument({
      documentTitle: "Tax Invoice",
      number: "TAX-INV-0001",
      customer: "Sample Customer",
      date: today,
      dueDate: today,
      order: "AQUA-SAMPLE",
      items: [
        { name: "Water purifier installation", quantity: 1, rate: 1200, discount: 0, tax: 5 },
        { name: "Maintenance service", quantity: 1, rate: 350, discount: 0, tax: 5 },
      ],
      taxableSubtotal: 1550,
      vatTotal: 77.5,
      total: 1627.5,
      notes: "Thank you for your business.",
      terms: "This preview uses your current branding settings.",
      owner: defaultUser,
      status: "Draft",
    });
    showToast(opened ? "Branding print preview opened" : "Allow pop-ups to preview branding");
  };
  const customizeTemplate = (template) => {
    const templateGroup = {
      "Tax Invoice": "invoice",
      Quotation: "quote",
      "Sales Order": "salesorder",
      "Purchase Order": "purchaseorder",
      "Payment Receipt": "paymentreceipt",
    }[template] || "invoice";
    setRoute(`settings/templates?template_group=${templateGroup}`);
  };
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose a PNG, JPG, or SVG image");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo must be 2 MB or smaller");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const nextLogo = {
        dataUrl: String(reader.result || ""),
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setLogo(nextLogo);
      writeStoredBrandLogo(nextLogo);
      showToast("Logo uploaded and applied");
    };
    reader.onerror = () => showToast("Logo upload failed. Please try another image.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  return (
    <>
      <div className="settings-two-column">
        <div className="settings-editor-section">
          <h3>Logo & Theme</h3>
          <div className="logo-drop">
            <div className={`settings-avatar large ${logo?.dataUrl ? "has-logo" : ""}`}>
              {logo?.dataUrl ? <img src={logo.dataUrl} alt={`${logoName} logo`} /> : "AB"}
            </div>
            <div>
              <strong>{logoName}</strong>
              <span>{logo?.name ? `${logo.name} (${formatFileSize(logo.size)})` : "PNG, JPG or SVG up to 2 MB"}</span>
            </div>
            <input
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleLogoChange}
            />
            <button type="button" className="secondary-button" onClick={uploadLogo}>
              <Upload size={16} />
              {logo?.dataUrl ? "Change Logo" : "Upload Logo"}
            </button>
          </div>
          <div className="settings-form-grid">
            <label>
              <span>Company Display Name</span>
              <input value={values.organizationName} onChange={(event) => updateField("organizationName", event.target.value)} />
            </label>
            <label>
              <span>Email Footer Name</span>
              <input value="Aqua Best Accounts Team" readOnly />
            </label>
          </div>
          <div className="color-swatch-grid">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={activeColor === color ? "active" : ""}
                style={{ backgroundColor: color }}
                aria-label={`Use ${color}`}
                onClick={() => setActiveColor(color)}
              />
            ))}
          </div>
        </div>
        <div className="settings-editor-section">
          <h3>Document Preview</h3>
          <div className="brand-preview" style={{ borderTopColor: activeColor }}>
            <div>
              {logo?.dataUrl && <img className="brand-preview-logo" src={logo.dataUrl} alt={`${logoName} logo preview`} />}
              <strong>{logoName}</strong>
              <span>Tax Invoice</span>
            </div>
            <em>TAX-INV-0001</em>
            <p>Dubai, United Arab Emirates</p>
            <div className="brand-preview-line" />
            <div className="brand-preview-total">Total AED 1,627.50</div>
          </div>
          <div className="settings-action-row">
            <button type="button" className="secondary-button" onClick={() => setRoute("settings/templates?template_group=invoice")}>PDF Templates</button>
            <button type="button" className="secondary-button" onClick={previewBranding}>Preview Branding</button>
          </div>
        </div>
      </div>
      <div className="settings-editor-section">
        <h3>Template Branding</h3>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr><th>Template</th><th>Brand</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {["Tax Invoice", "Quotation", "Sales Order", "Purchase Order", "Payment Receipt"].map((template) => (
                <tr key={template}>
                  <td>{template}</td>
                  <td>{logoName}</td>
                  <td><span className="status good">Active</span></td>
                  <td><button type="button" className="table-link" onClick={() => customizeTemplate(template)}>Customize</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CurrenciesSettingBlock({ showToast }) {
  const currencies = [
    ["AED", "UAE Dirham", "Base Currency", "1.0000", "Active"],
    ["USD", "US Dollar", "Foreign Currency", "3.6725", "Active"],
    ["EUR", "Euro", "Foreign Currency", "3.9800", "Active"],
    ["GBP", "British Pound", "Foreign Currency", "4.6600", "Inactive"],
  ];
  return (
    <>
      <div className="settings-callout">
        <strong>Base currency: AED</strong>
        <span>Base currency is used for reports, VAT returns, opening balances, and account totals.</span>
      </div>
      <div className="settings-editor-section">
        <div className="section-heading-row">
          <h3>Currencies</h3>
          <button type="button" className="primary-button" onClick={() => showToast("Add currency form opened")}>
            <Plus size={16} />
            New Currency
          </button>
        </div>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr><th>Currency</th><th>Name</th><th>Type</th><th>Exchange Rate</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {currencies.map((currencyRow) => (
                <tr key={currencyRow[0]}>
                  <td><span className="currency-code">{currencyRow[0]}</span></td>
                  <td>{currencyRow[1]}</td>
                  <td>{currencyRow[2]}</td>
                  <td><input defaultValue={currencyRow[3]} aria-label={`${currencyRow[0]} exchange rate`} /></td>
                  <td><span className={`status ${currencyRow[4] === "Active" ? "good" : "neutral"}`}>{currencyRow[4]}</span></td>
                  <td><button type="button" className="table-link" onClick={() => showToast(`${currencyRow[0]} currency opened`)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function OpeningBalancesSettingBlock({ showToast }) {
  const [rows, setRows] = useState([
    { account: "Cash in Hand", type: "Asset", debit: 0, credit: 0 },
    { account: "Accounts Receivable", type: "Asset", debit: 0, credit: 0 },
    { account: "Inventory Asset", type: "Asset", debit: 0, credit: 0 },
    { account: "Accounts Payable", type: "Liability", debit: 0, credit: 0 },
    { account: "VAT Payable", type: "Liability", debit: 0, credit: 0 },
    { account: "Owner Equity", type: "Equity", debit: 0, credit: 0 },
  ]);
  const updateRow = (index, key, value) => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: Number(value || 0) } : row)));
  };
  const totalDebit = rows.reduce((sum, row) => sum + Number(row.debit || 0), 0);
  const totalCredit = rows.reduce((sum, row) => sum + Number(row.credit || 0), 0);
  const difference = totalDebit - totalCredit;

  return (
    <>
      <div className="opening-balance-summary">
        <div><span>Total Debit</span><strong>{currency(totalDebit)}</strong></div>
        <div><span>Total Credit</span><strong>{currency(totalCredit)}</strong></div>
        <div><span>Difference</span><strong className={Math.abs(difference) < 0.01 ? "balanced" : "unbalanced"}>{currency(difference)}</strong></div>
      </div>
      <div className="settings-editor-section">
        <div className="section-heading-row">
          <h3>Opening Balances</h3>
          <div className="settings-action-row">
            <button type="button" className="secondary-button" onClick={() => showToast("Opening balance import ready")}>Import</button>
            <button type="button" className="secondary-button" onClick={() => showToast("Opening balances exported")}>Export</button>
          </div>
        </div>
        <div className="settings-table-wrap">
          <table className="settings-table opening-table">
            <thead>
              <tr><th>Account</th><th>Account Type</th><th>Debit</th><th>Credit</th></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.account}>
                  <td>{row.account}</td>
                  <td>{row.type}</td>
                  <td><input type="number" value={row.debit} onChange={(event) => updateRow(index, "debit", event.target.value)} /></td>
                  <td><input type="number" value={row.credit} onChange={(event) => updateRow(index, "credit", event.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="settings-callout">
          <strong>{Math.abs(difference) < 0.01 ? "Opening balances are balanced" : "Opening balance difference needs review"}</strong>
          <span>Balances affect the starting value of your chart of accounts and financial reports.</span>
        </div>
      </div>
    </>
  );
}

function TaxRatesSettingBlock({ showToast }) {
  const rates = [
    ["Standard Rate", "5%", "Sales and purchases", "Active"],
    ["Zero Rate", "0%", "Export and zero-rated supplies", "Active"],
    ["Exempt", "0%", "Exempt supplies", "Active"],
    ["Out of Scope", "0%", "Non-taxable transactions", "Active"],
  ];
  return (
    <>
      <div className="settings-callout">
        <strong>UAE VAT tax rates</strong>
        <span>These tax rates are available for Tax Invoices, Quotation PDFs, Bills, Expenses, and VAT reports.</span>
      </div>
      <div className="settings-editor-section">
        <div className="section-heading-row">
          <h3>Tax Rates</h3>
          <button type="button" className="primary-button" onClick={() => showToast("New tax rate form opened")}>
            <Plus size={16} />
            New Tax Rate
          </button>
        </div>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr><th>Name</th><th>Rate</th><th>Usage</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate[0]}>
                  <td>{rate[0]}</td>
                  <td>{rate[1]}</td>
                  <td>{rate[2]}</td>
                  <td><span className="status good">{rate[3]}</span></td>
                  <td><button type="button" className="table-link" onClick={() => showToast(`${rate[0]} opened`)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TaxReturnSettingsBlock({ field, selectField, switchRow }) {
  return (
    <>
      <div className="settings-editor-section">
        <h3>VAT Return Settings</h3>
        <div className="settings-form-grid">
          {field("TRN", "trn")}
          {selectField("Tax Basis", "taxBasis", ["Accrual", "Cash"])}
          {selectField("Return Frequency", "filingFrequency", ["Monthly", "Quarterly", "Yearly"])}
          {selectField("VAT Filing Month", "filingMonths", ["January, April, July, October", "February, May, August, November", "March, June, September, December"])}
        </div>
      </div>
      <div className="settings-editor-section">
        <h3>Controls</h3>
        <div className="settings-switch-list">
          {switchRow("Lock transactions after VAT filing", "lockFiledTransactions", "Prevents edits after a return is submitted")}
          {switchRow("Show VAT summary on documents", "showVat", "Displays taxable amount, VAT and grand total")}
          {switchRow("Email VAT reminders", "autoEmail", "Sends reminder before the return due date")}
        </div>
      </div>
    </>
  );
}

function CustomButtonsSettingBlock({ item, showToast }) {
  const buttons = [
    ["Send for Approval", "Record Detail", "Active"],
    ["Send WhatsApp Reminder", "List and Detail", "Active"],
    ["Mark as Reviewed", "Record Detail", "Inactive"],
  ];
  return (
    <>
      <div className="settings-callout">
        <strong>{item.label} custom buttons</strong>
        <span>Custom buttons appear on the list and detail pages for this module.</span>
      </div>
      <div className="settings-editor-section">
        <div className="section-heading-row">
          <h3>Custom Buttons</h3>
          <button type="button" className="primary-button" onClick={() => showToast("New custom button form opened")}>
            <Plus size={16} />
            New Custom Button
          </button>
        </div>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr><th>Button Name</th><th>Placement</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {buttons.map((button) => (
                <tr key={button[0]}>
                  <td>{button[0]}</td>
                  <td>{button[1]}</td>
                  <td><span className={`status ${button[2] === "Active" ? "good" : "neutral"}`}>{button[2]}</span></td>
                  <td><button type="button" className="table-link" onClick={() => showToast(`${button[0]} opened`)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RelatedListsSettingBlock({ item, showToast }) {
  const relatedLists = [
    ["Recent Activities", "Default", "Visible"],
    ["Documents", "Default", "Visible"],
    ["Custom Service History", "Custom", "Hidden"],
  ];
  return (
    <>
      <div className="settings-callout">
        <strong>{item.label} related lists</strong>
        <span>Control which related information appears on the record detail page.</span>
      </div>
      <div className="settings-editor-section">
        <div className="section-heading-row">
          <h3>Related Lists</h3>
          <button type="button" className="primary-button" onClick={() => showToast("New related list form opened")}>
            <Plus size={16} />
            New Related List
          </button>
        </div>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr><th>List Name</th><th>Type</th><th>Visibility</th><th></th></tr>
            </thead>
            <tbody>
              {relatedLists.map((list) => (
                <tr key={list[0]}>
                  <td>{list[0]}</td>
                  <td>{list[1]}</td>
                  <td><span className={`status ${list[2] === "Visible" ? "good" : "neutral"}`}>{list[2]}</span></td>
                  <td><button type="button" className="table-link" onClick={() => showToast(`${list[0]} opened`)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CustomFieldsSettingBlock({ item, showToast }) {
  const fields = [
    ["Cost Center", "Dropdown", "Active"],
    ["Project Code", "Single Line", "Active"],
    ["Approved By", "User Lookup", "Inactive"],
  ];
  return (
    <>
      <div className="settings-callout">
        <strong>{item.label} custom fields</strong>
        <span>Custom fields appear on forms, PDFs, reports, and imported data for this module.</span>
      </div>
      <div className="settings-editor-section">
        <div className="section-heading-row">
          <h3>Custom Fields</h3>
          <button type="button" className="primary-button" onClick={() => showToast("New custom field form opened")}>
            <Plus size={16} />
            New Custom Field
          </button>
        </div>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr><th>Field Name</th><th>Data Type</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field[0]}>
                  <td>{field[0]}</td>
                  <td>{field[1]}</td>
                  <td><span className={`status ${field[2] === "Active" ? "good" : "neutral"}`}>{field[2]}</span></td>
                  <td><button type="button" className="table-link" onClick={() => showToast(`${field[0]} opened`)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function UsersSettingBlock({ showToast }) {
  return (
    <div className="settings-editor-section">
      <h3>Secure User Management</h3>
      <div className="settings-callout">
        <strong>Users are managed from the Admin Panel</strong>
        <span>Create staff accounts, assign roles, reset passwords, and deactivate access from one protected screen.</span>
      </div>
      <button type="button" className="primary-button" onClick={() => setRoute("admin/users")}>
        <ShieldCheck size={16} />
        Open Admin Panel
      </button>
    </div>
  );
}

function RolesSettingBlock() {
  const roles = [
    ["Admin", true, true, true, true],
    ["Sales", true, true, false, false],
    ["Purchases", true, false, true, false],
    ["Accountant", true, false, true, true],
  ];
  return (
    <div className="settings-editor-section">
      <h3>Role Permissions</h3>
      <div className="settings-table-wrap">
        <table className="settings-table">
          <thead>
            <tr><th>Role</th><th>View</th><th>Sales</th><th>Purchases</th><th>Accountant</th></tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role[0]}>
                <td>{role[0]}</td>
                {role.slice(1).map((allowed, index) => (
                  <td key={`${role[0]}-${index}`}><input type="checkbox" defaultChecked={allowed} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentGatewayBlock({ showToast }) {
  const gateways = [
    ["Bank Transfer", "AED", "Enabled"],
    ["Cash / Cheque", "AED", "Enabled"],
    ["Card Gateway", "AED", "Disabled"],
  ];
  return (
    <div className="settings-editor-section">
      <h3>Payment Gateways</h3>
      <div className="settings-table-wrap">
        <table className="settings-table">
          <thead>
            <tr><th>Gateway</th><th>Currency</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {gateways.map((gateway) => (
              <tr key={gateway[0]}>
                <td>{gateway[0]}</td>
                <td>{gateway[1]}</td>
                <td><span className={`status ${gateway[2] === "Enabled" ? "good" : "neutral"}`}>{gateway[2]}</span></td>
                <td><button type="button" className="table-link" onClick={() => showToast(`${gateway[0]} settings opened`)}>Configure</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeveloperDataBlock({ item, showToast }) {
  const isBackup = item.id === "data-backup";
  return (
    <div className="settings-editor-section">
      <h3>{isBackup ? "Backup Schedule" : "API Usage"}</h3>
      <div className="settings-metric-grid">
        <div><span>{isBackup ? "Last Backup" : "Requests Used"}</span><strong>{isBackup ? "10 Jun 2026" : "1,284 / 10,000"}</strong></div>
        <div><span>{isBackup ? "Frequency" : "Active Tokens"}</span><strong>{isBackup ? "Weekly" : "2"}</strong></div>
        <div><span>{isBackup ? "Format" : "Status"}</span><strong>{isBackup ? "CSV + PDF" : "Healthy"}</strong></div>
      </div>
      <button type="button" className="secondary-button" onClick={() => showToast(isBackup ? "Backup export prepared" : "API token copied")}>
        {isBackup ? "Prepare Backup" : "Copy API Token"}
      </button>
    </div>
  );
}

function SettingsPanel() {
  const settings = [
    ["Organization Profile", "Aqua Best UAE", "organization", "profile"],
    ["Taxes", "UAE VAT enabled", "taxes", "taxes"],
    ["Templates", "Aqua Best Tax Invoice", "customisation", "pdf-templates"],
    ["Users & Roles", "4 active users", "users-roles", "users"],
    ["Preferences", "AED base currency", "preferences", "general"],
  ];
  return (
    <div className="settings-list">
      {settings.map(([name, value, section, item]) => (
        <button key={name} type="button" onClick={() => setRoute(settingRoute(section, item))}>
          <span>{name}</span>
          <em>{value}</em>
          <ChevronRight size={16} />
        </button>
      ))}
    </div>
  );
}

export default App;
