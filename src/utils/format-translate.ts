export const formatTranslate = (
  key: string,
  args?: Record<
    string,
    | {
        key: string;
        isTranslate?: boolean;
      }
    | string
  >,
): string => {
  let formattedKey: string = key;

  if (args) {
    Object.entries(args).forEach(([argKey, argValue]) => {
      if (typeof argValue === 'string') {
        formattedKey += `|${argKey}:${argValue}`;
        return;
      }

      formattedKey += `|${argKey}:${argValue.key}`;

      if (argValue.isTranslate) {
        formattedKey += `:++`;
      }
    });
  }

  return formattedKey;
};

export const formatTranslateToObject = (key: string) => {
  const result: Record<string, string | { key: string; isTranslate?: boolean }> = {};

  const parts = key.split('|');
  const mainKey = parts.shift() || '';

  parts.forEach((part) => {
    const [argKey, argValue, isTranslate] = part.split(':');
    if (argValue) {
      result[argKey] = argValue.replace(/:\+{2}$/, '');
    }

    if (isTranslate) {
      result[argKey] = {
        key: argValue,
        isTranslate: isTranslate === '++',
      };
    }
  });

  return { key: mainKey, args: result };
};
