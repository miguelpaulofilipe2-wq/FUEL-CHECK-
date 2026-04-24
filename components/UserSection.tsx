
import React, { useState, useEffect } from 'react';
import { FuelStation, FuelStatus } from '../types';
import { FuelStationCard } from './FuelStationCard';
import { SOYO_NEIGHBORHOODS } from '../constants';
import { getFuelAdvisor } from '../services/geminiService';

interface Props {
  stations: FuelStation[];
}

export const UserSection: React.FC<Props> = ({ stations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [advisorMsg, setAdvisorMsg] = useState('');
  const [isLoadingAdvisor, setIsLoadingAdvisor] = useState(false);

  const filteredStations = stations.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNeighborhood = selectedNeighborhood === 'Todos' || s.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesNeighborhood;
  });

  const askAdvisor = async () => {
    setIsLoadingAdvisor(true);
    const msg = await getFuelAdvisor(stations, "Onde tem gasolina disponível agora?");
    setAdvisorMsg(msg);
    setIsLoadingAdvisor(false);
  };

  return (
    <div className="space-y-6">
      <header className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="Pesquisar posto ou bairro..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#08677a] focus:border-transparent transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#08677a] outline-none bg-white"
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
          >
            <option value="Todos">Todos os Bairros</option>
            {SOYO_NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </header>

      {/* AI Advisor Card */}
      <div className="bg-gradient-to-r from-[#08677a] to-[#0c3a4a] p-5 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <div>
            <h4 className="font-bold">Assistente Fuel Check</h4>
            <p className="text-xs text-white/70">Sugestões inteligentes baseadas no stock real.</p>
          </div>
        </div>
        {advisorMsg ? (
          <div className="bg-white/10 p-3 rounded-xl text-sm leading-relaxed mb-3">
            {advisorMsg}
          </div>
        ) : null}
        <button 
          onClick={askAdvisor}
          disabled={isLoadingAdvisor}
          className="w-full bg-[#22c55e] hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-colors text-sm"
        >
          {isLoadingAdvisor ? 'Consultando...' : 'Onde abastecer agora?'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <FuelStationCard key={station.id} station={station} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="text-gray-400 mb-2">Nenhum posto encontrado para esta busca.</div>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedNeighborhood('Todos');}}
              className="text-[#08677a] font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
