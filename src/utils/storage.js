export const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromStorage = (key, fallback= []) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
};

export const clearStorage = (key) => {
    localStorage.removeItem(key);
};