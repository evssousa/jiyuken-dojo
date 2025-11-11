import { TraditionalKarateRank, ContactKarateRank, JiuJitsuRank, Gender, StudentStatus } from './types';

export const TRADITIONAL_KARATE_RANKS = Object.values(TraditionalKarateRank);
export const CONTACT_KARATE_RANKS = Object.values(ContactKarateRank);
export const JIU_JITSU_RANKS = Object.values(JiuJitsuRank);
export const GENDERS = Object.values(Gender);
export const STATUSES = Object.values(StudentStatus);

export const TRADITIONAL_KARATE_DEGREES = [0, 1, 2];
export const CONTACT_KARATE_DEGREES = [0, 1, 2];
export const JIU_JITSU_DEGREES = [0, 1, 2, 3, 4];