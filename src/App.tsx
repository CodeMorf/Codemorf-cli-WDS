/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { CodexWorkspace } from './components/CodexWorkspace';
import { MultiAgentManager } from './components/MultiAgentManager';
import { TaskManager } from './components/TaskManager';
import { PlanMode } from './components/PlanMode';
import { PermissionsCenter } from './components/PermissionsCenter';
import { IntegratedBrowser } from './components/IntegratedBrowser';
import { GitCenter } from './components/GitCenter';
import { TerminalPanel } from './components/TerminalPanel';
import { FileExplorerAndEditor } from './components/FileExplorerAndEditor';
import { MemoryCenter } from './components/MemoryCenter';
import { SkillsCenter } from './components/SkillsCenter';
import { ExtensionsMarketplace } from './components/ExtensionsMarketplace';
import { McpManager } from './components/McpManager';
import { AiProvidersAndRouter } from './components/AiProvidersAndRouter';
import { AutomationsCenter } from './components/AutomationsCenter';
import { DashboardView } from './components/DashboardView';
import { ProjectSelector } from './components/ProjectSelector';
import { CommandPalette } from './components/CommandPalette';
import { DiffViewerModal } from './components/DiffViewerModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { NewProjectModal } from './components/NewProjectModal';

import {
  MainView,
  ThemeMode,
  ProjectItem,
  AgentInfo,
  ActivityTimelineItem,
  ChatMessage,
  KanbanTask,
  ImplementationPlanStep,
  PermissionCategory,
  PermissionLevel,
  MemoryItem,
  SkillItem,
  ExtensionItem,
  McpServer,
  AiProvider,
  SmartRouterRule,
  AutomationJob,
  NotificationItem,
  AppState
} from './types';

