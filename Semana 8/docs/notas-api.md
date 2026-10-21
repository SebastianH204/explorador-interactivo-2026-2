# Notas de la PokéAPI

**1. URL de la lista:** `https://pokeapi.co/api/v2/pokemon?limit=24`

**2. Dónde está el array:** en `results`. Cada elemento es solo `{ name, url }`.

**3. Página siguiente:** `datos.next` (en la última página llega `null`). El total está en `datos.count`.

**4. ¿Trae todo lo que pinta la tarjeta?** No. La lista no trae imagen, tipos, peso ni altura. Hay que pedir el detalle de cada uno en su `url` (por ejemplo `https://pokeapi.co/api/v2/pokemon/25`). Por eso uso `Promise.all`: las 24 peticiones salen a la vez.

Rutas que uso del detalle:

- Imagen: `sprites.other['official-artwork'].front_default`
- Tipo: `types[0].type.name`
- Peso: `weight / 10` kg
- Altura: `height / 10` m
- Habilidades: `abilities[i].ability.name`

Cuando algo no existe responde 404 con `{"status": 404, "message": "Not Found"}`.

La PokéAPI sí pagina, así que el botón «Cargar más» usa `next`.
