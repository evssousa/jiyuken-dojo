
export enum TraditionalKarateRank {
  WHITE = "Branca",
  YELLOW = "Amarela",
  RED = "Vermelha",
  ORANGE = "Laranja",
  GREEN = "Verde",
  PURPLE = "Roxa",
  BROWN = "Marrom",
  BLACK = "Preta",
}

export enum ContactKarateRank {
  WHITE = "Branca",
  YELLOW = "Amarela",
  ORANGE = "Laranja",
  GREEN = "Verde",
  BLUE = "Azul",
  PURPLE = "Roxa",
  BROWN = "Marrom",
  BLACK = "Preta",
}

export enum JiuJitsuRank {
  WHITE = "Branca",
  GRAY = "Cinza",
  YELLOW = "Amarela",
  ORANGE = "Laranja",
  GREEN = "Verde",
  BLUE = "Azul",
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
  traditionalKarateRank: TraditionalKarateRank;
  contactKarateRank: ContactKarateRank;
  jiuJitsuRank: JiuJitsuRank;
}

export interface AdminUser {
    username: string;
    role: 'admin';
}

export type User = Student | AdminUser;
