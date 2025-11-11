import React, { useMemo } from 'react';
import type { Student, MartialArt, StudentGraduation } from '../../types';
import StatCard from '../../components/common/StatCard';
import { getRankColorStyle } from '../../utils/colorUtils';

interface AdminDashboardProps {
  students: Student[];
  martialArts: MartialArt[];
  onRegisterNew: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: number) => void;
  onManageDojos: () => void;
  onManageMartialArts: () => void;
  onManageAttendance: () => void;
  onPromoteStudent: (studentId: number, martialArtId: number) => void;
}

// Helper function to determine payment status
const getPaymentStatus = (student: Student, today: Date): 'Em dia' | 'Pendente' | 'N/A' => {
  if (student.status !== 'Ativo') return 'N/A';

  const enrollmentDate = new Date(student.enrollmentDate);
  
  // If enrollment was in the current month and year, they are paid up for this month.
  if (enrollmentDate.getFullYear() === today.getFullYear() && enrollmentDate.getMonth() === today.getMonth()) {
      return 'Em dia';
  }

  const enrollmentDay = enrollmentDate.getDate();
  const currentDay = today.getDate();
  
  // If current day is on or after their enrollment day, payment for this month is due.
  if (currentDay >= enrollmentDay) {
      return 'Pendente';
  }

  // Otherwise, they are paid up for this month.
  return 'Em dia';
};


// SVG Icons for the dashboard
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.78-4.125a4 4 0 00-6.44 0A6 6 0 003 20v1h12z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const GenderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18V6M6 12h12" /></svg>;
const DojoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const BirthdayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM19.5 15.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM14.25 8.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM12 3.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V3.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM9.75 8.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM9.75 12.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM15 12.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 7.5v9.75A2.25 2.25 0 004.5 19.5z" /></svg>;
const NewUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>;
const PromotionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
const PaymentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-2.25a.75.75 0 01.75-.75z" /></svg>;
const MartialArtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>

