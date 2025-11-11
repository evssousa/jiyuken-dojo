import React, { useState, useCallback, useEffect } from 'react';
import type { User, Student, MartialArt } from './types';
import { initialStudents, adminUser } from './services/studentService';
import { initialDojos } from './services/dojoService';
import { initialMartialArts } from './services/martialArtService';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RegisterStudentPage from './pages/admin/RegisterStudentPage';
import EditStudentPage from './pages/admin/EditStudentPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import DojoManagementPage from './pages/admin/DojoManagementPage';
import MartialArtManagementPage from './pages/admin/MartialArtManagementPage';
import AttendancePage from './pages/admin/AttendancePage';

type Page = 'login' | 'admin_dashboard' | 'register_student' | 'edit_student' | 'student_profile' | 'admin_view_student' | 'admin_dojos' | 'admin_martial_arts' | 'admin_attendance';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [dojos, setDojos] = useState<string[]>(initialDojos);
  const [martialArts, setMartialArts] = useState<MartialArt[]>(initialMartialArts);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [error, setError] = useState<string | null>(null);
  const [viewedStudent, setViewedStudent] = useState<Student | null>(null);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  const handleLogin = useCallback((username: string, password: string) => {
    setError(null);
    if (username === adminUser.username && password === 'admin') {
      setCurrentUser(adminUser);
      setCurrentPage('admin_dashboard');
      return;
    }
    const student = students.find(
      (s) => s.username === username && s.password === password
    );
    if (student) {
      setCurrentUser(student);
      setCurrentPage('student_profile');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  }, [students]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setViewedStudent(null);
    setEditedStudent(null);
    setCurrentPage('login');
  }, []);

  const handleRegisterNew = useCallback(() => {
    setCurrentPage('register_student');
  }, []);

  const handleRegisterStudent = useCallback((newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
        ...newStudentData,
        id: Date.now(),
        attendance: [],
    };
    setStudents(prev => [...prev, newStudent]);
    setCurrentPage('admin_dashboard');
  }, []);

  const handleCancelRegistration = useCallback(() => {
    setCurrentPage('admin_dashboard');
  }, []);
  
  const handleViewStudent = useCallback((student: Student) => {
      setViewedStudent(student);
      setCurrentPage('admin_view_student');
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setEditedStudent(student);
    setCurrentPage('edit_student');
  }, []);

  const handleUpdateStudent = useCallback((updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setEditedStudent(null);
    setCurrentPage('admin_dashboard');
  }, []);

  const handleDeleteStudent = useCallback((studentId: number) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditedStudent(null);
    setCurrentPage('admin_dashboard');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setViewedStudent(null);
    setCurrentPage('admin_dashboard');
  }, []);

  const handleManageDojos = useCallback(() => {
    setCurrentPage('admin_dojos');
  }, []);
  
  const handleManageMartialArts = useCallback(() => {
    setCurrentPage('admin_martial_arts');
  }, []);
  
  const handleNavigateToAttendance = useCallback(() => {
    setCurrentPage('admin_attendance');
  }, []);

  const handleAddDojo = useCallback((newDojo: string) => {
    if (newDojo && !dojos.includes(newDojo)) {
      setDojos(prev => [...prev, newDojo].sort());
    }
  }, [dojos]);

  const handleAddMartialArt = useCallback((newMartialArtData: Omit<MartialArt, 'id'>) => {
    const newMartialArt: MartialArt = {
      ...newMartialArtData,
      id: Date.now(),
    };
    setMartialArts(prev => [...prev, newMartialArt]);
  }, []);

  const handleDeleteMartialArt = (martialArtId: number) => {
    setMartialArts(prevMartialArts => prevMartialArts.filter(ma => ma.id !== martialArtId));
    setStudents(prevStudents =>
        prevStudents.map(student => ({
            ...student,
            graduations: student.graduations.filter(grad => grad.martialArtId !== martialArtId),
        }))
    );
  };
  
  const handleMarkAttendance = useCallback((studentId: number, martialArtId: number, date: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          const alreadyAttended = student.attendance.some(
            att => att.date === date && att.martialArtId === martialArtId
          );
          if (alreadyAttended) {
            return student; // Do not add duplicate attendance
          }
          const updatedStudent = {
            ...student,
            attendance: [...student.attendance, { date, martialArtId }],
          };
          return updatedStudent;
        }
        return student;
      })
    );
  }, []);
  
  const handlePromoteStudent = useCallback((studentId: number, martialArtId: number) => {
    setStudents(prevStudents => 
        prevStudents.map(student => {
            if (student.id !== studentId) return student;

            const gradIndex = student.graduations.findIndex(g => g.martialArtId === martialArtId);
            if (gradIndex === -1) return student;

            const martialArt = martialArts.find(ma => ma.id === martialArtId);
            if (!martialArt) return student;

            const currentGrad = student.graduations[gradIndex];
            const newGraduations = [...student.graduations];
            const today = new Date().toISOString().split('T')[0];
            
            let promoted = false;
            if (martialArt.usesDegrees && currentGrad.degree < martialArt.maxDegrees) {
                // Degree promotion
                newGraduations[gradIndex] = { 
                    ...currentGrad, 
                    degree: currentGrad.degree + 1, 
                    promotionDate: today 
                };
                promoted = true;
            } else {
                const currentRankIndex = martialArt.ranks.indexOf(currentGrad.rank);
                if (currentRankIndex < martialArt.ranks.length - 1) {
                    // Rank promotion
                    const nextRank = martialArt.ranks[currentRankIndex + 1];
                    newGraduations[gradIndex] = { 
                        ...currentGrad, 
                        rank: nextRank, 
                        degree: 0, 
                        promotionDate: today,
                        rankStartDate: today 
                    };
                    promoted = true;
                }
            }
            
            if(promoted) {
              return { ...student, graduations: newGraduations };
            }
            return student;
        })
    );
  }, [martialArts]);


  const renderContent = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} error={error} />;
      case 'admin_dashboard':
        return <AdminDashboard students={students} martialArts={martialArts} onRegisterNew={handleRegisterNew} onViewStudent={handleViewStudent} onEditStudent={handleEditStudent} onDeleteStudent={handleDeleteStudent} onManageDojos={handleManageDojos} onManageMartialArts={handleManageMartialArts} onManageAttendance={handleNavigateToAttendance} onPromoteStudent={handlePromoteStudent} />;
      case 'register_student':
        return <RegisterStudentPage onRegister={handleRegisterStudent} onCancel={handleCancelRegistration} dojos={dojos} martialArts={martialArts} />;
      case 'edit_student':
        if (editedStudent) {
            return <EditStudentPage student={editedStudent} onUpdate={handleUpdateStudent} onCancel={handleCancelEdit} dojos={dojos} martialArts={martialArts} />;
        }
        handleBackToDashboard();
        return null;
      case 'admin_dojos':
        return <DojoManagementPage dojos={dojos} onAddDojo={handleAddDojo} onBackToDashboard={handleBackToDashboard} />;
      case 'admin_martial_arts':
        return <MartialArtManagementPage martialArts={martialArts} onAddMartialArt={handleAddMartialArt} onDeleteMartialArt={handleDeleteMartialArt} onBackToDashboard={handleBackToDashboard} />;
      case 'admin_attendance':
        return <AttendancePage students={students} martialArts={martialArts} onMarkAttendance={handleMarkAttendance} onBackToDashboard={handleBackToDashboard} />;
      case 'student_profile':
        if (currentUser && 'fullName' in currentUser) {
          return <StudentProfilePage student={currentUser as Student} martialArts={martialArts} />;
        }
        handleLogout(); // Fallback if state is inconsistent
        return null;
      case 'admin_view_student':
        if (viewedStudent) {
            return <StudentProfilePage student={viewedStudent} martialArts={martialArts} onBack={handleBackToDashboard} />;
        }
        handleBackToDashboard(); // Fallback
        return null;
      default:
        return <LoginPage onLogin={handleLogin} error={error} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      {currentPage !== 'login' && <Header user={currentUser} onLogout={handleLogout} />}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;