import { useState, useEffect } from 'react';

export const useLocalStorage = (keyName) => {
  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage.getItem(keyName);
    try {
      const parsedValue = JSON.parse(storedValue);
      return parsedValue;
    } catch (error) {
      return storedValue;
    }
  });

  useEffect(() => {
    const stringifiedValue = JSON.stringify(value);
    sessionStorage.setItem(keyName, stringifiedValue);
  }, [value, setValue, keyName]);

  return [value, setValue];
};
