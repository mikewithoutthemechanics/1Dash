import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RealTimeUpdatesProps {
  updates: any;
}

export function RealTimeUpdates({ updates }: RealTimeUpdatesProps) {
  const [renderedAt] = useState(Date.now());

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">Real-Time Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {updates ? (
          <div className="space-y-2 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-green-400">
              <strong>System Updated:</strong> {updates.systemStatusUpdated?.name}
            </p>
            <p className="text-xs text-gray-400">
              Status: {updates.systemStatusUpdated?.status} •
              {new Date(updates.systemStatusUpdated?.lastSync || renderedAt).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Waiting for real-time updates...
          </p>
        )}
      </CardContent>
    </Card>
  );
}