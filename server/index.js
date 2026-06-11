import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAuth } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const isProduction = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const app = express();
const port = Number(process.env.PORT || 3000);
const auth = createAuth({ root, isProduction });

app.disable("x-powered-by");
app.use(auth.securityHeaders);
app.use(express.json({ limit: "2mb" }));
app.use(auth.sameOrigin);

const money = (value) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("AED", "AED");

const createId = () => Math.random().toString(36).slice(2, 10);

const seedRows = {
  contacts: [],
  invoices: [],
  quotes: [],
  salesorders: [],
  deliverychallans: [],
  paymentsreceived: [],
  creditnotes: [],
  vendors: [],
  expenses: [],
  bills: [],
  purchaseorders: [],
  paymentsmade: [],
  "inventory/items": [],
  "inventory/pricelists": [],
  "inventory/adjustments": [],
  retainerinvoices: [],
  recurringinvoices: [],
  recurringexpenses: [],
  recurringbills: [],
  vendorcredits: [],
  "timesheet/projects": [],
  "timesheet/alltimeentries": [],
  "accountant/journals": [],
  "accountant/recurringjournals": [],
  "accountant/bulkupdateaccounts": [],
  "taxreturnpayments/dues": [],
  "taxadjustment/list": [],
  "accountant/bcyadjustment/list": [],
  "accountant/chartofaccounts": [],
  "accountant/transactionlock": [],
  documents: [],
};

const data = JSON.parse(JSON.stringify(seedRows));

const reports = [
  { id: "profitandloss", group: "Business Overview", name: "Profit and Loss", type: "Profit and Loss", createdBy: "System Generated" },
  { id: "cfstatement", group: "Business Overview", name: "Cash Flow Statement", type: "Cash Flow Statement", createdBy: "System Generated" },
  { id: "balancesheet", group: "Business Overview", name: "Balance Sheet", type: "Balance Sheet", createdBy: "System Generated" },
  { id: "salesbycustomer", group: "Sales", name: "Sales by Customer", type: "Summary", createdBy: "System Generated" },
  { id: "invoiceaging", group: "Receivables", name: "Tax Invoice Aging Summary", type: "Aging", createdBy: "System Generated" },
  { id: "billaging", group: "Payables", name: "Bill Aging Summary", type: "Aging", createdBy: "System Generated" },
  { id: "taxsummary", group: "Accountant", name: "VAT Summary", type: "Tax", createdBy: "System Generated" },
  { id: "activitylogs", group: "Activity", name: "Activity Logs", type: "Audit", createdBy: "System Generated" },
];

const bankingAccounts = [];

const metrics = {
  receivables: {
    total: 0,
    current: 0,
    overdue: 0,
  },
  payables: {
    total: 0,
    current: 0,
    overdue: 0,
  },
  cashFlow: {
    opening: 0,
    incoming: 0,
    outgoing: 0,
    closing: 0,
    series: [
      { month: "Jan", value: 0 },
      { month: "Feb", value: 0 },
      { month: "Mar", value: 0 },
      { month: "Apr", value: 0 },
      { month: "May", value: 0 },
      { month: "Jun", value: 0 },
      { month: "Jul", value: 0 },
      { month: "Aug", value: 0 },
      { month: "Sep", value: 0 },
      { month: "Oct", value: 0 },
      { month: "Nov", value: 0 },
      { month: "Dec", value: 0 },
      { month: "Now", value: 0 },
    ],
  },
  incomeExpense: [
    { name: "Income", value: 0 },
    { name: "Expenses", value: 0 },
  ],
  expenses: [],
  projects: [],
};

const activities = [];

const normalizeModule = (moduleName) => moduleName.replace(/^\/+|\/+$/g, "");

app.get("/api/session", auth.sessionHandler);
app.post("/api/auth/setup", auth.setupHandler);
app.post("/api/auth/login", auth.loginHandler);
app.post("/api/auth/logout", auth.logoutHandler);

app.use("/api", (req, res, next) => {
  if (["/session", "/auth/setup", "/auth/login", "/auth/logout"].includes(req.path)) {
    next();
    return;
  }
  auth.requireAuth(req, res, next);
});

app.get("/api/admin/users", auth.requireAdmin, auth.listUsersHandler);
app.post("/api/admin/users", auth.requireAdmin, auth.createUserHandler);
app.patch("/api/admin/users/:id", auth.requireAdmin, auth.updateUserHandler);
app.delete("/api/admin/users/:id", auth.requireAdmin, auth.deactivateUserHandler);

const sendBootstrap = (req, res) => {
  const currentUser = auth.publicUser(req.user);
  res.json({
    organization: {
      name: "Aqua Best UAE",
      user: currentUser?.name || "Accounts Admin",
      email: currentUser?.email || "",
      role: currentUser?.role || "",
      support: "80004440824",
      currency: "AED",
    },
    currentUser,
    moneyPreview: {
      receivables: money(metrics.receivables.total),
      payables: money(metrics.payables.total),
    },
    records: data,
    reports,
    bankingAccounts,
    metrics,
    activities,
  });
};

app.get("/api/bootstrap", sendBootstrap);
app.get("/api/bootstrap.json", sendBootstrap);

app.get(/^\/api\/records\/(.+)$/, (req, res) => {
  const moduleName = normalizeModule(req.params[0]);
  res.json({ records: data[moduleName] || [] });
});

app.post(/^\/api\/records\/(.+)$/, (req, res) => {
  const moduleName = normalizeModule(req.params[0]);
  const row = {
    id: `${moduleName.replace(/[^a-z0-9]/gi, "-")}-${createId()}`,
    date: req.body.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    number: req.body.number || `NEW-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: req.body.name || "New record",
    status: req.body.status || "Draft",
    dueDate: req.body.dueDate || "Due on Receipt",
    amount: Number(req.body.amount || 0),
    balance: Number(req.body.balance ?? req.body.amount ?? 0),
    owner: req.body.owner || "Accounts Admin",
    order: req.body.order || "",
  };
  data[moduleName] ||= [];
  data[moduleName].unshift(row);
  res.status(201).json({ record: row });
});

app.patch(/^\/api\/records\/(.+)\/([^/]+)$/, (req, res) => {
  const moduleName = normalizeModule(req.params[0]);
  const rows = data[moduleName] || [];
  const index = rows.findIndex((row) => row.id === req.params[1]);
  if (index === -1) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  rows[index] = { ...rows[index], ...req.body };
  res.json({ record: rows[index] });
});

app.delete(/^\/api\/records\/(.+)\/([^/]+)$/, (req, res) => {
  const moduleName = normalizeModule(req.params[0]);
  const rows = data[moduleName] || [];
  const index = rows.findIndex((row) => row.id === req.params[1]);
  if (index === -1) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  const [deleted] = rows.splice(index, 1);
  res.json({ record: deleted });
});

if (!isProduction) {
  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(root, "dist")));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(root, "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Aqua Best Accounts running at http://localhost:${port}`);
});
