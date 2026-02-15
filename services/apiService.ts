
import { api } from './api';

// This file is maintained for compatibility but routes to the unified api.ts
const apiService = {
    get: (endpoint: string) => (api as any).request ? (api as any).request(endpoint) : Promise.resolve({ data: {} }),
    post: (endpoint: string, body: any) => {
        if (endpoint.includes('login')) return api.login(body.username || body.email, body.password);
        if (endpoint.includes('logout')) return Promise.resolve(api.logout());
        return Promise.resolve({ data: { success: true } });
    },
    setTokens: () => {},
    clearTokens: () => api.logout(),
    getAccessToken: () => api.getToken(),
    baseURL: 'http://localhost:8000/api'
};

export default apiService;
