import { URL_POKEMON, obtenerPokemones } from './api.js';
import { filtrarPokemones, contarDobleTipo, buscarPorId } from './logica.js';
import { leerFavoritos, guardarFavoritos, esFavorito, alternarFavorito } from './favoritos.js';

const filtros = { texto: '', tipo: '' };
let pokemones = [];
let cargando = false;
let error = null;
let siguiente = URL_POKEMON;
let favoritos = leerFavoritos();
let vista = 'todos';

const TIPOS = {
  normal:   { texto: 'Normal',    clases: 'bg-stone-200 text-stone-700' },
  fire:     { texto: 'Fuego',     clases: 'bg-orange-100 text-orange-700' },
  water:    { texto: 'Agua',      clases: 'bg-sky-100 text-sky-700' },
  grass:    { texto: 'Planta',    clases: 'bg-green-100 text-green-700' },
  electric: { texto: 'Eléctrico', clases: 'bg-yellow-100 text-yellow-700' },
  ice:      { texto: 'Hielo',     clases: 'bg-cyan-100 text-cyan-700' },
  fighting: { texto: 'Lucha',     clases: 'bg-red-100 text-red-700' },
  poison:   { texto: 'Veneno',    clases: 'bg-purple-100 text-purple-700' },
  ground:   { texto: 'Tierra',    clases: 'bg-amber-100 text-amber-800' },
  flying:   { texto: 'Volador',   clases: 'bg-indigo-100 text-indigo-700' },
  psychic:  { texto: 'Psíquico',  clases: 'bg-pink-100 text-pink-700' },
  bug:      { texto: 'Bicho',     clases: 'bg-lime-100 text-lime-700' },
  rock:     { texto: 'Roca',      clases: 'bg-yellow-200 text-yellow-800' },
  ghost:    { texto: 'Fantasma',  clases: 'bg-violet-100 text-violet-700' },
  dragon:   { texto: 'Dragón',    clases: 'bg-blue-100 text-blue-800' },
  dark:     { texto: 'Siniestro', clases: 'bg-neutral-300 text-neutral-800' },
  steel:    { texto: 'Acero',     clases: 'bg-slate-200 text-slate-700' },
  fairy:    { texto: 'Hada',      clases: 'bg-rose-100 text-rose-700' },
};

const chipTipo = (t) => `
  <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIPOS[t.type.name].clases}">${TIPOS[t.type.name].texto}</span>`;

const tarjetaHTML = (p) => {
  const fav = esFavorito(favoritos, p.id);
  return `
  <article class="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-center shadow transition
                  hover:-translate-y-1 hover:shadow-xl dark:border-gray-600 dark:bg-gray-800">
    <button type="button" data-fav="${p.id}" aria-pressed="${fav}"
            aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
            class="absolute top-3 right-3 grid size-10 place-items-center rounded-full border border-gray-200 bg-white text-2xl shadow transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF5350] dark:border-gray-600 dark:bg-gray-700 ${fav ? 'text-[#EF5350]' : 'text-gray-400'}">${fav ? '♥' : '♡'}</button>
    <img src="${p.sprites.front_default}" alt="Imagen de ${p.name}"
         class="mx-auto h-28 w-28 rounded-full border-4 border-gray-200 bg-gray-50 transition group-hover:scale-110
                dark:border-gray-600 dark:bg-gray-700">
    <h3 class="mt-3 text-lg font-bold capitalize text-[#EF5350]">${p.name}</h3>
    <div class="my-2 flex justify-center gap-2">${p.types.map(chipTipo).join('')}</div>
    <p class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Altura ${p.height / 10} m · Peso ${p.weight / 10} kg</p>
    <button type="button" data-id="${p.id}"
            class="mt-auto w-full rounded-lg bg-[#EF5350] py-2.5 font-semibold text-white transition
                   hover:bg-[#C62828] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF5350]">
      Ver detalle
    </button>
  </article>`;
};

const CLASES_ENLACE = {
  activo:   'block rounded-lg border border-[#C62828] bg-[#C62828] px-4 py-2 text-sm font-semibold text-white transition',
  inactivo: 'block rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#EF5350] transition hover:border-[#C62828] hover:bg-[#C62828] hover:text-white',
};

const listaActual = () => (vista === 'favoritos' ? favoritos : pokemones);

const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');

btnMenu.addEventListener('click', function () {
  menu.classList.toggle('hidden');
  const abierto = !menu.classList.contains('hidden');
  btnMenu.setAttribute('aria-expanded', abierto);
});

const titulo = document.querySelector('#titulo');
const enlacesVista = document.querySelectorAll('[data-vista]');

menu.addEventListener('click', (evento) => {
  const enlace = evento.target.closest('[data-vista]');
  if (!enlace) return;
  evento.preventDefault();
  vista = enlace.dataset.vista;
  menu.classList.add('hidden');
  btnMenu.setAttribute('aria-expanded', false);
  render();
});

