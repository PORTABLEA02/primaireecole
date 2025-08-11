import React, { useState } from 'react';
import { Calendar, ChevronDown, Plus, Archive } from 'lucide-react';
import { useAcademicYear } from '../../contexts/AcademicYearContext';

const AcademicYearSelector: React.FC = () => {
  const { currentAcademicYear, availableYears, setCurrentAcademicYear, addAcademicYear } = useAcademicYear();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState('');

  const handleAddYear = () => {
    if (newYear && !availableYears.includes(newYear)) {
      addAcademicYear(newYear);
      setNewYear('');
      setShowAddYear(false);
    }
  };

  const generateNextYear = () => {
    const currentYear = parseInt(currentAcademicYear.split('-')[0]);
    const nextYear = `${currentYear + 1}-${currentYear + 2}`;
    setNewYear(nextYear);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Calendar className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-800">{currentAcademicYear}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* Années disponibles */}
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                Années Scolaires
              </div>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setCurrentAcademicYear(year);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    currentAcademicYear === year ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{year}</span>
                  {currentAcademicYear === year && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  setShowAddYear(true);
                  generateNextYear();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-blue-600"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Année</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-gray-600"
              >
                <Archive className="h-4 w-4" />
                <span>Archiver Année</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal d'ajout d'année */}
      {showAddYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Nouvelle Année Scolaire</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année Scolaire
                </label>
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="Ex: 2025-2026"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Cette nouvelle année scolaire sera créée avec une base de données vierge. 
                  Vous pourrez ensuite y ajouter les élèves, classes et enseignants.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddYear(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddYear}
                disabled={!newYear}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYearSelector;