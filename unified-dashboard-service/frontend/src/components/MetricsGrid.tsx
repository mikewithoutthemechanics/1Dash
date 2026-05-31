import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Metric {
  id: string;
  category: string;
  label: string;
  value: number;
  unit?: string;
  change?: number;
  changePercent?: number;
  system: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const category = metric.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
        <Card key={category} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                  </p>
                  {metric.changePercent && (
                    <p className={`text-sm mt-1 ${metric.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.changePercent >= 0 ? '↑' : '↓'} {Math.abs(metric.changePercent)}%
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{metric.system}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}