import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/lib/LanguageContext';

export default function TopProductsCard({ productsData }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const hasRealData = !!productsData && productsData.length > 0;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">
          {isEn ? 'Top selling products' : 'Produits les plus vendus'}
        </h3>
        {!hasRealData && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            {isEn ? 'Not enriched' : 'Non enrichi'}
          </span>
        )}
      </div>

      {!hasRealData ? (
        <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-xs text-gray-400 text-center mb-2">
            {isEn ? 'No product data available' : 'Aucune donnée produit disponible'}
          </p>
          <Link
            to={`${createPageUrl('OploChat')}?mode=enrich`}
            className="text-xs text-blue-600 underline"
          >
            {isEn ? 'Enrich with Oplo.ai →' : 'Enrichir avec Oplo.ai →'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {productsData.map((product, index) => (
            <div key={product.name} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                {product.sales != null && (
                  <p className="text-xs text-gray-500">
                    {product.sales} {isEn ? 'sales' : 'ventes'}
                  </p>
                )}
              </div>
              <div className="text-right">
                {product.revenue != null && (
                  <p className="text-sm font-semibold text-gray-900">€{Number(product.revenue).toLocaleString()}</p>
                )}
                {product.trend != null && (
                  <div className={`flex items-center justify-end gap-1 text-xs ${product.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <TrendingUp className={`w-3 h-3 ${product.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(product.trend)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
