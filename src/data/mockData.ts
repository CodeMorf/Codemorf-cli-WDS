import {
  ProjectItem,
  AgentInfo,
  ActivityTimelineItem,
  ChatMessage,
  KanbanTask,
  ImplementationPlanStep,
  PermissionCategory,
  MemoryItem,
  SkillItem,
  ExtensionItem,
  McpServer,
  AiProvider,
  SmartRouterRule,
  AutomationJob,
  NotificationItem
} from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-eroga',
    name: 'Construye ErogaAI SaaS local',
    category: 'Plataforma de gastos',
    path: 'C:/Users/Kitgiz/Projects/ErogaAI',
    branch: 'master',
    lastActive: 'Hace 2 min',
    lastPromptSnippet: 'Te paso un ZIP de AI Studio para levantarlo en local...',
    pinned: true,
    isArchived: false,
    status: 'running',
    filesCount: 42,
    permissionLevel: 'full_access',
    techStack: 'React 19 + Express + Tailwind CSS',
    description: 'SaaS para control y conciliación de gastos empresariales con IA local',
    createdDate: '2026-08-15'
  },
  {
    id: 'proj-allsender',
    name: 'Locate Auth Allsender server',
    category: 'Anclados',
    path: 'C:/Users/Kitgiz/Servers/Allsender-Auth',
    branch: 'main',
    lastActive: 'Hace 1 hora',
    lastPromptSnippet: 'Verifica ERP Allsender en servidor y endpoints OAuth',
    pinned: true,
    isArchived: false,
    status: 'completed',
    filesCount: 88,
    permissionLevel: 'ask_confirmation',
    techStack: 'Node.js + PostgreSQL + OAuth2',
    description: 'Servicio de autenticación centralizada y pasarela de tokens para Allsender',
    createdDate: '2026-08-10'
  },
  {
    id: 'proj-fisco',
    name: 'FiscoERP Facturación Cloud',
    category: 'Proyectos',
    path: 'C:/Users/Kitgiz/Projects/FiscoERP',
    branch: 'feature/cfdi-4',
    lastActive: 'Ayer',
    lastPromptSnippet: 'Sincronizar timbrado SAT con webhooks',
    pinned: false,
    isArchived: false,
    status: 'idle',
    filesCount: 156,
    permissionLevel: 'ask_confirmation',
    techStack: 'Laravel PHP 11 + Filament + MySQL',
    description: 'Sistema ERP con facturación electrónica y timbrado CFDI 4.0 automatizado',
    createdDate: '2026-07-28'
  },
  {
    id: 'proj-gopaq',
    name: 'GoPaq Logistics Hub',
    category: 'Proyectos',
    path: 'C:/Users/Kitgiz/Projects/GoPaq',
    branch: 'develop',
    lastActive: 'Hace 3 días',
    lastPromptSnippet: 'Tracking en tiempo real de paquetería',
    pinned: false,
    isArchived: false,
    status: 'idle',
    filesCount: 64,
    permissionLevel: 'read_only',
    techStack: 'Next.js 15 + Prisma + Redis',
    description: 'Hub logístico y seguimiento satelital de envíos con webhooks',
    createdDate: '2026-08-01'
  },
  {
    id: 'proj-codemorf-scraper',
    name: 'Crear scraper de prospectos RD',
    category: 'CodeMorf',
    path: 'C:/Users/Kitgiz/Projects/CodeMorf-Scraper',
    branch: 'main',
    lastActive: 'Hace 5 horas',
    lastPromptSnippet: 'Scraper multihilo con rotación de proxies residenciales',
    pinned: false,
    isArchived: false,
    status: 'completed',
    filesCount: 23,
    permissionLevel: 'full_access',
    techStack: 'Python 3.12 + Playwright + BeautifulSoup',
    description: 'Extractor de datos y prospección B2B automatizada en República Dominicana',
    createdDate: '2026-08-20'
  },
  {
    id: 'proj-ship24go',
    name: 'grupo.SHIP24GO',
    category: 'Proyectos',
    path: 'C:/Users/Kitgiz/Projects/SHIP24GO',
    branch: 'master',
    lastActive: 'Hace 2 días',
    lastPromptSnippet: 'Hola, sincroniza la API de tarifas aduanales',
    pinned: false,
    isArchived: false,
    status: 'idle',
    filesCount: 95,
    permissionLevel: 'ask_confirmation',
    techStack: 'Vue 3 + FastAPI + PostgreSQL',
    description: 'Plataforma de comercio exterior y cálculo de impuestos arancelarios',
    createdDate: '2026-07-14'
  },
  {
    id: 'proj-vps',
    name: 'vps nuevo - Investiga acceso',
    category: 'Infraestructura',
    path: 'C:/Users/Kitgiz/Infra/VPS-Trucloud',
    branch: 'prod',
    lastActive: 'Hace 4 días',
    lastPromptSnippet: 'Accede al VPS trucloud y configura Docker compose',
    pinned: false,
    isArchived: false,
    status: 'idle',
    filesCount: 12,
    permissionLevel: 'read_only',
    techStack: 'Docker + Nginx + Ubuntu Server',
    description: 'Aprovisionamiento de servidores Linux VPS y proxy inverso seguro',
    createdDate: '2026-08-05'
  },
  {
    id: 'proj-legacy-crm',
    name: 'CRM Legacy 2024 (Archivado)',
    category: 'Archivados',
    path: 'C:/Users/Kitgiz/Archive/CRM-2024',
    branch: 'v1.4-archive',
    lastActive: 'Hace 3 meses',
    lastPromptSnippet: 'Proyecto archivado para consulta histórica',
    pinned: false,
    isArchived: true,
    status: 'idle',
    filesCount: 110,
    permissionLevel: 'read_only',
    techStack: 'React 18 + Node.js + MongoDB',
    description: 'Versión anterior del CRM corporativo; archivada en modo sólo lectura',
    createdDate: '2024-03-12'
  }
];

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'agent-frontend',
    name: 'Frontend Architect Agent',
    role: 'Frontend',
    avatarColor: 'from-cyan-400 to-blue-500',
    currentTask: 'Renderizando vistas de ErogaAI con Tailwind y React 19',
    status: 'Editing',
    duration: '04m 18s',
    modifiedFiles: ['src/components/Dashboard.tsx', 'src/styles/globals.css', 'src/App.tsx'],
    branch: 'feat/frontend-ui',
    actionsCount: 38,
    terminalLogs: [
      '[Vite] Compilando 14 módulos React...',
      '[Vite] HMR listo en http://localhost:5173',
      '[Tailwind] Generando clases de utilidad optimizadas'
    ],
    cpuUsage: '14%',
    memoryUsage: '312 MB'
  },
  {
    id: 'agent-backend',
    name: 'Backend & Database Agent',
    role: 'Backend',
    avatarColor: 'from-emerald-400 to-teal-600',
    currentTask: 'Configurando endpoints Express y Drizzle ORM PostgreSQL',
    status: 'Running',
    duration: '06m 45s',
    modifiedFiles: ['server/index.ts', 'server/db/schema.ts', 'server/routes/auth.ts'],
    branch: 'feat/backend-api',
    actionsCount: 52,
    terminalLogs: [
      '[Server] Express escuchando en puerto 4000',
      '[DB] Pool de conexiones PostgreSQL activo',
      '[Route] POST /api/auth/login registrado con bcrypt'
    ],
    cpuUsage: '22%',
    memoryUsage: '450 MB'
  },
  {
    id: 'agent-testing',
    name: 'QA & End-to-End Test Agent',
    role: 'Testing',
    avatarColor: 'from-violet-400 to-purple-600',
    currentTask: 'Ejecutando suite Playwright y Vitest de autenticación',
    status: 'Testing',
    duration: '02m 30s',
    modifiedFiles: ['tests/e2e/auth.spec.ts', 'tests/unit/calc.test.ts'],
    branch: 'master',
    actionsCount: 29,
    terminalLogs: [
      'PASS tests/unit/calc.test.ts (27 tests)',
      'RUNNING tests/e2e/auth.spec.ts [Chromium]',
      '✓ Login flow snapshot match'
    ],
    cpuUsage: '35%',
    memoryUsage: '580 MB'
  },
  {
    id: 'agent-security',
    name: 'Security & Dependency Auditor',
    role: 'Security',
    avatarColor: 'from-amber-400 to-orange-500',
    currentTask: 'Revisión de vulnerabilidades CVE y secrets en .env',
    status: 'Reading',
    duration: '01m 12s',
    modifiedFiles: ['.env.example', 'package.json'],
    branch: 'security/audit',
    actionsCount: 17,
    terminalLogs: [
      '[Audit] 0 high vulnerabilities found',
      '[SecretScan] No API Keys hardcoded in client build'
    ],
    cpuUsage: '8%',
    memoryUsage: '190 MB'
  }
];

