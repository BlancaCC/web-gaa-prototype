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