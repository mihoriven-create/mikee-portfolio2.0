// Single source of truth for all portfolio content.
// Everything here is taken from the previous live portfolio
// (michaeljohnbuencamino.vercel.app). Do not add claims that are not verified there.

export const profile = {
  name: "Michael John Buencamino",
  nickname: "Mikee",
  role: "CRM & Technical Operations Specialist",
  location: "Iloilo, Philippines",
  timeZone: "Asia/Manila",
  email: "mikeecamino@gmail.com",
  whatsapp: { label: "+63 956 214 5204", href: "https://wa.me/639562145204" },
  calendly: "https://calendly.com/mikeecamino/30min",
  resume: "/Michael-John-Buencamino-Resume.pdf",
  siteUrl: "https://michaeljohnbuencamino.vercel.app",
  portrait: { src: "/images/michael-john-buencamino.png", width: 216, height: 229 },
  summary:
    "I support US-based businesses by managing CRM systems, workflow automations, and backend operations — building and improving CRM workflows, automating processes, and troubleshooting system issues so teams can work through reliable, organized systems.",
} as const;

export const nav = [
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "about", label: "About" },
  { id: "feedback", label: "Feedback" },
  { id: "contact", label: "Contact" },
] as const;

export type Shot = { src: string; alt: string; width: number; height: number };

const shot = (name: string, alt: string, width: number, height: number): Shot => ({
  src: `/work/${name}.webp`,
  alt,
  width,
  height,
});

export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  status: "Implemented" | "In development";
  summary: string;
  role: string;
  context: string;
  stack: string[];
  challenge: string;
  solution: string;
  implementation: string;
  outcome: string;
  shots?: Shot[];
  capabilityIds: string[];
};

