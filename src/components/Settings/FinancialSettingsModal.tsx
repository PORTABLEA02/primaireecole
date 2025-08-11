import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Smartphone, Building, Plus, Trash2 } from 'lucide-react';

interface FinancialSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: FinancialSettings) => void;
}

interface FeeType {
  id: string;
  name: string;
  amount: number;
  level: string;
  mandatory: boolean;
  description: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'mobile' | 'bank';
  enabled: boolean;
  fees: number;
  config: Record<string, any>;
}

interface FinancialSettings {
  currency: string;
  feeTypes: FeeType[];
  paymentMethods: PaymentMethod[];
  lateFeePercentage: number;
  scholarshipPercentage: number;
  installmentOptions: string[];
}

const FinancialSettingsModal: React.FC<FinancialSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [settings, setSettings] = useState<FinancialSettings>({
    currency: 'FCFA',
    lateFeePercentage: 5,
    scholarshipPercentage: 10,
    installmentOptions: ['Paiement unique', '2 tranches', '3 tranches'],
    feeTypes: [
      {
        id: '1',
        name: 'Frais de scolarité',
        amount: 400000,
        level: 'CE2',
        mandatory: true,
        description: 'Frais annuels de scolarité'
      },
      {
        id: '2',
        name: 'Frais d\'inscription',
        amount: 50000,
        level: 'Tous',
        mandatory: true,
        description: 'Frais d\'inscription annuelle'
      },
      {
        id: '3',
        name: 'Frais de cantine',
        amount: 25000,
        level: 'Tous',
        mandatory: false,
        description: 'Frais de restauration scolaire'
      },
      {
        id: '4',
        name: 'Frais de transport',
        amount: 15000,
        level: 'Tous',
        mandatory: false,
        description: 'Transport scolaire'
      }
    ],
    paymentMethods: [
      {
        id: '1',
        name: 'Espèces',
        type: 'cash',
        enabled: true,
        fees: 0,
        config: {}
      },
      {
        id: '2',
        name: 'Orange Money',
        type: 'mobile',
        enabled: true,
        fees: 1.5,
        config: {
          merchantCode: 'ECO001',
          apiKey: '***hidden***'
        }
      },
      {
        id: '3',
        name: 'Moov Money',
        type: 'mobile',
        enabled: true,
        fees: 1.2,
        config: {
          merchantId: 'MOOV_ECO_001',
          secretKey: '***hidden***'
        }
      },
      {
        id: '4',
        name: 'Virement Bancaire',
        type: 'bank',
        enabled: true,
        fees: 0.5,
        config: {
          bankAccount: 'ML033 1234 5678 9012 3456 789',
          bankName: 'Banque de l\'Habitat du Mali'
        }
      }
    ]
  });

  const [newFeeType, setNewFeeType] = useState({
    name: '',
    amount: 0,
    level: 'Tous',
    mandatory: false,
    description: ''
  });

  const [showAddFee, setShowAddFee] = useState(false);

  const levels = ['Tous', 'Maternelle', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  const addFeeType = () => {
    if (newFeeType.name && newFeeType.amount > 0) {
      const feeType: FeeType = {
        id: Date.now().toString(),
        ...newFeeType
      };
      
      setSettings(prev => ({
        ...prev,
        feeTypes: [...prev.feeTypes, feeType]
      }));
      
      setNewFeeType({
        name: '',
        amount: 0,
        level: 'Tous',
        mandatory: false,
        description: ''
      });
      
      setShowAddFee(false);
    }
  };

  const removeFeeType = (feeId: string) => {
    setSettings(prev => ({
      ...prev,
      feeTypes: prev.feeTypes.filter(f => f.id !== feeId)
    }));
  };

  const updatePaymentMethod = (methodId: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(method =>
        method.id === methodId ? { ...method, [field]: value } : method
      )
    }));
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'cash': return DollarSign;
      case 'mobile': return Smartphone;
      case 'bank': return Building;
      default: return CreditCard;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Paramètres Financiers</h2>
                <p className="text-gray-600">Configuration des frais et méthodes de paiement</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Paramètres généraux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Paramètres Généraux</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="FCFA">FCFA (Franc CFA)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pénalité de retard (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={settings.lateFeePercentage}
                  onChange={(e) => setSettings(prev => ({ ...prev, lateFeePercentage: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux de bourse max (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.scholarshipPercentage}
                  onChange={(e) => setSettings(prev => ({ ...prev, scholarshipPercentage: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Types de frais */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Types de Frais</h3>
              <button
                type="button"
                onClick={() => setShowAddFee(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter Frais</span>
              </button>
            </div>

            {/* Formulaire d'ajout */}
            {showAddFee && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-4">Nouveau Type de Frais</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Frais *
                    </label>
                    <input
                      type="text"
                      value={newFeeType.name}
                      onChange={(e) => setNewFeeType(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant (FCFA) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newFeeType.amount}
                      onChange={(e) => setNewFeeType(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau Concerné
                    </label>
                    <select
                      value={newFeeType.level}
                      onChange={(e) => setNewFeeType(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mandatory"
                      checked={newFeeType.mandatory}
                      onChange={(e) => setNewFeeType(prev => ({ ...prev, mandatory: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="mandatory" className="text-sm font-medium text-gray-700">
                      Frais obligatoire
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newFeeType.description}
                    onChange={(e) => setNewFeeType(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={addFeeType}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFee(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Liste des frais */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settings.feeTypes.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800">{fee.name}</p>
                          <p className="text-sm text-gray-500">{fee.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {fee.amount.toLocaleString()} FCFA
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          {fee.level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          fee.mandatory 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {fee.mandatory ? 'Obligatoire' : 'Optionnel'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeFeeType(fee.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Méthodes de Paiement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.paymentMethods.map((method) => {
                const Icon = getPaymentMethodIcon(method.type);
                
                return (
                  <div key={method.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-800">{method.name}</span>
                      </div>
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={method.enabled}
                          onChange={(e) => updatePaymentMethod(method.id, 'enabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Activé</span>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frais de transaction (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={method.fees}
                          onChange={(e) => updatePaymentMethod(method.id, 'fees', parseFloat(e.target.value) || 0)}
                          disabled={!method.enabled}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>

                      {method.type === 'mobile' && (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Code Marchand
                            </label>
                            <input
                              type="text"
                              value={method.config.merchantCode || method.config.merchantId || ''}
                              onChange={(e) => updatePaymentMethod(method.id, 'config', {
                                ...method.config,
                                [method.config.merchantCode ? 'merchantCode' : 'merchantId']: e.target.value
                              })}
                              disabled={!method.enabled}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      )}

                      {method.type === 'bank' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Compte Bancaire
                          </label>
                          <input
                            type="text"
                            value={method.config.bankAccount || ''}
                            onChange={(e) => updatePaymentMethod(method.id, 'config', {
                              ...method.config,
                              bankAccount: e.target.value
                            })}
                            disabled={!method.enabled}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialSettingsModal;