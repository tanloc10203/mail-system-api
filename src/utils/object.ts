/**
 * Type guard to check if a given object has a property with a specific key and type.
 *
 * @param obj - Object to check
 * @param key - Key to check for
 * @param type - Type to check for
 * @returns boolean indicating if the object has the key with the given type
 */

export const hasKeyWithType = <T>(
  obj: unknown,
  key: string,
  type: string,
): obj is Record<string, T> => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    key in obj &&
    typeof (obj as Record<string, T>)[key] === type
  );
};

export const unSelect = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: Array<K>,
): Record<K, T[K]> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Record<K, T[K]>;
};

export const getInfo = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: Array<K>,
): Record<K, T[K]> => {
  return keys.reduce(
    (acc, key) => {
      if (obj && Object.hasOwnProperty.call(obj, key)) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Record<K, T[K]>,
  );
};
