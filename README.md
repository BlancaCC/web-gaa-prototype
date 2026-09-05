# Web GAA

How to lunch the web

```
python3 -m http.server 8000
```
The open the web page at 

```
http://localhost:8000
```


## Events

Events shown on the site are managed entirely through a single file:

```
data/events.json
```

No code changes are needed to add, edit, or remove an event — just edit this JSON file.

### How it works

- `events.js` reads `data/events.json` and automatically splits events into **Upcoming** and **Previous** based on today's date and the event's `date`/`time`.
- Events are shown newest/soonest first in each group.
- If an event has no upcoming events at all, the "Upcoming" section shows a friendly empty message instead of breaking.
- The page updates automatically when the language is switched (EN/ES).

### Adding a new event

1. Open `data/events.json`.
2. Copy an existing event object (the `{ ... }` block) as a template.
3. Paste it as a new entry in the array and fill in the fields below.
4. Save the file — no build step or restart is required.

### Field reference

| Field | Required | Type | Description |
|---|---|---|---|
| `id` | ✅ | string | Unique identifier for the event (e.g. `"my-talk-2026"`). Not shown to users, just needs to be unique. |
| `title` | ✅ | string or `{ en, es }` | Event title. Use `{ "en": "...", "es": "..." }` for translations, or a plain string if only one language is needed. |
| `date` | ✅ | string | Event date in `YYYY-MM-DD` format. This is what determines upcoming vs. previous. |
| `time` | ⬜ | string | Event time in 24h `HH:MM` format (e.g. `"10:30"`). Defaults to midnight if omitted. |
| `location` | ⬜ | string or `{ en, es }` | Physical location / venue. |
| `online` | ⬜ | object | Online meeting info: `{ "platform": "Microsoft Teams", "url": "https://..." }`. |
| `speaker` | ⬜ | object | `{ "name": "...", "affiliation": "..." }`. `affiliation` can be a string or `{ en, es }`. |
| `description` | ⬜ | string or `{ en, es }` | Full abstract / description of the event. |
| `image` | ⬜ | string | Path to an image (e.g. `"assets/images/events/my-image.png"`). Shown at the top of the event card. |
| `type` | ⬜ | string | Short label such as `"seminar"`, `"workshop"`, `"conference"`. |
| `tags` | ⬜ | string[] | List of keyword tags, e.g. `["Robotics", "Computer Vision"]`. |
| `links` | ⬜ | object | Any of: `meeting`, `slides`, `recording`, `documentation`, `additionalMaterials`. Each is a URL string or `null`. Only links with a real URL are shown. |

### Example entry

```json
{
    "id": "example-talk-2026",
    "title": {
        "en": "An Example Talk Title",
        "es": "Un título de charla de ejemplo"
    },
    "date": "2026-11-20",
    "time": "16:00",
    "location": {
        "en": "Room 101, Main Building",
        "es": "Sala 101, Edificio Principal"
    },
    "online": {
        "platform": "Zoom",
        "url": "https://example.com/zoom-link"
    },
    "speaker": {
        "name": "Jane Doe",
        "affiliation": {
            "en": "University of Example",
            "es": "Universidad de Ejemplo"
        }
    },
    "description": {
        "en": "A short abstract describing what the talk is about.",
        "es": "Un resumen breve de qué trata la charla."
    },
    "image": "assets/images/events/example-talk.png",
    "type": "seminar",
    "tags": ["Example Tag", "Another Tag"],
    "links": {
        "meeting": "https://example.com/zoom-link",
        "slides": "files/example-talk-slides.pdf",
        "recording": null,
        "documentation": null,
        "additionalMaterials": null
    }
}
```

### Tips

