// utils/deviceStorageIndexedDB.ts
import { openDB } from 'idb';
import { FORM_STORAGE_KEY, CURRENT_INDEX_KEY, STEP_KEY, IMAGE_STATE_KEY } from '~/constants/interactiveKeys'
const DB_NAME = 'interactive-editor-db';
const STORE_NAME = 'interactive_store';

// Инициализация базы
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// Сохранение значения (аналог saveToDeviceStorage)
export async function saveToDeviceStorage(key: string, value: any) {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, value, key);
  } catch (err) {
    console.error(`Ошибка при сохранении в IndexedDB (${key}):`, err);
  }
}

// Загрузка значения (аналог loadFromDeviceStorage)
export async function loadFromDeviceStorage(key: string): Promise<any | null> {
  try {
    const db = await getDB();
    const value = await db.get(STORE_NAME, key);
    return value ?? null;
  } catch (err) {
    console.error(`Ошибка при загрузке из IndexedDB (${key}):`, err);
    return null;
  }
}

// Удаление ключа (аналог clearDeviceStorage)
export async function clearDeviceStorage(key: string) {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
  } catch (err) {
    console.error(`Ошибка при удалении из IndexedDB (${key}):`, err);
  }
}

// Полная очистка хранилища
export async function clearAllDeviceStorage() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.store.clear();
    await tx.done;
  } catch (err) {
    console.error('Ошибка при полной очистке IndexedDB:', err);
  }
}
export async function getAllDeviceStorageKeys(): Promise<string[]> {
  try {
    const db = await getDB();
    const keys = await db.getAllKeys(STORE_NAME);
    return keys.map(key => String(key)); // Преобразуем все в строки
  } catch (err) {
    console.error('Ошибка при получении ключей из IndexedDB:', err);
    return [];
  }
}


export async function clearInteractiveSessionData() {
  try {
    const dbKeys = await getAllDeviceStorageKeys();

    // Базовые ключи, которые нужно удалить
    const fixedKeys = [
      'interactive_form_draft',
      'interactive_current_index',
      'interactive_editor_step',
      'interactive_image_state',
    ];

    // Находим все динамические ключи для изображений
    const imageKeys = dbKeys.filter((key) =>
      key.startsWith('interactive_image_state_')
    );

    // Объединяем всё и удаляем
    const keysToClear = [...fixedKeys, ...imageKeys];
    for (const key of keysToClear) {
      await clearDeviceStorage(key);
    }
  } catch (err) {
    console.error('Ошибка при очистке данных интерактива:', err);
  }
}