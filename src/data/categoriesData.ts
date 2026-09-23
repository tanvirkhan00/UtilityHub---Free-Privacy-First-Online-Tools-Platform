import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'fiverr',
    name: 'Fiverr Freelance Safety',
    shortName: 'Fiverr Tools',
    description: 'Independent policy & safety scanner to check freelance client messages for risky terms, contact disclosures, and policy traps.',
    icon: 'ShieldAlert',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    accentColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'pdf',
    name: 'PDF & Document Utilities',
    shortName: 'PDF Tools',
    description: 'Merge, split, rotate, compress, and convert PDF documents 100% in your browser without uploading to any server.',
    icon: 'FileText',
    badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    accentColor: 'from-rose-500 to-red-600'
  },
  {
    id: 'image',
    name: 'Image Optimization & Converters',
    shortName: 'Image Tools',
    description: 'Compress, resize, crop, convert formats (JPG, PNG, WEBP), extract palettes, and pick hex colors securely on client hardware.',
    icon: 'Image',
    badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    accentColor: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'creator',
    name: 'Creator & Social Media Tools',
    shortName: 'Creator Tools',
    description: 'Generate high-res QR codes, format YouTube thumbnails, resize for Instagram & LinkedIn, build memes, and preview Open Graph cards.',
    icon: 'Sparkles',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    accentColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'text',
    name: 'Text & Developer Productivity',
    shortName: 'Text Tools',
    description: 'Format & validate JSON, calculate word metrics, clean duplicate lines, inspect text diffs, preview Markdown, and encode Base64/URLs.',
    icon: 'Code2',
    badgeColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    accentColor: 'from-cyan-500 to-blue-600'
  }
];

export const getCategoryById = (id: string): CategoryInfo | undefined => {
  return CATEGORIES.find(c => c.id === id);
};
