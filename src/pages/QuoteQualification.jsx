import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Navbar from '@/components/Navbar';
import { base44 } from '@/api/base44Client';
import { 
        ArrowRight,
        ArrowLeft,
        CheckCircle,
        Shield
      } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function QuoteQualification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    role: '',
    restaurantCount: '',
    establishmentType: '',
    monthlyRevenue: '',
    hasExistingSoftware: '',
    existingSoftwareCost: '',
    investmentBudget: ''
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await base44.integrations.Core.SendEmail({
        to: 'nicolasdelboispro@gmail.com',
        from_name: 'Oplo.ai - Demande de démo',
        subject: `🍽️ Nouvelle demande - ${formData.companyName || formData.firstName}`,
        body: `Nouvelle demande de qualification Oplo.ai reçue :\n\n👤 CONTACT\nNom : ${formData.firstName}\nEmail : ${formData.email}\nTéléphone : ${formData.phone}\n\n🍽️ GROUPE\nNom : ${formData.companyName}\nFonction : ${formData.role}\nNombre de restaurants : ${formData.restaurantCount}\n\n📊 ACTIVITÉ\nType d'établissement : ${formData.establishmentType}\nCA mensuel estimé : ${formData.monthlyRevenue}\n\n💰 INVESTISSEMENT\nLogiciel existant : ${formData.hasExistingSoftware}\nCoût actuel : ${formData.existingSoftwareCost || 'N/A'}\nBudget d'investissement : ${formData.investmentBudget || 'N/A'}`
      });
    } catch (e) {
      // silent fail
    }
    setCurrentStep(5);
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.email && formData.phone;
      case 2:
        return formData.companyName && formData.role && formData.restaurantCount;
      case 3:
        return formData.establishmentType && formData.monthlyRevenue;
      case 4:
        return formData.hasExistingSoftware && 
               (formData.hasExistingSoftware === 'no' ? formData.investmentBudget : formData.existingSoftwareCost);
      default:
        return false;
    }
  };

  const renderStep = () => {
    if (currentStep === 5) {
      return (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Merci pour votre demande !
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe va analyser votre profil et vous recontacter uniquement si celui-ci correspond à notre avatar client idéal.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#3B82F6" opacity="0.4"/>
                <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#2563EB"/>
              </svg>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Nom complet *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="Prénom et nom (ex: Jean Dupont)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Adresse email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Numéro WhatsApp *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="Votre numéro WhatsApp (ex: +33 6 12 34 56 78)"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Parlez-nous de votre établissement
              </h2>
              <p className="text-gray-600">
                Ces informations nous aideront à personnaliser notre offre
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Nom de votre groupe *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="Mon Groupe Restaurant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Votre fonction *</label>
              <select 
                value={formData.role}
                onChange={(e) => updateFormData('role', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Sélectionnez</option>
                <option value="ceo">CEO / Directeur Général</option>
                <option value="operations">Directeur des Opérations</option>
                <option value="finance">Directeur Financier</option>
                <option value="manager">Manager / Responsable</option>
                <option value="owner">Propriétaire</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Combien de restaurants ? *</label>
              <select 
                value={formData.restaurantCount}
                onChange={(e) => updateFormData('restaurantCount', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Sélectionnez</option>
                <option value="1">1 restaurant</option>
                <option value="2-5">2-5 restaurants</option>
                <option value="6-10">6-10 restaurants</option>
                <option value="11-20">11-20 restaurants</option>
                <option value="20+">Plus de 20 restaurants</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Votre activité
              </h2>
              <p className="text-gray-600">
                Pour mieux comprendre votre contexte business
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Type d'établissement *</label>
              <select 
                value={formData.establishmentType}
                onChange={(e) => updateFormData('establishmentType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Sélectionnez</option>
                <option value="casual">Casual Dining</option>
                <option value="fine_dining">Fine Dining</option>
                <option value="fast_casual">Fast Casual</option>
                <option value="bistro">Bistro</option>
                <option value="brasserie">Brasserie</option>
                <option value="cafe">Café / Bar</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Chiffre d'affaires mensuel (estimé) *</label>
              <select 
                value={formData.monthlyRevenue}
                onChange={(e) => updateFormData('monthlyRevenue', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Sélectionnez</option>
                <option value="0-50k">0 - 50 000€</option>
                <option value="50k-100k">50 000€ - 100 000€</option>
                <option value="100k-250k">100 000€ - 250 000€</option>
                <option value="250k-500k">250 000€ - 500 000€</option>
                <option value="500k+">Plus de 500 000€</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Investissement logiciel
              </h2>
              <p className="text-gray-600">
                Dernière étape pour qualifier votre demande
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Avez-vous déjà investi dans un logiciel similaire ? *</label>
              <select 
                value={formData.hasExistingSoftware}
                onChange={(e) => updateFormData('hasExistingSoftware', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Sélectionnez</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>

            {formData.hasExistingSoftware === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Combien payez-vous actuellement ? *</label>
                <select 
                  value={formData.existingSoftwareCost}
                  onChange={(e) => updateFormData('existingSoftwareCost', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Sélectionnez</option>
                  <option value="0-500">Moins de 500€/mois</option>
                  <option value="500-1000">500€ - 1 000€/mois</option>
                  <option value="1000-2500">1 000€ - 2 500€/mois</option>
                  <option value="2500-5000">2 500€ - 5 000€/mois</option>
                  <option value="5000+">Plus de 5 000€/mois</option>
                </select>
              </div>
            )}

            {formData.hasExistingSoftware === 'no' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Combien êtes-vous prêt à investir ? *</label>
                <select 
                  value={formData.investmentBudget}
                  onChange={(e) => updateFormData('investmentBudget', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Sélectionnez</option>
                  <option value="0-500">Moins de 500€/mois</option>
                  <option value="500-1000">500€ - 1 000€/mois</option>
                  <option value="1000-2500">1 000€ - 2 500€/mois</option>
                  <option value="2500-5000">2 500€ - 5 000€/mois</option>
                  <option value="5000+">Plus de 5 000€/mois</option>
                </select>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {currentStep <= totalSteps && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Vérifiez si vous êtes éligible à notre plateforme
              </h1>
            </div>
          )}

          {/* Progress Bar */}
          {currentStep <= totalSteps && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  Étape {currentStep} sur {totalSteps}
                </Badge>
                <span className="text-sm text-gray-500">
                  ~{5 - currentStep} min restantes
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            {renderStep()}

            {/* Navigation Buttons */}
            {currentStep <= totalSteps && (
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentStep === totalSteps ? 'Envoyer ma demande' : 'Continuer'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          {currentStep <= totalSteps && (
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Vos données sont sécurisées et confidentielles</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}