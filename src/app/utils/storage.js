const getItem = (key) => {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
};
const setItem = (key, data) => {
    const _data = JSON.stringify(data);
    return localStorage.setItem(key, _data);
};
const clearItem = (key) => {
    localStorage.removeItem(key);
};
const clearAll = () => {
    localStorage.clear();
};
export const Storage = {getItem, setItem, clearItem, clearAll}