- **Bilingual fields** (`title`, `location`, `description`, `speaker.affiliation`) accept either a plain string or a `{ "en": "...", "es": "..." }` object. If you only provide English, it will also be used as the fallback for other languages.
- **Unused fields**: any optional field can be omitted entirely, or set to `null` — it just won't be rendered.
- **Images**: keep them in `assets/images/events/` for consistency with existing events.
- **Past events keep working automatically**: once an event's date passes, it moves from "Upcoming" to "Previous" on its own — you don't need to move it manually or delete it.
- **Validate your JSON** before saving (e.g. with a JSON linter or your editor's built-in validation) — a single missing comma will break the whole events list.


## Research Topics / Temas de Investigación

**EN:** The topic cards on the "Research" section (things like *Generative AI*, *Kernel Methods*, *Temporal Predictions*, *Robotics*...) are managed entirely through a single file:

**ES:** Las tarjetas de temas de la sección "Research" (cosas como *IA Generativa*, *Métodos de Núcleo*, *Predicciones Temporales*, *Robótica*...) se gestionan por completo a través de un único fichero:

```
data/research.json
```

No code changes are needed to add, edit, or remove a topic — just edit this JSON file.
*(No es necesario tocar código para añadir, editar o eliminar un tema — basta con editar este fichero JSON.)*

### How it works / Cómo funciona

- **EN:** `research.js` reads `data/research.json` and renders one card per entry inside `#research-container`. The page updates automatically when the language is switched (EN/ES), just like People and Events.
- **ES:** `research.js` lee `data/research.json` y renderiza una tarjeta por cada entrada dentro de `#research-container`. La página se actualiza automáticamente al cambiar de idioma (EN/ES), igual que People y Events.

### Adding a new topic / Añadir un nuevo tema

1. Open `data/research.json` / Abre `data/research.json`.
2. Copy an existing topic object (the `{ ... }` block) as a template. / Copia un objeto de tema existente (el bloque `{ ... }`) como plantilla.
3. Paste it as a new entry in the array and fill in the fields below. / Pégalo como una nueva entrada del array y rellena los campos de abajo.
4. Save the file — no build step or restart is required. / Guarda el fichero — no hace falta compilar ni reiniciar nada.

### Field reference / Referencia de campos

| Field / Campo | Required / Obligatorio | Type / Tipo | Description (EN) | Descripción (ES) |
|---|---|---|---|---|
| `id` | ✅ | string | Unique identifier for the topic (e.g. `"generative-ai"`). Not shown to users, just needs to be unique. | Identificador único del tema (p. ej. `"generative-ai"`). No se muestra al usuario, solo debe ser único. |
| `icon` | ⬜ | string (emoji) | An emoji shown inside the icon box, e.g. `"🤖"`. Defaults to 🔬 if omitted. | Un emoji que se muestra en el recuadro del icono, p. ej. `"🤖"`. Si se omite, se usa 🔬 por defecto. |
| `topic` | ✅ | string or `{ en, es }` | The topic's title/name. | El título/nombre del tema. |
| `description` | ✅ | string or `{ en, es }` | One or two sentences describing the topic. | Una o dos frases describiendo el tema. |

- **Bilingual fields** (`topic`, `description`) accept either a plain string or a `{ "en": "...", "es": "..." }` object, exactly like `events.json`. If you only provide English, it will also be used as the fallback for Spanish.
  *(Los campos bilingües aceptan una cadena simple o un objeto `{ "en": "...", "es": "..." }`, igual que en `events.json`. Si solo pones inglés, también se usará como alternativa para español.)*
- **Order matters:** topics are shown in the same order as they appear in the JSON array.
  *(El orden importa: los temas se muestran en el mismo orden en que aparecen en el array del JSON.)*

### Example entry / Ejemplo

```json
{
    "id": "example-topic",
    "icon": "🧪",
    "topic": {
        "en": "Example Topic",
        "es": "Tema de Ejemplo"
    },
    "description": {
        "en": "A short description of what this research line is about.",
        "es": "Una breve descripción de qué trata esta línea de investigación."
    }
}
```

## Publications / Publicaciones

**EN:** Publications are split into one JSON file per year, plus a small index file that says which years exist:

**ES:** Las publicaciones están divididas en un fichero JSON por año, más un pequeño fichero índice que indica qué años existen:

```
data/
  publications-years.json     <- ["2026", "2025", "2024", "2023"]
  2026/
    publications.json
  2025/
    publications.json
  2024/
    publications.json
  2023/
    publications.json
```

**EN:** `data/publications-years.json` is the ONLY place that lists which years exist — this is what makes the year "variable": add a new year whenever you need it, and the site picks it up automatically without any code changes.

**ES:** `data/publications-years.json` es el ÚNICO sitio que lista qué años existen — esto es lo que hace que el año sea "variable": añade un año nuevo cuando lo necesites, y el sitio lo detecta automáticamente sin cambiar código.

They appear in TWO places / Aparecen en DOS sitios:

1. **Main page / Página principal** (`index.html`, "Publications" section) — only shows the publications with **`"relevant": true`** (from any year), sorted newest first, one per row, followed by a "View all publications" link.
   *(Solo muestra las publicaciones con **`"relevant": true`** (de cualquier año), ordenadas de más reciente a más antigua, una por fila, seguidas de un enlace "Ver todas las publicaciones".)*
2. **Full view / Vista completa** (`publications.html`) — shows **every** publication from **every** year, with a search box and filters by year, type and tag, plus a sort order selector (newest first / oldest first / title A–Z). Filter options are built automatically from whatever is in the data — you never need to edit any `.js` file to add a new year, type or tag.
   *(Muestra **todas** las publicaciones de **todos** los años, con un buscador y filtros por año, tipo y etiqueta, además de un selector de orden (más recientes primero / más antiguas primero / título A–Z). Las opciones de los filtros se generan automáticamente a partir de lo que haya en los datos — nunca hace falta editar ningún fichero `.js` para añadir un año, tipo o etiqueta nuevo.)*

No code changes are needed to add, edit or remove a publication — just edit the JSON files.
*(No es necesario tocar código para añadir, editar o eliminar una publicación — basta con editar los ficheros JSON.)*

### Adding a publication to an existing year / Añadir una publicación a un año existente

1. Open `data/<year>/publications.json` (e.g. `data/2026/publications.json`).
   *(Abre `data/<año>/publications.json`, p. ej. `data/2026/publications.json`.)*
2. Copy an existing publication object as a template, paste it as a new array entry, and fill in the fields below.
   *(Copia un objeto de publicación existente como plantilla, pégalo como nueva entrada del array, y rellena los campos de abajo.)*

### Adding a brand-new year / Añadir un año completamente nuevo

1. Create a new folder under `data/`, named exactly the year, e.g. `data/2027/`.
   *(Crea una carpeta nueva bajo `data/`, con el nombre exacto del año, p. ej. `data/2027/`.)*
2. Inside it, create `publications.json` containing a JSON array (start with `[]` if empty, or copy the shape from another year's file).
   *(Dentro, crea `publications.json` con un array JSON — empieza con `[]` si está vacío, o copia la forma de otro fichero de año.)*
3. Add `2027` to the list in `data/publications-years.json`.
   *(Añade `2027` a la lista en `data/publications-years.json`.)*
4. Save — no build step or restart is required.
   *(Guarda — no hace falta compilar ni reiniciar nada.)*

- **Tip:** each publication's `year` field is optional now — if you leave it out, it's automatically filled in from the folder it's stored in. It's still useful to set it explicitly if a publication needs to be sorted/filed under a different year than its folder (rare, but supported).
  *(Consejo: el campo `year` de cada publicación ahora es opcional — si lo omites, se rellena automáticamente con el de la carpeta donde está guardada. Sigue siendo útil ponerlo explícitamente si una publicación necesita ordenarse/archivarse bajo un año distinto al de su carpeta — algo raro, pero compatible.)*

### Field reference / Referencia de campos

| Field / Campo | Required / Obligatorio | Type / Tipo | Description (EN) | Descripción (ES) |
|---|---|---|---|---|
| `id` | ✅ | string | Unique identifier (e.g. `"coco-loss-2026"`). | Identificador único (p. ej. `"coco-loss-2026"`). |
| `relevant` | ✅ | boolean | `true` to show it on the main-page teaser, `false` to only show it in the full view. | `true` para mostrarla en el avance de la página principal, `false` para mostrarla solo en la vista completa. |
| `title` | ✅ | string | The publication title, as published (not translated). | El título de la publicación, tal como se publicó (no se traduce). |
| `authors` | ⬜ | string[] | List of author names, in order. | Lista de nombres de autores, en orden. |
| `venue` | ⬜ | string | Journal / conference / thesis institution, etc. | Revista / congreso / institución de la tesis, etc. |
| `year` | ✅ | number | Publication year — used for sorting and for the year filter. | Año de publicación — se usa para ordenar y para el filtro de año. |
| `date` | ⬜ | string (`YYYY-MM-DD`) | Exact date, if known. When present it's used instead of `year` for more precise sorting. | Fecha exacta, si se conoce. Si está presente, se usa en lugar de `year` para un orden más preciso. |
| `type` | ⬜ | string | One of `journal`, `conference`, `workshop`, `preprint`, `thesis`, `book-chapter`, or any custom value. Known values get a nice translated label automatically; unknown ones are shown capitalised. | Uno de `journal`, `conference`, `workshop`, `preprint`, `thesis`, `book-chapter`, o cualquier valor personalizado. Los valores conocidos obtienen una etiqueta traducida automáticamente; los desconocidos se muestran capitalizados. |
| `tags` | ⬜ | string[] | Keywords, also used to populate the tag filter. | Palabras clave, también se usan para rellenar el filtro de etiquetas. |
| `abstract` | ⬜ | string or `{ en, es }` | Short summary shown under the venue/year line. | Resumen corto que se muestra bajo la línea de revista/año. |
| `links` | ⬜ | object | **Fully flexible** — any key is allowed. Common keys (`pdf`, `doi`, `arxiv`, `code`, `dataset`, `slides`, `video`, `poster`, `bibtex`) get a nice label automatically; any other key still renders fine, capitalised. Set a key to `null` (or omit it) to hide that link. | **Totalmente flexible** — se admite cualquier clave. Las claves comunes (`pdf`, `doi`, `arxiv`, `code`, `dataset`, `slides`, `video`, `poster`, `bibtex`) obtienen una etiqueta bonita automáticamente; cualquier otra clave también se muestra bien, capitalizada. Pon una clave a `null` (u omítela) para ocultar ese enlace. |

### Example entry / Ejemplo

Inside the `data/<year>/publications.json`

```json
{
    "id": "example-2026",
    "relevant": true,
    "title": "An Example Publication Title",
    "authors": ["A. Author", "B. Author"],
    "venue": "Example Journal",
    "year": 2026,
    "date": "2026-03-15",
    "type": "journal",
    "tags": ["generative ai"],
    "abstract": {
        "en": "A short abstract in English.",
        "es": "Un resumen breve en español."
    },
    "links": {
        "pdf": "publications/pdf/example-2026.pdf",
        "arxiv": "https://arxiv.org/abs/0000.00000",
        "code": "https://github.com/example-org/example-repo"
    }
}
```

### Required translation keys / Claves de traducción necesarias

**EN:** `publications.js` / `publications-all.js` use a few new `data-i18n` keys for static labels (search placeholder, filter defaults, sort options, messages). Your `i18n.js` / locale files weren't part of what I could see, so please add these keys wherever `nav.people`, `btn.learnMore`, etc. currently live:

**ES:** `publications.js` / `publications-all.js` usan algunas claves `data-i18n` nuevas para las etiquetas estáticas (placeholder de búsqueda, valores por defecto de los filtros, opciones de orden, mensajes). No tenía acceso a tu `i18n.js` / ficheros de idioma, así que añade estas claves donde ya vivan `nav.people`, `btn.learnMore`, etc.:

| Key / Clave | English | Español |
|---|---|---|
| `publications.viewAll` | View all publications → | Ver todas las publicaciones → |
| `publications.back` | ← Back to home | ← Volver al inicio |
| `publications.searchPlaceholder` | Search by title, author or venue… | Buscar por título, autor o revista… |
| `publications.filterYear` | All years | Todos los años |
| `publications.filterType` | All types | Todos los tipos |
| `publications.filterTag` | All tags | Todas las etiquetas |
| `publications.sortDateDesc` | Newest first | Más recientes primero |
| `publications.sortDateAsc` | Oldest first | Más antiguas primero |
| `publications.sortTitleAsc` | Title (A–Z) | Título (A–Z) |
| `publications.noResults` | No publications match your filters. | Ninguna publicación coincide con tus filtros. |
| `publications.noItems` | No publications yet. | Aún no hay publicaciones. |

**EN:** Note: the search box uses `data-i18n-placeholder` for its placeholder text. If your `applyTranslations()` only translates `textContent` (not placeholders), the placeholder will simply stay in English — harmless, but let me know if you'd like that extended.

**ES:** Nota: el buscador usa `data-i18n-placeholder` para el texto del placeholder. Si tu `applyTranslations()` solo traduce `textContent` (no placeholders), el placeholder simplemente se quedará en inglés — inofensivo, pero avísame si quieres que lo extienda.