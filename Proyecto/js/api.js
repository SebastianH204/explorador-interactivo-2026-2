export const URL_POKEMON = 'https://pokeapi.co/api/v2/pokemon?limit=24';

export const pedirJSON = async (url) => {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos;
};

const resumirPokemon = ({ id, name, weight, height, types, abilities, sprites }) => ({
  id,
  name,
  weight,
  height,
  types,
  abilities,
  sprites: {
    front_default: sprites.front_default,
    other: { 'official-artwork': { front_default: sprites.other['official-artwork'].front_default } },
  },
});

export const obtenerPokemones = async (url) => {
  const lista = await pedirJSON(url);
  const promesas = lista.results.map((p) => pedirJSON(p.url));
  const detalles = await Promise.all(promesas);
  return { info: { next: lista.next }, results: detalles.map(resumirPokemon) };
};
