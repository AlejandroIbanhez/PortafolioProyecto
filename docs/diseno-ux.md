# Documentación de diseño UX

Portafolio web del Proyecto Integrador «Estación MPS». Este documento resume las decisiones de diseño para quien mantenga la página.

## 1. Objetivo y audiencia

**Objetivo.** Que una persona entienda en menos de un minuto qué es la estación, cómo funciona y en qué estado real se encuentra, y que pueda profundizar o descargar el informe si lo necesita.

**Principio rector.** Honestidad del estado: lo verificado, lo pendiente y lo futuro se distinguen siempre con texto, y además con un código visual constante (piloto verde, piloto ámbar, contorno discontinuo).

**Audiencia.** Jurados y docentes, estudiantes del programa y personas externas (reclutadores, familiares, otros estudiantes).

## 2. Personas (resumen)

| Persona | Qué busca | Cómo responde la página |
| --- | --- | --- |
| **Docente o jurado.** Evalúa el proyecto, con poco tiempo, a menudo en portátil. | Rigor, estado real, metodología, costos y el informe. | Panel de estado en la cabecera, sección «Estado y resultados», protocolo de pruebas, tablas y descarga del PDF. |
| **Estudiante que continúa el proyecto.** Usará o mejorará la estación. | Cómo funciona, cómo se calibra, qué falta. | Diagrama y lógica de clasificación, calibración paso a paso, reglas de laboratorio, próximos pasos. |
| **Visitante externo.** Llega por un enlace, casi siempre en el móvil. | Entender rápido qué hicieron y verlo. | Frase inicial clara, foto del prototipo, galería ampliable, lenguaje sin jerga innecesaria. |

## 3. Arquitectura de información

Una sola página con navegación por anclas. El orden va de lo general a lo específico y deja el estado real a la vista desde el inicio.

1. **Inicio** (`#inicio`): título, qué es, estado actual, foto, datos del proyecto.
2. **Problema** (`#problema`): contexto industrial y académico, pregunta de investigación, objetivos, alcance.
3. **Funcionamiento** (`#funcionamiento`): diagrama SVG, cuatro pasos, tabla de lógica, ciclo del programa, calibración (desplegable).
4. **Componentes** (`#componentes`): seis módulos (mecánica, transporte, sensores, control, actuación, seguridad), reglas y normas.
5. **Metodología** (`#metodologia`): seis fases y cronograma de 16 semanas.
6. **Galería** (`#galeria`): fotos del montaje, planos y diagramas del apéndice.
7. **Estado** (`#estado`): verificado, pendiente, siguiente fase; análisis; protocolo de pruebas propuesto (`#protocolo`).
8. **Costos** (`#costos`): total, distribución por categoría, detalle (desplegable), componentes electrónicos.
9. **Conclusiones** (`#conclusiones`): aprendizajes, conclusiones, próximos pasos (`#proximos-pasos`).
10. **Equipo** (`#equipo`): autores y docente asesor.
11. **Referencias** (`#referencias`): bibliografía y descarga del informe.

Decisiones de contenido:

- El desvío con servomotores se presenta como «según los diagramas del apéndice» y se marca como no verificado. La neumática aparece solo como trabajo futuro.
- No se muestran porcentajes de precisión ni tiempos, porque no se han medido.
- El detalle largo (calibración, 14 partidas de costos) va en desplegables `<details>` para no alargar la lectura.

## 4. Sistema de diseño (tokens)

Definidos como propiedades CSS en `:root`, en `assets/css/styles.css`.

**Identidad.** Tablero de control industrial: fondo de papel técnico con retícula, etiquetas en tipografía monoespaciada como rótulos de bornera, ámbar de señalización como único color de marca, pilotos de estado y radios pequeños.

### Color

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--bg` | `#f5f4ef` | `#0f151b` | Fondo de página |
| `--bg-alt` | `#eceae2` | `#131b23` | Secciones alternas |
| `--surface` | `#ffffff` | `#18222c` | Tarjetas, paneles, tablas |
| `--ink` | `#15212c` | `#e6ecf1` | Texto principal |
| `--ink-muted` | `#4a5763` | `#a7b3bd` | Texto secundario |
| `--line` | `#d6d3c9` | `#2a3642` | Divisores decorativos |
| `--line-strong` | `#77838e` | `#6f7c88` | Bordes de controles |
| `--accent` | `#0a5a87` | `#74c4ee` | Enlaces y acción principal |
| `--signal` | `#ffb824` | `#ffb824` | Ámbar de señalización (siempre con texto oscuro) |
| `--ok` / `--ok-lamp` | `#1a6638` / `#1f9d55` | `#6fd698` / `#3ecf7c` | Verificado |
| `--warn` / `--warn-lamp` | `#85490a` / `#e09400` | `#ffc45c` / `#ffb824` | Pendiente |
| `--focus` | `#0a5a87` | `#ffb824` | Indicador de foco |

### Tipografía

- `--font-sans`: fuentes del sistema (`system-ui`, Segoe UI, Roboto…). Sin fuentes web.
- `--font-mono`: monoespaciada del sistema, para etiquetas, numeración y cabeceras de tabla.
- Escala: `--text-xs` 13 px, `--text-sm` 15 px, `--text-base` 17 px, `--text-lg` 20 px, y `--text-xl`, `--text-2xl`, `--text-3xl` fluidas con `clamp()`.
- Interlineado: 1,6 en texto y 1,15 en títulos.

### Espaciado, radios y layout

