
import { User, ApiExecutionResponse, AsyncRunStatus, AuditLogEntry, UserRole } from '../types';
import { KNOUX_CONFIG } from '../config';
import { docGenerator } from './docGenerator';

class ApiService {
  private baseUrl = KNOUX_CONFIG.apiBase;
  private isSimulator = false;

  constructor() {
    // التحقق المبدئي من الاتصال بالسيرفر
    this.checkInitialConnection();
  }

  private async checkInitialConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      this.isSimulator = !response.ok;
    } catch (e) {
      this.isSimulator = true;
      console.warn("⚠️ KNOUX CORE: Backend unreachable. Simulation mode active.");
    }
  }

  // إرسال الطلبات مع توثيق Bearer تلقائياً
  private async request(endpoint: string, options: RequestInit = {}) {
    if (this.isSimulator) {
        return this.mockResponse(endpoint, options);
    }

    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        this.logout();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error(`Request failed: ${endpoint}`, e);
      // إذا فشل الاتصال فجأة، نتحول للمحاكاة
      this.isSimulator = true;
      return this.mockResponse(endpoint, options);
    }
  }

  // محاكي الردود لضمان عمل التطبيق بدون سيرفر
  private async mockResponse(endpoint: string, options: RequestInit): Promise<any> {
    await new Promise(r => setTimeout(r, 800)); // محاكاة التأخير

    if (endpoint.includes('/auth/login')) {
      const body = JSON.parse(options.body as string);
      return {
        access_token: "mock_jwt_token_for_demo",
        user: {
          username: body.username || "Admin",
          role: body.username === 'admin' ? 'admin' : (body.username === 'analyst' ? 'analyst' : 'viewer'),
          full_name: "Sentinel Guardian",
          email: "guardian@knoux.io"
        }
      };
    }

    if (endpoint.includes('/health')) {
      return { status: 'healthy', version: '1.0.0-mock' };
    }

    if (endpoint.includes('/modules') && endpoint.includes('/status')) {
        return { status: 'Active', health_score: 98, enabled: true, module_name: endpoint.split('/')[2] };
    }

    if (endpoint.includes('/audit/logs')) {
        return { items: [] };
    }

    // Special logic for DocumentationForge module
    if (endpoint.includes('/DocumentationForge/')) {
        const docId = endpoint.split('/').pop();
        if (docId) {
            const content = docGenerator.generateDoc(docId, {
                projectName: "KNOUX-I Sentinel OS",
                repoName: "knoux-sentinel-core",
                version: "2.1.0"
            });
            return {
                status: 'completed',
                run_mode: 'immediate',
                message: `Documentation generated: ${docId}`,
                script_content: content,
                file_extension: (docId.includes('conf') || docId.includes('htaccess')) ? 'conf' : (docId.includes('yml') || docId.includes('yaml')) ? 'yml' : (docId.includes('json')) ? 'json' : (docId.includes('js')) ? 'js' : 'md'
            };
        }
    }

    return { status: 'success', message: 'Simulated Response' };
  }

  // إدارة الجلسة (Session)
  saveSession(user: User) {
    localStorage.setItem('knoux_auth_data', JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem('knoux_auth_data');
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
  }

  getToken(): string | null {
    const user = this.getUser();
    return user ? user.token : null;
  }

  logout() {
    localStorage.removeItem('knoux_auth_data');
    window.location.reload();
  }

  // --- دوال المصادقة ---
  async login(username: string, password: string): Promise<User> {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    const user: User = {
      username: data.user?.username || username,
      role: data.user?.role || 'viewer',
      token: data.access_token,
      email: data.user?.email,
      full_name: data.user?.full_name
    };

    this.saveSession(user);
    return user;
  }

  async checkHealth() { return this.request('/health'); }
  async getModulesList() { return this.request('/modules'); }
  
  async getModuleStatus(moduleName: string | undefined) {
    if (!moduleName) return { status: 'Unknown' };
    return this.request(`/modules/${moduleName}/status`);
  }

  async executeModule(moduleName: string | undefined, action: string, parameters: any = {}) {
    if (!moduleName) throw new Error('Module name required');
    return this.request(`/modules/${moduleName}/${action}`, {
      method: 'POST',
      body: JSON.stringify({ run_mode: 'immediate', parameters })
    });
  }

  async getAuditLogs() { return this.request('/audit/logs'); }
  async getAsyncRunStatus(runId: string): Promise<AsyncRunStatus> { return this.request(`/async/status/${runId}`); }
  async getExecutionResult(moduleName: string | undefined, runId: string): Promise<ApiExecutionResponse> {
    return this.request(`/modules/${moduleName}/runs/${runId}`);
  }
}

export const api = new ApiService();
