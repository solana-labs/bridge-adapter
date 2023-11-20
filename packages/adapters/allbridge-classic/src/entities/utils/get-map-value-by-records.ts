type ValueOf<T> = T[keyof T];

export const getMapValueByRecords = <
  S extends NonNullable<unknown>,
  A extends { [key: string]: unknown },
  B extends Map<string, unknown>,
>(
  records: A,
  map: B,
  findBy: (record: ValueOf<A>) => any,
) => {
  const result: S[] = [];
  for (let key in records) {
    const value = records[key];
    const criteria = findBy(value);
    if (map.has(criteria)) {
      const mapValue = map.get(criteria) as S;
      if (mapValue) {
        result.push(mapValue);
      }
    } else {
      continue;
    }
  }

  return result;
};
