import { AnalyticsPageTemplate } from "@/components/ui/analytics-page-template";
import { AuthPageTemplate } from "@/components/ui/auth-page-template";
import { CrmPageTemplate } from "@/components/ui/crm-page-template";
import { LandingPageTemplate } from "@/components/ui/landing-page-template";
import { SettingsPageTemplate } from "@/components/ui/settings-page-template";
import { BookingCard } from "@/components/ui/booking-card";
import { CustomerCard } from "@/components/ui/customer-card";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { FileUpload } from "@/components/ui/file-upload";
import { InvoiceCard } from "@/components/ui/invoice-card";
import { KanbanBoard } from "@/components/ui/kanban-board";
import { NotificationCenter } from "@/components/ui/notification-center";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { BarChart } from "@/components/ui/bar-chart";
import { DataTable } from "@/components/ui/data-table";
import { DonutChart } from "@/components/ui/donut-chart";
import { KeyValueList } from "@/components/ui/key-value-list";
import { LineChart } from "@/components/ui/line-chart";
import { ProgressList } from "@/components/ui/progress-list";
import { StatGrid } from "@/components/ui/stat-grid";
import { Timeline } from "@/components/ui/timeline";
import { ArrowRight, CircleDollarSign, Layers3, Plus, Sparkles } from "lucide-react";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DrawerPanel } from "@/components/ui/drawer-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Pagination } from "@/components/ui/pagination";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { ToastDemo } from "@/components/ui/toast-demo";
import { TooltipDemo } from "@/components/ui/tooltip-demo";
import { ActionButton } from "@/components/ui/action-button";
import { AnimatedFlipCard } from "@/components/ui/animated-flip-card";
import { ButtonShowcase } from "@/components/ui/button-showcase";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { EmptyCard } from "@/components/ui/empty-card";
import { FloatingField } from "@/components/ui/floating-field";
import { FormShowcase } from "@/components/ui/form-showcase";
import { HoverBlurCards } from "@/components/ui/hover-blur-cards";
import { LoginForm } from "@/components/ui/login-form";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { SearchField } from "@/components/ui/search-field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

export type ComponentProp = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

export type ComponentEntry = {
  slug: string;
  title: string;
  category: string;
  description: string;
  status: string;
  code: string;
  preview: React.ReactNode;
  source?: string;
  accessibility?: string[];
  props?: ComponentProp[];
  dependencies?: string[];
  maturity?: "stable" | "beta";
};