export const INITIAL_TIMELINE: ActivityTimelineItem[] = [
  {
    id: 'tl-1',
    time: '09:42',
    status: 'Reading',
    description: 'Read src/auth/login.ts',
    target: 'src/auth/login.ts',
    duration: '120ms'
  },
  {
    id: 'tl-2',
    time: '09:43',
    status: 'Searching',
    description: 'Search authenticateUser in workspace files',
    target: 'authenticateUser',
    duration: '85ms'
  },
  {
    id: 'tl-3',
    time: '09:43',
    status: 'Editing',
    description: 'Edit src/auth/login.ts - Updated JWT token expiry & cookie params',
    target: 'src/auth/login.ts',
    duration: '310ms'
  },
  {
    id: 'tl-4',
    time: '09:44',
    status: 'Running',
    description: 'Run npm test -- --runInBand',
    target: 'Terminal',
    duration: '1.4s'
  },
  {
    id: 'tl-5',
    time: '09:45',
    status: 'Completed',
    description: '27 tests passed successfully across 4 test suites',
    target: 'Vitest Runner',
    duration: '820ms'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'agent',
    timestamp: '09:39',
    content: 'He analizado el archivo comprimido del proyecto. La aplicación está levantada en `http://localhost:5173` y la API en `http://localhost:4000`. Como el requisito incluye una interfaz usable, usaré el navegador integrado para comprobar que la pantalla carga, que el login demo abre el panel y que el alta de una erogación funciona desde la UI, no solo desde la API.',
    toolBadges: [
      {
        type: 'files_read',
        label: 'Herramienta cargada, ha leído archivos y ha ejecutado un comando'
      },
      {
        type: 'browser_action',
        label: 'Se han usado el navegador y ha ejecutado comandos'
      }
    ],
    diffSummary: {
      totalFiles: 14,
      additions: 644,
      deletions: 0,
      files: [
        { path: '.env.example', additions: 3, deletions: 0, contentDiff: '+ DB_HOST=localhost\n+ DB_PORT=5432\n+ JWT_SECRET=codemorf_secure_key_2026' },
        { path: '.gitignore', additions: 6, deletions: 0, contentDiff: '+ node_modules\n+ dist\n+ .env\n+ *.log' },
        { path: 'README.md', additions: 45, deletions: 0, contentDiff: '+ # ErogaAI SaaS Local\n+ Manual de puesta en marcha con CodeMorf CLI.' },
        { path: 'package.json', additions: 28, deletions: 0, contentDiff: '+ "drizzle-orm": "^0.39.0",\n+ "express": "^4.21.2"' },
        { path: 'src/App.tsx', additions: 112, deletions: 0, contentDiff: '+ export default function App() {\n+   return <ErogaDashboard />;\n+ }' },
        { path: 'src/components/ErogaDashboard.tsx', additions: 180, deletions: 0, contentDiff: '+ export function ErogaDashboard() { ... }' },
        { path: 'src/components/ExpensesTable.tsx', additions: 94, deletions: 0, contentDiff: '+ export function ExpensesTable() { ... }' },
        { path: 'server/index.ts', additions: 76, deletions: 0, contentDiff: '+ import express from "express";\n+ const app = express();' },
        { path: 'server/db/schema.ts', additions: 50, deletions: 0, contentDiff: '+ export const expenses = pgTable("expenses", { ... });' },
        { path: 'server/routes/auth.ts', additions: 40, deletions: 0, contentDiff: '+ router.post("/login", authenticate);' },
        { path: 'tests/auth.test.ts', additions: 10, deletions: 0, contentDiff: '+ test("login demo ok", () => { expect(true).toBe(true); });' }
      ]
    },
    workingTime: 'Ha trabajado durante 10s'
  },
  {
    id: 'msg-2',
    sender: 'user',
    timestamp: '09:41',
    content: 'tu eres como estrano! solo era para que entienda! que dice aqui haremos esto  te paso zip  de aistudio lo haremos en localhost  con mysql o mejor sql  rapido! saas! ?'
  },
  {
    id: 'msg-3',
    sender: 'agent',
    timestamp: '09:41',
    content: `Sí, entendí ahora: me estabas explicando el plan, no pidiendo que empezara todavía.

La frase significa:

> *"Te voy a pasar un ZIP exportado de AI Studio. Luego lo adaptaremos para ejecutarlo en localhost, usando MySQL o una base SQL más rápida, y lo convertiremos en un SaaS."*

Me adelanté creando cosas; disculpa. Por ahora solo recibí el prompt de texto, no el ZIP. Cuando lo pases, lo revisamos primero y decidimos entre **MySQL**, **PostgreSQL** o **SQLite local**.

Podemos seguir estos 3 pasos en orden cuando estés listo:
1. **Inspeccionar estructura:** Descomprimir el ZIP y listar dependencias.
2. **Definir base de datos:** Configurar Docker para MySQL o PostgreSQL ligero.
3. **Multi-tenant SaaS:** Añadir autenticación por organización y roles.`,
    workingTime: 'Ha trabajado durante 2s',
    reasoningSteps: [
      { step: 'Analizar intención del usuario y corregir contexto de ejecución', status: 'done', duration: '320ms' },
      { step: 'Clarificar flujo para recepción del ZIP de AI Studio y base SQL', status: 'done', duration: '410ms' },
      { step: 'Generar respuesta concisa con pasos accionables', status: 'done', duration: '280ms' }
    ]
  }
];

export const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Definir esquema Multi-tenant en Drizzle ORM',
    column: 'BACKLOG',
    agent: 'Backend Agent',
    priority: 'High',
    project: 'ErogaAI SaaS',
    branch: 'feat/schema',
    progress: 0,
    date: '26 Ago',
    description: 'Separar tablas con tenant_id y claves foráneas en cascada.',
    tags: ['Database', 'SQL', 'Schema']
  },
  {
    id: 'task-2',
    title: 'Crear componente visual de importación de ZIP',
    column: 'TODO',
    agent: 'Frontend Agent',
    priority: 'Medium',
    project: 'ErogaAI SaaS',
    branch: 'feat/zip-uploader',
    progress: 25,
    date: '26 Ago',
    description: 'Drag & drop con preview de carpetas antes de descomprimir.',
    tags: ['UI', 'Upload', 'React']
  },
  {
    id: 'task-3',
    title: 'Migración a PostgreSQL local con Docker Compose',
    column: 'WORKING',
    agent: 'Backend Agent',
    priority: 'Critical',
    project: 'ErogaAI SaaS',
    branch: 'feat/docker-postgres',
    progress: 70,
    date: '26 Ago',
    description: 'docker-compose.yml con healthcheck y volumen persistente.',
    tags: ['Docker', 'Backend', 'DevOps']
  },
  {
    id: 'task-4',
    title: 'Verificación de 27 pruebas unitarias de Autenticación',
    column: 'VERIFY',
    agent: 'QA Test Agent',
    priority: 'High',
    project: 'ErogaAI SaaS',
    branch: 'master',
    progress: 95,
    date: '26 Ago',
    description: 'Tests de expiración de JWT y roles de usuario.',
    tags: ['Vitest', 'Testing']
  },
  {
    id: 'task-5',
    title: 'Scaffolding inicial de rutas Express y Vite middleware',
    column: 'DONE',
    agent: 'Frontend Architect',
    priority: 'Medium',
    project: 'ErogaAI SaaS',
    branch: 'master',
    progress: 100,
    date: '26 Ago',
    description: 'Integración de Vite en modo desarrollo y bundling con esbuild.',
    tags: ['Architecture', 'Setup']
  }
];

