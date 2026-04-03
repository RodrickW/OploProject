import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function TrafficSourceChart({ trafficData }) {
  const hasRealData = !!trafficData && trafficData.length > 0;
  const data = trafficData || [];

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Sources de trafic</h3>
        {!hasRealData && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            Non enrichi
          </span>
        )}
      </div>

      {!hasRealData ? (
        <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-xs text-gray-400 text-center">
            Sources de trafic non renseignées
          </p>
          <Link
            to={`${createPageUrl('OploChat')}?mode=enrich`}
            className="text-xs text-blue-600 mt-2 underline"
          >
            Enrichir →
          </Link>
        </div>
      ) : (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="text-gray-900 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}