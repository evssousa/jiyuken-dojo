import React, { useState } from 'react';
import Card from '../../components/common/Card';

interface DojoManagementPageProps {
  dojos: string[];
  onAddDojo: (dojoName: string) => void;
  onBackToDashboard: () => void;
}

const DojoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;

const DojoManagementPage: React.FC<DojoManagementPageProps> = ({ dojos, onAddDojo, onBackToDashboard }) => {
  const [newDojo, setNewDojo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDojo.trim()) {
      onAddDojo(newDojo.trim());
      setNewDojo('');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
      <button onClick={onBackToDashboard} className="mb-6 text-sm font-semibold text-red-600 hover:text-red-800 flex items-center group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Voltar para o Painel
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading tracking-wider text-gray-900">Gerenciar Dojos</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add New Dojo Form */}
        <Card>
          <h3 className="text-xl font-heading tracking-wider text-gray-800 mb-4">Adicionar Novo Dojo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="dojoName" className="block text-sm font-medium leading-6 text-gray-900">Nome do Dojo</label>
              <input 
                type="text" 
                id="dojoName" 
                value={newDojo} 
                onChange={(e) => setNewDojo(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                placeholder="Ex: Filial Zona Norte"
              />
            </div>
            <button 
              type="submit" 
              className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Adicionar
            </button>
          </form>
        </Card>

        {/* Dojo List */}
        <Card>
          <h3 className="text-xl font-heading tracking-wider text-gray-800 mb-4">Dojos Cadastrados</h3>
          {dojos.length > 0 ? (
            <ul className="space-y-2">
              {dojos.map((dojo, index) => (
                <li key={index} className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                  <DojoIcon />
                  <span className="ml-3 text-sm font-medium text-gray-700">{dojo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum dojo cadastrado.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DojoManagementPage;