export const INITIAL_PLAN_STEPS: ImplementationPlanStep[] = [
  {
    id: 1,
    title: 'Lectura e inspección del paquete comprimido AI Studio',
    description: 'Verificar package.json, detectar si usa React + Vite y dependencias backend.',
    fileTarget: 'package.json',
    action: 'test',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Configurar variables de entorno locales (.env)',
    description: 'Generar credenciales seguras para SQLite / PostgreSQL local y puerto 3000.',
    fileTarget: '.env.example',
    action: 'create',
    status: 'approved'
  },
  {
    id: 3,
    title: 'Implementar conexión y migraciones con Drizzle ORM',
    description: 'Crear esquema con usuarios, gastos, comprobantes fiscales y tenants.',
    fileTarget: 'server/db/schema.ts',
    action: 'modify',
    status: 'in_progress'
  },
  {
    id: 4,
    title: 'Integrar visualizador en navegador integrado',
    description: 'Validar login interactivo y captura de screenshots automáticos.',
    fileTarget: 'src/components/IntegratedBrowser.tsx',
    action: 'modify',
    status: 'pending'
  },
  {
    id: 5,
    title: 'Ejecutar suite de tests y empaquetar para Windows Tauri',
    description: 'Comprobar 0 regresiones antes de generar el instalador .msi.',
    fileTarget: 'src-tauri/tauri.conf.json',
    action: 'command',
    status: 'pending'
  }
];

export const INITIAL_PERMISSIONS: PermissionCategory[] = [
  {
    id: 'perm-files',
    name: 'Archivos & Directorios',
    description: 'Lectura, creación, modificación y eliminación de archivos en el workspace.',
    icon: 'FolderKanban',
    mode: 'Allow This Session',
    allowedPatterns: ['src/**', 'server/**', 'package.json', '*.md']
  },
  {
    id: 'perm-terminal',
    name: 'Terminal & Procesos CLI',
    description: 'Ejecución de comandos npm, git, docker, tauri y compiladores en shell.',
    icon: 'Terminal',
    mode: 'Ask Every Time',
    allowedPatterns: ['npm run *', 'npm test', 'git status', 'git diff']
  },
  {
    id: 'perm-git',
    name: 'Operaciones Git & GitHub',
    description: 'Creación de ramas, commits, push, pull requests y sincronización remota.',
    icon: 'GitBranch',
    mode: 'Always Allow',
    allowedPatterns: ['git checkout *', 'git add *', 'git commit -m *']
  },
  {
    id: 'perm-db',
    name: 'Base de Datos & SQL',
    description: 'Ejecución de migraciones DDL y consultas DML en bases de datos configuradas.',
    icon: 'Database',
    mode: 'Allow This Session',
    allowedPatterns: ['SELECT *', 'drizzle-kit push', 'npx prisma migrate']
  },
  {
    id: 'perm-browser',
    name: 'Navegador Integrado',
    description: 'Automatización de navegación, clics, inspección de consola y capturas.',
    icon: 'Globe',
    mode: 'Always Allow',
    allowedPatterns: ['http://localhost:*', 'https://codemorf.tech/*']
  },
  {
    id: 'perm-network',
    name: 'Red & Llamadas Externas',
    description: 'Conexión a APIs de proveedores AI, registros npm y webhooks.',
    icon: 'Wifi',
    mode: 'Ask Every Time',
    allowedPatterns: ['https://api.codemorf.tech/**', 'https://api.anthropic.com/**']
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'User Memory',
    title: 'Preferencia de Stack Tecnológico',
    content: 'El usuario prefiere React 19 con Tailwind CSS v4, Express con TypeScript para backend, y Drizzle ORM sobre Prisma por rendimiento.',
    tags: ['Stack', 'Tech', 'React'],
    pinned: true,
    updatedAt: 'Hoy 09:15'
  },
  {
    id: 'mem-2',
    category: 'Workspace Memory',
    title: 'Estructura de Carpetas ErogaAI',
    content: 'El workspace cuenta con frontend en /src, servidor Express en /server, tests en /tests y scripts en /scripts.',
    tags: ['Workspace', 'Paths'],
    pinned: true,
    updatedAt: 'Hoy 08:30'
  },
  {
    id: 'mem-3',
    category: 'Project Memory',
    title: 'Credenciales Demo ErogaAI',
    content: 'Usuario demo: admin@eroga.ai / Clave: ErogaPass2026! (solo para entorno local).',
    tags: ['Credentials', 'Demo'],
    pinned: false,
    updatedAt: 'Ayer'
  },
  {
    id: 'mem-4',
    category: 'Agent Memory',
    title: 'Contexto de Multi-Agente',
    content: 'Frontend Agent se encarga únicamente de UI/UX sin tocar queries directas a DB; Backend Agent provee endpoints REST.',
    tags: ['Agents', 'Rules'],
    pinned: false,
    updatedAt: 'Hace 2 días'
  },
  {
    id: 'mem-5',
    category: 'Task Memory',
    title: 'Regla de formato de Commits',
    content: 'Usar Conventional Commits: feat(scope): message, fix(scope): message, test(scope): message.',
    tags: ['Git', 'Convention'],
    pinned: true,
    updatedAt: 'Hace 3 días'
  }
];

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'skill-react',
    name: 'React 19 & Next-Gen UI Expert',
    description: 'Arquitectura de componentes funcionales, Server Components, hooks reactivos y Tailwind CSS v4.',
    category: 'Frontend',
    icon: 'Atom',
    enabled: true,
    version: '2.4.0',
    author: 'CodeMorf Core',
    rulesCount: 14
  },
  {
    id: 'skill-ts',
    name: 'TypeScript Strict Expert',
    description: 'Tipado estricto sin tipo `any`, genéricos avanzados, interfaces utilitarias y validación con Zod.',
    category: 'Language',
    icon: 'FileCode2',
    enabled: true,
    version: '1.9.2',
    author: 'CodeMorf Core',
    rulesCount: 22
  },
  {
    id: 'skill-laravel',
    name: 'Laravel & PHP Modern Developer',
    description: 'Patrones Repository, Eloquent ORM optimizado, Filament Admin y APIs RESTful seguras.',
    category: 'Backend',
    icon: 'Layers',
    enabled: false,
    version: '1.1.0',
    author: 'Community',
    rulesCount: 18
  },
  {
    id: 'skill-db',
    name: 'Database Migration & Indexing',
    description: 'Optimización de índices B-Tree, esquemas Drizzle/PostgreSQL, transacciones ACID y particionado.',
    category: 'Database',
    icon: 'Database',
    enabled: true,
    version: '3.0.1',
    author: 'CodeMorf DB Team',
    rulesCount: 31
  },
  {
    id: 'skill-sec',
    name: 'Security Review & Zero-Trust',
    description: 'Prevención OWASP Top 10, sanitización XSS/SQLi, rate limiting, validación JWT y secrets hygiene.',
    category: 'Security',
    icon: 'ShieldCheck',
    enabled: true,
    version: '2.1.0',
    author: 'Security Lab',
    rulesCount: 45
  },
  {
    id: 'skill-prod',
    name: 'Production Deployment & Tauri CI',
    description: 'Empaquetado multiplataforma para Windows MSI/NSIS, Docker compose y despliegue Cloud Run.',
    category: 'DevOps',
    icon: 'Rocket',
    enabled: true,
    version: '1.5.0',
    author: 'CodeMorf Infra',
    rulesCount: 12
  },
  {
    id: 'skill-test',
    name: 'Testing & Playwright Automation',
    description: 'Pruebas E2E visuales, mocking de llamadas de red y cobertura de código mínima del 85%.',
    category: 'QA',
    icon: 'CheckCircle2',
    enabled: true,
    version: '2.0.0',
    author: 'QA Core',
    rulesCount: 19
  },
  {
    id: 'skill-git',
    name: 'Git Workflow & Rebase Pro',
    description: 'Estrategia Trunk-based development, resolución interactiva de merge conflicts y commits atómicos.',
    category: 'Git',
    icon: 'GitPullRequest',
    enabled: true,
    version: '1.8.0',
    author: 'CodeMorf Core',
    rulesCount: 15
  }
];

