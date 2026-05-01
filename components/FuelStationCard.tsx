
import React from 'react';
import { FuelStation, FuelStatus } from '../types';

interface Props {
  station: FuelStation;
}

const StatusBadge = ({ status, label }: { status: FuelStatus, label: string }) => {
  const configs = {
    [FuelStatus.AVAILABLE]: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', msg: 'Disponível' },
    [FuelStatus.LOW]: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', msg: 'Pouco Stock' },
    [FuelStatus.UNAVAILABLE]: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', msg: 'Esgotado' }
  };

  const config = configs[status];

  return (
    <div className={`flex flex-col gap-1 p-2 rounded-lg ${config.bg} border border-opacity-20`}>
      <span className="text-[10px] uppercase font-bold text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></div>
        <span className={`text-sm font-semibold ${config.text}`}>{config.msg}</span>
      </div>
    </div>
  );
};

export const FuelStationCard: React.FC<Props> = ({ station }) => {
  const formattedDate = new Date(station.lastUpdated).toLocaleTimeString('pt-AO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-[#0c3a4a]">{station.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {station.neighborhood}
          </p>
        </div>
        <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-medium">
          Atualizado às {formattedDate}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatusBadge status={station.gasolineStatus} label="Gasolina" />
        <StatusBadge status={station.dieselStatus} label="Gasóleo" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">{station.contact}</span>
        <button className="text-[#08677a] text-sm font-medium hover:underline">
          Ver no Mapa
        </button>
      </div>
    </div>
  );
};
