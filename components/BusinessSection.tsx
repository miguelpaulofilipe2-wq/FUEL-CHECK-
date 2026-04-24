
import React, { useState } from 'react';
import { FuelStation, FuelStatus, BusinessOwner } from '../types';

interface Props {
  owner: BusinessOwner;
  stations: FuelStation[];
  onUpdateStation: (stationId: string, gasoline: FuelStatus, diesel: FuelStatus) => void;
  onLogout: () => void;
}

export const BusinessSection: React.FC<Props> = ({ owner, stations, onUpdateStation, onLogout }) => {
  // Simulate managing only stations belonging to this owner's neighborhood/name for demo
  const myStations = stations.filter(s => s.neighborhood === owner.neighborhood);

  const StatusSelector = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string, 
    value: FuelStatus, 
    onChange: (s: FuelStatus) => void 
  }) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="grid grid-cols-3 gap-2">
        {(Object.values(FuelStatus) as FuelStatus[]).map((status) => {
          const isActive = value === status;
          const colors = {
            [FuelStatus.AVAILABLE]: isActive ? 'bg-green-600 border-green-700 text-white' : 'bg-green-50 text-green-700 border-green-200',
            [FuelStatus.LOW]: isActive ? 'bg-yellow-500 border-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
            [FuelStatus.UNAVAILABLE]: isActive ? 'bg-red-600 border-red-700 text-white' : 'bg-red-50 text-red-700 border-red-200'
          };
          const labels = {
            [FuelStatus.AVAILABLE]: 'Sim',
            [FuelStatus.LOW]: 'Baixo',
            [FuelStatus.UNAVAILABLE]: 'Não'
          };

          return (
            <button
              key={status}
              onClick={() => onChange(status)}
              className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all ${colors[status]}`}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#0c3a4a]">Painel de Gestão</h2>
          <p className="text-sm text-gray-500">Olá, {owner.fullName} ({owner.companyName})</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-red-500 text-sm font-semibold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 flex items-center gap-2">
             <svg className="w-5 h-5 text-[#08677a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             Meus Dados
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">NIF</span>
              <span className="font-medium">{owner.nif}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">BI</span>
              <span className="font-medium">{owner.biNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Telefone</span>
              <span className="font-medium">{owner.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Localidade</span>
              <span className="font-medium">{owner.neighborhood}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold px-2 flex items-center gap-2">
             <svg className="w-5 h-5 text-[#08677a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             Atualizar Disponibilidade
          </h3>
          {myStations.length > 0 ? myStations.map(station => (
            <div key={station.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#0c3a4a]">{station.name}</span>
                <span className="text-[10px] text-gray-400 uppercase">Última: {new Date(station.lastUpdated).toLocaleTimeString()}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatusSelector 
                  label="Gasolina" 
                  value={station.gasolineStatus} 
                  onChange={(val) => onUpdateStation(station.id, val, station.dieselStatus)}
                />
                <StatusSelector 
                  label="Gasóleo" 
                  value={station.dieselStatus} 
                  onChange={(val) => onUpdateStation(station.id, station.gasolineStatus, val)}
                />
              </div>
            </div>
          )) : (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
              Nenhuma bomba vinculada a este perfil.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