export const INITIAL_EXTENSIONS: ExtensionItem[] = [
  {
    id: 'ext-codemorf-copilot',
    name: 'CodeMorf Neural Intelligence',
    description: 'Autocompletado ultra rápido con streaming continuo y generación contextual de código.',
    category: 'AI',
    author: 'CodeMorf Technologies',
    rating: 4.9,
    downloads: '142k',
    installed: true,
    version: '3.4.0'
  },
  {
    id: 'ext-mcp-hub',
    name: 'MCP Universal Connector',
    description: 'Soporte completo para Model Context Protocol conectando herramientas locales y remotas.',
    category: 'MCP',
    author: 'Anthropic & CodeMorf',
    rating: 5.0,
    downloads: '98k',
    installed: true,
    hasUpdate: true,
    version: '1.2.0'
  },
  {
    id: 'ext-git-lens',
    name: 'Git Quantum Lens',
    description: 'Blame en línea de código, visualizador de ramas interactivo y generación de PRs con IA.',
    category: 'Git',
    author: 'DevTools Lab',
    rating: 4.8,
    downloads: '310k',
    installed: true,
    version: '4.1.2'
  },
  {
    id: 'ext-browser-agent',
    name: 'Autonomous Web Inspector',
    description: 'Agente autónomo para interactuar con navegadores headless, capturas y depuración DOM.',
    category: 'Browser',
    author: 'CodeMorf QA',
    rating: 4.7,
    downloads: '65k',
    installed: true,
    version: '2.0.4'
  },
  {
    id: 'ext-db-lens',
    name: 'PostgreSQL & MySQL Lens',
    description: 'Explorador visual de tablas, diagramas ER automáticos y generador de queries SQL optimizadas.',
    category: 'Database',
    author: 'DataStudio',
    rating: 4.9,
    downloads: '88k',
    installed: false,
    version: '1.9.0'
  },
  {
    id: 'ext-docker-mgr',
    name: 'Docker Desktop Bridge',
    description: 'Gestor de contenedores, logs en tiempo real y reinicio rápido desde la interfaz de CodeMorf.',
    category: 'DevOps',
    author: 'CloudTools',
    rating: 4.6,
    downloads: '120k',
    installed: false,
    version: '2.2.1'
  }
];

export const INITIAL_MCP_SERVERS: McpServer[] = [
  {
    id: 'mcp-github',
    name: 'GitHub MCP Server',
    description: 'Acceso a repositorios, issues, pull requests y comentarios de la organización.',
    status: 'Connected',
    command: 'npx -y @modelcontextprotocol/server-github',
    envVars: { GITHUB_PERSONAL_ACCESS_TOKEN: 'ghp_••••••••••••••••' },
    permissions: ['repo', 'pull_requests', 'issues'],
    toolsCount: 18
  },
  {
    id: 'mcp-postgres',
    name: 'PostgreSQL MCP Server',
    description: 'Introspección de esquemas, ejecución de queries SELECT y planes EXPLAIN ANALYZE.',
    status: 'Connected',
    command: 'npx -y @modelcontextprotocol/server-postgres postgresql://localhost/eroga_db',
    envVars: { POSTGRES_URL: 'postgresql://postgres:pass@localhost:5432/eroga_db' },
    permissions: ['read_schema', 'query_readonly'],
    toolsCount: 9
  },
  {
    id: 'mcp-filesystem',
    name: 'Secure Filesystem MCP',
    description: 'Lectura y escritura acotada a carpetas aprobadas dentro del espacio de trabajo.',
    status: 'Connected',
    command: 'npx -y @modelcontextprotocol/server-filesystem C:/Users/Kitgiz/Projects',
    envVars: {},
    permissions: ['fs_read', 'fs_write'],
    toolsCount: 14
  },
  {
    id: 'mcp-custom',
    name: 'Custom ERP Proxy MCP',
    description: 'Conexión personalizada para endpoints de Allsender y FiscoERP en red privada.',
    status: 'Disconnected',
    command: 'node C:/Users/Kitgiz/mcp/erp-proxy.js',
    envVars: { ERP_ENDPOINT: 'https://erp.allsender.internal/api' },
    permissions: ['erp_read', 'erp_invoice'],
    toolsCount: 6
  }
];

