import React from 'react';
import { Clock, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RushHourHeatmap({ data }) {
  // Mock data structure: { day: 'Lun', hours: [{ hour: '11h', intensity: 'low', sales: 300 }] }
  const defaultData = [
    { 
      day: 'Lun', 
      hours: [
        { hour: '11h', intensity: 'low', sales: 320 },
        { hour: '12h', intensity: 'high', sales: 1100 },
        { hour: '13h', intensity: 'peak', sales: 1450 },
        { hour: '14h', intensity: 'medium', sales: 680 },
        { hour: '19h', intensity: 'high', sales: 980 },
        { hour: '20h', intensity: 'peak', sales: 1320 },
        { hour: '21h', intensity: 'medium', sales: 750 },
      ]
    },
    { 
      day: 'Mar', 
      hours: [
        { hour: '11h', intensity: 'low', sales: 310 },
        { hour: '12h', intensity: 'high', sales: 1050 },
        { hour: '13h', intensity: 'peak', sales: 1420 },
        { hour: '14h', intensity: 'medium', sales: 650 },
        { hour: '19h', intensity: 'high', sales: 1020 },
        { hour: '20h', intensity: 'peak', sales: 1380 },
        { hour: '21h', intensity: 'medium', sales: 780 },
      ]
    },
    { 
      day: 'Mer', 
      hours: [
        { hour: '11h', intensity: 'medium', sales: 380 },
        { hour: '12h', intensity: 'high', sales: 1180 },
        { hour: '13h', intensity: 'peak', sales: 1520 },
        { hour: '14h', intensity: 'medium', sales: 720 },
        { hour: '19h', intensity: 'high', sales: 1050 },
        { hour: '20h', intensity: 'peak', sales: 1420 },
        { hour: '21h', intensity: 'high', sales: 890 },
      ]
    },
    { 
      day: 'Jeu', 
      hours: [
        { hour: '11h', intensity: 'medium', sales: 390 },
        { hour: '12h', intensity: 'high', sales: 1200 },
        { hour: '13h', intensity: 'peak', sales: 1540 },
        { hour: '14h', intensity: 'medium', sales: 740 },
        { hour: '19h', intensity: 'high', sales: 1120 },
        { hour: '20h', intensity: 'peak', sales: 1480 },
        { hour: '21h', intensity: 'high', sales: 920 },
      ]
    },
    { 
      day: 'Ven', 
      hours: [
        { hour: '11h', intensity: 'medium', sales: 420 },
        { hour: '12h', intensity: 'peak', sales: 1350 },
        { hour: '13h', intensity: 'peak', sales: 1680 },
        { hour: '14h', intensity: 'high', sales: 850 },
        { hour: '19h', intensity: 'peak', sales: 1380 },
        { hour: '20h', intensity: 'peak', sales: 1720 },
        { hour: '21h', intensity: 'high', sales: 1100 },
      ]
    },
    { 
      day: 'Sam', 
      hours: [
        { hour: '11h', intensity: 'high', sales: 680 },
        { hour: '12h', intensity: 'peak', sales: 1520 },
        { hour: '13h', intensity: 'peak', sales: 1820 },
        { hour: '14h', intensity: 'high', sales: 1050 },
        { hour: '19h', intensity: 'peak', sales: 1650 },
        { hour: '20h', intensity: 'peak', sales: 1980 },
        { hour: '21h', intensity: 'peak', sales: 1420 },
      ]
    },
    { 
      day: 'Dim', 
      hours: [
        { hour: '11h', intensity: 'medium', sales: 520 },
        { hour: '12h', intensity: 'high', sales: 1280 },
        { hour: '13h', intensity: 'peak', sales: 1580 },
        { hour: '14h', intensity: 'high', sales: 920 },
        { hour: '19h', intensity: 'high', sales: 1180 },
        { hour: '20h', intensity: 'peak', sales: 1520 },
        { hour: '21h', intensity: 'medium', sales: 780 },
      ]
    },
  ];

  const heatmapData = data || defaultData;
  const allHours = [...new Set(heatmapData.flatMap(d => d.hours.map(h => h.hour)))];

  const getIntensityStyle = (intensity) => {
    switch (intensity) {
      case 'peak':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-400 text-white';
      case 'medium':
        return 'bg-yellow-400 text-gray-900';
      case 'low':
        return 'bg-green-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-400';
    }
  };

  const totalSales = heatmapData.flatMap(d => d.hours).reduce((acc, h) => acc + h.sales, 0);
  const rushHourSales = heatmapData.flatMap(d => d.hours.filter(h => h.intensity === 'peak')).reduce((acc, h) => acc + h.sales, 0);
  const rushPercentage = ((rushHourSales / totalSales) * 100).toFixed(0);

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Heatmap des ventes par heure
          </h3>
          <p className="text-sm text-gray-500 mt-1">Optimisez votre staffing et production</p>
        </div>
      </div>

      {/* Insight */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              {rushPercentage}% du CA est généré pendant les heures de rush
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Suggestion : Augmentez le staff de 30% entre 12h-14h et 20h-21h
            </p>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 pb-3">Heure</th>
              {heatmapData.map(day => (
                <th key={day.day} className="text-center text-xs font-medium text-gray-500 pb-3 px-2">
                  {day.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allHours.map(hour => (
              <tr key={hour}>
                <td className="text-xs font-medium text-gray-700 py-2">{hour}</td>
                {heatmapData.map(day => {
                  const hourData = day.hours.find(h => h.hour === hour);
                  return (
                    <td key={`${day.day}-${hour}`} className="px-2 py-2">
                      {hourData ? (
                        <div 
                          className={cn(
                            "rounded-lg p-2 text-center transition-all cursor-pointer hover:scale-105",
                            getIntensityStyle(hourData.intensity)
                          )}
                          title={`€${hourData.sales}`}
                        >
                          <div className="text-xs font-bold">€{(hourData.sales / 1000).toFixed(1)}k</div>
                        </div>
                      ) : (
                        <div className="rounded-lg p-2 bg-gray-50"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">Intensité :</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200"></div>
          <span className="text-xs text-gray-600">Faible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400"></div>
          <span className="text-xs text-gray-600">Moyen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-400"></div>
          <span className="text-xs text-gray-600">Élevé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-xs text-gray-600">Rush 🔥</span>
        </div>
      </div>
    </div>
  );
}