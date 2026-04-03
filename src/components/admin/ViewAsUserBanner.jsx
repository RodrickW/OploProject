import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ViewAsUserBanner() {
  const [viewAsEmail, setViewAsEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('admin_view_as_user');
    setViewAsEmail(email);
  }, []);

  if (!viewAsEmail) return null;

  const handleExit = () => {
    localStorage.removeItem('admin_view_as_user');
    navigate(createPageUrl('AdminUsers'));
    window.location.reload();
  };

  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Mode visualisation admin</p>
              <p className="text-sm text-gray-600">Vous consultez le compte de : {viewAsEmail}</p>
            </div>
          </div>
          <Button onClick={handleExit} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour admin
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}