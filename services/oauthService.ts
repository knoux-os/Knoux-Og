// KNOUX OS Guardian - OAuth Service
// Handles OAuth integration with 10 social providers

import apiService from './apiService';

class OAuthService {
  providers: Record<string, any>;

  constructor() {
    this.providers = {
      github: {
        name: 'GitHub',
        icon: '🐙',
        color: '#181717',
        authUrl: '/auth/oauth/github',
      },
      google: {
        name: 'Google',
        icon: '🔍',
        color: '#4285F4',
        authUrl: '/auth/oauth/google',
      },
      microsoft: {
        name: 'Microsoft',
        icon: '🪟',
        color: '#00A4EF',
        authUrl: '/auth/oauth/microsoft',
      },
      linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        color: '#0A66C2',
        authUrl: '/auth/oauth/linkedin',
      },
      twitter: {
        name: 'Twitter',
        icon: '🐦',
        color: '#1DA1F2',
        authUrl: '/auth/oauth/twitter',
      },
      facebook: {
        name: 'Facebook',
        icon: '📘',
        color: '#1877F2',
        authUrl: '/auth/oauth/facebook',
      },
      apple: {
        name: 'Apple',
        icon: '🍎',
        color: '#000000',
        authUrl: '/auth/oauth/apple',
      },
      discord: {
        name: 'Discord',
        icon: '💬',
        color: '#5865F2',
        authUrl: '/auth/oauth/discord',
      },
      slack: {
        name: 'Slack',
        icon: '💬',
        color: '#4A154B',
        authUrl: '/auth/oauth/slack',
      },
      bitbucket: {
        name: 'Bitbucket',
        icon: '🪣',
        color: '#0052CC',
        authUrl: '/auth/oauth/bitbucket',
      },
    };
  }

  // Get all provider configurations
  getProviders() {
    return Object.entries(this.providers).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }

  // Get single provider configuration
  getProvider(providerId: string) {
    return this.providers[providerId];
  }

  // Initiate OAuth flow - Real Redirection
  initiateOAuth(providerId: string) {
    const provider = this.getProvider(providerId);
    if (!provider) {
        throw new Error('Invalid provider');
    }
    
    // Redirect to backend endpoint which handles the OAuth handshake with the provider
    // The backend should redirect to the provider's login page
    const targetUrl = `${apiService.baseURL}${provider.authUrl}`;
    
    console.log(`Redirecting to ${targetUrl} for ${provider.name} authentication...`);
    window.location.href = targetUrl;
  }
}

// Create singleton instance
const oauthService = new OAuthService();

export default oauthService;