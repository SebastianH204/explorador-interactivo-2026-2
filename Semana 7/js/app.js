import { pokemones } from './datos.js';
import { filtrarPokemones, contarDobleTipo, buscarPorId } from './logica.js';

const filtros = { texto: '', tipo: '' };

const TIPOS = {
  grass:    { texto: 'Planta',    clases: 'bg-green-100 text-green-700' },
  poison:   { texto: 'Veneno',    clases: 'bg-purple-100 text-purple-700' },
  fire:     { texto: 'Fuego',     clases: 'bg-orange-100 text-orange-700' },
  water:    { texto: 'Agua',      clases: 'bg-sky-100 text-sky-700' },
  electric: { texto: 'Eléctrico', clases: 'bg-yellow-100 text-yellow-700' },
  ghost:    { texto: 'Fantasma',  clases: 'bg-violet-100 text-violet-700' },
  normal:   { texto: 'Normal',    clases: 'bg-stone-200 text-stone-700' },
  psychic:  { texto: 'Psíquico',  clases: 'bg-pink-100 text-pink-700' },
  fighting: { texto: 'Lucha',     clases: 'bg-red-100 text-red-700' },
  ice:      { texto: 'Hielo',     clases: 'bg-cyan-100 text-cyan-700' },
};

const chipTipo = (t) => `
  <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIPOS[t.type.name].clases}">${TIPOS[t.type.name].texto}</span>`;

const tarjetaHTML = (p) => `
  <article class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow transition
                  hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800">
    <div class="overflow-hidden bg-slate-100 dark:bg-slate-700">
      <img src="${p.sprites.other['official-artwork'].front_default}" alt="${p.name}"
           class="aspect-square w-full object-contain p-4 transition group-hover:scale-105">
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <p class="text-xs font-semibold text-slate-400">#${p.id}</p>
      <h3 class="text-lg font-bold capitalize text-slate-900 dark:text-white">${p.name}</h3>
      <div class="flex gap-2">${p.types.map(chipTipo).join('')}</div>
      <p class="text-sm text-slate-500 dark:text-slate-400">Altura ${p.height / 10} m · Peso ${p.weight / 10} kg</p>
      <button type="button" data-id="${p.id}"
              class="mt-auto rounded-lg bg-indigo-600 py-2 font-semibold text-white transition
                     hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2
                     focus-visible:outline-indigo-600">
        Ver detalle
      </button>
    </div>
  </article>`;

const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');

btnMenu.addEventListener('click', function () {
  menu.classList.toggle('hidden');
  const abierto = !menu.classList.contains('hidden');
  btnMenu.setAttribute('aria-expanded', abierto);
});

const modal = document.getElementById('modal-detalle');

const abrirDetalle = (pokemon) => {
  const { id, name, weight, height, types, abilities, sprites } = pokemon;
  document.getElementById('modal-nombre').textContent = name;
  document.getElementById('modal-img').src = sprites.other['official-artwork'].front_default;
  document.getElementById('modal-img').alt = name;
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

const render = () => {
  const visibles = filtrarPokemones(pokemones, filtros);
  if (visibles.length === 0) {
    grilla.innerHTML = `<p class="col-span-full rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">Ningún pokémon coincide con la búsqueda.</p>`;
  } else {
    grilla.innerHTML = visibles.map(tarjetaHTML).join('');
  }
  contador.textContent =
    `${visibles.length} de ${pokemones.length} pokémon · ${contarDobleTipo(visibles)} con doble tipo`;
};

const formBusqueda = document.querySelector('#form-busqueda');
const inputBusqueda = document.querySelector('#busqueda');
const selectTipo = document.querySelector('#filtro-tipo');

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
  const boton = evento.target.closest('[data-id]');
  if (!boton) return;
  const pokemon = buscarPorId(pokemones, Number(boton.dataset.id));
  abrirDetalle(pokemon);
});

render();
