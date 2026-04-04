import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/lib/LanguageContext';

const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RevenueChart({ chartData }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const months = isEn ? monthsEn : monthsFr;
  const defaultData = months.map(m => ({ month: m, revenue: 0, lastYear: 0 }));

  const hasRealData = !!chartData && chartData.length > 0;
  const data = hasRealData ? chartData : defaultData;
  const totalRevenue = data.reduce((sum, d) => sum + (d.revenue || 0), 0);

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600">
            {isEn ? 'Revenue trend' : 'Évolution du revenu'}
          </h3>
          {hasRealData ? (
            <p className="text-2xl font-bold text-gray-900 mt-1">
              €{(totalRevenue / 1000).toFixed(0)}k
            </p>
          ) : (
            <p className="text-sm text-amber-600 mt-1">
              {isEn ? 'No data — ' : 'Donnée non enrichie — '}
              <Link to={`${createPageUrl('OploChat')}?mode=enrich`} className="underline">
                {isEn ? 'Enrich' : 'Enrichir'}
              </Link>
            </p>
          )}
        </div>
        {hasRealData && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-gray-600">{isEn ? 'This year' : 'Cette année'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-gray-600">{isEn ? 'Last year' : 'Année dernière'}</span>
            </div>
          </div>
        )}
      </div>

      {!hasRealData ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400 text-center">
            {isEn
              ? <>Share your POS exports with Oplo.ai<br />to display your real revenue trend</>
              : <>Partagez vos exports de caisse à Oplo.ai<br />pour afficher l'évolution réelle de vos revenus</>
            }
          </p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52525b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#52525b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }}
                formatter={(value) => [`€${Number(value).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="lastYear" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorLastYear)" />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