- Espaciado: `--space-1` a `--space-8` (4, 8, 12, 16, 24, 32, 48 y 72 px).
- Radios: `--radius-sm` 3 px, `--radius-md` 6 px, `--radius-lg` 10 px, `--radius-full`.
- Contenedor: `--container` 70 rem; margen lateral `--gutter` de 16 px (24 px desde 768 px).

### Temas

- Por defecto se sigue `prefers-color-scheme`.
- El conmutador fija `data-theme="light"` o `data-theme="dark"` en `<html>` y lo guarda en `localStorage` (clave `mps-tema`). Un script mínimo en el `<head>` lo aplica antes de pintar para evitar parpadeo.

### Componentes

Botón (primario y secundario), panel, tarjeta (módulo, estado, futuro), piloto de estado, insignia, tabla con contenedor desplazable, desplegable, lista de fases, cronograma, galería, cifra destacada, lightbox.

## 5. Accesibilidad

### Decisiones

- **Estado sin depender del color.** Cada piloto va junto a su texto («Verificado», «Pendiente», «Siguiente fase»); lo futuro usa además contorno discontinuo.
- **Lightbox con `<dialog>` nativo.** `showModal()` aporta la captura del foco, el cierre con Escape y la inactivación del fondo. Al cerrar, el foco vuelve a la miniatura. Sin JavaScript, cada miniatura es un enlace normal a la imagen.
- **Menú móvil como revelación** (`aria-expanded` y `aria-controls`), no como modal. Se cierra con Escape y devuelve el foco al botón. Sin JavaScript, el menú se muestra siempre.
- **Tablas reales** con `caption`, `scope="col"` y `scope="row"`. Las tablas anchas se desplazan dentro de una región con nombre y enfocable, no la página.
- **Imágenes.** Texto alternativo descriptivo en cada una. Las tablas de costos tienen además su equivalente en HTML.
- **Diagrama SVG** con `role="img"`, `<title>` y `<desc>`, y la misma información en una lista ordenada.
- **Movimiento.** El revelado y el desplazamiento suave solo se activan con `prefers-reduced-motion: no-preference`.
- **Objetivos táctiles** de 44 px como mínimo en navegación, botones y controles del lightbox.

### Checklist WCAG 2.1 AA

| Criterio | Estado | Cómo se verificó |
| --- | --- | --- |
| 1.1.1 Contenido no textual | Cumple | Revisión manual: `alt` en las imágenes, iconos decorativos con `aria-hidden` |
| 1.3.1 Información y relaciones | Cumple | Landmarks, encabezados sin saltos de nivel, listas y tablas semánticas |
| 1.3.2 Secuencia significativa | Cumple | El orden del DOM coincide con el orden visual |
| 1.4.1 Uso del color | Cumple | Estados con texto y forma además del color |
| 1.4.3 Contraste de texto (4,5:1) | Cumple | Calculado sobre los tokens en ambos temas; mínimo 6,1:1 |
| 1.4.4 Cambio de tamaño del texto | Cumple por diseño | Unidades `rem` y tipografía fluida; no se probó zoom al 200 % |
| 1.4.10 Reajuste | Cumple | Sin scroll horizontal a 360, 440, 640, 768 y 1280 px |
| 1.4.11 Contraste de elementos no textuales (3:1) | Cumple | Bordes de controles y foco: mínimo 3,2:1 |
| 2.1.1 Teclado y 2.1.2 Sin trampas | Cumple | Menú, conmutador, desplegables y lightbox (apertura, flechas, cierre, retorno del foco) probados por script |
| 2.4.1 Evitar bloques | Cumple | Enlace «Saltar al contenido» |
| 2.4.2 Página titulada | Cumple | `<title>` descriptivo |
| 2.4.4 Propósito de los enlaces | Cumple | Textos descriptivos; las miniaturas incluyen «Ampliar imagen» |
| 2.4.6 Encabezados y etiquetas | Cumple | Revisión manual |
| 2.4.7 Foco visible | Cumple | Contorno de 3 px con `:focus-visible` |
| 2.3.3 / preferencia de movimiento reducido | Cumple | Reglas con `prefers-reduced-motion` |
| 3.1.1 Idioma de la página | Cumple | `lang="es"`; títulos en inglés de las referencias con `lang="en"` |
| 4.1.1 Análisis | Cumple | Sin `id` duplicados (comprobado por script) |
| 4.1.2 Nombre, función, valor | Cumple | Botones con nombre accesible, `aria-expanded`, `aria-current` |

**No verificado.** No se hizo prueba con lectores de pantalla reales (VoiceOver, NVDA, TalkBack), ni en Safari o Firefox, ni con zoom al 200 %. Se recomienda hacerlas antes de la sustentación.

## 6. Breakpoints

Enfoque mobile-first: los estilos base son para móvil y se amplían con `min-width`.

| Ancho | Cambios |
| --- | --- |
| Base (desde 360 px) | Una columna, menú plegable, galería de una o dos columnas |
| 480 px | Equipo en dos columnas |
| 768 px | Rejillas de dos columnas, cronograma en dos columnas, margen lateral de 24 px |
| 900 px | Cabecera principal en dos columnas (texto y foto) |
| 1100 px | Navegación horizontal completa, tarjetas y fases en tres columnas, diagrama junto a los pasos |

**Imágenes.** Las originales miden entre 400 y 950 px. Las miniaturas nunca superan el ancho natural y en el lightbox la imagen se muestra como máximo a su tamaño real.
