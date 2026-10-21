const CLAVE = 'pokekit:favoritos';

export const leerFavoritos = () => {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
};

export const guardarFavoritos = (lista) => {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
};

export const esFavorito = (lista, id) => lista.some((f) => f.id === id);

export const alternarFavorito = (lista, pokemon) =>
  esFavorito(lista, pokemon.id)
    ? lista.filter((f) => f.id !== pokemon.id)
    : [...lista, pokemon];
