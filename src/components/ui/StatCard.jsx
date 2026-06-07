import { Icon } from './Icon';

export function StatCard({ icon, label, value, trend, trendDirection = 'up' }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <Icon name={icon} className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}
