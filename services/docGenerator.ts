
// KNOUX OS Guardian - Documentation Generator
// Generates enterprise-grade legal and technical documentation

interface DocTemplate {
  name: string;
  filename: string;
  description: string;
  content: (context: any) => string;
}

const MASTER_INFO = {
  founderName: "knoux, Abu Retaj",
  founderDisplay: "knoux",
  organization: "knoux-I",
  email: "contact@knoux.io",
  whatsapp: "+971503281920",
  website: "https://knoux.io",
  githubOrg: "https://github.com/knoux-I",
  location: "Abu Dhabi, UAE"
};

class DocGenerator {
  private templates: Record<string, DocTemplate>;

  constructor() {
    this.templates = this.initializeTemplates();
  }

  private replacePlaceholders(content: string, ctx: any): string {
    const today = new Date().toISOString().split('T')[0];
    const map: Record<string, string> = {
      '{PROJECT_NAME}': ctx.projectName || 'KNOUX-I Sentinel',
      '{REPO_NAME}': ctx.repoName || 'knoux-sentinel-core',
      '{VERSION_NUMBER}': ctx.version || '1.0.0',
      '{DATE}': today,
      '{CLIENT_NAME}': ctx.clientName || '[CLIENT NAME]',
      '{LICENSE_TYPE}': ctx.licenseType || 'Proprietary',
      '{FOUNDER_NAME}': MASTER_INFO.founderName,
      '{ORGANIZATION_NAME}': MASTER_INFO.organization,
      '{EMAIL}': MASTER_INFO.email,
      '{WEBSITE}': MASTER_INFO.website,
      '{WHATSAPP}': MASTER_INFO.whatsapp,
      '{API_URL}': ctx.apiUrl || 'https://api.knoux.io',
      '{WS_URL}': ctx.wsUrl || 'wss://api.knoux.io',
      '{DB_PASSWORD}': 'KNOUX_SECURE_PASS_2025!',
      '{REDIS_PASSWORD}': 'KNOUX_REDIS_PASS_2025!',
      '{JWT_SECRET}': 'KNOUX_CORE_SECRET_KEY_PROD',
      '{API_KEY}': 'KNOUX_MASTER_API_GATEWAY_KEY'
    };

    return content.replace(/{[A-Z0-9_]+}/g, (match) => map[match] || match);
  }

