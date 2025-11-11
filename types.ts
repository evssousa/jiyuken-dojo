// types.ts

export enum AllRanks {
  WHITE = "Branca",
  GRAY = "Cinza",
  BLUE = "Azul",
  YELLOW = "Amarela",
  RED = "Vermelha",
  ORANGE = "Laranja",
  GREEN = "Verde",
  PURPLE = "Roxa",
  BROWN = "Marrom",
  BLACK = "Preta",
}

export enum Gender {
  MALE = "Masculino",
  FEMALE = "Feminino",
  OTHER = "Outro",
}

export enum StudentStatus {
  ACTIVE = "Ativo",
  INACTIVE = "Inativo",
}

export interface MartialArt {
  id: number;
  name: string;
  ranks: string[];
  usesDegrees: boolean;
  maxDegrees: number;
  promotionRequirements: Record<string, number>;
}

export interface StudentGraduation {
  martialArtId: number;
  rank: string;
  degree: number;
  promotionDate: string; // Date of last promotion (degree or rank)
  rankStartDate: string; // Date when the current rank was achieved
}

export interface Student {
  id: number;
  username: string;
  password?: string;
  status: StudentStatus;
  fullName: string;
  birthDate: string;
  gender: Gender;
  photo: string | null;
  internalRegistry: string;
  enrollmentDate: string;
  contactPhone: string;
  dojo: string;
  observations: string;
  graduations: StudentGraduation[];
  attendance: { date: string; martialArtId: number }[];
}

export interface AdminUser {
    username: string;
    role: 'admin';
}

export type User = Student | AdminUser;