import React, { useState, useCallback, useEffect } from 'react';
import type { User, Student } from './types';
import { initialStudents, adminUser } from './services/studentService';
import { initialDojos } from './services/dojoService';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RegisterStudentPage from './pages/admin/RegisterStudentPage';
import EditStudentPage from './pages/admin/EditStudentPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import DojoManagementPage from './pages/admin/DojoManagementPage';

type Page = 'login' | 'admin_dashboard' | 'register_student' | 'edit_student' | 'student_profile' | 'admin_view_student' | 'admin_dojos';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [dojos, setDojos] = useState<string[]>(initialDojos);
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

  const handleAddDojo = useCallback((newDojo: string) => {
    if (newDojo && !dojos.includes(newDojo)) {
      setDojos(prev => [...prev, newDojo].sort());
    }
  }, [dojos]);

  const renderContent = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} error={error} />;
      case 'admin_dashboard':
        return <AdminDashboard students={students} onRegisterNew={handleRegisterNew} onViewStudent={handleViewStudent} onEditStudent={handleEditStudent} onManageDojos={handleManageDojos} />;
      case 'register_student':
        return <RegisterStudentPage onRegister={handleRegisterStudent} onCancel={handleCancelRegistration} dojos={dojos}/>;
      case 'edit_student':
        if (editedStudent) {
            return <EditStudentPage student={editedStudent} onUpdate={handleUpdateStudent} onCancel={handleCancelEdit} dojos={dojos} />;
        }
        handleBackToDashboard();
        return null;
      case 'admin_dojos':
        return <DojoManagementPage dojos={dojos} onAddDojo={handleAddDojo} onBackToDashboard={handleBackToDashboard} />;
      case 'student_profile':
        if (currentUser && 'fullName' in currentUser) {
          return <StudentProfilePage student={currentUser} />;
        }
        handleLogout(); // Fallback if state is inconsistent
        return null;
      case 'admin_view_student':
        if (viewedStudent) {
            return <StudentProfilePage student={viewedStudent} onBack={handleBackToDashboard} />;
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