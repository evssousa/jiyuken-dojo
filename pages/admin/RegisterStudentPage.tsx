import React, { useState } from 'react';
import type { Student } from '../../types';
import { TraditionalKarateRank, ContactKarateRank, JiuJitsuRank, Gender, StudentStatus } from '../../types';
import { TRADITIONAL_KARATE_RANKS, CONTACT_KARATE_RANKS, JIU_JITSU_RANKS, GENDERS, STATUSES } from '../../constants';
import Card from '../../components/common/Card';

interface RegisterStudentPageProps {
  onRegister: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const RegisterStudentPage: React.FC<RegisterStudentPageProps> = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    username: '',
    password: '',
    status: StudentStatus.ACTIVE,
    fullName: '',
    birthDate: '',
    gender: Gender.MALE,
    photo: null,
    internalRegistry: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    contactPhone: '',
    dojo: '',
    observations: '',
    traditionalKarateRank: TraditionalKarateRank.WHITE,
    contactKarateRank: ContactKarateRank.WHITE,
    jiuJitsuRank: JiuJitsuRank.WHITE,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, photo: base64 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-heading tracking-wider text-gray-900 mb-6">Cadastrar Novo Aluno</h2>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Credentials & Status */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-heading tracking-wider text-gray-800">Credenciais e Status</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Usuário</label>
                <input type="text" name="username" id="username" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Senha</label>
                <input type="password" name="password" id="password" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          {/* Section: Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-heading tracking-wider text-gray-800">Informações Pessoais</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo</label>
                    <input type="text" name="fullName" id="fullName" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">Data de Nascimento</label>
                    <input type="date" name="birthDate" id="birthDate" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">Sexo</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="sm:col-span-4">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Foto</label>
                    <div className="mt-2 flex items-center gap-x-3">
                        {photoPreview ? <img src={photoPreview} alt="Preview" className="h-12 w-12 rounded-full object-cover"/> : <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"><svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>}
                        <input type="file" name="photo" id="photo" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                    </div>
                </div>
            </div>
          </div>

          {/* Section: Dojo Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-heading tracking-wider text-gray-800">Informações do Dojo</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-2">
                    <label htmlFor="internalRegistry" className="block text-sm font-medium leading-6 text-gray-900">Registro Interno</label>
                    <input type="text" name="internalRegistry" id="internalRegistry" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="enrollmentDate" className="block text-sm font-medium leading-6 text-gray-900">Data da Matrícula</label>
                    <input type="date" name="enrollmentDate" id="enrollmentDate" value={formData.enrollmentDate} required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="dojo" className="block text-sm font-medium leading-6 text-gray-900">Dojo</label>
                    <input type="text" name="dojo" id="dojo" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="contactPhone" className="block text-sm font-medium leading-6 text-gray-900">Telefone de Contato</label>
                    <input type="tel" name="contactPhone" id="contactPhone" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="sm:col-span-full">
                    <label htmlFor="observations" className="block text-sm font-medium leading-6 text-gray-900">Observações</label>
                    <textarea id="observations" name="observations" rows={3} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
          </div>
          
          {/* Section: Graduations */}
          <div>
            <h3 className="text-xl font-heading tracking-wider text-gray-800">Graduações</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                <div>
                    <label htmlFor="traditionalKarateRank" className="block text-sm font-medium leading-6 text-gray-900">Karate Tradicional</label>
                    <select id="traditionalKarateRank" name="traditionalKarateRank" value={formData.traditionalKarateRank} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                        {TRADITIONAL_KARATE_RANKS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="contactKarateRank" className="block text-sm font-medium leading-6 text-gray-900">Karate de Contato</label>
                    <select id="contactKarateRank" name="contactKarateRank" value={formData.contactKarateRank} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                        {CONTACT_KARATE_RANKS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="jiuJitsuRank" className="block text-sm font-medium leading-6 text-gray-900">Jiu-Jitsu</label>
                    <select id="jiuJitsuRank" name="jiuJitsuRank" value={formData.jiuJitsuRank} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                        {JIU_JITSU_RANKS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                    </select>
                </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-x-4 border-t border-gray-200 mt-6">
            <button type="button" onClick={onCancel} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Salvar Aluno</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterStudentPage;
