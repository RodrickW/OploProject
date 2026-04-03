import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Trash2, Users, Mail, Loader2 } from 'lucide-react';

export default function AssociatesManager() {
  const [profile, setProfile] = useState(null);
  const [associates, setAssociates] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      base44.entities.OnboardingProfile.filter(
        { created_by: user.email, status: 'completed' },
        '-created_date', 1
      ).then(profiles => {
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setAssociates(profiles[0].associate_emails || []);
        }
        setLoading(false);
      });
    });
  }, []);

  const addAssociate = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || associates.includes(email)) return;

    setSaving(true);
    const updated = [...associates, email];
    await base44.entities.OnboardingProfile.update(profile.id, { associate_emails: updated });
    // Invite l'utilisateur dans l'app
    try {
      await base44.users.inviteUser(email, 'user');
    } catch (_) {}
    setAssociates(updated);
    setNewEmail('');
    setSaving(false);
  };

  const removeAssociate = async (email) => {
    setSaving(true);
    const updated = associates.filter(e => e !== email);
    await base44.entities.OnboardingProfile.update(profile.id, { associate_emails: updated });
    setAssociates(updated);
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-12 text-gray-500">
      Complétez d'abord votre onboarding pour gérer les associés.
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Associés & Co-gérants</h3>
            <p className="text-sm text-gray-500">
              Les associés invités auront accès à l'intégralité de votre espace <strong>{profile.group_name}</strong>.
            </p>
          </div>
        </div>

        {/* Add associate */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 space-y-1">
            <Label>Adresse email</Label>
            <Input
              type="email"
              placeholder="associe@exemple.com"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addAssociate()}
            />
          </div>
          <div className="pt-6">
            <Button
              onClick={addAssociate}
              disabled={saving || !newEmail.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span className="ml-2">Inviter</span>
            </Button>
          </div>
        </div>

        {/* Associates list */}
        {associates.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
            Aucun associé pour l'instant
          </div>
        ) : (
          <div className="space-y-2">
            {associates.map(email => (
              <div key={email} className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAssociate(email)}
                  disabled={saving}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}