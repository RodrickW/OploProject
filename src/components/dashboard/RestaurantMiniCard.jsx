import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users, Euro, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RestaurantMiniCard({ restaurant }) {
  const trend = Math.random() > 0.3 ? 'up' : 'down';
  const change = Math.floor(Math.random() * 15) + 1;

  return (
    <Link 
      to={createPageUrl(`RestaurantDetail?id=${restaurant.id}`)}
      className="block rounded-xl bg-white border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center gap-3 mb-3">
        {restaurant.image_url ? (
          <img 
            src={restaurant.image_url} 
            alt={restaurant.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
            {restaurant.name?.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
            {restaurant.name}
          </h4>
          <p className="text-xs text-gray-500">{restaurant.city || 'Non défini'}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
        )}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}%
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-blue-50 rounded-lg p-2">
          <Euro className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Revenu</p>
          <p className="text-sm font-semibold text-gray-900">
            €{((restaurant.monthly_revenue || 45000) / 1000).toFixed(0)}k
          </p>
        </div>
        <div className="bg-cyan-50 rounded-lg p-2">
          <Users className="w-3.5 h-3.5 text-cyan-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Clients</p>
          <p className="text-sm font-semibold text-gray-900">
            {(restaurant.monthly_customers || 1200).toLocaleString()}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-2">
          <Star className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Note</p>
          <p className="text-sm font-semibold text-gray-900">
            {(restaurant.satisfaction_score || 4.5).toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}