export const projects: Project[] = [
  {
    id: "deal-intake",
    index: "01",
    title: "AFS Deal Intake Web Application",
    category: "Custom web application",
    status: "In development",
    summary:
      "A custom intake application for American Financial Services that collects deal submissions and documents and connects them to GoHighLevel.",
    role: "Building the application end to end",
    context: "American Financial Services, LLC",
    stack: ["Next.js", "GitHub", "Vercel", "Private file storage", "GoHighLevel API"],
    challenge:
      "Deal submissions needed a dedicated, structured intake path that could accept supporting documents securely and feed directly into CRM operations.",
    solution:
      "A purpose-built web application for deal intake, with private file storage for uploaded documents and an integration that passes submission data into GoHighLevel.",
    implementation:
      "Built with Next.js and modern web technologies, version-controlled on GitHub, and deployed through Vercel. Uploaded files go to private storage rather than public URLs.",
    outcome:
      "Currently in development. Results will be documented once the application is in production use.",
    capabilityIds: ["web-apps", "integrations"],
  },
  {
    id: "ghl-workflows",
    index: "02",
    title: "GoHighLevel CRM Workflows & Lead Nurturing",
    category: "CRM automation",
    status: "Implemented",
    summary:
      "Re-engagement and nurturing systems for aged and inbound business loan leads, using SMS, email, tagging, and follow-up workflows.",
    role: "Workflow design, build & optimization",
    context: "American Financial Services, LLC",
    stack: ["GoHighLevel", "SMS automation", "Email automation", "Round-robin calendars", "Slack"],
    challenge:
      "Thousands of inactive leads required a structured follow-up process, and new inbound business loan leads needed immediate, consistent communication through qualification.",
    solution:
      "A scalable re-engagement system plus inbound nurturing workflows that engage leads, collect information, and support appointment booking.",
    implementation:
      "SMS and email sequences, tagging, follow-up workflows, round-robin lead routing, and automated appointment scheduling across multiple CRM environments.",
    outcome:
      "A re-engagement process that consistently follows up with aged leads without manual intervention, and timely communication for every inbound lead.",
    shots: [
      shot("ghl-workflows-list", "GoHighLevel workflow folders for aged leads, call center, leads, deals, and lead management", 1584, 825),
      shot("ghl-aged-lead-campaign", "Aged Lead Campaign workflows: email and SMS, booked, not interested, respond, appointment, and converted", 1588, 820),
      shot("ghl-aged-lead-new-campaign", "Aged Lead New Campaign workflows with 30-day check-in, response, and staged follow-up", 1582, 824),
      shot("ghl-aged-lead-email-sms", "Aged Lead Email & SMS workflow in the GoHighLevel builder", 1800, 843),
      shot("ghl-call-center-workflows", "Call center business loan workflows: outreach, appointment booked, tagging, and response", 1584, 813),
      shot("ghl-call-center-workflows-2", "Business loan call center workflows including staged follow-up and AI test workflow", 1572, 796),
      shot("ghl-bl-outreach-7", "Business loan main workflow with 7-touch outreach sequence", 1800, 839),
      shot("ghl-bl-outreach-10", "Business loan main workflow with 10-touch outreach and monthly check-in", 1800, 846),
      shot("ghl-bl-response", "Business loan response workflow: opportunity update, tagging, notifications, and SMS", 1800, 839),
      shot("ghl-round-robin-assign", "Workflow entry distributing leads to setters with round-robin user assignment", 1800, 909),
      shot("ghl-booked-slack-notification", "Appointment booked workflow sending a Slack notification to the team", 1800, 1012),
    ],
    capabilityIds: ["crm", "automation", "lead-management"],
  },
  {
    id: "ai-voice",
    index: "03",
    title: "AI Voice & Conversation AI Implementation",
    category: "AI systems",
    status: "Implemented",
    summary:
      "AI agents and call intelligence workflows covering call routing, booking logic, AI summaries, notifications, and CRM integration.",
    role: "Configuration, prompt development & monitoring",
    context: "American Financial Services, LLC",
    stack: ["GHL AI Agents", "Conversation AI", "AI Voice", "OpenAI"],
    challenge:
      "The business needed an AI assistant to handle lead conversations and support qualification, and sales teams needed a faster way to review calls than reading long transcripts.",
    solution:
      "Configured AI Voice and Conversation AI workflows, plus an AI-powered workflow that turns call transcripts into structured summaries inside the CRM.",
    implementation:
      "Prompt development, conversation logic, call routing, booking logic, notifications, dry-run validation, and ongoing monitoring and refinement of AI agents.",
    outcome:
      "Reduced manual note-taking, improved visibility into customer conversations, and improved AI response quality.",
    shots: [
      shot("ai-atlas-working-hours", "Conversation AI workflow switching the AI agent on outside human working hours", 851, 315),
      shot("ai-qualification-summary", "AI qualification summary workflow powered by OpenAI", 851, 315),
      shot("ai-call-disposition", "Multi-trigger call disposition workflow routing outcomes to follow-up actions", 851, 315),
    ],
    capabilityIds: ["ai"],
  },
  {
    id: "lead-age",
    index: "04",
    title: "Google Sheets, Apps Script & Webhook Integrations",
    category: "Integrations",
    status: "Implemented",
    summary:
      "Spreadsheet-driven data processes and integrations that connect CRM records with Google Sheets through Apps Script, webhooks, and Zapier.",
    role: "Built the data process & integrations",
    context: "American Financial Services, LLC",
    stack: ["Google Sheets", "Google Apps Script", "Webhooks", "Zapier", "Bulk import"],
    challenge:
      "GoHighLevel does not natively calculate the days between a contact's creation date and today, so existing records lacked an accurate Lead Age value for reporting.",
    solution:
      "A custom spreadsheet process that calculates Lead Age from each contact's creation date and prepares the values for bulk import.",
    implementation:
      "Spreadsheet formulas and bulk import for historical records, alongside automation built with Google Apps Script, webhooks, REST APIs, and Zapier.",
    outcome:
      "Standardized the Lead Age field across existing contacts, improving reporting accuracy, lead prioritization, and operational visibility.",
    capabilityIds: ["integrations", "automation"],
  },
  {
    id: "dscr",
    index: "05",
    title: "Jotform DSCR Loan Calculator",
    category: "Forms & calculators",
    status: "Implemented",
    summary:
      "A Debt Service Coverage Ratio (DSCR) loan calculator built in Jotform to support loan scenario conversations.",
    role: "Built the calculator",
    context: "American Financial Services, LLC",
    stack: ["Jotform", "Calculated fields"],
    challenge:
      "Loan conversations often come down to one number, the debt service coverage ratio (DSCR): how well a property’s income covers its loan payments. Working it out by hand each time slows the conversation and makes results harder to keep consistent.",
    solution:
      "A calculator built as a Jotform form. Enter the property and loan figures and the form works out the DSCR automatically, so every scenario is run the same way.",
    implementation:
      "Built in Jotform using form calculation fields that compute the ratio from the figures entered.",
    outcome:
      "A ready-to-use calculator that returns the DSCR as soon as the figures are entered, giving a quick and consistent way to size up a loan scenario.",
    capabilityIds: ["ops", "process"],
  },
  {
    id: "operations",
    index: "06",
    title: "CRM Infrastructure, Troubleshooting & Process Automation",
    category: "Technical operations",
    status: "Implemented",
    summary:
      "Day-to-day backbone work: keeping CRMs, integrations, forms, email, and e-signature workflows reliable for AFS and partner organizations.",
    role: "CRM administration & technical support",
    context: "AFS and partner organizations",
    stack: ["GoHighLevel", "Zoho CRM", "Microsoft 365", "Adobe Acrobat Sign", "Zapier"],
    challenge:
      "Multiple businesses depend on CRMs, third-party integrations, digital forms, and document workflows that must stay reliable day to day.",
    solution:
      "Ongoing CRM administration, technical troubleshooting, and process automation, supported by documentation and SOPs.",
    implementation:
      "Root-cause analysis across CRMs, APIs, webhooks, and PDF workflows; Microsoft 365 and Outlook administration; Adobe Acrobat Sign fillable forms and e-signature workflows; backend support for One Finance Source, Term Loan Solution, and Alliance Capital Enterprises Inc.",
    outcome:
      "Reliable systems that reduce manual work and keep funding workflows and daily operations running.",
    shots: [
      shot("crm-pipeline-1", "Opportunity pipeline board managed in GoHighLevel (contact details blurred)", 851, 315),
      shot("crm-pipeline-2", "Lead pipeline stages in GoHighLevel (contact details blurred)", 851, 315),
      shot("crm-pipeline-3", "Sales pipeline with qualification and follow-up stages (contact details blurred)", 851, 315),
      shot("crm-pipeline-4", "Aged lead pipeline with response and booking stages (contact details blurred)", 851, 315),
      shot("crm-calendar-availability", "Discovery call calendar availability schedule across team members", 1800, 925),
      shot("crm-calendar-staff", "Calendar staff and meeting location setup optimized for equal distribution", 1800, 927),
      shot("crm-calendar-details", "Discovery call calendar configuration", 851, 315),
      shot("crm-cc-tagging", "Call center tagging workflow with branching paths", 1800, 838),
      shot("crm-response-slack", "Lead response workflow posting Slack alerts with assigned user and contact details", 1800, 846),
    ],
    capabilityIds: ["crm", "ops", "process", "lead-management"],
  },
];

