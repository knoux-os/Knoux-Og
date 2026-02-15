
import { LucideIcon } from 'lucide-react';

export enum ModuleStatus {
  Active = 'Active',
  Warning = 'Warning',
  Critical = 'Critical',
  Idle = 'Idle',
  Unknown = 'Unknown'
}

export interface ServiceDefinition {
  id: string;
  name: string;
  icon: string | LucideIcon;
  description?: string;
}

export interface GuardianModule {
  id: string;
  name: string;
  apiModuleName?: string; // Optional for new structure compatibility
  description: string;
  icon: string | LucideIcon;
  color?: string;
  status?: ModuleStatus;
  metrics?: { label: string; value: string }[];
  actions?: ModuleAction[];
  services?: ServiceDefinition[]; // New field for the 120 services
}

export interface ModuleAction {
  id: string;
  label: string;
  endpoint: string; // e.g., 'execute', 'scan', 'analyze', 'harden'
  method: 'POST' | 'GET';
  defaultPayload?: any;
  requiresRole?: UserRole[];
}

export interface SystemMetrics {
  cpuUsage: number;
  ramUsage: number;
  networkUp: number;
  networkDown: number;
  temperature: number;
  timestamp: string;
}

export enum ThemeColors {
  Primary = '#bf00ff',
  Medium = '#9d4edd',
  Dark = '#4B0082',
  Success = '#00ff88',
  Warning = '#ffaa00',
  Error = '#ff0055'
}

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface User {
  username: string;
  role: UserRole;
  token: string;
  email?: string;
  full_name?: string;
  avatar?: string;
  // Fix: Adding missing properties used in placeholderPopulator to resolve TS errors
  id?: string;
  phone_number?: string;
  github_handle?: string;
  created_at?: string;
  social_accounts?: any[];
}

export interface ApiExecutionResponse {
  run_id?: string;
  status: string;
  run_mode?: string;
  severity?: string;
  details?: any;
  message?: string;
  script_content?: string; // New field for returned PowerShell scripts
}

export interface AsyncRunStatus {
  run_id: string;
  status: 'running' | 'completed' | 'failed';
  result?: any;
}

export interface AuditLogEntry {
  audit_id: string;
  module_name: string;
  action: string;
  timestamp: string;
  user: string;
  status: string;
  metadata?: any;
}
