import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Store, 
  Plus, 
  MapPin, 
  Phone, 
  Mail,
  Users,
  Euro,
  Star,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

export default function Restaurants() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    type: 'casual',
    capacity: ''
  });
  
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants', currentUser?.email],
    queryFn: () => base44.entities.Restaurant.filter({ created_by: currentUser.email }, '-created_date'),
    enabled: !!currentUser?.email
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Restaurant.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurants']);
      setIsOpen(false);
      setFormData({ name: '', address: '', city: '', phone: '', email: '', type: 'casual', capacity: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Restaurant.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['restaurants'])
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      capacity: parseInt(formData.capacity) || 0,
      status: 'active'
    });
  };

  const typeLabels = {
    casual: 'Casual',
    fine_dining: 'Gastronomique',
    fast_casual: 'Fast Casual',
    bistro: 'Bistro',
    brasserie: 'Brasserie'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mes Restaurants</h1>
          <p className="text-gray-500 mt-1">{restaurants.length} restaurant(s) dans votre groupe</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Ajouter un restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Nouveau restaurant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nom du restaurant</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-200"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="fine_dining">Gastronomique</SelectItem>
                      <SelectItem value="fast_casual">Fast Casual</SelectItem>
                      <SelectItem value="bistro">Bistro</SelectItem>
                      <SelectItem value="brasserie">Brasserie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Capacité (couverts)</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Créer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Restaurants Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
          <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun restaurant</h3>
          <p className="text-gray-500 mb-4">Commencez par ajouter votre premier restaurant</p>
          <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Ajouter un restaurant
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map(restaurant => (
            <div 
              key={restaurant.id}
              className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:border-blue-300 transition-all group"
            >
              {/* Header with image or gradient */}
              <div className="h-32 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 relative">
                {restaurant.image_url && (
                  <img 
                    src={restaurant.image_url} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/30 text-white hover:bg-black/50">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => deleteMutation.mutate(restaurant.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge className="absolute bottom-3 left-3 bg-black/50 text-white">
                  {typeLabels[restaurant.type] || restaurant.type}
                </Badge>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <Link to={createPageUrl(`RestaurantDetail?id=${restaurant.id}`)}>
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </h3>
                </Link>
                
                {restaurant.city && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {restaurant.city}
                  </p>
                )}
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <Euro className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Revenu</p>
                    <p className="text-sm font-semibold text-gray-900">
                      €{((restaurant.monthly_revenue || 45000) / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <Users className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Clients</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {(restaurant.monthly_customers || 1200).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <Star className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Note</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {(restaurant.satisfaction_score || 4.5).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}