  private initializeTemplates(): Record<string, DocTemplate> {
    return {
      'htaccess': {
        name: 'Apache .htaccess',
        filename: '.htaccess',
        description: 'Advanced security headers, HTTPS redirection, and caching for Apache servers.',
        content: (ctx) => this.replacePlaceholders(`# .htaccess - {PROJECT_NAME} Web Server Configuration
# Created by ${MASTER_INFO.founderDisplay} (${MASTER_INFO.founderName})

# ============================================
# SECURITY HEADERS
# ============================================
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# ============================================
# URL REWRITING
# ============================================
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
    RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
    RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?/$1 [L]
</IfModule>

# ============================================
# CACHING & COMPRESSION
# ============================================
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Created by ${MASTER_INFO.founderDisplay} | {ORGANIZATION_NAME}`, ctx)
      },

      'nginx_conf': {
        name: 'Nginx Config',
        filename: 'nginx.conf',
        description: 'High-performance Nginx configuration with SSL, Gzip, and Rate Limiting.',
        content: (ctx) => this.replacePlaceholders(`# nginx.conf - {PROJECT_NAME} Nginx Configuration
# Created by ${MASTER_INFO.founderDisplay}

http {
    server_tokens off;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    server {
        listen 80;
        server_name {WEBSITE};
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name {WEBSITE};
        
        ssl_certificate /etc/ssl/certs/{REPO_NAME}.crt;
        ssl_certificate_key /etc/ssl/private/{REPO_NAME}.key;
        
        root /var/www/{REPO_NAME}/public;
        index index.html index.php;

        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header X-Frame-Options "SAMEORIGIN" always;

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3000;
        }

        location ~* \\.(jpg|jpeg|png|gif|ico|css|js|webp)$ {
            expires 1y;
            access_log off;
        }
    }
}`, ctx)
      },

      'eslintrc': {
        name: 'ESLint Config',
        filename: '.eslintrc.json',
        description: 'Clean code standards for TypeScript and React projects.',
        content: (ctx) => `{
  "root": true,
  "env": { "browser": true, "es2021": true, "node": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}`
      },

      'prettierrc': {
        name: 'Prettier Config',
        filename: '.prettierrc',
        description: 'Automated code formatting for consistent style.',
        content: (ctx) => `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}`
      },

      'tailwind_config': {
        name: 'Tailwind Config',
        filename: 'tailwind.config.js',
        description: 'Standard Tailwind CSS configuration with KNOUX design tokens.',
        content: (ctx) => `module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        'knoux': {
          'neon': '#bf00ff',
          'accent': '#9d4edd',
          'primary': '#4B0082'
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}`
      },

      'vscode_settings': {
        name: 'VSCode Workspace',
        filename: 'settings.json',
        description: 'Optimized VSCode settings for TypeScript development.',
        content: (ctx) => `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.autoSave": "onFocusChange",
  "workbench.colorTheme": "KNOUX Dark Theme",
  "workbench.iconTheme": "material-icon-theme"
}`
      },

      'vscode_extensions': {
        name: 'VSCode Extensions',
        filename: 'extensions.json',
        description: 'Recommended extensions for a full-stack environment.',
        content: (ctx) => `{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens",
    "pkief.material-icon-theme"
  ]
}`
      },

      'dockerfile': {
        name: 'Dockerfile',
        filename: 'Dockerfile',
        description: 'Optimized multi-stage Docker build for production.',
        content: (ctx) => `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]`
      },

      'docker_compose': {
        name: 'Docker Compose',
        filename: 'docker-compose.yml',
        description: 'Full stack service orchestration (App + DB + Redis).',
        content: (ctx) => this.replacePlaceholders(`version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: {REPO_NAME}db
      POSTGRES_PASSWORD: {DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass {REDIS_PASSWORD}
  backend:
    build: .
    environment:
      DB_PASSWORD: {DB_PASSWORD}
      REDIS_PASSWORD: {REDIS_PASSWORD}
      API_KEY: {API_KEY}
    depends_on:
      - postgres
      - redis
volumes:
  postgres_data:`, ctx)
      },

      'env_example': {
        name: '.env Template',
        filename: '.env.example',
        description: 'Template for environment variables with secure placeholders.',
        content: (ctx) => this.replacePlaceholders(`# KNOUX-I ENVIRONMENT VARIABLES
APP_NAME="{PROJECT_NAME}"
APP_URL={WEBSITE}
PORT=3000

DB_PASSWORD={DB_PASSWORD}
REDIS_PASSWORD={REDIS_PASSWORD}
JWT_SECRET={JWT_SECRET}
API_KEY={API_KEY}`, ctx)
      },

      'gitignore': {
        name: '.gitignore',
        filename: '.gitignore',
        description: 'Standard Git exclusion patterns for modern projects.',
        content: (ctx) => `node_modules/
dist/
build/
.env
.DS_Store
*.log
npm-debug.log*
.vscode/`
      },

      'deploy_workflow': {
        name: 'GitHub Actions Deploy',
        filename: 'deploy.yml',
        description: 'Automated CI/CD pipeline for GitHub actions.',
        content: (ctx) => this.replacePlaceholders(`name: Deploy {PROJECT_NAME}
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: |
          npm ci
          npm run build
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: $\{/{ secrets.SERVER_HOST /}}
          username: $\{/{ secrets.SERVER_USER /}}
          key: $\{/{ secrets.SSH_PRIVATE_KEY /}}
          script: |
            cd /opt/{REPO_NAME}
            docker-compose pull
            docker-compose up -d`, ctx).replace('$\{/{', '${{').replace('/}}', '}}')
      },

      'tos': {
        name: 'Terms of Service',
        filename: 'TOS.md',
        description: 'Comprehensive legal terms of service.',
        content: (ctx) => this.replacePlaceholders(`# Terms of Service
**Effective Date:** {DATE}
**Project:** {PROJECT_NAME}
**Owner:** ${MASTER_INFO.founderName}

These terms govern the use of {PROJECT_NAME}. By accessing this system, you agree to...`, ctx)
      },

      'privacy_policy': {
        name: 'Privacy Policy',
        filename: 'PrivacyPolicy.md',
        description: 'Standard data collection and usage policy.',
        content: (ctx) => this.replacePlaceholders(`# Privacy Policy
**Last Updated:** {DATE}
**Owner:** ${MASTER_INFO.organization}

We take your privacy seriously. Data collected by {PROJECT_NAME} is used solely for...`, ctx)
      },

      'sla': {
        name: 'Service Level Agreement',
        filename: 'SLA.md',
        description: 'Enterprise uptime and support guarantees.',
        content: (ctx) => this.replacePlaceholders(`# Service Level Agreement
**Agreement Date:** {DATE}
**Uptime Guarantee:** 99.9%

This SLA outlines the performance commitments for {PROJECT_NAME}...`, ctx)
      },

      'security': {
        name: 'Security Policy',
        filename: 'SECURITY.md',
        description: 'Vulnerability reporting and security protocols.',
        content: (ctx) => this.replacePlaceholders(`# Security Policy
**Organization:** ${MASTER_INFO.organization}

Please report vulnerabilities to ${MASTER_INFO.email}. We aim to respond within 24 hours.`, ctx)
      },

      'ip_assignment': {
        name: 'IP Assignment',
        filename: 'IP_Assignment.md',
        description: 'Intellectual property ownership agreement.',
        content: (ctx) => this.replacePlaceholders(`# Intellectual Property Assignment
**Assignor:** {CLIENT_NAME}
**Assignee:** ${MASTER_INFO.organization}

This document confirms the transfer of intellectual property rights for {PROJECT_NAME}...`, ctx)
      }
    };
  }

  public generateDoc(templateKey: string, context: any = {}): string {
    const template = this.templates[templateKey];
    if (!template) return `# Error: Template '${templateKey}' not found.`;
    return template.content(context);
  }

  public getTemplates() {
    return Object.entries(this.templates).map(([key, t]) => ({
      id: key,
      name: t.name,
      filename: t.filename,
      description: t.description
    }));
  }
}

export const docGenerator = new DocGenerator();
