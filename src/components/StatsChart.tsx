import React from 'react';
import { useSettings } from '../hooks/useSettings.ts';
import { GameStats } from '../types.ts';

interface StatsChartProps {
    stats: GameStats;
}

const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  const { t } = useSettings();
  const distribution = stats.guessDistribution;
  const maxValue = Math.max(...Object.values(distribution), 1);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2 text-center">{t('guessDistribution')}</h3>
      <div className="space-y-2">
        {Object.entries(distribution).map(([guessCount, count]) => (
          <div key={guessCount} className="flex items-center text-sm font-medium">
            <div className="w-4 font-mono text-gray-600 dark:text-gray-400">{guessCount}</div>
            <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-sm h-5 ltr:ml-2 rtl:mr-2">
              <div
                className="bg-emerald-600 h-5 rounded-sm flex items-center text-white font-bold ltr:justify-end ltr:pr-2 rtl:justify-start rtl:pl-2"
                style={{ width: `${Math.max((count / maxValue) * 100, count > 0 ? 8 : 0)}%` }} // min width for visibility
              >
               {count > 0 && count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsChart;