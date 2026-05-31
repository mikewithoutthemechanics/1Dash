import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface System {
  id: string;
  name: string;
  type: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSync?: string;
  metrics: Record<string, any>;
}

interface SystemStatusProps {
  systems: System[];
}

export function SystemStatus({ systems }: SystemStatusProps) {
  const statusColors: Record<string, string> = {
    CONNECTED: 'bg-green-500/20 text-green-400',
    DISCONNECTED: 'bg-red-500/20 text-red-400',
    ERROR: 'bg-red-500/20 text-red-400',
    SYNCING: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system) => (
            <div key={system.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{system.name}</h3>
                  <p className="text-sm text-gray-400">{system.type}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={statusColors[system.status] || 'bg-gray-500/20 text-gray-400'}
                >
                  {system.status}
                </Badge>
              </div>
              
              {system.lastSync && (
                <p className="text-xs text-gray-500 mt-1">
                  Last synced: {new Date(system.lastSync).toLocaleTimeString()}
                </p>
              )}
              
              {Object.keys(system.metrics).length > 0 && (
                <div className="mt-3 space-y-1 text-sm">
                  <CardDescription className="text-gray-400">Metrics:</CardDescription>
                  <div className="space-y-0.5">
                    {Object.entries(system.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-300">{key}:</span>
                        <span className="font-mono">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}