const rawComponentRegistry: ComponentEntry[] = [
  {
    slug: "action-button",
    title: "Action Button",
    category: "Buttons",
    description: "A typed button primitive with five visual variants, three sizes, icons and a loading state.",
    status: "Six states",
    code: `<ActionButton\n  variant="primary"\n  leftIcon={<Plus size={16} />}\n>\n  Add item\n</ActionButton>`,
    preview: <ActionButton leftIcon={<Plus size={16}/>}>Add item</ActionButton>,
    source: "components/ui/action-button.tsx",
    accessibility: ["Native button semantics", "Visible keyboard focus", "Disabled state while loading"],
    props: [
      { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "danger"', defaultValue: '"primary"', description: "Controls the visual emphasis." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Controls height and horizontal padding." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Shows progress and prevents repeated actions." },
      { name: "leftIcon / rightIcon", type: "ReactNode", description: "Adds a decorative or meaningful icon." },
    ],
  },
  {
    slug: "button-showcase",
    title: "Button System",
    category: "Buttons",
    description: "The complete action-button family shown together for quick comparison and QA.",
    status: "Variant set",
    code: `<ActionButton>Primary</ActionButton>\n<ActionButton variant="secondary">Secondary</ActionButton>\n<ActionButton variant="outline">Outline</ActionButton>\n<ActionButton variant="ghost">Ghost</ActionButton>\n<ActionButton variant="danger">Delete</ActionButton>\n<ActionButton loading>Saving</ActionButton>`,
    preview: <ButtonShowcase />,
  },
  {
    slug: "neumorphic-button",
    title: "Neumorphic Button",
    category: "Buttons",
    description: "A tactile dark action button with pressed, hover and keyboard-focus states.",
    status: "Accessible",
    code: `<NeumorphicButton icon={<Sparkles size={18} />}>\n  Create project\n</NeumorphicButton>`,
    preview: <NeumorphicButton icon={<Sparkles size={18}/>}>Create project</NeumorphicButton>,
  },
  {
    slug: "empty-card",
    title: "Empty Card",
    category: "Cards",
    description: "A reusable elevated surface for custom content, empty states and compact feature blocks.",
    status: "Responsive",
    code: `<EmptyCard>\n  <div>Your content</div>\n</EmptyCard>`,
    preview: <EmptyCard><span className="empty-card__content"><Layers3 size={30}/><strong>Drop content here</strong><small>Reusable surface primitive.</small></span></EmptyCard>,
  },
  {
    slug: "dashboard-card",
    title: "Dashboard Card",
    category: "Cards",
    description: "A configurable metric card for dashboards, reports and overview screens.",
    status: "Typed props",
    code: `<DashboardCard\n  title="Revenue"\n  value="€24,860"\n  change="12.4%"\n  progress={76}\n  icon={<CircleDollarSign size={16} />}\n/>`,
    preview: <DashboardCard title="Revenue" value="€24,860" change="12.4%" progress={76} icon={<CircleDollarSign size={16}/>} />,
    source: "components/ui/dashboard-card.tsx",
    accessibility: ["Readable metric hierarchy", "Progress value exposed semantically", "Icon does not replace the title"],
    props: [
      { name: "title", type: "string", description: "Metric label." },
      { name: "value", type: "string", description: "Primary displayed value." },
      { name: "change", type: "string", description: "Comparison or change indicator." },
      { name: "progress", type: "number", description: "Progress percentage from 0 to 100." },
      { name: "icon", type: "ReactNode", description: "Optional supporting icon." },
    ],
  },
  {
    slug: "animated-flip-card",
    title: "Animated Flip Card",
    category: "Cards",
    description: "A motion-led card with a moving light treatment and hover flip interaction.",
    status: "Motion",
    code: `<AnimatedFlipCard />`,
    preview: <AnimatedFlipCard/>,
  },
  {
    slug: "hover-blur-cards",
    title: "Hover Blur Group",
    category: "Cards",
    description: "A grouped-card interaction that focuses the hovered item and softens neighbouring cards.",
    status: "Group interaction",
    code: `<HoverBlurCards />`,
    preview: <HoverBlurCards/>,
  },
  {
    slug: "floating-field",
    title: "Floating Field",
    category: "Forms",
    description: "A semantic floating-label input with focus, required and validation-ready states.",
    status: "Accessible",
    code: `<FloatingField\n  id="project-name"\n  label="Project name"\n  required\n/>`,
    preview: <div className="field-demo"><FloatingField id="detail-project-name" label="Project name" required /></div>,
    source: "components/ui/floating-field.tsx",
    accessibility: ["Explicit label association", "Native required state", "Visible focus treatment"],
    props: [
      { name: "id", type: "string", description: "Connects the label and input." },
      { name: "label", type: "string", description: "Visible field label." },
      { name: "required", type: "boolean", defaultValue: "false", description: "Marks the native input as required." },
    ],
  },
  {
    slug: "search-field",
    title: "Search Field",
    category: "Forms",
    description: "A compact search control with semantic input behaviour and responsive width.",
    status: "Search pattern",
    code: `<SearchField placeholder="Search customers…" />`,
    preview: <SearchField placeholder="Search customers…" />,
  },
  {
    slug: "select-field",
    title: "Select Field",
    category: "Forms",
    description: "A styled native select that keeps keyboard support and mobile platform behaviour.",
    status: "Native control",
    code: `<SelectField id="status" aria-label="Status">\n  <option>Draft</option>\n  <option>Active</option>\n</SelectField>`,
    preview: <div className="control-demo"><SelectField id="detail-status" aria-label="Status" defaultValue="active"><option value="draft">Draft</option><option value="active">Active</option><option value="complete">Complete</option></SelectField></div>,
  },
  {
    slug: "textarea-field",
    title: "Textarea Field",
    category: "Forms",
    description: "A labelled multiline control with helper text and a comfortable editing surface.",
    status: "Long form",
    code: `<TextareaField\n  id="notes"\n  aria-label="Notes"\n  placeholder="Add notes…"\n/>`,
    preview: <div className="control-demo"><TextareaField id="detail-notes" aria-label="Notes" placeholder="Add notes…" /></div>,
  },
  {
    slug: "toggle-switch",
    title: "Toggle Switch",
    category: "Forms",
    description: "A stateful switch with a visible status label and an underlying native checkbox.",
    status: "Interactive",
    code: `<ToggleSwitch label="Enable notifications" />`,
    preview: <div className="control-demo"><ToggleSwitch label="Enable notifications" /></div>,
  },
  {
    slug: "checkbox-field",
    title: "Checkbox Field",
    category: "Forms",
    description: "A custom checkbox presentation that retains native form semantics and focus behaviour.",
    status: "Native semantics",
    code: `<CheckboxField label="Remember my choice" />`,
    preview: <div className="control-demo"><CheckboxField label="Remember my choice" defaultChecked /></div>,
  },
  {
    slug: "login-form",
    title: "Login Form",
    category: "Forms",
    description: "A complete dark login surface with semantic fields and reusable form styling.",
    status: "Form pattern",
    code: `<LoginForm />`,
    preview: <LoginForm/>,
  },
  {
    slug: "form-showcase",
    title: "Project Brief Form",
    category: "Forms",
    description: "A complete form composition demonstrating fields, selection, toggles and actions together.",
    status: "Composed pattern",
    code: `<FormShowcase />`,
    preview: <FormShowcase />,
  },
  {
    slug: "button-with-icon",
    title: "Button with Icon",
    category: "Buttons",
    description: "An action-button example with balanced trailing icon spacing for forward navigation.",
    status: "Icon support",
    code: `<ActionButton rightIcon={<ArrowRight size={16} />}>\n  Continue\n</ActionButton>`,
    preview: <ActionButton rightIcon={<ArrowRight size={16}/>}>Continue</ActionButton>,
  },

  {
    slug: "status-badge", title: "Status Badge", category: "Feedback",
    description: "Compact semantic labels for statuses, categories and workflow states.", status: "Five tones",
    code: `<StatusBadge tone="success">Active</StatusBadge>`,
    preview: <div className="badge-showcase"><StatusBadge tone="neutral">Draft</StatusBadge><StatusBadge tone="success">Active</StatusBadge><StatusBadge tone="warning">Pending</StatusBadge><StatusBadge tone="danger">Blocked</StatusBadge><StatusBadge tone="accent">New</StatusBadge></div>,
  },
  {
    slug: "alert-banner", title: "Alert Banner", category: "Feedback",
    description: "A structured status message with distinct information, success, warning and danger tones.", status: "Role-aware",
    code: `<AlertBanner title="Import complete" tone="success">24 records were added successfully.</AlertBanner>`,
    preview: <div className="feedback-stack"><AlertBanner title="Import complete" tone="success">24 records were added successfully.</AlertBanner><AlertBanner title="Review required" tone="warning">Two records need attention.</AlertBanner></div>,
  },
  {
    slug: "toast", title: "Toast Notification", category: "Feedback",
    description: "A dismissible, non-blocking confirmation message for completed actions.", status: "Interactive",
    code: `<ToastDemo />`, preview: <ToastDemo />,
  },
  {
    slug: "tooltip", title: "Tooltip", category: "Feedback",
    description: "A keyboard-accessible contextual hint revealed on hover or focus.", status: "Focus support",
    code: `<TooltipDemo />`, preview: <TooltipDemo />,
  },
  {
    slug: "skeleton-card", title: "Skeleton Card", category: "Feedback",
    description: "A reduced-motion-aware loading placeholder for card and list content.", status: "Loading state",
    code: `<SkeletonCard />`, preview: <SkeletonCard />,
  },
  {
    slug: "empty-state", title: "Empty State", category: "Feedback",
    description: "A complete empty-state composition with explanation and primary recovery action.", status: "Composed pattern",
    code: `<EmptyState />`, preview: <EmptyState />,
  },
  {
    slug: "tabs", title: "Tabs", category: "Navigation",
    description: "A compact tab system for switching between related sections in place.", status: "ARIA tabs",
    code: `<Tabs />`, preview: <Tabs />,
  },
  {
    slug: "breadcrumbs", title: "Breadcrumbs", category: "Navigation",
    description: "A responsive hierarchy trail with semantic navigation and current-page state.", status: "Semantic nav",
    code: `<Breadcrumbs />`, preview: <Breadcrumbs />,
  },
  {
    slug: "pagination", title: "Pagination", category: "Navigation",
    description: "A keyboard-friendly page navigator with previous, next and current-page states.", status: "Interactive",
    code: `<Pagination />`, preview: <Pagination />,
  },
  {
    slug: "modal-dialog", title: "Modal Dialog", category: "Overlays",
    description: "A focused confirmation dialog with overlay dismissal and explicit actions.", status: "Modal pattern",
    code: `<ModalDialog />`, preview: <ModalDialog />,
  },
  {
    slug: "drawer-panel", title: "Drawer Panel", category: "Overlays",
    description: "A side panel for editing or inspecting content without leaving the current context.", status: "Responsive overlay",
    code: `<DrawerPanel />`, preview: <DrawerPanel />,
  },
  {
    slug: "data-table", title: "Data Table", category: "Data",
    description: "A responsive project table with semantic markup, status indicators and row actions.", status: "Semantic table",
    code: `<DataTable />`, preview: <DataTable />,
  },
  {
    slug: "bar-chart", title: "Bar Chart", category: "Data",
    description: "A lightweight weekly comparison chart built with CSS and no chart dependency.", status: "Dependency-free",
    code: `<BarChart />`, preview: <BarChart />,
  },
  {
    slug: "line-chart", title: "Line Chart", category: "Data",
    description: "An accessible SVG trend chart with a responsive viewBox and layered area treatment.", status: "Responsive SVG",
    code: `<LineChart />`, preview: <LineChart />,
  },
  {
    slug: "donut-chart", title: "Donut Chart", category: "Data",
    description: "A compact traffic distribution visual with a clear legend and central summary.", status: "CSS chart",
    code: `<DonutChart />`, preview: <DonutChart />,
  },
  {
    slug: "progress-list", title: "Progress List", category: "Data",
    description: "A labelled set of progress indicators for milestones, capacity and completion states.", status: "ARIA-ready",
    code: `<ProgressList />`, preview: <ProgressList />,
  },
  {
    slug: "stat-grid", title: "Statistic Grid", category: "Data",
    description: "A responsive metric group with directional changes and compact dashboard hierarchy.", status: "Dashboard pattern",
    code: `<StatGrid />`, preview: <StatGrid />,
  },
  {
    slug: "avatar-stack", title: "Avatar Stack", category: "Data",
    description: "A compact collaborator group with overlap, overflow count and accessible names.", status: "Team pattern",
    code: `<AvatarStack />`, preview: <AvatarStack />,
  },
  {
    slug: "timeline", title: "Timeline", category: "Data",
    description: "A vertical milestone history for project events, audits and workflow progress.", status: "Ordered history",
    code: `<Timeline />`, preview: <Timeline />,
  },
  {
    slug: "activity-feed", title: "Activity Feed", category: "Data",
    description: "A scannable stream of user actions with icons, descriptions and relative timestamps.", status: "Feed pattern",
    code: `<ActivityFeed />`, preview: <ActivityFeed />,
  },
  {
    slug: "key-value-list", title: "Key Value List", category: "Data",
    description: "A semantic description list for account, order and configuration summaries.", status: "Semantic DL",
    code: `<KeyValueList />`, preview: <KeyValueList />,
  },

  {
    slug: "customer-card", title: "Customer Card", category: "Business",
    description: "A compact customer profile with contact details, account context and a clear profile action.", status: "CRM pattern",
    code: `<CustomerCard />`, preview: <CustomerCard />,
  },
  {
    slug: "invoice-card", title: "Invoice Card", category: "Business",
    description: "A billing summary with amount, due state, client context and common invoice actions.", status: "Billing pattern",
    code: `<InvoiceCard />`, preview: <InvoiceCard />,
  },
  {
    slug: "booking-card", title: "Booking Card", category: "Business",
    description: "A responsive booking summary for schedules, reservations and appointment workflows.", status: "Booking pattern",
    code: `<BookingCard />`, preview: <BookingCard />,
  },
  {
    slug: "notification-center", title: "Notification Center", category: "Business",
    description: "A reusable notification panel with unread count, event icons and relative timestamps.", status: "Application pattern",
    code: `<NotificationCenter />`, preview: <NotificationCenter />,
  },
  {
    slug: "kanban-board", title: "Kanban Board", category: "Business",
    description: "A responsive workflow board for tasks, project stages and lightweight operational planning.", status: "Workflow pattern",
    code: `<KanbanBoard />`, preview: <KanbanBoard />,
  },
  {
    slug: "file-upload", title: "File Upload", category: "Business",
    description: "A drag-and-drop upload surface with native file input semantics and upload-progress feedback.", status: "Upload pattern",
    code: `<FileUpload />`, preview: <FileUpload />,
  },
  {
    slug: "dashboard-layout", title: "Dashboard Layout", category: "Layouts",
    description: "A compact application-shell composition showing navigation, metrics and content regions together.", status: "Layout pattern",
    code: `<DashboardLayout />`, preview: <DashboardLayout />,
  },


  {
    slug: "landing-page-template",
    title: "Landing Page Template",
    category: "Templates",
    description: "A responsive marketing-page composition with navigation, hero content, proof points and a product preview.",
    status: "Page composition",
    code: `<LandingPageTemplate />`,
    preview: <LandingPageTemplate />,
  },
  {
    slug: "auth-page-template",
    title: "Authentication Page",
    category: "Templates",
    description: "A complete sign-in experience combining brand storytelling, social proof and an accessible account form.",
    status: "Page composition",
    code: `<AuthPageTemplate />`,
    preview: <AuthPageTemplate />,
  },
  {
    slug: "crm-page-template",
    title: "CRM Customers Page",
    category: "Templates",
    description: "A practical customer-management layout with navigation, search, filters, status labels and responsive records.",
    status: "Business template",
    code: `<CrmPageTemplate />`,
    preview: <CrmPageTemplate />,
  },
  {
    slug: "settings-page-template",
    title: "Settings Page",
    category: "Templates",
    description: "A structured account-settings page with section navigation, profile fields and preference controls.",
    status: "Application template",
    code: `<SettingsPageTemplate />`,
    preview: <SettingsPageTemplate />,
  },
  {
    slug: "analytics-page-template",
    title: "Analytics Page",
    category: "Templates",
    description: "A dashboard composition with metric cards, a trend chart, channel distribution and export controls.",
    status: "Dashboard template",
    code: `<AnalyticsPageTemplate />`,
    preview: <AnalyticsPageTemplate />,
  },
 ];

const sourceOverrides: Record<string, string> = {
  "button-with-icon": "components/ui/action-button.tsx",
  "toast": "components/ui/toast-demo.tsx",
  "tooltip": "components/ui/tooltip-demo.tsx",
};

export const componentRegistry: ComponentEntry[] = rawComponentRegistry.map((entry) => ({
  ...entry,
  source: entry.source ?? sourceOverrides[entry.slug] ?? `components/ui/${entry.slug}.tsx`,
  accessibility: entry.accessibility ?? ["Semantic markup", "Visible keyboard focus", "Readable colour contrast"],
  dependencies: entry.dependencies ?? ["react", "lucide-react"],
  maturity: entry.maturity ?? "stable",
}));

export function getComponent(slug: string) {
  return componentRegistry.find((item) => item.slug === slug);
}