export const partners = ["One Finance Source", "Term Loan Solution", "Alliance Capital Enterprises Inc."];

export type Capability = {
  id: string;
  title: string;
  description: string;
  tools: string[];
};

export const capabilities: Capability[] = [
  {
    id: "crm",
    title: "CRM administration & configuration",
    description:
      "Pipelines, calendars, custom fields, contacts, user permissions, and opportunity management across GoHighLevel, Zoho CRM, and partner platforms.",
    tools: ["GoHighLevel", "Zoho CRM", "HubSpot", "ActiveCampaign", "ReSimpli"],
  },
  {
    id: "automation",
    title: "Workflow automation",
    description:
      "SMS, email, and workflow automations for lead nurturing, appointment booking, follow-up campaigns, and internal notifications.",
    tools: ["GHL Workflows", "Zapier", "Google Apps Script", "Mailchimp"],
  },
  {
    id: "ai",
    title: "AI Voice & Conversation AI",
    description:
      "Configuring and supporting AI Voice and Conversation AI — call routing, booking logic, AI summaries, notifications, and CRM integrations.",
    tools: ["GHL AI Agents", "OpenAI (ChatGPT)", "LeadConnector", "Zoho Voice"],
  },
  {
    id: "integrations",
    title: "API & webhook integrations",
    description:
      "Connecting CRMs, forms, and spreadsheets through REST APIs and webhooks, and troubleshooting third-party integrations end to end.",
    tools: ["REST APIs", "Webhooks", "Zapier", "Google Sheets"],
  },
  {
    id: "ops",
    title: "Backend operations & troubleshooting",
    description:
      "Root-cause analysis across CRM systems, digital forms, PDF workflows, email administration, and e-signature processes.",
    tools: ["Microsoft 365", "Outlook", "Adobe Acrobat Sign", "Jotform"],
  },
  {
    id: "lead-management",
    title: "Lead management & distribution",
    description:
      "Lead routing, round-robin calendars, ownership assignment, and aged-lead re-engagement so every lead reaches the right person.",
    tools: ["Round-robin calendars", "Lead routing", "Tagging", "Pipelines"],
  },
  {
    id: "web-apps",
    title: "Custom web applications",
    description:
      "Building purpose-built web tools that connect directly to CRM operations, version-controlled and deployed with modern tooling.",
    tools: ["Next.js", "GitHub", "Vercel", "HTML & CSS"],
  },
  {
    id: "process",
    title: "Business process optimization",
    description:
      "Process documentation, SOP development, and cross-functional collaboration to make systems reliable and teams more efficient.",
    tools: ["SOPs", "ClickUp", "Asana", "Notion"],
  },
];

