import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MobileSelect({
  value,
  onValueChange,
  options = [],
  placeholder = 'Sélectionner...',
  className,
}) {
  const [open, setOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  if (!isMobile) {
    // Fallback to regular select on desktop
    return (
      <select
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-600',
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between px-3 py-2 text-left',
            className
          )}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>{selectedLabel}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{placeholder}</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-2 p-4">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onValueChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'w-full px-4 py-3 text-left rounded-lg transition-colors',
                value === opt.value
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-gray-50 hover:bg-gray-100'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}