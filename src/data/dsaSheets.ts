import { DsaSheetId } from '../types';

export interface DsaSheetConfig {
  id: DsaSheetId;
  name: string;
  badge: string;
  description: string;
  targetAudience: string;
  recommendedTime: string;
}

export const DSA_SHEETS: DsaSheetConfig[] = [
  {
    id: 'all',
    name: 'Complete Problem Bank',
    badge: 'ALL TOPICS',
    description: 'The master collection of technical interview and college syllabus algorithms across all categories.',
    targetAudience: 'Comprehensive practice',
    recommendedTime: 'Self-paced'
  },
  {
    id: 'blind75',
    name: 'Blind 75 Essential Sheet',
    badge: 'MUST DO',
    description: 'The definitive 75 problem list distilled by Facebook engineers to cover all patterns with zero redundancy.',
    targetAudience: 'FAANG / Tier 1 SDE Interviews',
    recommendedTime: '4 - 6 Weeks'
  },
  {
    id: 'striver-sde',
    name: 'Striver SDE Roadmap',
    badge: 'TOP RATED',
    description: 'Curated by Striver (Take U Forward) covering foundational to advanced dynamic programming, graphs, and arrays.',
    targetAudience: 'Product Companies & SDE Roles',
    recommendedTime: '2 - 3 Months'
  },
  {
    id: 'college-core',
    name: 'College Semester Essentials',
    badge: 'SEMESTER CORE',
    description: 'Standard college syllabus lab experiments: Linked lists, Binary Search Trees, Sorting algorithms, and Kadane\'s.',
    targetAudience: 'University Exams & Campus Placements',
    recommendedTime: '2 - 4 Weeks'
  }
];
