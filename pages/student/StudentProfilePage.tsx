import React from 'react';
import type { Student } from '../../types';
import Card from '../../components/common/Card';

interface StudentProfilePageProps {
  student: Student;
  onBack?: () => void; // Optional back button for admin view
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-gray-900">{value || '-'}</dd>
  </div>
);

const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ student, onBack }) => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      {onBack && (
         <button onClick={onBack} className="mb-6 text-sm font-semibold text-red-600 hover:text-red-800 flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Voltar para o Painel
         </button>
      )}
      <Card className="overflow-hidden p-0">
        <div className="p-6 bg-gray-50/75 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                <img className="h-32 w-32 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6 ring-8 ring-white shadow-lg" src={student.photo || `https://i.pravatar.cc/150?u=${student.id}`} alt={student.fullName} />
                <div className="flex-grow">
                    <h3 className="text-5xl font-heading tracking-wider text-gray-900">{student.fullName}</h3>
                    <p className="mt-1 max-w-2xl text-base text-gray-500">@{student.username}</p>
                    <p className="mt-3">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${student.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {student.status.toUpperCase()}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div>
          <dl>
            <div className="bg-white px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-8">
              <InfoItem label="Data de Nascimento" value={new Date(student.birthDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} />
              <InfoItem label="Sexo" value={student.gender} />
              <InfoItem label="Telefone de Contato" value={student.contactPhone} />
              <InfoItem label="Registro Interno" value={student.internalRegistry} />
              <InfoItem label="Data da Matrícula" value={new Date(student.enrollmentDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <InfoItem label="Dojo" value={student.dojo} />
            </div>

            {student.observations && (
              <div className="bg-gray-50/75 px-6 py-5 border-t border-b border-gray-200">
                <InfoItem label="Observações" value={<p className="whitespace-pre-wrap font-normal text-gray-700">{student.observations}</p>} />
              </div>
            )}
            
            <div className="bg-white p-6">
              <dt className="text-xl font-heading tracking-wider text-gray-800 mb-4">Graduações</dt>
              <dd className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    <p className="font-bold text-gray-200 tracking-wide">Karate Tradicional</p>
                    <p className="text-3xl font-heading text-red-500 my-2 tracking-wider">{student.traditionalKarateRank}</p>
                    <p className="font-semibold text-sm text-gray-400">{student.traditionalKarateDegree}º Grau</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    <p className="font-bold text-gray-200 tracking-wide">Karate de Contato</p>
                    <p className="text-3xl font-heading text-red-500 my-2 tracking-wider">{student.contactKarateRank}</p>
                    <p className="font-semibold text-sm text-gray-400">{student.contactKarateDegree}º Grau</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    <p className="font-bold text-gray-200 tracking-wide">Jiu-Jitsu</p>
                    <p className="text-3xl font-heading text-red-500 my-2 tracking-wider">{student.jiuJitsuRank}</p>
                    <p className="font-semibold text-sm text-gray-400">{student.jiuJitsuDegree}º Grau</p>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfilePage;