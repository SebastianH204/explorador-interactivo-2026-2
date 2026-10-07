# Bitácora de IA

## 2026-10-06 · Modal de detalle

**Herramienta:** Claude

**Spec que usé:**

```
QUÉ: modal para ver el detalle de un Pokémon en mi explorador.

ESTRUCTURA
- <dialog id="modal-detalle"> abierto con showModal().
- Imagen arriba, <h2> con el nombre, una lista <dl> con número, tipo,
  altura, peso y habilidades, y un botón "Cerrar".

ESTILO
- Tailwind CSS v4 (no v3): sin tailwind.config.js, sin CSS propio, sin style="".
- rounded-2xl, max-w-md, sombra grande y el fondo de atrás oscuro y transparente.
- Modo oscuro con dark: (fondo slate-800 y letras claras).

COMPORTAMIENTO
- Se abre desde cualquier botón "Ver detalle" de las tarjetas.
- Cada tarjeta muestra en el modal los datos de su propio Pokémon.
- Se cierra con Esc, con el botón Cerrar (<form method="dialog">)
  y dando clic en el fondo oscuro.

RESTRICCIONES
- HTML y JavaScript normal en el mismo archivo, sin librerías.
- aria-labelledby apuntando al h2 y alt en la imagen.

CONTEXTO (https://pokeapi.co/api/v2/pokemon/25):
{"id":25,"name":"pikachu","types":[{"type":{"name":"electric"}}],
 "height":4,"weight":60,
 "abilities":[{"ability":{"name":"static"}},{"ability":{"name":"lightning-rod"}}]}
```

**Auditoría contra la spec:**
- [x] Usa `<dialog>` y `showModal()`
- [x] Se cierra con Esc y con el botón Cerrar
- [x] Se cierra dando clic en el fondo oscuro
- [ ] Al principio todas las tarjetas abrían a Pikachu porque los datos del modal estaban fijos. Lo arreglé poniéndole a cada botón sus datos con `data-nombre`, `data-imagen`, etc., y leyéndolos con `boton.dataset` antes de abrir el modal (como en el reto opcional de la clase)
- [ ] La API da la altura y el peso en decímetros y hectogramos, así que tocó dividir entre 10 (4 → 0.4 m, 60 → 6 kg)

**Clases o sintaxis inventadas que encontré:**
- No encontré clases inventadas ni cosas de la versión 3 como `bg-opacity-50`.
- `btn-detalle` no es de Tailwind, es una clase mía para encontrar los botones desde JavaScript. Por eso IntelliSense no la reconoce.

**Qué no entendí y cómo lo resolví:**
- `backdrop:` → es para darle estilo al fondo oscuro que aparece detrás del modal.
- `m-auto` → sin eso el modal se pegaba arriba a la izquierda, porque Tailwind le quita los márgenes a todo.

**¿Puedo explicar cada línea?** Sí.

---

## 2026-10-06 · Dark mode

**Herramienta:** Claude

**Spec que usé:**

```
QUÉ: agregarle modo oscuro a mis componentes (navbar, formulario,
tarjetas, modal y footer).

ESTILO
- Tailwind CSS v4, solo con dark:, sin JavaScript ni CSS propio.
  Que siga el modo oscuro del sistema.
- Usa siempre estas parejas:
  Fondo de la página ... bg-slate-100   → dark:bg-slate-900
  Tarjetas y modal ..... bg-white       → dark:bg-slate-800
  Texto principal ...... text-slate-900 → dark:text-white
  Texto secundario ..... text-slate-500 → dark:text-slate-400
  Bordes ............... border-slate-300 → dark:border-slate-600

RESTRICCIONES
- No cambies las clases que ya están, solo agrega las dark:.
- Los chips de tipo se quedan igual.
- Que nada quede blanco ni con letra que no se lea.
```

**Auditoría contra la spec:**
- [x] Fondo, tarjetas, modal y textos con sus parejas
- [x] Input y select con `dark:border-slate-600 dark:bg-slate-800`
- [x] Los chips no se tocaron
- [ ] Los enlaces del menú en el celular quedaban casi blancos al pasar el mouse en modo oscuro. Les agregué `dark:hover:bg-slate-700`
- [ ] El fondo de las imágenes de las tarjetas quedaba como un cuadro blanco. Le puse `dark:bg-slate-700`

**Clases o sintaxis inventadas que encontré:**
- Ninguna, y no salió el `darkMode: 'class'` de la versión 3.

**Qué no entendí y cómo lo resolví:**
- `dark:hover:bg-slate-700` → se lee de izquierda a derecha: "en modo oscuro y cuando el mouse esté encima".
- Para probarlo sin cambiar Windows: DevTools → ⋮ → More tools → Rendering → `prefers-color-scheme: dark`.

**¿Puedo explicar cada línea?** Sí.