const modal = document.getElementById('modal-detalle');

const abrirDetalle = (pokemon) => {
  const { id, name, weight, height, types, abilities, sprites } = pokemon;
  document.getElementById('modal-nombre').textContent = name;
  document.getElementById('modal-img').src = sprites.front_default;
  document.getElementById('modal-img').alt = `Imagen de ${name}`;
  document.getElementById('modal-numero').textContent = `#${id}`;
  document.getElementById('modal-tipo').textContent = types.map((t) => TIPOS[t.type.name].texto).join(', ');
  document.getElementById('modal-altura').textContent = `${height / 10} m`;
  document.getElementById('modal-peso').textContent = `${weight / 10} kg`;
  document.getElementById('modal-habilidades').textContent = abilities.map((a) => a.ability.name).join(', ');
  modal.showModal();
};

modal.addEventListener('click', function (e) {
  if (e.target === modal) modal.close();
});

const grilla = document.querySelector('#grilla');
const contador = document.querySelector('#contador');
const btnMas = document.querySelector('#btn-mas');

const render = () => {
  titulo.textContent = vista === 'favoritos' ? 'Tus Pokémon favoritos' : 'Resultados de la búsqueda';
  enlacesVista.forEach((enlace) => {
    const activo = enlace.dataset.vista === vista;
    enlace.className = activo ? CLASES_ENLACE.activo : CLASES_ENLACE.inactivo;
    enlace.setAttribute('aria-current', activo ? 'page' : 'false');
  });

  btnMas.hidden = vista === 'favoritos' || siguiente === null || pokemones.length === 0;
  btnMas.disabled = cargando;
  btnMas.textContent = cargando ? 'Cargando…' : error ? 'No se pudo cargar. Reintentar' : 'Cargar más';

  const sinDatos = vista === 'todos' && pokemones.length === 0;

  if (cargando && sinDatos) {
    grilla.innerHTML = `<p class="col-span-full animate-pulse rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">Cargando pokémon…</p>`;
    contador.textContent = '';
    return;
  }

  if (error && sinDatos) {
    grilla.innerHTML = `
      <div class="col-span-full rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-600 dark:bg-gray-800">
        <p class="font-semibold text-[#C62828] dark:text-red-400">No pudimos cargar los pokémon.</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Revisa tu conexión e inténtalo de nuevo. (${error})</p>
        <button type="button" data-reintentar
                class="mt-4 rounded-lg bg-[#EF5350] px-5 py-2 font-semibold text-white transition hover:bg-[#C62828] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF5350]">
          Reintentar
        </button>
      </div>`;
    contador.textContent = '';
    return;
  }

  const lista = listaActual();
  const visibles = filtrarPokemones(lista, filtros);
  if (visibles.length === 0) {
    const mensaje = vista === 'favoritos' && favoritos.length === 0
      ? 'Aún no tienes favoritos. Toca el ♡ de cualquier Pokémon.'
      : 'Ningún Pokémon coincide con la búsqueda.';
    grilla.innerHTML = `<p class="col-span-full rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">${mensaje}</p>`;
  } else {
    grilla.innerHTML = visibles.map(tarjetaHTML).join('');
  }
  contador.textContent =
    `${visibles.length} de ${lista.length} ${vista === 'favoritos' ? 'favoritos' : 'pokémon'} · ${contarDobleTipo(visibles)} con doble tipo`;
};

const formBusqueda = document.querySelector('#form-busqueda');
const inputBusqueda = document.querySelector('#busqueda');
const selectTipo = document.querySelector('#filtro');

inputBusqueda.addEventListener('input', (evento) => {
  filtros.texto = evento.target.value;
  render();
});

selectTipo.addEventListener('change', (evento) => {
  filtros.tipo = evento.target.value;
  render();
});

formBusqueda.addEventListener('submit', (evento) => evento.preventDefault());

grilla.addEventListener('click', (evento) => {
  if (evento.target.closest('[data-reintentar]')) {
    cargar();
    return;
  }
  const corazon = evento.target.closest('[data-fav]');
  if (corazon) {
    const pokemon = buscarPorId(listaActual(), Number(corazon.dataset.fav));
    favoritos = alternarFavorito(favoritos, pokemon);
    guardarFavoritos(favoritos);
    render();
    return;
  }
  const boton = evento.target.closest('[data-id]');
  if (!boton) return;
  const pokemon = buscarPorId(listaActual(), Number(boton.dataset.id));
  abrirDetalle(pokemon);
});

btnMas.addEventListener('click', () => cargar());

const cargar = async () => {
  cargando = true;
  error = null;
  render();
  try {
    const datos = await obtenerPokemones(siguiente);
    pokemones = [...pokemones, ...datos.results];
    siguiente = datos.info.next;
  } catch (e) {
    error = e.message;
    console.error(e);
  }
  cargando = false;
  render();
};

cargar();