export const toolkit: { group: string; items: string[] }[] = [
  { group: "CRM platforms", items: ["GoHighLevel", "Zoho CRM", "HubSpot", "ActiveCampaign", "ReSimpli"] },
  {
    group: "Automation & AI",
    items: ["Zapier", "Google Apps Script", "REST APIs", "Webhooks", "OpenAI (ChatGPT)", "GHL AI Agents"],
  },
  { group: "Communication", items: ["Zoho Voice", "LeadConnector", "Microsoft Outlook", "Instantly AI", "Mailchimp"] },
  {
    group: "Forms & documents",
    items: ["Jotform", "Adobe Acrobat", "Google Forms", "Google Sheets", "Microsoft Excel", "Google Drive"],
  },
  {
    group: "Web platforms",
    items: ["WordPress", "Wix", "Shopify", "Investor Carrot", "Google Analytics", "Search Console"],
  },
  {
    group: "Project & collaboration",
    items: ["ClickUp", "Asana", "Monday.com", "Notion", "Slack", "Microsoft Teams", "Zoom", "Loom"],
  },
];

export type Role = {
  period: string;
  title: string;
  org: string;
  points: string[];
  current?: boolean;
};

export const experience: Role[] = [
  {
    period: "Jul 2025 — Present",
    title: "CRM & Technical Operations Specialist",
    org: "American Financial Services, LLC",
    current: true,
    points: [
      "Manage CRM operations across GoHighLevel, Zoho CRM, and partner platforms, including pipelines, calendars, workflow automations, lead routing, and opportunity management.",
      "Design, build, and optimize SMS, email, AI, and workflow automations that improve lead nurturing, appointment booking, follow-up campaigns, and operational efficiency.",
      "Configure and support AI Voice and Conversation AI workflows, including call routing, booking logic, AI summaries, notifications, and CRM integrations.",
      "Troubleshoot CRM systems, APIs, webhooks, third-party integrations, digital forms, PDF workflows, and backend processes through root cause analysis.",
      "Develop and maintain automation solutions using Zapier, Google Apps Script, and native CRM workflows.",
      "Manage Microsoft 365, Outlook, and Adobe Acrobat Sign, including email administration, fillable PDF forms, e-signature workflows, and document automation.",
      "Building a custom deal intake web application with Next.js, GitHub, and Vercel, featuring private file storage and GoHighLevel integration (in development).",
      "Built a DSCR loan calculator in Jotform using form calculation fields.",
      "Collaborate with cross-functional teams to document processes, implement new systems, and improve CRM performance, automation reliability, and operational workflows.",
      "Support CRM operations and backend automation for partner organizations — One Finance Source, Term Loan Solution, and Alliance Capital Enterprises Inc.",
    ],
  },
  {
    period: "May 2025 — Jul 2025",
    title: "Marketing Operations Assistant",
    org: "Finance Parrot",
    points: [
      "Supported daily operations, executive tasks, and project coordination.",
      "Managed website updates, SEO improvements, lead generation initiatives, and cold email outreach campaigns.",
      "Monitored campaign performance and provided administrative support.",
    ],
  },
  {
    period: "Feb 2024 — May 2025",
    title: "Executive Assistant to CEO",
    org: "One Virtual Desk",
    points: [
      "Supported executive operations, project coordination, and business processes across multiple departments.",
      "Built and managed GoHighLevel workflows, CRM automations, lead capture systems, and follow-up campaigns.",
      "Maintained CRM data, pipelines, and client communication processes to improve lead management and conversion.",
      "Managed websites, SEO initiatives, and client support requests.",
      "Supported recruitment, sales, marketing, and client success operations.",
    ],
  },
  {
    period: "Nov 2023 — Jan 2024",
    title: "Content Management Specialist",
    org: "StratHauz",
    points: [
      "Assisted with website management, SEO, and lead generation.",
      "Conducted keyword research and supported content marketing efforts.",
    ],
  },
  {
    period: "Jan 2018 — Present",
    title: "Field Service Technician (IT)",
    org: "Self-employed",
    points: [
      "Provide technical support for hardware, software, and networking.",
      "Install, configure, and maintain IT equipment and systems.",
    ],
  },
];

