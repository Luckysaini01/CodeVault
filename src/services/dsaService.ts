import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DsaUserProgress, LanguageKey } from '../types';

const DSA_PROGRESS_COLLECTION = 'dsaProgress';
const LOCAL_STORAGE_KEY = 'codevault_dsa_progress';

export function getLocalDsaProgress(): Record<string, DsaUserProgress> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalDsaProgress(progressMap: Record<string, DsaUserProgress>): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressMap));
  } catch {
    // ignore
  }
}

/**
 * Subscribes to DSA progress changes from Firestore in real-time
 */
export function subscribeToDsaProgress(
  onUpdate: (progressMap: Record<string, DsaUserProgress>) => void,
  onError?: (err: Error) => void
): () => void {
  const collRef = collection(db, DSA_PROGRESS_COLLECTION);

  return onSnapshot(
    collRef,
    (snapshot) => {
      const result: Record<string, DsaUserProgress> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        result[docSnap.id] = {
          problemId: docSnap.id,
          status: data.status || 'todo',
          solvedAt: data.solvedAt,
          language: data.language,
          userCode: data.userCode,
          notes: data.notes || '',
          bookmarked: Boolean(data.bookmarked)
        };
      });

      // Merge with local fallback
      const local = getLocalDsaProgress();
      const merged = { ...local, ...result };
      saveLocalDsaProgress(merged);
      onUpdate(merged);
    },
    (err) => {
      console.warn('Firestore DSA progress subscription fallback to local cache:', err);
      const local = getLocalDsaProgress();
      onUpdate(local);
      if (onError) onError(err);
    }
  );
}

/**
 * Persists a user's progress or solution for a DSA problem to Firestore
 */
export async function saveDsaProblemProgress(
  problemId: string,
  progress: Partial<DsaUserProgress>
): Promise<void> {
  // Update local cache immediately
  const local = getLocalDsaProgress();
  const current = local[problemId] || { problemId, status: 'todo' };
  const updated: DsaUserProgress = {
    ...current,
    ...progress,
    problemId
  };
  local[problemId] = updated;
  saveLocalDsaProgress(local);

  try {
    const docRef = doc(db, DSA_PROGRESS_COLLECTION, problemId);
    const dataToSave: Record<string, any> = {
      problemId,
      status: updated.status
    };

    if (updated.solvedAt) dataToSave.solvedAt = updated.solvedAt;
    if (updated.language) dataToSave.language = updated.language;
    if (updated.userCode) dataToSave.userCode = updated.userCode;
    if (updated.notes !== undefined) dataToSave.notes = updated.notes;
    if (updated.bookmarked !== undefined) dataToSave.bookmarked = updated.bookmarked;

    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.error('Failed to sync DSA progress to Firestore:', err);
  }
}

/**
 * Toggle bookmark for a DSA problem
 */
export async function toggleDsaProblemBookmark(
  problemId: string,
  currentBookmarked: boolean
): Promise<void> {
  await saveDsaProblemProgress(problemId, {
    bookmarked: !currentBookmarked
  });
}

/**
 * Mark a DSA problem as solved
 */
export async function markDsaProblemSolved(
  problemId: string,
  language?: LanguageKey,
  userCode?: string
): Promise<void> {
  await saveDsaProblemProgress(problemId, {
    status: 'solved',
    solvedAt: new Date().toISOString().split('T')[0],
    language,
    userCode
  });
}
