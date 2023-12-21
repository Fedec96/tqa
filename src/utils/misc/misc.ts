export const PATH_SEP = "->";

export const resolvePath = (obj: unknown, path: string): unknown => {
  const properties = path.split(PATH_SEP);
  let result = obj as object;

  for (const prop of properties) {
    result = result[prop as keyof typeof result];

    if (typeof result === "undefined") {
      return undefined;
    }
  }

  return result;
};
