
import React from 'react';
import { FuelStation, FuelStatus } from '../types';

interface Props {
  station: FuelStation;
}

const StatusBadge = ({ status, label }: { status: FuelStatus, label: string }) => {
  const configs = {
    [FuelStatus.AVAILABLE]: { bg: 'bg-[#0f2d1f]', text: 'text-green-400', dot: 'bg-green-500', msg: 'Disponível' },
    [FuelStatus.LOW]: { bg: 'bg-[#3b2d10]', text: 'text-yellow-400', dot: 'bg-yellow-500', msg: 'Pouco Stock' },
    [FuelStatus.UNAVAILABLE]: { bg: 'bg-[#3b1212]', text: 'text-red-400', dot: 'bg-red-500', msg: 'Esgotado' }
  };

  const config = configs[status];

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-2xl ${config.bg} border border-white/5`}>
      <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-[0_0_8px_rgba(34,197,94,0.5)]`}></div>
        <span className={`text-sm font-bold ${config.text}`}>{config.msg}</span>
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
    <div className="bg-[#121212] rounded-[32px] shadow-2xl border border-white/5 p-6 hover:border-[#08677a]/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black text-white group-hover:text-[#08677a] transition-colors">{station.name}</h3>
          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {station.neighborhood}
          </p>
        </div>
        <span className="text-[10px] bg-white/5 text-gray-500 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
          Atualizado às {formattedDate}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatusBadge status={station.gasolineStatus} label="Gasolina" />
        <StatusBadge status={station.dieselStatus} label="Gasóleo" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs font-medium text-gray-500 tracking-tight">{station.contact}</span>
        <button className="text-cyan-400 text-sm font-black hover:text-cyan-300 transition-colors">
          Ver no Mapa
        </button>
      </div>
    </div>
  );
};
