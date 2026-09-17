import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Snippet } from '../types';
import { initialSnippets } from '../data/initialSnippets';

const SNIPPETS_COLLECTION = 'snippets';

/**
 * Normalizes Firestore document data to a complete Snippet
 */
function normalizeDocToSnippet(id: string, data: Record<string, any>): Snippet {
  const code = data.code || '';
  const lines = code.split('\n');
  const previewLines = data.previewLines && Array.isArray(data.previewLines) && data.previewLines.length > 0
    ? data.previewLines
    : lines.slice(0, 10).map((line: string, i: number) => ({
        num: String(i + 1).padStart(2, '0'),
        text: line
      }));

  return {
    id,
    title: data.title || 'Untitled Snippet',
    language: data.language || 'py',
    languageLabel: data.languageLabel || 'Python',
    topic: data.topic || 'DSA',
    tags: Array.isArray(data.tags) ? data.tags : [],
    updatedAt: data.updatedAt || 'Just now',
    description: data.description || '',
    code,
    previewLines,
    starred: Boolean(data.starred),
    notes: data.notes || '',
    runtimeSpec: data.runtimeSpec || '',
    complexity: data.complexity || '',
    lastExecution: data.lastExecution
  };
}

/**
 * Real-time listener for snippets in Firestore
 */
export function subscribeToSnippets(
  onUpdate: (snippets: Snippet[]) => void,
  onError?: (err: Error) => void
): () => void {
  const snippetsRef = collection(db, SNIPPETS_COLLECTION);

  return onSnapshot(
    snippetsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is completely empty on first launch, seed with default starter snippets
        await seedStarterSnippets();
        return;
      }

      const items: Snippet[] = [];
      snapshot.forEach((docSnap) => {
        items.push(normalizeDocToSnippet(docSnap.id, docSnap.data()));
      });

      // Sort by updatedAt or default order
      onUpdate(items);
    },
    (error) => {
      console.error('Error listening to snippets:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Saves or creates a snippet in Firestore
 */
export async function saveSnippetToDatabase(snippet: Snippet): Promise<void> {
  const docRef = doc(db, SNIPPETS_COLLECTION, snippet.id);
  const dataToSave = {
    title: snippet.title,
    language: snippet.language,
    languageLabel: snippet.languageLabel,
    topic: snippet.topic,
    tags: snippet.tags || [],
    updatedAt: snippet.updatedAt || new Date().toISOString().split('T')[0],
    description: snippet.description || '',
    code: snippet.code,
    notes: snippet.notes || '',
    runtimeSpec: snippet.runtimeSpec || '',
    complexity: snippet.complexity || '',
    starred: Boolean(snippet.starred)
  };

  await setDoc(docRef, dataToSave, { merge: true });
}

/**
 * Updates specific fields of a snippet in Firestore
 */
export async function updateSnippetInDatabase(
  id: string,
  updates: Partial<Snippet>
): Promise<void> {
  const docRef = doc(db, SNIPPETS_COLLECTION, id);
  const filteredUpdates: Record<string, any> = {};

  if (updates.title !== undefined) filteredUpdates.title = updates.title;
  if (updates.language !== undefined) filteredUpdates.language = updates.language;
  if (updates.languageLabel !== undefined) filteredUpdates.languageLabel = updates.languageLabel;
  if (updates.topic !== undefined) filteredUpdates.topic = updates.topic;
  if (updates.tags !== undefined) filteredUpdates.tags = updates.tags;
  if (updates.description !== undefined) filteredUpdates.description = updates.description;
  if (updates.code !== undefined) filteredUpdates.code = updates.code;
  if (updates.notes !== undefined) filteredUpdates.notes = updates.notes;
  if (updates.runtimeSpec !== undefined) filteredUpdates.runtimeSpec = updates.runtimeSpec;
  if (updates.complexity !== undefined) filteredUpdates.complexity = updates.complexity;
  if (updates.starred !== undefined) filteredUpdates.starred = updates.starred;
  filteredUpdates.updatedAt = new Date().toISOString().split('T')[0];

  await updateDoc(docRef, filteredUpdates);
}

/**
 * Deletes a snippet from Firestore
 */
export async function deleteSnippetFromDatabase(id: string): Promise<void> {
  const docRef = doc(db, SNIPPETS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Toggles the starred status of a snippet
 */
export async function toggleStarSnippetInDatabase(
  id: string,
  currentStarred: boolean
): Promise<void> {
  const docRef = doc(db, SNIPPETS_COLLECTION, id);
  await updateDoc(docRef, { starred: !currentStarred });
}

/**
 * Seeds initial library snippets if database is fresh
 */
export async function seedStarterSnippets(): Promise<void> {
  try {
    const existing = await getDocs(collection(db, SNIPPETS_COLLECTION));
    if (!existing.empty) return;

    for (const s of initialSnippets) {
      await saveSnippetToDatabase(s);
    }
  } catch (err) {
    console.warn('Seeding starter snippets error:', err);
  }
}
