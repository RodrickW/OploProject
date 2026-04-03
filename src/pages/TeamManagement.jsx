import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Mail,
  Calendar,
  UserPlus,
  Trash2,
  Building2,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamManagement() {
  const [search, setSearch] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  // Récupérer le profil pour avoir les associés
  const { data: profile } = useQuery({
    queryKey: ['onboarding-profile', currentUser?.email],
    queryFn: async () => {
      const profiles = await base44.entities.OnboardingProfile.filter(
        { created_by: currentUser.email }, 
        '-created_date', 
        1
      );
      return profiles[0] || null;
    },
    enabled: !!currentUser?.email
  });

  // Récupérer les membres de l'équipe (via TeamMember entity si existe, sinon via associate_emails)
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members', currentUser?.email],
    queryFn: () => base44.entities.TeamMember.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const inviteMutation = useMutation({
    mutationFn: async (email) => {
      await base44.users.inviteUser(email, 'user');
      
      // Ajouter l'email aux associés du profil
      if (profile) {
        const currentAssociates = profile.associate_emails || [];
        await base44.entities.OnboardingProfile.update(profile.id, {
          associate_emails: [...currentAssociates, email]
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['onboarding-profile']);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  });

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      inviteMutation.mutate(inviteEmail.trim());
    }
  };

  const associateEmails = profile?.associate_emails || [];
  const filteredAssociates = associateEmails.filter(email => 
    email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMembers = teamMembers.filter(member =>
    member.name?.toLowerCase().includes(search.toLowerCase()) ||
    member.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalTeamSize = associateEmails.length + teamMembers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion d'équipe</h1>
          <p className="text-gray-600 mt-1">Invitez et gérez les membres de votre équipe</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">{totalTeamSize} membre{totalTeamSize > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter un membre
        </Button>
      </div>

      {/* Formulaire d'invitation */}
      {showInviteForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <form onSubmit={handleInvite} className="flex gap-3">
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-white"
                required
              />
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? 'Envoi...' : 'Envoyer invitation'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowInviteForm(false);
                  setInviteEmail('');
                }}
              >
                Annuler
              </Button>
            </form>
            <p className="text-xs text-blue-700 mt-2">
              L'utilisateur recevra un email d'invitation pour rejoindre votre groupe
            </p>
          </CardContent>
        </Card>
      )}

      {/* Associés invités */}
      {filteredAssociates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Associés et managers</h2>
          <div className="grid gap-4">
            {filteredAssociates.map((email, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">Membre invité</h3>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Associé</Badge>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3" />
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Membres de l'équipe (TeamMember) */}
      {filteredMembers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Équipe opérationnelle</h2>
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {member.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            {member.role}
                          </Badge>
                          {member.status === 'active' && (
                            <Badge className="bg-green-100 text-green-700 text-xs">Actif</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {member.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </span>
                          )}
                          {member.restaurant_id && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              Restaurant assigné
                            </span>
                          )}
                          {member.performance_score && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              Performance: {member.performance_score}/100
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* État vide */}
      {filteredAssociates.length === 0 && filteredMembers.length === 0 && !search && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun membre d'équipe
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par inviter des managers ou des membres de votre équipe
            </p>
            <Button 
              onClick={() => setShowInviteForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter le premier membre
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Résultat de recherche vide */}
      {filteredAssociates.length === 0 && filteredMembers.length === 0 && search && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Aucun résultat pour "{search}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}