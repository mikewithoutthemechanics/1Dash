import { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { DASHBOARD_QUERY, SYSTEM_STATUS_SUBSCRIPTION } from '../apollo/queries';
import { MetricsGrid } from '../components/MetricsGrid';
import { SystemStatus } from '../components/SystemStatus';
import { RealTimeUpdates } from '../components/RealTimeUpdates';

export default function Dashboard() {
  const { loading, error, data, refetch } = useQuery(DASHBOARD_QUERY);
  const { subscriptionData } = useSubscription(SYSTEM_STATUS_SUBSCRIPTION);

  const [dashboard, setDashboard] = useState(data?.dashboard);

  useEffect(() => {
    if (data) {
      setDashboard(data.dashboard);
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData?.systemStatusUpdated) {
      refetch();
    }
  }, [subscriptionData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unified Dashboard</h1>
        <p className="text-gray-400">
          All systems connected • Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MetricsGrid metrics={dashboard.metrics} />
        </div>
        <div>
          <SystemStatus systems={dashboard.systems} />
        </div>
      </div>

      <RealTimeUpdates updates={subscriptionData?.systemStatusUpdated} />
    </div>
  );
}