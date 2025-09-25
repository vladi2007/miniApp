export function saveToDeviceStorage(key: string, value: any) {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Ошибка при сохранении в localStorage:', err);
    }
  }
}

export function loadFromDeviceStorage(key: string): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Ошибка при загрузке из localStorage:', err);
    return null;
  }
}


export function clearDeviceStorage(key: string) {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.error('Ошибка при удалении ключа из localStorage:', err);
    }
  }
}

export function saveToLocaleStorage(key: string, value: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Ошибка при сохранении в localStorage:', err);
    }
  }
}

export function loadFromLocalStorage(key: string): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Ошибка при загрузке из localStorage:', err);
    return null;
  }
}

export function clearLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Ошибка при удалении ключа из localStorage:', err);
    }
  }
}
