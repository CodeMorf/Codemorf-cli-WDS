export type ThemeMode = 'dark' | 'light' | 'system';

export type PermissionLevel = 'read_only' | 'ask_confirmation' | 'full_access';

export type MainView = 
  | 'workspace'
  | 'multi-agent'
  | 'tasks'
  | 'plan'
  | 'permissions'
  | 'browser'
  | 'git'
  | 'terminal'
  | 'files'
  | 'memory'
  | 'skills'
  | 'extensions'
  | 'mcp'
  | 'providers'
  | 'automations'
  | 'dashboard'
  | 'welcome';

export interface ProjectItem {
  id: string;
  name: string;
  category?: string;
  path: string;
  branch: string;
  lastActive: string;
  lastPromptSnippet?: string;
  pinned?: boolean;
  isArchived?: boolean;
  status: 'idle' | 'running' | 'completed' | 'error' | 'archived';
  filesCount?: number;
  permissionLevel?: PermissionLevel;
  techStack?: string;
  description?: string;
  createdDate?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Testing' | 'Security' | 'DevOps' | 'Architect';
  avatarColor: string;
  currentTask: string;
  status: 'Thinking' | 'Planning' | 'Reading' | 'Searching' | 'Editing' | 'Running' | 'Testing' | 'Browsing' | 'Waiting permission' | 'Completed' | 'Idle' | 'Failed';
  duration: string;
  modifiedFiles: string[];
  branch: string;
  actionsCount: number;
  terminalLogs: string[];
  cpuUsage: string;
  memoryUsage: string;
}

export interface ActivityTimelineItem {
  id: string;
  time: string;
  status: AgentInfo['status'];
  description: string;
  target?: string;
  details?: string;
  duration?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  content: string;
  toolBadges?: {
    type: 'files_read' | 'command_run' | 'browser_action' | 'test_passed' | 'git_commit';
    label: string;
    icon?: string;
  }[];
  diffSummary?: {
    totalFiles: number;
    additions: number;
    deletions: number;
    files: {
      path: string;
      additions: number;
      deletions: number;
      contentDiff?: string;
    }[];
  };
  reasoningSteps?: {
    step: string;
    status: 'done' | 'active' | 'pending';
    duration?: string;
    details?: string;
  }[];
  workingTime?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  column: 'BACKLOG' | 'TODO' | 'WORKING' | 'VERIFY' | 'DONE';
  agent: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  project: string;
  branch: string;
  progress: number;
  date: string;
  description: string;
  tags: string[];
}

export interface ImplementationPlanStep {
  id: number;
  title: string;
  description: string;
  fileTarget: string;
  action: 'create' | 'modify' | 'delete' | 'test' | 'command';
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
}

export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  mode: 'Ask Every Time' | 'Allow This Session' | 'Always Allow' | 'Always Deny';
  allowedPatterns: string[];
}

export interface MemoryItem {
  id: string;
  category: 'User Memory' | 'Workspace Memory' | 'Project Memory' | 'Agent Memory' | 'Task Memory';
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  enabled: boolean;
  version: string;
  author: string;
  rulesCount: number;
}

export interface ExtensionItem {
  id: string;
  name: string;
  description: string;
  category: 'Development' | 'Git' | 'Browser' | 'Database' | 'DevOps' | 'Cloud' | 'Design' | 'Productivity' | 'AI' | 'MCP';
  author: string;
  rating: number;
  downloads: string;
  installed: boolean;
  hasUpdate?: boolean;
  version: string;
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  status: 'Connected' | 'Disconnected' | 'Connecting' | 'Error';
  command: string;
  url?: string;
  envVars: Record<string, string>;
  permissions: string[];
  toolsCount: number;
}

export interface AiProvider {
  id: string;
  name: string;
  isFeatured?: boolean;
  status: 'connected' | 'configured' | 'disconnected';
  apiKeyPlaceholder: string;
  apiKey?: string;
  userApiKey?: string;
  isConfigured?: boolean;
  baseUrl: string;
  docsUrl?: string;
  defaultModel: string;
  availableModels: string[];
  models?: string[];
  supportsAudio: boolean;
  audioFeatureDetails?: string;
}

export interface SmartRouterRule {
  id: string;
  taskType: string;
  recommendedModel: string;
  model?: string;
  provider: string;
  description: string;
  reason?: string;
}

export interface AutomationJob {
  id: string;
  name: string;
  schedule: string;
  trigger?: string;
  nextRun: string;
  lastStatus: 'success' | 'failed' | 'running' | 'idle';
  lastRun?: string;
  targetAgent: string;
  enabled: boolean;
  description?: string;
  triggerType?: 'cron' | 'interval' | 'git_hook' | 'manual';
  actionPrompt?: string;
  executionLogs?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time?: string;
  timestamp?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
}

export type ViewMode = MainView;
export type McpServerItem = McpServer;
export type AiProviderConfig = AiProvider;
export type ModelRouterRule = SmartRouterRule;
export type AutomationTask = AutomationJob;

export interface AppState {
  currentView: MainView;
  projects: ProjectItem[];
  activeProjectId: string;
  agents: AgentInfo[];
  timeline: ActivityTimelineItem[];
  messages: ChatMessage[];
  tasks: KanbanTask[];
  planSteps: ImplementationPlanStep[];
  permissions: PermissionCategory[];
  memories: MemoryItem[];
  skills: SkillItem[];
  extensions: ExtensionItem[];
  mcpServers: McpServer[];
  aiProviders: AiProvider[];
  routerRules: SmartRouterRule[];
  automations: AutomationJob[];
  notifications: NotificationItem[];
  theme: ThemeMode;
  isAgentRunning: boolean;
}