import {
  INITIAL_PROJECTS,
  INITIAL_AGENTS,
  INITIAL_TIMELINE,
  INITIAL_CHAT_MESSAGES,
  INITIAL_TASKS,
  INITIAL_PLAN_STEPS,
  INITIAL_PERMISSIONS,
  INITIAL_MEMORIES,
  INITIAL_SKILLS,
  INITIAL_EXTENSIONS,
  INITIAL_MCP_SERVERS,
  INITIAL_AI_PROVIDERS,
  SMART_ROUTER_RULES,
  INITIAL_AUTOMATIONS,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('workspace');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-eroga');
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [timeline, setTimeline] = useState<ActivityTimelineItem[]>(INITIAL_TIMELINE);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [planSteps, setPlanSteps] = useState<ImplementationPlanStep[]>(INITIAL_PLAN_STEPS);
  const [permissions, setPermissions] = useState<PermissionCategory[]>(INITIAL_PERMISSIONS);
  const [globalPermissionLevel, setGlobalPermissionLevel] = useState<PermissionLevel>('ask_confirmation');
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [extensions, setExtensions] = useState<ExtensionItem[]>(INITIAL_EXTENSIONS);
  const [mcpServers, setMcpServers] = useState<McpServer[]>(INITIAL_MCP_SERVERS);
  const [aiProviders, setAiProviders] = useState<AiProvider[]>(INITIAL_AI_PROVIDERS);
  const [routerRules, setRouterRules] = useState<SmartRouterRule[]>(SMART_ROUTER_RULES);
  const [automations, setAutomations] = useState<AutomationJob[]>(INITIAL_AUTOMATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || {
    id: 'default-proj',
    name: 'Sin Proyecto',
    path: 'C:/Users/Kitgiz/Projects',
    category: 'General',
    branch: 'main',
    lastActive: 'Ahora',
    lastPromptSnippet: 'Comienza escribiendo un prompt o usando la voz.',
    pinned: false,
    status: 'idle',
    filesCount: 0,
    permissionLevel: 'ask_confirmation'
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      } else if ((e.altKey && e.key.toLowerCase() === 'v') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v')) {
        e.preventDefault();
        setIsVoiceAssistantOpen((prev) => !prev);
      } else if (e.altKey && e.key === '1') {
        e.preventDefault();
        setCurrentView('workspace');
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setCurrentView('multi-agent');
      } else if (e.altKey && e.key === '3') {
        e.preventDefault();
        setCurrentView('tasks');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Project Management Actions: Create, Archive, Unarchive, Delete
  const handleCreateProject = (projectData: Omit<ProjectItem, 'id' | 'lastActive' | 'status' | 'filesCount'>) => {
    const newProject: ProjectItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
      lastActive: 'Ahora mismo',
      lastPromptSnippet: 'Proyecto inicializado y configurado en Windows.',
      status: 'idle',
      filesCount: 12,
      isArchived: false
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setCurrentView('workspace');
    setIsNewProjectOpen(false);

    // Timeline event
    const timelineItem: ActivityTimelineItem = {
      id: `tl-${Date.now()}`,
      time: 'Ahora',
      status: 'Completed',
      description: `Nuevo proyecto creado: ${newProject.name}`,
      details: `Ubicación: ${newProject.path} • Permiso: ${newProject.permissionLevel || 'ask_confirmation'}`
    };
    setTimeline((prev) => [timelineItem, ...prev]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Proyecto Creado con Éxito',
        message: `Se ha configurado ${newProject.name} en ${newProject.path}`,
        timestamp: 'Ahora',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  const handleArchiveProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, isArchived: true, status: 'archived' }
          : p
      )
    );

    // If active project is archived, select the first unarchived project
    if (activeProjectId === projectId) {
      const remainingActive = projects.filter((p) => p.id !== projectId && !p.isArchived);
      if (remainingActive.length > 0) {
        setActiveProjectId(remainingActive[0].id);
      }
    }
  };

  const handleUnarchiveProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, isArchived: false, status: 'idle' }
          : p
      )
    );
  };

  const handleDeleteProject = (projectId: string) => {
    const targetProj = projects.find((p) => p.id === projectId);
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente el proyecto "${targetProj?.name || projectId}" del workspace?`
    );
    if (!confirmed) return;

    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);

    if (activeProjectId === projectId && remaining.length > 0) {
      setActiveProjectId(remaining[0].id);
    }
  };

  // Provider API Key Management Action
  const handleUpdateProviderApiKey = (providerId: string, newKey: string) => {
    setAiProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? {
              ...p,
              apiKey: newKey,
              userApiKey: newKey,
              isConfigured: Boolean(newKey && newKey.length > 3),
              status: newKey && newKey.length > 3 ? 'connected' : 'disconnected'
            }
          : p
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'API Key Actualizada',
        message: `Se ha guardado la clave de API para el proveedor ${providerId}.`,
        timestamp: 'Ahora',
        read: false,
        type: 'info'
      },
      ...prev
    ]);
  };

  // Scheduled Automations Action
  const handleCreateAutomation = (newJob: Partial<AutomationJob>) => {
    const job: AutomationJob = {
      id: `auto-${Date.now()}`,
      name: newJob.name || 'Nueva Tarea Programada',
      schedule: newJob.schedule || '0 0 * * *',
      trigger: newJob.trigger || newJob.schedule,
      triggerType: newJob.triggerType || 'cron',
      nextRun: 'Próxima ejecución según cron',
      lastStatus: 'idle',
      lastRun: 'Nunca',
      targetAgent: newJob.targetAgent || 'CodeMorf Agent',
      enabled: true,
      description: newJob.description || '',
      actionPrompt: newJob.actionPrompt || '',
      executionLogs: [`[Schedule] Tarea inicializada.`]
    };

    setAutomations((prev) => [job, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Automatización Programada',
        message: `Se activó la tarea "${job.name}" con frecuencia: ${job.schedule}`,
        timestamp: 'Ahora',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  // Chat message sending with dynamic agent response
  const handleSendMessage = (text: string, model: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAgentRunning(true);

    // Simulate Agent Step-by-Step response
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        content: `He procesado tu solicitud en Windows para el proyecto **${activeProject.name}** utilizando el modelo **${model}**:\n\n1. ✅ Analizado el árbol de archivos y dependencias.\n2. ✅ Aplicados los cambios y validados en el entorno de desarrollo.\n3. ✅ Ejecutados tests unitarios y sintaxis sin errores.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diffSummary: {
          totalFiles: 2,
          additions: 42,
          deletions: 4,
          files: [
            {
              path: `src/components/${activeProject.name.replace(/\s+/g, '')}Module.tsx`,
              additions: 38,
              deletions: 2,
              contentDiff: '+ // Generado por CodeMorf Codex\n+ import React from "react";\n+ export const Module = () => <div>Listo</div>;'
            }
          ]
        },
        toolBadges: [
          { type: 'files_read', label: '2 archivos leídos' },
          { type: 'command_run', label: 'npm test (Vitest)' }
        ]
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsAgentRunning(false);

      // Add to timeline
      const newTimelineItem: ActivityTimelineItem = {
        id: `tl-${Date.now()}`,
        time: 'Ahora',
        status: 'Completed',
        description: `Ejecución de Agente completada: ${text.slice(0, 30)}...`,
        details: `Modelo: ${model} • Proyecto: ${activeProject.name}`
      };
      setTimeline((prev) => [newTimelineItem, ...prev]);
    }, 1200);
  };

  const handleStopAgent = () => {
    setIsAgentRunning(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentView('workspace');
  };

  const handleToggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'Running' ? 'Idle' : 'Running' }
          : a
      )
    );
  };

  const handleRunAllAgents = () => {
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'Running' })));
  };

  const handleStopAllAgents = () => {
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'Idle' })));
  };

  const handleAddTask = (newTask: Omit<KanbanTask, 'id'>) => {
    const task: KanbanTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleMoveTask = (taskId: string, targetColumn: KanbanTask['column']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: targetColumn } : t))
    );
  };

  const handleApproveStep = (stepId: number) => {
    setPlanSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, status: 'approved' } : s))
    );
  };

  const handleApproveAllSteps = () => {
    setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'approved' })));
  };

  const handleUpdatePermissionMode = (categoryId: string, mode: PermissionCategory['mode']) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === categoryId ? { ...p, mode } : p))
    );
  };

  const handleAddMemory = (newMem: Omit<MemoryItem, 'id' | 'updatedAt'>) => {
    const item: MemoryItem = {
      ...newMem,
      id: `mem-${Date.now()}`,
      updatedAt: 'Ahora'
    };
    setMemories((prev) => [item, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleTogglePinMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))
    );
  };

  const handleToggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleToggleInstallExtension = (id: string) => {
    setExtensions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, installed: !e.installed } : e))
    );
  };

  const handleToggleMcpServer = (id: string) => {
    setMcpServers((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'Connected' ? 'Disconnected' : 'Connected'
            }
          : s
      )
    );
  };

  const handleAddMcpServer = (server: Omit<McpServer, 'id'>) => {
    const item: McpServer = {
      ...server,
      id: `mcp-${Date.now()}`
    };
    setMcpServers((prev) => [...prev, item]);
  };

  const handleToggleAiProvider = (id: string) => {
    setAiProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === 'connected' ? 'disconnected' : 'connected'
            }
          : p
      )
    );
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleRunAutomationNow = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lastStatus: 'running' } : a))
    );
    setTimeout(() => {
      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, lastStatus: 'success' } : a))
      );
    }, 2000);
  };

  const handleImportZip = (fileName: string) => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: `Importado: ${fileName.replace('.zip', '')}`,
      category: 'Proyectos',
      path: `C:/Users/Kitgiz/Projects/${fileName.replace('.zip', '')}`,
      branch: 'master',
      lastActive: 'Ahora',
      lastPromptSnippet: 'Proyecto importado desde AI Studio',
      pinned: true,
      status: 'idle',
      filesCount: 38,
      permissionLevel: 'ask_confirmation'
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setCurrentView('workspace');
  };

  // Compile active diff files for modal
  const activeDiffFiles = messages.flatMap((m) => m.diffSummary?.files || []);
  const totalAdditions = activeDiffFiles.reduce((acc, f) => acc + f.additions, 0) || 644;
  const totalDeletions = activeDiffFiles.reduce((acc, f) => acc + f.deletions, 0) || 0;

  // AppState object for Dashboard
  const appState: AppState = {
    currentView,
    projects,
    activeProjectId,
    agents,
    timeline,
    messages,
    tasks,
    planSteps,
    permissions,
    memories,
    skills,
    extensions,
    mcpServers,
    aiProviders,
    routerRules,
    automations,
    notifications,
    theme,
    isAgentRunning
  };

  return (
    <div
      id="codemorf-app-container"
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none ${
        theme === 'dark' ? 'dark bg-[#111216] text-[#e0e4ec]' : 'light bg-gray-100 text-gray-900'
      }`}
    >
      {/* 1. Windows Native-Style Desktop TitleBar */}
      <TitleBar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeProjectName={activeProject.name}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
      />

      {/* 2. Main Workbench Shell: Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => {
            setActiveProjectId(id);
            setCurrentView('workspace');
          }}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onArchiveProject={handleArchiveProject}
          onUnarchiveProject={handleUnarchiveProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* Dynamic Center View Container */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#16171d] relative">
          {currentView === 'workspace' && (
            <CodexWorkspace
              project={activeProject}
              messages={messages}
              onSendMessage={handleSendMessage}
              isAgentRunning={isAgentRunning}
              onStopAgent={handleStopAgent}
              onOpenDiffModal={() => setIsDiffModalOpen(true)}
              timeline={timeline}
              onNavigateToView={setCurrentView}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            />
          )}

          {currentView === 'multi-agent' && (
            <MultiAgentManager
              agents={agents}
              onToggleAgent={handleToggleAgent}
              onRunAll={handleRunAllAgents}
              onStopAll={handleStopAllAgents}
            />
          )}

          {currentView === 'tasks' && (
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onMoveTask={handleMoveTask}
            />
          )}

          {currentView === 'plan' && (
            <PlanMode
              steps={planSteps}
              onApproveStep={handleApproveStep}
              onApproveAll={handleApproveAllSteps}
              onModifyPlan={() => alert('Modo de edición de blueprint activado')}
              onCancelPlan={() => setCurrentView('workspace')}
            />
          )}

          {currentView === 'permissions' && (
            <PermissionsCenter
              permissions={permissions}
              onUpdatePermissionMode={handleUpdatePermissionMode}
              globalPermissionLevel={globalPermissionLevel}
              onUpdateGlobalPermissionLevel={setGlobalPermissionLevel}
            />
          )}

          {currentView === 'browser' && <IntegratedBrowser />}

          {currentView === 'git' && <GitCenter />}

          {currentView === 'terminal' && <TerminalPanel />}

          {currentView === 'files' && <FileExplorerAndEditor />}

          {currentView === 'memory' && (
            <MemoryCenter
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
              onTogglePin={handleTogglePinMemory}
            />
          )}

          {currentView === 'skills' && (
            <SkillsCenter
              skills={skills}
              onToggleSkill={handleToggleSkill}
            />
          )}

          {currentView === 'extensions' && (
            <ExtensionsMarketplace
              extensions={extensions}
              onToggleInstall={handleToggleInstallExtension}
            />
          )}

          {currentView === 'mcp' && (
            <McpManager
              servers={mcpServers}
              onToggleServer={handleToggleMcpServer}
              onAddServer={handleAddMcpServer}
            />
          )}

          {currentView === 'providers' && (
            <AiProvidersAndRouter
              providers={aiProviders}
              routerRules={routerRules}
              onToggleProvider={handleToggleAiProvider}
              onUpdateProviderApiKey={handleUpdateProviderApiKey}
            />
          )}

          {currentView === 'automations' && (
            <AutomationsCenter
              automations={automations}
              onToggleAutomation={handleToggleAutomation}
              onRunNow={handleRunAutomationNow}
              onCreateAutomation={handleCreateAutomation}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              state={appState}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'welcome' && (
            <ProjectSelector
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => {
                setActiveProjectId(id);
                setCurrentView('workspace');
              }}
              onImportZip={handleImportZip}
              onOpenNewProject={() => setIsNewProjectOpen(true)}
              onArchiveProject={handleArchiveProject}
              onUnarchiveProject={handleUnarchiveProject}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </main>
      </div>

      {/* 3. Global Overlays & Modals */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={setCurrentView}
        projects={projects}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setCurrentView('workspace');
        }}
        onNewChat={handleNewChat}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onSendMessage={handleSendMessage}
        onNavigateToView={setCurrentView}
        onOpenDiffModal={() => setIsDiffModalOpen(true)}
        onNewChat={handleNewChat}
        activeProject={activeProject}
      />

      <DiffViewerModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        files={
          activeDiffFiles.length > 0
            ? activeDiffFiles
            : [
                {
                  path: 'src/components/ErogaDashboard.tsx',
                  additions: 180,
                  deletions: 0,
                  contentDiff: '+ import React from "react";\n+ export const ErogaDashboard = () => {\n+   return <div>Panel ErogaAI SaaS</div>;\n+ };'
                },
                {
                  path: 'server/db/schema.ts',
                  additions: 50,
                  deletions: 0,
                  contentDiff: '+ export const expenses = pgTable("expenses", {\n+   id: serial("id").primaryKey(),\n+   tenantId: text("tenant_id").notNull(),\n+   amount: numeric("amount").notNull()\n+ });'
                }
              ]
        }
        totalAdditions={totalAdditions}
        totalDeletions={totalDeletions}
        onUndoChanges={() => alert('Se han revertido los cambios en los archivos.')}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearNotification={(id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      />
    </div>
  );
}
