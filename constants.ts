
import { GuardianModule, ModuleStatus } from './types';
import { Fingerprint, ShieldCheck, Key, FileText, Cpu, HardDrive } from 'lucide-react';

export const MODULES: GuardianModule[] = [
  {
    id: 'identity',
    name: 'Identity Orchestrator',
    apiModuleName: 'IdentityOrchestrator',
    description: 'Centralized Auth0 user management and credential surveillance.',
    icon: Fingerprint,
    color: '#bf00ff',
    status: ModuleStatus.Active,
    services: [
      { id: 'user_audit', name: 'User Audit', icon: '👥', description: 'Monitor active Auth0 user base' },
      { id: 'mfa_enforcement', name: 'MFA Enforcement', icon: '🔐', description: 'Surveil multi-factor adoption' },
      { id: 'session_guardian', name: 'Session Guardian', icon: '🎟️', description: 'Active token and session tracking' },
      { id: 'access_control', name: 'RBAC Policy', icon: '⚖️', description: 'Role-based access monitoring' }
    ]
  },
  {
    id: 'lifecycle',
    name: 'Lifecycle Curator',
    apiModuleName: 'LifecycleCurator',
    description: 'Manages system lifecycle from startup to shutdown.',
    icon: Cpu,
    color: '#FF4C00',
    status: ModuleStatus.Active,
    services: [
      { id: 'startup_optimizer', name: 'Startup Optimizer', icon: '🚀', description: 'Analyze and optimize startup programs' },
      { id: 'shutdown_manager', name: 'Shutdown Manager', icon: '🛑', description: 'Manage graceful system shutdown' },
      { id: 'process_monitor', name: 'Process Monitor', icon: '👁️', description: 'Real-time process surveillance' },
      { id: 'service_controller', name: 'Service Controller', icon: '⚙️', description: 'Windows service management' }
    ]
  },
  {
    id: 'documentation',
    name: 'Documentation Forge',
    apiModuleName: 'DocumentationForge',
    description: 'Generate enterprise-grade legal and technical documentation.',
    icon: FileText,
    color: '#F4D03F',
    status: ModuleStatus.Idle,
    services: [
      { id: 'htaccess', name: 'Apache .htaccess', icon: '🌐', description: 'Security and redirection for Apache servers' },
      { id: 'nginx_conf', name: 'Nginx Config', icon: '⚙️', description: 'High-performance Nginx server configuration' },
      { id: 'dockerfile', name: 'Dockerfile', icon: '🐳', description: 'Multi-stage production build container' }
    ]
  }
];
