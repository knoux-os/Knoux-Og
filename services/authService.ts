
import { api } from './api';

class AuthService {
  async login(username, password) {
    try {
      const result = await api.login(username, password);
      return result;
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }

  handleCallback() {
    // In demo mode, we don't handle real OAuth callbacks
    return false;
  }

  logout() {
    api.logout();
    window.location.reload();
  }

  getCurrentUser() {
    return api.getUser();
  }

  isAuthenticated() {
    return !!api.getToken();
  }
}

const authService = new AuthService();
export default authService;
