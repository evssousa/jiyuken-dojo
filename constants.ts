import { AllRanks, Gender, StudentStatus } from './types';

export const ALL_RANKS = Object.values(AllRanks);
export const GENDERS = Object.values(Gender);
export const STATUSES = Object.values(StudentStatus);

export const MAX_DEGREES = Array.from({ length: 11 }, (_, i) => i); // 0 to 10
