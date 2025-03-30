export const normalizeArgsDto = (key: string) => {
  const keyArray = key.split('|');

  if (keyArray.length <= 1) return { key: keyArray?.[0], args: {} };

  const objectDto = JSON.parse(keyArray?.[1]) ?? {};

  return {
    key: keyArray?.[0],
    args: Object.keys(objectDto)
      .map((k) => ({
        [k]: objectDto[k],
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {}),
  };
};
