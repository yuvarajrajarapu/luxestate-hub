import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COUNTER_DOC = doc(db, 'metadata', 'property-counters');

const sanitizeSegment = (value: string, fallback: string) => {
  const cleaned = (value || fallback)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);
  return cleaned || fallback;
};

export const normalizePropertyCode = (code?: string | null) => code?.trim().toUpperCase() || '';

export async function reservePropertyCode(city: string, mainCategory: string) {
  const citySegment = sanitizeSegment(city, 'PRP');
  const categorySegment = sanitizeSegment(mainCategory, 'CAT');
  const prefix = `${citySegment}-${categorySegment}`;

  try {
    const code = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(COUNTER_DOC);
      const counters = snapshot.exists() ? snapshot.data() : {};
      const current = Number((counters as Record<string, any>)[prefix]) || 1000;
      const next = current + 1;

      transaction.set(
        COUNTER_DOC,
        {
          [prefix]: next,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      return `${prefix}-${next.toString().padStart(4, '0')}`;
    });

    return code;
  } catch (error) {
    console.warn('reservePropertyCode failed, falling back to timestamp code', error);
    const fallback = `${prefix}-${Math.floor(Date.now() % 100000).toString().padStart(5, '0')}`;
    return fallback;
  }
}

export const buildPropertyUrl = (code: string, baseUrl = 'https://www.umyinfra.in') => {
  const normalized = normalizePropertyCode(code);
  return `${baseUrl.replace(/\/$/, '')}/property/${encodeURIComponent(normalized)}`;
};
