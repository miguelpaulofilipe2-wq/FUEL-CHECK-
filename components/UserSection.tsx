
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
      <header className="bg-[#121212] p-4 rounded-3xl border border-white/5 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="relative flex-grow">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="Pesquisar posto ou bairro..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#1e1e1e] border-none text-white focus:ring-2 focus:ring-[#08677a] transition-all outline-none placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
             <select 
                className="w-full px-4 py-4 rounded-2xl bg-[#1e1e1e] border-none text-white focus:ring-2 focus:ring-[#08677a] outline-none appearance-none font-medium"
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
              >
                <option value="Todos">Todos os Bairros</option>
                {SOYO_NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
          </div>
        </div>
      </header>

      {/* AI Advisor Card - Matching Screenshot */}
      <div className="bg-[#004d5a] p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#0c3a4a] p-3 rounded-2xl">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight">Assistente Fuel Check</h4>
            <p className="text-xs text-white/60">Sugestões inteligentes baseadas no stock real.</p>
          </div>
        </div>

        <div className="bg-[#08677a]/50 backdrop-blur-sm p-4 rounded-2xl text-sm font-medium mb-5 border border-white/10 min-h-[50px] flex items-center justify-center">
            {isLoadingAdvisor ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            ) : advisorMsg ? (
              advisorMsg
            ) : (
              <span className="text-white/80">Ocorreu um erro ao consultar o assistente.</span>
            )}
        </div>

        <button 
          onClick={askAdvisor}
          disabled={isLoadingAdvisor}
          className="w-full bg-[#22c55e] hover:bg-green-600 active:scale-[0.98] disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-900/20 uppercase tracking-widest text-xs"
        >
          Onde abastecer agora?
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
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
