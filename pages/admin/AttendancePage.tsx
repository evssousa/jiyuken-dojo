import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import type { Student, MartialArt } from '../../types';

interface AttendancePageProps {
  students: Student[];
  martialArts: MartialArt[];
  onMarkAttendance: (studentId: number, martialArtId: number, date: string) => void;
  onBackToDashboard: () => void;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ students, martialArts, onMarkAttendance, onBackToDashboard }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMartialArtId, setSelectedMartialArtId] = useState<number | null>(martialArts[0]?.id || null);

  const filteredStudents = useMemo(() => {
    if (!selectedMartialArtId) return [];
    return students.filter(student => 
        student.status === 'Ativo' && student.graduations.some(g => g.martialArtId === selectedMartialArtId)
    ).sort((a,b) => a.fullName.localeCompare(b.fullName));
  }, [students, selectedMartialArtId]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <button onClick={onBackToDashboard} className="mb-6 text-sm font-semibold text-red-600 hover:text-red-800 flex items-center group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Voltar para o Painel
      </button>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-heading tracking-wider text-gray-900">Registrar Frequência</h2>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <label htmlFor="attendance-date" className="block text-sm font-medium leading-6 text-gray-900">Data</label>
            <input 
              type="date" 
              id="attendance-date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="martial-art" className="block text-sm font-medium leading-6 text-gray-900">Arte Marcial</label>
            <select 
              id="martial-art" 
              value={selectedMartialArtId || ''}
              onChange={(e) => setSelectedMartialArtId(parseInt(e.target.value, 10))}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
            >
              {martialArts.map(ma => <option key={ma.id} value={ma.id}>{ma.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-heading tracking-wider text-gray-800 mb-4">Alunos Inscritos</h3>
          {selectedMartialArtId ? (
            <ul className="divide-y divide-gray-200">
              {filteredStudents.length > 0 ? filteredStudents.map(student => {
                const isPresent = student.attendance.some(a => a.date === selectedDate && a.martialArtId === selectedMartialArtId);
                return (
                  <li key={student.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover" src={student.photo || `https://i.pravatar.cc/150?u=${student.id}`} alt={student.fullName} />
                      <span className="ml-4 text-sm font-medium text-gray-900">{student.fullName}</span>
                    </div>
                    {isPresent ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Presente
                      </span>
                    ) : (
                      <button 
                        onClick={() => onMarkAttendance(student.id, selectedMartialArtId, selectedDate)}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Marcar Presença
                      </button>
                    )}
                  </li>
                )
              }) : <p className="text-sm text-gray-500 italic">Nenhum aluno ativo inscrito nesta arte marcial.</p>}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">Selecione uma arte marcial para ver a lista de alunos.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AttendancePage;