export const education = {
  period: "2015 — 2020",
  school: "Western Institute of Technology",
  field: "Information Technology",
};

export type Testimonial = { quote: string; name: string; org: string; logo?: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Mikee has been an important part of our technical operations, helping us improve our CRM systems, automate workflows, and streamline our business processes. His ability to troubleshoot technical issues, integrate different platforms, and develop practical solutions has helped our team operate more efficiently. He consistently demonstrates initiative, attention to detail, and a strong commitment to improving the systems we rely on.",
    name: "Todd T.",
    org: "American Financial Services, LLC",
    logo: "/logos/american-financial-services.webp",
  },
  {
    quote:
      "Great at solving technical problems and building CRM automations. His dedication and technical skills have made our workflows more efficient.",
    name: "Ryan P.",
    org: "One Finance Source",
    logo: "/logos/one-finance-source-logo.webp",
  },
  {
    quote:
      "I truly appreciate the effort, professionalism, and dedication you’ve brought to the work. Thank you for everything you’ve contributed so far.",
    name: "Yannick",
    org: "Finance Parrot",
    logo: "/logos/finance-parrot.webp",
  },
];

export type WorkSample = { topic: string; quote?: string; name: string; shot: Shot };

export const workSamples: WorkSample[] = [
  {
    topic: "Workflow development & problem solving",
    quote: "Thank you so much Mikee... great problem solving on that!",
    name: "Robert M",
    shot: shot("feedback-robert-m", "Slack thread: Mikee shares a new contact-notes workflow and Robert M thanks him for the problem solving", 1553, 837),
  },
  {
    topic: "Reporting & lead qualification",
    quote:
      "We have 2 Funding Agreements signed & in underwriting and 1 with inaccurate information, 1 No show we are following up on and 1 call scheduled today. Great job on qualifying leads and I love the reports!! Very thorough and helpful in call preparation.",
    name: "Katrina F",
    shot: shot("feedback-katrina-f", "Slack message from Katrina F praising lead qualification and reports", 1595, 322),
  },
  {
    topic: "Website & system updates",
    quote: "Everything Looks Great! Thanks for getting this done for me. It is very much appreciated!",
    name: "Bob H",
    shot: shot("feedback-bob-h", "Slack thread: Mikee reports website fixes and Bob H confirms everything looks great", 1185, 904),
  },
  {
    topic: "CRM troubleshooting & workflow investigation",
    name: "John T",
    shot: shot("feedback-john-t", "Slack thread: Mikee traces where automated messages originate in the CRM workflow", 983, 791),
  },
];
