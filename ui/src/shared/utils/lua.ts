export const lua2json = (lua: string): any => {
  try {
    return JSON.parse(
      lua
        .replace(/\[([^\[\]]+)\]\s*=/g, (_, k) => `${k} :`)
        .replace(/,(\s*)\}/gm, (_, k) => `${k}}`)
    );
  } catch (e) {
    return {};
  }
};
