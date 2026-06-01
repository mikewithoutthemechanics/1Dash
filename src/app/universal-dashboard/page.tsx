'use client';

import { useEffect, useMemo, useState } from 'react';

interface IntegrationMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  authUrl?: string;
}

interface IntegrationStatus {
  id: string;
  connected: boolean;
  lastSync?: string;
  error?: string;
}

type ProviderTokenFields = Array<{ key: string; label: string; type: 'text' | 'password' }>;

const providerFields: Record<string, ProviderTokenFields> = {
  github: [{ key: 'token', label: 'Personal Access Token', type: 'password' }],
  vercel: [{ key: 'token', label: 'Vercel Token', type: 'password' }],
  linear: [{ key: 'token', label: 'Linear API Key', type: 'password' }],
  slack: [{ key: 'token', label: 'Bot Token', type: 'password' }],
};

function loadTokens() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('dashboard-integrations');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function loadConnected() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('dashboard-connected');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export default function UniversalDashboardPage() {
  const [integrations, setIntegrations] = useState<IntegrationMeta[]>([]);
  const [connected, setConnected] = useState<Record<string, IntegrationStatus>>({});