export const INITIAL_AI_PROVIDERS: AiProvider[] = [
  {
    id: 'codemorf-api',
    name: 'CodeMorf Multi-Agent Cloud API',
    isFeatured: true,
    status: 'connected',
    isConfigured: true,
    apiKeyPlaceholder: 'cm_live_99f2b84a32904bc89c4...',
    apiKey: 'cm_live_99f2b84a32904bc89c4d92a10e82',
    userApiKey: 'cm_live_99f2b84a32904bc89c4d92a10e82',
    baseUrl: 'https://api.codemorf.tech/v1',
    docsUrl: 'https://codemorf.tech/chat/docs/es/',
    defaultModel: 'codemorf-ultra-coder-2026',
    availableModels: [
      'codemorf-ultra-coder-2026',
      'codemorf-reasoning-r1',
      'codemorf-fast-coder-mini',
      'codemorf-voice-stream-2026'
    ],
    models: [
      'codemorf-ultra-coder-2026',
      'codemorf-reasoning-r1',
      'codemorf-fast-coder-mini',
      'codemorf-voice-stream-2026'
    ],
    supportsAudio: true,
    audioFeatureDetails: 'Voz bidireccional humana ultra-rápida (200ms de latencia) + Transcripción nativa'
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o / Realtime)',
    status: 'configured',
    isConfigured: true,
    apiKeyPlaceholder: 'sk-proj-••••••••••••••••',
    apiKey: 'sk-proj-91a0b38c29014efa818290bcdae829',
    userApiKey: 'sk-proj-91a0b38c29014efa818290bcdae829',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    availableModels: ['gpt-4o', 'gpt-4o-realtime-preview', 'gpt-4o-mini', 'o1-preview', 'o3-mini'],
    models: ['gpt-4o', 'gpt-4o-realtime-preview', 'gpt-4o-mini', 'o1-preview', 'o3-mini'],
    supportsAudio: true,
    audioFeatureDetails: 'Audio nativo GPT-4o Realtime API con entrada y salida de voz humana multilingüe'
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini (Live Audio)',
    status: 'connected',
    isConfigured: true,
    apiKeyPlaceholder: 'AIzaSy••••••••••••••••',
    apiKey: 'AIzaSy88190BCAFE01928472910482019482',
    userApiKey: 'AIzaSy88190BCAFE01928472910482019482',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.5-pro',
    availableModels: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-realtime'],
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-realtime'],
    supportsAudio: true,
    audioFeatureDetails: 'Gemini Multimodal Live API con streaming de voz humana bidireccional y bajo retardo'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    status: 'configured',
    isConfigured: true,
    apiKeyPlaceholder: 'sk-ant-api03-••••••••••••',
    apiKey: 'sk-ant-api03-bb90184728919018247019824',
    userApiKey: 'sk-ant-api03-bb90184728919018247019824',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-7-sonnet-20250219',
    availableModels: [
      'claude-3-7-sonnet-20250219',
      'claude-3-5-sonnet-latest',
      'claude-3-5-haiku-latest'
    ],
    models: [
      'claude-3-7-sonnet-20250219',
      'claude-3-5-sonnet-latest',
      'claude-3-5-haiku-latest'
    ],
    supportsAudio: false,
    audioFeatureDetails: 'Solo Texto y Código (No incluye streaming de audio nativo)'
  },
  {
    id: 'xai-grok',
    name: 'xAI Grok',
    status: 'connected',
    isConfigured: true,
    apiKeyPlaceholder: 'xai-••••••••••••••••',
    apiKey: 'xai-81928401928491028301948201948201',
    userApiKey: 'xai-81928401928491028301948201948201',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-3',
    availableModels: ['grok-3', 'grok-3-mini', 'grok-2-vision'],
    models: ['grok-3', 'grok-3-mini', 'grok-2-vision'],
    supportsAudio: false,
    audioFeatureDetails: 'Solo Texto y Visión de código (No soporta voz en tiempo real directa)'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (DeepSeek R1 / Llama)',
    status: 'disconnected',
    isConfigured: false,
    apiKeyPlaceholder: 'sk-or-v1-••••••••••••••••',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'deepseek/deepseek-r1',
    availableModels: ['deepseek/deepseek-r1', 'qwen/qwen-2.5-coder-32b', 'meta-llama/llama-3.3-70b-instruct'],
    models: ['deepseek/deepseek-r1', 'qwen/qwen-2.5-coder-32b', 'meta-llama/llama-3.3-70b-instruct'],
    supportsAudio: false,
    audioFeatureDetails: 'Solo Texto y Razonamiento R1 (Sin streaming de audio)'
  },
  {
    id: 'custom-openai',
    name: 'Custom Local Ollama / vLLM',
    status: 'disconnected',
    isConfigured: false,
    apiKeyPlaceholder: 'custom-token-or-empty',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'ollama-codellama',
    availableModels: ['ollama-codellama', 'local-deepseek-coder', 'vllm-model'],
    models: ['ollama-codellama', 'local-deepseek-coder', 'vllm-model'],
    supportsAudio: false,
    audioFeatureDetails: 'Servidor Local (Requiere puente Piper TTS o Whisper externo para voz)'
  }
];

export const SMART_ROUTER_RULES: SmartRouterRule[] = [
  {
    id: 'rule-simple',
    taskType: 'Simple tasks & quick queries',
    recommendedModel: 'CodeMorf Fast Mini / Grok-3 Mini',
    model: 'CodeMorf Fast Mini / Grok-3 Mini',
    provider: 'CodeMorf API',
    description: 'Respuestas instantáneas (<500ms) para consultas rápidas, explicaciones de sintaxis y renombrado de variables.',
    reason: 'Baja latencia y bajo consumo de tokens para edición rápida.'
  },
  {
    id: 'rule-coding',
    taskType: 'Coding & Multi-file editing',
    recommendedModel: 'CodeMorf Ultra Coder / Claude 3.7 Sonnet',
    model: 'CodeMorf Ultra Coder / Claude 3.7 Sonnet',
    provider: 'CodeMorf API',
    description: 'Generación precisa de código TypeScript, refactorización transversal y mantenimiento de contratos.',
    reason: 'Máxima precisión en sintaxis y resolución de dependencias.'
  },
  {
    id: 'rule-arch',
    taskType: 'Architecture & System design',
    recommendedModel: 'CodeMorf Reasoning R1 / OpenAI o1',
    model: 'CodeMorf Reasoning R1 / OpenAI o1',
    provider: 'CodeMorf API',
    description: 'Análisis profundo de dependencias, diseño de esquemas de bases de datos y orquestación multi-agente.',
    reason: 'Razonamiento recursivo para prevenir errores estructurales.'
  },
  {
    id: 'rule-vision',
    taskType: 'Vision & UI inspection',
    recommendedModel: 'Gemini 2.5 Pro / Grok-2 Vision',
    model: 'Gemini 2.5 Pro / Grok-2 Vision',
    provider: 'Google Gemini',
    description: 'Inspección de capturas del navegador integrado, diseño visual Pixel-Perfect y detección de bugs visuales.',
    reason: 'Comprensión multimodal de alta resolución.'
  },
  {
    id: 'rule-context',
    taskType: 'Large context & Full repo analysis',
    recommendedModel: 'Gemini 2.5 Pro (2M Tokens) / Claude 3.7',
    model: 'Gemini 2.5 Pro (2M Tokens) / Claude 3.7',
    provider: 'Google Gemini',
    description: 'Lectura completa de repositorios de gran envergadura sin pérdida de contexto en la ventana de atención.',
    reason: 'Ventana de contexto de 2 millones de tokens sin degradación.'
  }
];

