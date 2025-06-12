type Ordem = "asc" | "desc";

export function ordenarPorDataHora<T>(
  array: T[],
  campoData: keyof T,
  ordem: Ordem = "asc"
): T[] {
  return array.slice().sort((a, b) => {
    const dataA = new Date(a[campoData] as unknown as string).getTime();
    const dataB = new Date(b[campoData] as unknown as string).getTime();

    if (ordem === "asc") {
      return dataA - dataB;
    } else {
      return dataB - dataA;
    }
  });
}
