import React, { useState } from 'react';
import Card from '../../components/common/Card';
import type { MartialArt, AllRanks as AllRanksEnum } from '../../types';
import { ALL_RANKS, MAX_DEGREES } from '../../constants';

interface MartialArtManagementPageProps {
  martialArts: MartialArt[];
  onAddMartialArt: (martialArt: Omit<MartialArt, 'id'>) => void;
  onDeleteMartialArt: (martialArtId: number) => void;
  onBackToDashboard: () => void;
}

const MartialArtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const MartialArtManagementPage: React.FC<MartialArtManagementPageProps> = ({ martialArts, onAddMartialArt, onDeleteMartialArt, onBackToDashboard }) => {
  const [name, setName] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<AllRanksEnum[]>([]);
  const [otherRanks, setOtherRanks] = useState('');
  const [usesDegrees, setUsesDegrees] = useState(true);
  const [maxDegrees, setMaxDegrees] = useState(4);
  const [promotionReqs, setPromotionReqs] = useState<Record<string, number>>({});
  
  const handleRankChange = (rank: AllRanksEnum) => {
    setSelectedRanks(prev => 
        prev.includes(rank) ? prev.filter(r => r !== rank) : [...prev, rank]
    );
  };
  
  const handleReqChange = (rank: string, value: string) => {
    setPromotionReqs(prev => ({
        ...prev,
        [rank]: parseInt(value, 10) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customRanks = otherRanks.split(',').map(r => r.trim()).filter(Boolean);
    const finalRanks = [...new Set([...selectedRanks, ...customRanks])];

    if (name.trim() && finalRanks.length > 0) {
      const finalPromotionReqs: Record<string, number> = {};
      finalRanks.forEach(rank => {
          finalPromotionReqs[rank] = promotionReqs[rank] || 0;
      });

      onAddMartialArt({
          name: name.trim(),
          ranks: finalRanks,
          usesDegrees,
          maxDegrees,
          promotionRequirements: finalPromotionReqs,
      });
      // Reset form
      setName('');
      setSelectedRanks([]);
      setOtherRanks('');
      setUsesDegrees(true);
      setMaxDegrees(4);
      setPromotionReqs({});
    }
  };
  
  const combinedRanks = [...new Set([...selectedRanks, ...otherRanks.split(',').map(r => r.trim()).filter(Boolean)])];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
      <button onClick={onBackToDashboard} className="mb-6 text-sm font-semibold text-red-600 hover:text-red-800 flex items-center group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Voltar para o Painel
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading tracking-wider text-gray-900">Gerenciar Artes Marciais</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-heading tracking-wider text-gray-800 mb-4">Adicionar Nova Arte Marcial</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="artName" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
              <input 
                type="text" 
                id="artName" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                placeholder="Ex: Muay Thai"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Faixas Padrão</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_RANKS.map(rank => (
                    <div key={rank} className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id={`rank-${rank}`}
                                name={`rank-${rank}`}
                                type="checkbox"
                                checked={selectedRanks.includes(rank as AllRanksEnum)}
                                onChange={() => handleRankChange(rank as AllRanksEnum)}
                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                            />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor={`rank-${rank}`} className="font-medium text-gray-900">{rank}</label>
                        </div>
                    </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="otherRanks" className="block text-sm font-medium leading-6 text-gray-900">Outras Faixas (separadas por vírgula)</label>
              <input 
                type="text" 
                id="otherRanks" 
                value={otherRanks} 
                onChange={(e) => setOtherRanks(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                placeholder="Ex: Roxa Escuro, Coral"
              />
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
               <h4 className="text-base font-medium text-gray-900">Requisitos de Promoção por Faixa</h4>
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {combinedRanks.length > 0 ? combinedRanks.map(rank => (
                    <div key={rank} className="grid grid-cols-3 items-center gap-2">
                         <label htmlFor={`req-${rank}`} className="col-span-1 text-sm font-medium text-gray-700">{rank}</label>
                         <input
                            type="number"
                            id={`req-${rank}`}
                            value={promotionReqs[rank] || ''}
                            onChange={(e) => handleReqChange(rank, e.target.value)}
                            className="col-span-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            placeholder="Nº de aulas"
                         />
                    </div>
                )) : <p className="text-sm text-gray-500 italic">Selecione ou adicione faixas para definir os requisitos.</p>}
               </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-start">
                  <div className="flex h-6 items-center">
                      <input
                          id="usesDegrees"
                          name="usesDegrees"
                          type="checkbox"
                          checked={usesDegrees}
                          onChange={(e) => setUsesDegrees(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                      <label htmlFor="usesDegrees" className="font-medium text-gray-900">Utiliza sistema de Graus?</label>
                  </div>
              </div>
              
              {usesDegrees && (
                  <div className="pl-2 border-l-2 border-gray-200 ml-2">
                    <label htmlFor="maxDegrees" className="block text-sm font-medium leading-6 text-gray-900">Nº de Graus por Faixa</label>
                    <select 
                      id="maxDegrees" 
                      value={maxDegrees} 
                      onChange={(e) => setMaxDegrees(parseInt(e.target.value, 10))}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      {MAX_DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      A quantidade de aulas por faixa será dividida pelo número de graus + 1 (para a troca de faixa), com o resultado arredondado para baixo.
                    </p>
                  </div>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Adicionar Arte Marcial
            </button>
          </form>
        </Card>

        <Card>
          <h3 className="text-xl font-heading tracking-wider text-gray-800 mb-4">Artes Marciais Cadastradas</h3>
          {martialArts.length > 0 ? (
            <ul className="space-y-3">
              {martialArts.map((art) => (
                <li key={art.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <MartialArtIcon />
                      <span className="ml-3 text-sm font-medium text-gray-800 truncate">{art.name}</span>
                    </div>
                    <div className="flex items-center flex-shrink-0 ml-4">
                      <span className="text-xs font-semibold text-gray-500 mr-4">{art.usesDegrees ? `${art.maxDegrees} Grau(s)` : 'Sem Graus'}</span>
                       <button 
                        onClick={() => {
                          if(window.confirm(`Tem certeza que deseja excluir "${art.name}"? Esta ação também removerá esta graduação de todos os alunos.`)) {
                             onDeleteMartialArt(art.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-150"
                        aria-label={`Excluir ${art.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 pl-8 text-xs text-gray-600">
                    <p><span className="font-semibold">Faixas: </span>{art.ranks.join(', ')}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhuma arte marcial cadastrada.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MartialArtManagementPage;