export const INITIAL_AUTOMATIONS: AutomationJob[] = [
  {
    id: 'auto-nightly',
    name: 'Nightly E2E & Unit Tests Suite',
    schedule: 'Todos los días a las 02:00 AM',
    trigger: 'Diario a las 02:00 AM',
    nextRun: 'Mañana 02:00 AM',
    lastStatus: 'success',
    lastRun: 'Hoy 02:00 AM (27 tests aprobados)',
    targetAgent: 'QA Test Agent',
    enabled: true,
    triggerType: 'cron',
    description: 'Ejecuta automáticamente la suite completa de pruebas unitarias y de integración en Windows, generando un reporte de cobertura.',
    actionPrompt: 'Ejecutar npm test con vitest y generar reporte de cobertura en /coverage',
    executionLogs: [
      '[02:00:01] Iniciando runner en C:/Users/Kitgiz/Projects/ErogaAI',
      '[02:00:04] 27 tests ejecutados sin errores',
      '[02:00:05] Cobertura alcanzada: 91.4%'
    ]
  },
  {
    id: 'auto-security',
    name: 'Security & Dependency Vulnerability Review',
    schedule: 'Todos los viernes a las 18:00 PM',
    trigger: 'Semanal (Viernes 18:00)',
    nextRun: 'Viernes 18:00 PM',
    lastStatus: 'success',
    lastRun: 'Viernes pasado (0 vulnerabilidades críticas)',
    targetAgent: 'Security Auditor',
    enabled: true,
    triggerType: 'cron',
    description: 'Auditoría automática de paquetes npm, análisis estático de vulnerabilidades OWASP y verificación de secretos expuestos.',
    actionPrompt: 'npm audit --json y escaneo estático de secrets con Security Agent',
    executionLogs: [
      '[18:00:00] Analizando 142 paquetes dependientes',
      '[18:00:03] 0 vulnerabilidades detectadas'
    ]
  },
  {
    id: 'auto-issues',
    name: 'Check GitHub Issues & Auto-Triage',
    schedule: 'Cada 6 horas',
    trigger: 'Intervalo de 6 horas',
    nextRun: 'En 3 horas (21:30)',
    lastStatus: 'running',
    lastRun: 'Hace 3 horas (2 issues categorizados)',
    targetAgent: 'Frontend Architect',
    enabled: true,
    triggerType: 'interval',
    description: 'Revisa nuevos issues y pull requests en GitHub, etiqueta severidades y redacta propuestas de solución con diffs.',
    actionPrompt: 'Sincronizar GitHub issues mediante API y etiquetar bugs / features',
    executionLogs: [
      '[15:30:10] Consultando API de GitHub...',
      '[15:30:12] 1 issue pendiente de revisión asignado al backlog'
    ]
  },
  {
    id: 'auto-backup',
    name: 'Automatic Memory & Project Snapshot Sync',
    schedule: 'Cada 1 hora',
    trigger: 'Intervalo de 1 hora',
    nextRun: 'En 18 minutos',
    lastStatus: 'success',
    lastRun: 'Hace 42 minutos',
    targetAgent: 'CodeMorf Daemon',
    enabled: true,
    triggerType: 'interval',
    description: 'Crea snapshots incrementales del estado del proyecto, memorias persistentes y contexto de multi-agentes.',
    actionPrompt: 'Crear backup snapshot en .codemorf/snapshots/',
    executionLogs: [
      '[18:15:00] Snapshot incremental #482 guardado satisfactoriamente'
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Agente completó la tarea',
    message: 'Frontend Architect finalizó la edición de 14 archivos en ErogaAI SaaS local.',
    time: 'Hace 4 min',
    type: 'success',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Permiso requerido',
    message: 'Backend Agent solicita permiso para ejecutar: "npx drizzle-kit push" en PostgreSQL.',
    time: 'Hace 12 min',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-3',
    title: '27 Pruebas superadas con éxito',
    message: 'QA Agent verificó que el flujo de login y registro pasa el 100% de aserciones.',
    time: 'Hace 22 min',
    type: 'success',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Pull Request #14 listo para revisión',
    message: 'Ruta feat/frontend-ui puede ser fusionada en master.',
    time: 'Hace 1 hora',
    type: 'info',
    read: true
  }
];
