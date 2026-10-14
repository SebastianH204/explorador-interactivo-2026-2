export const filtrarPokemones = (lista, { texto, tipo }) => {
  const buscado = texto.trim().toLowerCase();
  return lista
    .filter((p) => p.name.includes(buscado))
    .filter((p) => tipo === '' || p.types[0].type.name === tipo);
};

export const contarDobleTipo = (lista) =>
  lista.reduce((total, p) => (p.types.length > 1 ? total + 1 : total), 0);

export const buscarPorId = (lista, id) => lista.find((p) => p.id === id);