const AdminDashboard: React.FC<AdminDashboardProps> = ({ students, martialArts, onRegisterNew, onViewStudent, onEditStudent, onDeleteStudent, onManageDojos, onManageMartialArts, onManageAttendance, onPromoteStudent }) => {
  const processedData = useMemo(() => {
    if (!students) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);
    
    const studentsWithPaymentStatus = students.map(s => ({ ...s, paymentStatus: getPaymentStatus(s, today) }));

    const upcomingBirthdays = students.map(student => {
        const birthDate = new Date(student.birthDate);
        const thisYearBirthday = new Date(birthDate.getTime());
        thisYearBirthday.setFullYear(today.getFullYear());

        if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }

        return { student, birthday: thisYearBirthday };
    })
    .filter(({ birthday }) => birthday >= today && birthday <= in30Days)
    .sort((a, b) => a.birthday.getTime() - b.birthday.getTime())
    .map(({ student, birthday }) => ({
        id: student.id,
        fullName: student.fullName,
        photo: student.photo,
        date: birthday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }));

    const paymentsDue = studentsWithPaymentStatus.filter(s => s.paymentStatus === 'Pendente');

    const promotableStudents: { student: Student, martialArt: MartialArt, currentGraduation: StudentGraduation }[] = [];

    students.forEach(student => {
        if (student.status !== 'Ativo') return;

        student.graduations.forEach(grad => {
            const martialArt = martialArts.find(ma => ma.id === grad.martialArtId);
            if (!martialArt) return;

            const currentRankIndex = martialArt.ranks.indexOf(grad.rank);
            const isAtMaxRank = currentRankIndex === martialArt.ranks.length - 1;
            const isAtMaxDegree = martialArt.usesDegrees && grad.degree === martialArt.maxDegrees;

            if (isAtMaxRank && (!martialArt.usesDegrees || isAtMaxDegree)) {
                return; // Already at the highest possible promotion
            }

            const attendedClassesSincePromotion = student.attendance.filter(a => 
                a.martialArtId === grad.martialArtId && new Date(a.date) > new Date(grad.promotionDate)
            ).length;

            const requiredClassesForRank = martialArt.promotionRequirements[grad.rank] || 0;
            if(requiredClassesForRank === 0) return;

            let requiredClassesForNextStep = requiredClassesForRank;

            if (martialArt.usesDegrees) {
                const classesPerDegree = Math.floor(requiredClassesForRank / (martialArt.maxDegrees + 1));
                requiredClassesForNextStep = classesPerDegree;
            }

            if (attendedClassesSincePromotion >= requiredClassesForNextStep) {
                promotableStudents.push({
                    student: student,
                    martialArt: martialArt,
                    currentGraduation: grad
                });
            }
        });
    });


    return {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'Ativo').length,
        maleStudents: students.filter(s => s.gender === 'Masculino').length,
        femaleStudents: students.filter(s => s.gender === 'Feminino').length,
        dojoCounts: students.reduce((acc, { dojo }) => { acc[dojo] = (acc[dojo] || 0) + 1; return acc; }, {} as Record<string, number>),
        upcomingBirthdays,
        paymentsDue,
        latestEnrollments: [...students].sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()).slice(0, 5),
        studentsWithPaymentStatus,
        promotableStudents,
    };
  }, [students, martialArts]);

  if (!processedData) return null; // Or a loading state
  
  const paymentStatusColors: Record<string, string> = {
    'Em dia': 'bg-green-100 text-green-800',
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'N/A': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-heading tracking-wider text-gray-900">Painel do Administrador</h2>
        <div className="flex items-center gap-x-4 flex-wrap gap-y-2">
           <button
            onClick={onManageAttendance}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out flex items-center shadow-sm border border-gray-300"
          >
            <CalendarIcon />
            <span className="ml-2">Registrar Frequência</span>
          </button>
           <button
            onClick={onManageMartialArts}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out flex items-center shadow-sm border border-gray-300"
          >
            <MartialArtIcon />
            <span className="ml-2">Artes Marciais</span>
          </button>
          <button
            onClick={onManageDojos}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out flex items-center shadow-sm border border-gray-300"
          >
            <DojoIcon />
            <span className="ml-2">Dojos</span>
          </button>
          <button
            onClick={onRegisterNew}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            <span>Cadastrar Aluno</span>
          </button>
        </div>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total de Alunos" icon={<UsersIcon />}><p className="text-4xl font-bold text-gray-800">{processedData.totalStudents}</p></StatCard>
          <StatCard title="Status" icon={<CheckCircleIcon />}>
              <div className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-lg font-semibold text-green-700">Ativos</span><span className="text-2xl font-bold text-gray-800">{processedData.activeStudents}</span></div>
                  <div className="flex justify-between items-center"><span className="text-lg font-semibold text-red-700">Inativos</span><span className="text-2xl font-bold text-gray-800">{processedData.totalStudents - processedData.activeStudents}</span></div>
              </div>
          </StatCard>
          <StatCard title="Gênero" icon={<GenderIcon />}>
              <div className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-lg font-semibold text-blue-700">Masculino</span><span className="text-2xl font-bold text-gray-800">{processedData.maleStudents}</span></div>
                  <div className="flex justify-between items-center"><span className="text-lg font-semibold text-pink-700">Feminino</span><span className="text-2xl font-bold text-gray-800">{processedData.femaleStudents}</span></div>
              </div>
          </StatCard>
          <StatCard title="Dojos" icon={<DojoIcon />}>
              {Object.keys(processedData.dojoCounts).length > 0 ? Object.entries(processedData.dojoCounts).map(([dojo, count]) => <div key={dojo} className="flex justify-between text-sm"><span className="text-gray-600">{dojo}</span><span className="font-bold text-gray-800">{count}</span></div>) : <p className="text-sm text-gray-500 italic">Nenhum dojo registrado.</p>}
          </StatCard>
          <StatCard title="Próximos Aniversários" icon={<BirthdayIcon />} className="sm:col-span-2 lg:col-span-4">
              {processedData.upcomingBirthdays.length > 0 ? <ul className="space-y-2">{processedData.upcomingBirthdays.map((b) => <li key={b.id} className="flex justify-between items-center text-sm"><div className="flex items-center min-w-0"><img src={b.photo || `https://i.pravatar.cc/150?u=${b.id}`} className="w-6 h-6 rounded-full mr-2 flex-shrink-0" alt={b.fullName}/><span className="text-gray-600 truncate">{b.fullName}</span></div><span className="font-semibold text-gray-800 flex-shrink-0 ml-2">{b.date}</span></li>)}</ul> : <p className="text-sm text-gray-500 italic">Nenhum aniversário nos próximos 30 dias.</p>}
          </StatCard>
          
          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Mensalidades Pendentes" icon={<PaymentIcon />}>
              {processedData.paymentsDue.length > 0 ? <ul className="space-y-2">{processedData.paymentsDue.map(s => <li key={s.id} className="flex justify-between items-center text-sm"><span className="text-gray-600 truncate">{s.fullName}</span><span className="font-semibold text-yellow-600 text-xs flex-shrink-0 ml-2">Pendente</span></li>)}</ul> : <p className="text-sm text-gray-500 italic">Nenhuma mensalidade pendente.</p>}
            </StatCard>
            <StatCard title="Últimas Matrículas" icon={<NewUserIcon />}>
                {processedData.latestEnrollments.length > 0 ? <ul className="space-y-2">{processedData.latestEnrollments.map(s => <li key={s.id} className="flex justify-between items-center text-sm"><div className="flex items-center"><img src={s.photo || `https://i.pravatar.cc/150?u=${s.id}`} className="w-6 h-6 rounded-full mr-2" alt={s.fullName}/><span className="text-gray-600 truncate">{s.fullName}</span></div><span className="font-semibold text-gray-500 text-xs flex-shrink-0 ml-2">{new Date(s.enrollmentDate).toLocaleDateString('pt-BR')}</span></li>)}</ul> : <p className="text-sm text-gray-500 italic">Nenhum aluno matriculado recentemente.</p>}
            </StatCard>
            <StatCard title="Alunos Prontos para Graduação" icon={<PromotionIcon />}>
              {processedData.promotableStudents.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {processedData.promotableStudents.map(({ student, martialArt, currentGraduation }) => (
                    <li key={`${student.id}-${martialArt.id}`} className="flex items-center justify-between p-2 rounded-md bg-gray-50/75 border border-gray-200">
                      <div className="flex items-center min-w-0">
                        <img src={student.photo || `https://i.pravatar.cc/150?u=${student.id}`} className="w-8 h-8 rounded-full mr-3 flex-shrink-0" alt={student.fullName}/>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{student.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {martialArt.name}: {currentGraduation.rank} {martialArt.usesDegrees ? `(${currentGraduation.degree}º G)` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onPromoteStudent(student.id, martialArt.id)}
                        className="ml-4 flex-shrink-0 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                      >
                        Graduar
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhum aluno atingiu os requisitos para a próxima graduação.</p>
              )}
            </StatCard>
          </div>
      </div>


      <h3 className="text-2xl font-heading tracking-wider text-gray-800 mb-4 mt-10">Lista de Alunos</h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Dojo</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Graduações</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mensalidade</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedData.studentsWithPaymentStatus.length > 0 ? (
                processedData.studentsWithPaymentStatus.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={student.photo || `https://i.pravatar.cc/150?u=${student.id}`} alt={student.fullName} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                        <div className="text-sm text-gray-500">@{student.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.dojo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <div className="flex flex-col space-y-1">
                      {martialArts.map(ma => {
                        const grad = student.graduations.find(g => g.martialArtId === ma.id);
                        return (
                          <div key={ma.id} className="flex items-center">
                            <span className="font-semibold w-10">{ma.name.substring(0, 3).toUpperCase()}:</span>
                            {grad ? (
                              <div className="flex items-center ml-1">
                                <span
                                  className="inline-block w-3 h-3 rounded-sm mr-2"
                                  style={getRankColorStyle(grad.rank)}
                                ></span>
                                <span>{grad.rank} {ma.usesDegrees ? `(${grad.degree}º G)` : ''}</span>
                              </div>
                            ) : (
                              <span className="ml-2">-</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[student.paymentStatus]}`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja excluir o aluno ${student.fullName}? Esta ação não pode ser desfeita.`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="font-semibold text-gray-500 hover:text-red-700 transition-colors duration-150"
                    >
                      Excluir
                    </button>
                    <button onClick={() => onEditStudent(student)} className="font-semibold text-gray-600 hover:text-gray-900 transition-colors duration-150">Editar</button>
                    <button onClick={() => onViewStudent(student)} className="font-semibold text-red-600 hover:text-red-800 transition-colors duration-150">Ver Detalhes</button>
                  </td>
                </tr>
              ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum aluno cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;