import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Package, Plus, AlertTriangle, CheckCircle, XCircle,
  Truck, ShoppingCart, Phone, Mail, User, RefreshCw,
  TrendingDown, Euro, Boxes, ClipboardList, Pencil, Trash2,
  PhoneCall, PhoneOff, PhoneMissed, PhoneIncoming, Mic, Loader2, Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

const CATEGORIES_FR = ['Produits frais', 'Viande & Poisson', 'Épicerie', 'Boissons', 'Produits laitiers', 'Alcools', 'Hygiène', 'Emballages', 'Autre'];
const CATEGORIES_EN = ['Fresh Produce', 'Meat & Fish', 'Grocery', 'Beverages', 'Dairy', 'Spirits', 'Hygiene', 'Packaging', 'Other'];
const UNITS = ['kg', 'g', 'L', 'cL', 'unité', 'carton', 'bouteille', 'sachet', 'pièce'];

const DEMO_SUPPLIERS = [
  { name: 'Rungis Primeur', contact_person: 'Jean Dupont', phone: '+33 1 45 22 88 00', email: 'commandes@rungis-primeur.fr', products: ['Tomates', 'Salade', 'Légumes', 'Fruits'], notes: 'Livraison lundi, mercredi, vendredi' },
  { name: 'Maison Bocuse Viandes', contact_person: 'Pierre Martin', phone: '+33 4 72 42 90 90', email: 'pro@bocuse-viandes.fr', products: ['Bœuf', 'Veau', 'Agneau', 'Volaille'], notes: 'Livraison mardi et jeudi. MOQ: 20kg' },
  { name: 'Cave Nicolas Pro', contact_person: 'Sophie Bernard', phone: '+33 1 40 20 20 20', email: 'pro@nicolas.fr', products: ['Vins', 'Champagne', 'Spiritueux'], notes: 'Commande min. 6 caisses. 30j paiement' },
  { name: 'Metro Cash & Carry', contact_person: 'Marc Lefebvre', phone: '+33 1 48 63 50 00', email: 'pro@metro.fr', products: ['Épicerie', 'Hygiène', 'Emballages', 'Produits laitiers'], notes: 'Compte pro 15% de remise' },
];

const DEMO_ITEMS = [
  { name: 'Tomates cerises', category: 'Produits frais', current_quantity: 3, par_level: 10, unit: 'kg', cost_per_unit: 4.5, location: 'Chambre froide' },
  { name: 'Filet de bœuf', category: 'Viande & Poisson', current_quantity: 8, par_level: 15, unit: 'kg', cost_per_unit: 28, location: 'Chambre froide' },
  { name: 'Cabernet Sauvignon 2021', category: 'Alcools', current_quantity: 24, par_level: 48, unit: 'bouteille', cost_per_unit: 12, location: 'Cave' },
  { name: 'Huile d\'olive extra vierge', category: 'Épicerie', current_quantity: 12, par_level: 8, unit: 'L', cost_per_unit: 9.5, location: 'Réserve sèche' },
  { name: 'Crème fraîche 35%', category: 'Produits laitiers', current_quantity: 4, par_level: 10, unit: 'L', cost_per_unit: 3.2, location: 'Chambre froide' },
  { name: 'Champagne Brut', category: 'Alcools', current_quantity: 1, par_level: 12, unit: 'bouteille', cost_per_unit: 22, location: 'Cave' },
  { name: 'Farine T55', category: 'Épicerie', current_quantity: 25, par_level: 20, unit: 'kg', cost_per_unit: 0.9, location: 'Réserve sèche' },
  { name: 'Eau minérale Evian', category: 'Boissons', current_quantity: 3, par_level: 20, unit: 'carton', cost_per_unit: 6, location: 'Réserve boissons' },
  { name: 'Saumon fumé Label Rouge', category: 'Viande & Poisson', current_quantity: 5, par_level: 8, unit: 'kg', cost_per_unit: 35, location: 'Chambre froide' },
  { name: 'Beurre doux AOP', category: 'Produits laitiers', current_quantity: 15, par_level: 10, unit: 'kg', cost_per_unit: 7.5, location: 'Chambre froide' },
  { name: 'Savon mains professionnel', category: 'Hygiène', current_quantity: 0, par_level: 6, unit: 'L', cost_per_unit: 4, location: 'Réserve hygiène' },
  { name: 'Barquettes aluminium 1L', category: 'Emballages', current_quantity: 50, par_level: 200, unit: 'unité', cost_per_unit: 0.35, location: 'Réserve emballages' },
];

function stockStatus(item) {
  if (item.par_level === 0) return 'ok';
  const ratio = item.current_quantity / item.par_level;
  if (ratio >= 1) return 'ok';
  if (ratio >= 0.5) return 'low';
  return 'critical';
}

const statusConfig = {
  ok: { label: 'OK', labelEn: 'OK', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, dot: 'bg-green-500' },
  low: { label: 'Faible', labelEn: 'Low', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertTriangle, dot: 'bg-amber-500' },
  critical: { label: 'Critique', labelEn: 'Critical', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle, dot: 'bg-red-500' },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={cn('bg-white rounded-2xl border p-5 flex items-start gap-4', color?.border || 'border-gray-200')}>
      <div className={cn('p-3 rounded-xl', color?.bg || 'bg-gray-100')}>
        <Icon className={cn('w-5 h-5', color?.icon || 'text-gray-600')} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ItemForm({ item, suppliers, onSave, onClose, lang }) {
  const categories = lang === 'en' ? CATEGORIES_EN : CATEGORIES_FR;
  const [form, setForm] = useState({
    name: item?.name || '',
    category: item?.category || categories[0],
    current_quantity: item?.current_quantity ?? 0,
    par_level: item?.par_level ?? 0,
    unit: item?.unit || 'kg',
    supplier_id: item?.supplier_id || '',
    cost_per_unit: item?.cost_per_unit || '',
    location: item?.location || '',
    notes: item?.notes || '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>{lang === 'en' ? 'Name' : 'Nom'}</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} className="mt-1" data-testid="input-item-name" />
        </div>
        <div>
          <Label>{lang === 'en' ? 'Category' : 'Catégorie'}</Label>
          <Select value={form.category} onValueChange={v => set('category', v)}>
            <SelectTrigger className="mt-1" data-testid="select-category"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>{lang === 'en' ? 'Unit' : 'Unité'}</Label>
          <Select value={form.unit} onValueChange={v => set('unit', v)}>
            <SelectTrigger className="mt-1" data-testid="select-unit"><SelectValue /></SelectTrigger>
            <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>{lang === 'en' ? 'Current Stock' : 'Stock actuel'}</Label>
          <Input type="number" min="0" step="0.1" value={form.current_quantity} onChange={e => set('current_quantity', parseFloat(e.target.value) || 0)} className="mt-1" data-testid="input-current-qty" />
        </div>
        <div>
          <Label>{lang === 'en' ? 'Par Level (min.)' : 'Niveau minimum'}</Label>
          <Input type="number" min="0" step="0.1" value={form.par_level} onChange={e => set('par_level', parseFloat(e.target.value) || 0)} className="mt-1" data-testid="input-par-level" />
        </div>
        <div>
          <Label>{lang === 'en' ? 'Cost/Unit (€)' : 'Coût/unité (€)'}</Label>
          <Input type="number" min="0" step="0.01" value={form.cost_per_unit} onChange={e => set('cost_per_unit', e.target.value)} className="mt-1" data-testid="input-cost" />
        </div>
        <div>
          <Label>{lang === 'en' ? 'Location' : 'Emplacement'}</Label>
          <Input value={form.location} onChange={e => set('location', e.target.value)} className="mt-1" data-testid="input-location" />
        </div>
        <div className="col-span-2">
          <Label>{lang === 'en' ? 'Supplier' : 'Fournisseur'}</Label>
          <Select value={form.supplier_id || 'none'} onValueChange={v => set('supplier_id', v === 'none' ? '' : v)}>
            <SelectTrigger className="mt-1" data-testid="select-supplier"><SelectValue placeholder={lang === 'en' ? 'Select supplier' : 'Choisir un fournisseur'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{lang === 'en' ? 'No supplier' : 'Aucun fournisseur'}</SelectItem>
              {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="mt-1" rows={2} data-testid="textarea-notes" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} data-testid="button-cancel">{lang === 'en' ? 'Cancel' : 'Annuler'}</Button>
        <Button onClick={() => onSave(form)} disabled={!form.name} data-testid="button-save">
          {lang === 'en' ? 'Save' : 'Enregistrer'}
        </Button>
      </DialogFooter>
    </div>
  );
}

function SupplierForm({ supplier, onSave, onClose, lang }) {
  const [form, setForm] = useState({
    name: supplier?.name || '',
    contact_person: supplier?.contact_person || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    address: supplier?.address || '',
    products: supplier?.products?.join(', ') || '',
    notes: supplier?.notes || '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>{lang === 'en' ? 'Company Name' : 'Nom de l\'entreprise'}</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} className="mt-1" data-testid="input-supplier-name" />
        </div>
        <div>
          <Label>{lang === 'en' ? 'Contact Person' : 'Contact'}</Label>
          <Input value={form.contact_person} onChange={e => set('contact_person', e.target.value)} className="mt-1" data-testid="input-contact" />
        </div>
        <div>
          <Label>{lang === 'en' ? 'Phone' : 'Téléphone'}</Label>
          <Input value={form.phone} onChange={e => set('phone', e.target.value)} className="mt-1" data-testid="input-phone" />
        </div>
        <div className="col-span-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="mt-1" data-testid="input-email" />
        </div>
        <div className="col-span-2">
          <Label>{lang === 'en' ? 'Products Supplied' : 'Produits fournis'}</Label>
          <Input value={form.products} onChange={e => set('products', e.target.value)} placeholder={lang === 'en' ? 'Tomatoes, Beef, ...' : 'Tomates, Bœuf, ...'} className="mt-1" data-testid="input-products" />
        </div>
        <div className="col-span-2">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="mt-1" rows={2} data-testid="textarea-supplier-notes" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} data-testid="button-cancel-supplier">{lang === 'en' ? 'Cancel' : 'Annuler'}</Button>
        <Button onClick={() => onSave({ ...form, products: form.products.split(',').map(p => p.trim()).filter(Boolean) })} disabled={!form.name} data-testid="button-save-supplier">
          {lang === 'en' ? 'Save' : 'Enregistrer'}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function Inventory() {
  const qc = useQueryClient();
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;
  const lang = language;
  const isEn = lang === 'en';

  const [activeTab, setActiveTab] = useState('inventory');
  const [itemModal, setItemModal] = useState(null);
  const [supplierModal, setSupplierModal] = useState(null);
  const [orderingItem, setOrderingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [orderQty, setOrderQty] = useState('');
  const [callModal, setCallModal] = useState(null);
  const [previewedScript, setPreviewedScript] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [callStatus, setCallStatus] = useState(null);

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: () => fetch('/api/inventory').then(r => r.json()),
  });

  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ['/api/suppliers'],
    queryFn: () => fetch('/api/suppliers').then(r => r.json()),
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['/api/inventory/orders'],
    queryFn: () => fetch('/api/inventory/orders').then(r => r.json()),
  });

  const { data: calls = [], isLoading: loadingCalls } = useQuery({
    queryKey: ['/api/calls'],
    queryFn: () => fetch('/api/calls').then(r => r.json()),
    refetchInterval: 8000,
  });

  const createItem = useMutation({
    mutationFn: data => fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/inventory'] }); setItemModal(null); },
  });

  const updateItem = useMutation({
    mutationFn: ({ id, data }) => fetch(`/api/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/inventory'] }); setItemModal(null); },
  });

  const deleteItem = useMutation({
    mutationFn: id => fetch(`/api/inventory/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/inventory'] }); setDeleteConfirm(null); },
  });

  const createSupplier = useMutation({
    mutationFn: data => fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/suppliers'] }); setSupplierModal(null); },
  });

  const updateSupplier = useMutation({
    mutationFn: ({ id, data }) => fetch(`/api/suppliers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/suppliers'] }); setSupplierModal(null); },
  });

  const deleteSupplier = useMutation({
    mutationFn: id => fetch(`/api/suppliers/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/suppliers'] }),
  });

  const placeOrder = useMutation({
    mutationFn: ({ id, qty }) => fetch(`/api/inventory/${id}/order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity_ordered: parseFloat(qty) }) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/inventory/orders'] }); setOrderingItem(null); setOrderQty(''); },
  });

  const initiateCall = useMutation({
    mutationFn: ({ item_id, quantity }) =>
      fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id, quantity, language: lang }),
      }).then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || data.error || 'Call failed');
        return data;
      }),
    onSuccess: (data) => {
      setCallStatus({ type: 'success', callId: data.id, sid: data.twilio_call_sid });
      qc.invalidateQueries({ queryKey: ['/api/calls'] });
    },
    onError: (err) => {
      setCallStatus({ type: 'error', message: err.message });
    },
  });

  const previewScript = async (item) => {
    setPreviewLoading(true);
    setPreviewedScript('');
    const qty = Math.max((item.par_level || 0) - (item.current_quantity || 0), 1);
    try {
      const res = await fetch('/api/calls/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: item.id, quantity: qty, language: lang }),
      });
      const data = await res.json();
      setPreviewedScript(data.script || '');
    } catch {
      setPreviewedScript(isEn ? 'Error generating script.' : 'Erreur lors de la génération du script.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const openCallModal = (item) => {
    setCallModal(item);
    setPreviewedScript('');
    setCallStatus(null);
    previewScript(item);
  };

  const seedDemoData = async () => {
    setSeeding(true);
    try {
      const createdSuppliers = await Promise.all(DEMO_SUPPLIERS.map(s =>
        fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) }).then(r => r.json())
      ));
      const supplierMap = { 'Rungis Primeur': createdSuppliers[0], 'Maison Bocuse Viandes': createdSuppliers[1], 'Cave Nicolas Pro': createdSuppliers[2], 'Metro Cash & Carry': createdSuppliers[3] };
      const supplierAssign = { 'Produits frais': 'Rungis Primeur', 'Viande & Poisson': 'Maison Bocuse Viandes', 'Alcools': 'Cave Nicolas Pro', 'Épicerie': 'Metro Cash & Carry', 'Hygiène': 'Metro Cash & Carry', 'Emballages': 'Metro Cash & Carry', 'Boissons': 'Metro Cash & Carry', 'Produits laitiers': 'Metro Cash & Carry' };
      await Promise.all(DEMO_ITEMS.map(item => {
        const sup = supplierMap[supplierAssign[item.category]];
        return fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, supplier_id: sup?.id || null }) }).then(r => r.json());
      }));
      qc.invalidateQueries({ queryKey: ['/api/inventory'] });
      qc.invalidateQueries({ queryKey: ['/api/suppliers'] });
    } finally { setSeeding(false); }
  };

  // Stats
  const lowStock = items.filter(i => stockStatus(i) === 'low');
  const critical = items.filter(i => stockStatus(i) === 'critical');
  const totalValue = items.reduce((sum, i) => sum + (i.current_quantity * (i.cost_per_unit || 0)), 0);

  const statusOrder = { critical: 0, low: 1, ok: 2 };
  const sortedItems = [...items].sort((a, b) => statusOrder[stockStatus(a)] - statusOrder[stockStatus(b)]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-100 border border-indigo-200">
            <Boxes className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {isEn ? 'Inventory Management' : 'Gestion des Stocks'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {isEn ? 'Track stock levels, manage suppliers, and automate ordering' : 'Suivez vos niveaux de stock, gérez vos fournisseurs et automatisez les commandes'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {items.length === 0 && suppliers.length === 0 && (
            <Button variant="outline" onClick={seedDemoData} disabled={seeding} data-testid="button-seed-demo" className="gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50">
              {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
              {isEn ? 'Load Demo Data' : 'Charger données démo'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Boxes} label={isEn ? 'Total Items' : 'Articles total'} value={items.length} color={{ bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-100' }} />
        <StatCard icon={AlertTriangle} label={isEn ? 'Low Stock' : 'Stock faible'} value={lowStock.length + critical.length} sub={isEn ? 'Below par level' : 'En dessous du minimum'} color={{ bg: 'bg-amber-100', icon: 'text-amber-600', border: 'border-amber-100' }} />
        <StatCard icon={XCircle} label={isEn ? 'Critical' : 'Critique'} value={critical.length} sub={isEn ? 'Urgent reorder needed' : 'Réapprovisionnement urgent'} color={{ bg: 'bg-red-100', icon: 'text-red-600', border: 'border-red-100' }} />
        <StatCard icon={Euro} label={isEn ? 'Stock Value' : 'Valeur du stock'} value={`${totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`} color={{ bg: 'bg-green-100', icon: 'text-green-600', border: 'border-green-100' }} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="inventory" className="gap-2" data-testid="tab-inventory">
            <Boxes className="w-4 h-4" />{isEn ? 'Inventory' : 'Inventaire'}
            {(lowStock.length + critical.length) > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {lowStock.length + critical.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-2" data-testid="tab-suppliers">
            <Truck className="w-4 h-4" />{isEn ? 'Suppliers' : 'Fournisseurs'}
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2" data-testid="tab-orders">
            <ClipboardList className="w-4 h-4" />{isEn ? 'Orders' : 'Commandes'}
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="calls" className="gap-2" data-testid="tab-calls">
            <PhoneCall className="w-4 h-4" />{isEn ? 'AI Calls' : 'Appels IA'}
            {calls.filter(c => ['initiated', 'ringing', 'in-progress'].includes(c.status)).length > 0 && (
              <span className="ml-1 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {calls.filter(c => ['initiated', 'ringing', 'in-progress'].includes(c.status)).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── INVENTORY TAB ── */}
        <TabsContent value="inventory" className="mt-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{isEn ? 'Stock Items' : 'Articles en stock'}</h2>
              <Button size="sm" onClick={() => setItemModal({ mode: 'create' })} className="gap-2 bg-indigo-600 hover:bg-indigo-700" data-testid="button-add-item">
                <Plus className="w-4 h-4" />{isEn ? 'Add Item' : 'Ajouter un article'}
              </Button>
            </div>
            {loadingItems ? (
              <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />{isEn ? 'Loading...' : 'Chargement...'}
              </div>
            ) : sortedItems.length === 0 ? (
              <div className="text-center py-16">
                <Boxes className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{isEn ? 'No items yet' : 'Aucun article pour le moment'}</p>
                <p className="text-gray-400 text-sm mt-1">{isEn ? 'Add items or load demo data to get started' : 'Ajoutez des articles ou chargez les données démo pour commencer'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-semibold text-gray-600">{isEn ? 'Item' : 'Article'}</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">{isEn ? 'Stock' : 'Stock'}</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">{isEn ? 'Supplier' : 'Fournisseur'}</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">{isEn ? 'Status' : 'Statut'}</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">{isEn ? 'Actions' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedItems.map(item => {
                      const status = stockStatus(item);
                      const cfg = statusConfig[status];
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-item-${item.id}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.category} {item.location ? `· ${item.location}` : ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <span className={cn('font-bold', status === 'critical' ? 'text-red-600' : status === 'low' ? 'text-amber-600' : 'text-gray-900')}>
                                {item.current_quantity}
                              </span>
                              <span className="text-gray-400 text-xs"> / {item.par_level} {item.unit}</span>
                            </div>
                            <div className="mt-1 w-24 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={cn('h-1.5 rounded-full transition-all', status === 'critical' ? 'bg-red-500' : status === 'low' ? 'bg-amber-500' : 'bg-green-500')}
                                style={{ width: `${Math.min(100, item.par_level > 0 ? (item.current_quantity / item.par_level) * 100 : 100)}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-gray-600 text-sm">{item.supplier_name || <span className="text-gray-300 italic">—</span>}</span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={cn('gap-1 border text-xs', cfg.color)}>
                              <StatusIcon className="w-3 h-3" />
                              {isEn ? cfg.labelEn : cfg.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {status !== 'ok' && (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1 text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 h-8" onClick={() => { setOrderingItem(item); setOrderQty(String(item.par_level - item.current_quantity)); }} data-testid={`button-order-${item.id}`}>
                                    <ShoppingCart className="w-3 h-3" />{isEn ? 'Order' : 'Commander'}
                                  </Button>
                                  {item.supplier_phone && (
                                    <Button size="sm" variant="outline" className="gap-1 text-xs border-green-300 text-green-700 hover:bg-green-50 h-8" onClick={() => openCallModal(item)} data-testid={`button-call-${item.id}`}>
                                      <PhoneCall className="w-3 h-3" />{isEn ? 'Call' : 'Appeler'}
                                    </Button>
                                  )}
                                </>
                              )}
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => setItemModal({ mode: 'edit', item })} data-testid={`button-edit-item-${item.id}`}>
                                <Pencil className="w-3.5 h-3.5 text-gray-500" />
                              </Button>
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteConfirm({ type: 'item', id: item.id, name: item.name })} data-testid={`button-delete-item-${item.id}`}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── SUPPLIERS TAB ── */}
        <TabsContent value="suppliers" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{isEn ? 'Supplier Directory' : 'Annuaire des fournisseurs'}</h2>
            <Button size="sm" onClick={() => setSupplierModal({ mode: 'create' })} className="gap-2 bg-indigo-600 hover:bg-indigo-700" data-testid="button-add-supplier">
              <Plus className="w-4 h-4" />{isEn ? 'Add Supplier' : 'Ajouter un fournisseur'}
            </Button>
          </div>
          {loadingSuppliers ? (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{isEn ? 'No suppliers yet' : 'Aucun fournisseur pour le moment'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {suppliers.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5" data-testid={`card-supplier-${s.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                      {s.contact_person && (
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" />{s.contact_person}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => setSupplierModal({ mode: 'edit', supplier: s })} data-testid={`button-edit-supplier-${s.id}`}>
                        <Pencil className="w-3.5 h-3.5 text-gray-500" />
                      </Button>
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteSupplier.mutate(s.id)} data-testid={`button-delete-supplier-${s.id}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {s.phone && <a href={`tel:${s.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"><Phone className="w-3.5 h-3.5 text-indigo-400" />{s.phone}</a>}
                    {s.email && <a href={`mailto:${s.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"><Mail className="w-3.5 h-3.5 text-indigo-400" />{s.email}</a>}
                  </div>
                  {s.products?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.products.map(p => (
                        <span key={p} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">{p}</span>
                      ))}
                    </div>
                  )}
                  {s.notes && <p className="mt-3 text-xs text-gray-400 italic">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── ORDERS TAB ── */}
        <TabsContent value="orders" className="mt-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{isEn ? 'Order History' : 'Historique des commandes'}</h2>
            </div>
            {loadingOrders ? (
              <div className="flex items-center justify-center py-16 text-gray-400 gap-2"><RefreshCw className="w-5 h-5 animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{isEn ? 'No orders yet' : 'Aucune commande pour le moment'}</p>
                <p className="text-gray-400 text-sm mt-1">{isEn ? 'Orders placed from the inventory will appear here' : 'Les commandes passées depuis l\'inventaire apparaîtront ici'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between" data-testid={`row-order-${order.id}`}>
                    <div className="flex items-center gap-4">
                      <div className={cn('p-2 rounded-xl', order.status === 'pending' ? 'bg-amber-100' : order.status === 'confirmed' ? 'bg-blue-100' : 'bg-green-100')}>
                        <ShoppingCart className={cn('w-4 h-4', order.status === 'pending' ? 'text-amber-600' : order.status === 'confirmed' ? 'text-blue-600' : 'text-green-600')} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.item_name}</p>
                        <p className="text-xs text-gray-400">{order.supplier_name} · {order.quantity_ordered} {order.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn('text-xs border', order.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-300' : order.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-green-100 text-green-700 border-green-300')}>
                        {order.status === 'pending' ? (isEn ? 'Pending' : 'En attente') : order.status === 'confirmed' ? (isEn ? 'Confirmed' : 'Confirmé') : (isEn ? 'Delivered' : 'Livré')}
                      </Badge>
                      <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        {/* ── CALLS TAB ── */}
        <TabsContent value="calls" className="mt-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">{isEn ? 'AI Supplier Call History' : 'Historique des appels IA fournisseurs'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{isEn ? 'Automated calls placed via Twilio + OpenAI' : 'Appels automatisés via Twilio + OpenAI'}</p>
              </div>
              {calls.filter(c => ['initiated','ringing','in-progress'].includes(c.status)).length > 0 && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {isEn ? 'Call in progress' : 'Appel en cours'}
                </div>
              )}
            </div>
            {loadingCalls ? (
              <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-gray-500 font-medium">{isEn ? 'No calls yet' : 'Aucun appel pour le moment'}</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                  {isEn
                    ? 'Click "Call" on any low-stock item to trigger an AI-generated call to your supplier'
                    : 'Cliquez sur "Appeler" sur un article en stock faible pour déclencher un appel IA vers votre fournisseur'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {calls.map(call => {
                  const isActive = ['initiated','ringing','in-progress'].includes(call.status);
                  const isComplete = call.status === 'completed';
                  const isFailed = ['failed','busy','no-answer'].includes(call.status);
                  return (
                    <div key={call.id} className="px-6 py-4" data-testid={`row-call-${call.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn('p-2 rounded-xl flex-shrink-0',
                            isActive ? 'bg-green-100' : isComplete ? 'bg-blue-100' : isFailed ? 'bg-red-100' : 'bg-gray-100'
                          )}>
                            {isActive ? <Volume2 className="w-4 h-4 text-green-600 animate-pulse" /> :
                             isComplete ? <PhoneIncoming className="w-4 h-4 text-blue-600" /> :
                             isFailed ? <PhoneMissed className="w-4 h-4 text-red-500" /> :
                             <PhoneCall className="w-4 h-4 text-gray-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{call.item_name}</p>
                            <p className="text-xs text-gray-400">
                              {call.supplier_name} · {call.supplier_phone} · {call.quantity_ordered} {call.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={cn('text-xs border',
                            isActive ? 'bg-green-100 text-green-700 border-green-300' :
                            isComplete ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            isFailed ? 'bg-red-100 text-red-700 border-red-300' :
                            'bg-gray-100 text-gray-600 border-gray-300'
                          )}>
                            {call.status === 'initiated' ? (isEn ? 'Calling...' : 'Appel...') :
                             call.status === 'ringing' ? (isEn ? 'Ringing' : 'Sonnerie') :
                             call.status === 'in-progress' ? (isEn ? 'In progress' : 'En cours') :
                             call.status === 'completed' ? (isEn ? 'Completed' : 'Terminé') :
                             call.status === 'failed' ? (isEn ? 'Failed' : 'Échoué') :
                             call.status === 'busy' ? (isEn ? 'Busy' : 'Occupé') :
                             call.status === 'no-answer' ? (isEn ? 'No answer' : 'Sans réponse') :
                             call.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(call.created_at).toLocaleString(isEn ? 'en-GB' : 'fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {call.duration && (
                            <span className="text-xs text-gray-400">{call.duration}s</span>
                          )}
                        </div>
                      </div>
                      {call.call_script && (
                        <div className="mt-3 ml-11 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Mic className="w-3 h-3" />{isEn ? 'Script read by AI:' : 'Script lu par l\'IA :'}
                          </p>
                          <p className="text-sm text-gray-700 italic">"{call.call_script}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Item Add/Edit Modal */}
      <Dialog open={!!itemModal} onOpenChange={() => setItemModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              {itemModal?.mode === 'edit' ? (isEn ? 'Edit Item' : 'Modifier l\'article') : (isEn ? 'Add Item' : 'Ajouter un article')}
            </DialogTitle>
          </DialogHeader>
          {itemModal && (
            <ItemForm
              item={itemModal.item}
              suppliers={suppliers}
              lang={lang}
              onClose={() => setItemModal(null)}
              onSave={data => itemModal.mode === 'edit' ? updateItem.mutate({ id: itemModal.item.id, data }) : createItem.mutate(data)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Supplier Add/Edit Modal */}
      <Dialog open={!!supplierModal} onOpenChange={() => setSupplierModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              {supplierModal?.mode === 'edit' ? (isEn ? 'Edit Supplier' : 'Modifier le fournisseur') : (isEn ? 'Add Supplier' : 'Ajouter un fournisseur')}
            </DialogTitle>
          </DialogHeader>
          {supplierModal && (
            <SupplierForm
              supplier={supplierModal.supplier}
              lang={lang}
              onClose={() => setSupplierModal(null)}
              onSave={data => supplierModal.mode === 'edit' ? updateSupplier.mutate({ id: supplierModal.supplier.id, data }) : createSupplier.mutate(data)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Modal */}
      <Dialog open={!!orderingItem} onOpenChange={() => setOrderingItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              {isEn ? 'Place Order' : 'Passer une commande'}
            </DialogTitle>
          </DialogHeader>
          {orderingItem && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p className="font-semibold text-gray-900">{orderingItem.name}</p>
                <p className="text-sm text-gray-500">{isEn ? 'Supplier' : 'Fournisseur'}: <span className="font-medium">{orderingItem.supplier_name || '—'}</span></p>
                <p className="text-sm text-gray-500">{isEn ? 'Current stock' : 'Stock actuel'}: <span className="font-medium text-red-600">{orderingItem.current_quantity} {orderingItem.unit}</span></p>
                <p className="text-sm text-gray-500">{isEn ? 'Par level' : 'Niveau minimum'}: <span className="font-medium">{orderingItem.par_level} {orderingItem.unit}</span></p>
              </div>
              <div>
                <Label>{isEn ? 'Quantity to order' : 'Quantité à commander'} ({orderingItem.unit})</Label>
                <Input type="number" min="0.1" step="0.1" value={orderQty} onChange={e => setOrderQty(e.target.value)} className="mt-1" data-testid="input-order-qty" />
              </div>
              {orderingItem.supplier_name && (
                <div className="text-xs text-gray-400 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <p className="font-medium text-indigo-600 mb-1">{isEn ? 'Auto-generated order script:' : 'Script de commande généré :'}</p>
                  <p className="italic">"{isEn ? `Hello, this is an order from Oplo Restaurant. We would like to order ${orderQty} ${orderingItem.unit} of ${orderingItem.name}. Please confirm.` : `Bonjour, je vous contacte de la part d'Oplo Restaurant. Nous souhaitons commander ${orderQty} ${orderingItem.unit} de ${orderingItem.name}. Merci de confirmer.`}"</p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setOrderingItem(null)} data-testid="button-cancel-order">{isEn ? 'Cancel' : 'Annuler'}</Button>
                <Button onClick={() => placeOrder.mutate({ id: orderingItem.id, qty: orderQty })} disabled={!orderQty || placeOrder.isPending} className="bg-indigo-600 hover:bg-indigo-700" data-testid="button-confirm-order">
                  {placeOrder.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  {isEn ? 'Confirm Order' : 'Confirmer la commande'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── AI CALL MODAL ── */}
      <Dialog open={!!callModal} onOpenChange={() => { setCallModal(null); setCallStatus(null); setPreviewedScript(''); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <PhoneCall className="w-5 h-5" />
              {isEn ? 'AI Supplier Call' : 'Appel IA Fournisseur'}
            </DialogTitle>
          </DialogHeader>
          {callModal && (
            <div className="space-y-4">
              {/* Item + Supplier info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-500" />{callModal.name}
                </p>
                <p className="text-sm text-gray-500">
                  {isEn ? 'Supplier' : 'Fournisseur'}: <span className="font-medium text-gray-700">{callModal.supplier_name || '—'}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {isEn ? 'Phone' : 'Téléphone'}: <span className="font-medium text-gray-700">{callModal.supplier_phone}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {isEn ? 'To order' : 'À commander'}: <span className="font-bold text-green-700">
                    {Math.max((callModal.par_level || 0) - (callModal.current_quantity || 0), 1)} {callModal.unit}
                  </span>
                </p>
              </div>

              {/* AI-generated script */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-green-600" />
                  {isEn ? 'AI-generated call script:' : 'Script d\'appel généré par IA :'}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 min-h-[80px] flex items-start">
                  {previewLoading ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEn ? 'Generating script with AI...' : 'Génération du script avec l\'IA...'}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800 italic leading-relaxed">"{previewedScript}"</p>
                  )}
                </div>
              </div>

              {/* Call result feedback */}
              {callStatus && (
                <div className={cn('rounded-xl p-3 text-sm flex items-start gap-2',
                  callStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                )}>
                  {callStatus.type === 'success' ? (
                    <>
                      <PhoneCall className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{isEn ? 'Call initiated!' : 'Appel lancé !'}</p>
                        <p className="text-xs mt-0.5 opacity-80">{isEn ? 'Twilio is placing the call now. Check the "AI Calls" tab for status.' : 'Twilio passe l\'appel maintenant. Consultez l\'onglet "Appels IA" pour le suivi.'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <PhoneOff className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{isEn ? 'Call failed' : 'Échec de l\'appel'}</p>
                        <p className="text-xs mt-0.5 opacity-80">{callStatus.message}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => { setCallModal(null); setCallStatus(null); setPreviewedScript(''); }}>
                  {callStatus?.type === 'success' ? (isEn ? 'Close' : 'Fermer') : (isEn ? 'Cancel' : 'Annuler')}
                </Button>
                {callStatus?.type !== 'success' && (
                  <Button
                    onClick={() => initiateCall.mutate({ item_id: callModal.id, quantity: Math.max((callModal.par_level || 0) - (callModal.current_quantity || 0), 1) })}
                    disabled={initiateCall.isPending || previewLoading}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    data-testid="button-confirm-call"
                  >
                    {initiateCall.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />{isEn ? 'Calling...' : 'Appel en cours...'}</>
                    ) : (
                      <><PhoneCall className="w-4 h-4" />{isEn ? 'Call Supplier Now' : 'Appeler le fournisseur'}</>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">{isEn ? 'Delete Item' : 'Supprimer l\'article'}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">{isEn ? `Are you sure you want to delete "${deleteConfirm?.name}"?` : `Voulez-vous vraiment supprimer "${deleteConfirm?.name}" ?`}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} data-testid="button-cancel-delete">{isEn ? 'Cancel' : 'Annuler'}</Button>
            <Button variant="destructive" onClick={() => deleteItem.mutate(deleteConfirm.id)} data-testid="button-confirm-delete">
              {isEn ? 'Delete' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
