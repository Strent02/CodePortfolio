import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('documentacion/plan_y_plantilla_pruebas');
fs.mkdirSync(OUT, { recursive: true });

const DATE = '14 de septiembre de 2026';
const AUTHOR = 'Pedro Bonilla';
const VERSION = '1.0';
const esc = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const h2 = (n, s) => `<h2><span>${n}</span>${s}</h2>`;
const h3 = (n, s) => `<h3>${n} ${s}</h3>`;
const p = (s, c = '') => `<p${c ? ` class="${c}"` : ''}>${s}</p>`;
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const ol = (xs) => `<ol>${xs.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const table = (headers, rows, widths = []) => `<table><colgroup>${headers.map((_, i) => `<col${widths[i] ? ` style="width:${widths[i]}"` : ''}>`).join('')}</colgroup><thead><tr>${headers.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const callout = (title, body, kind = '') => `<aside class="${kind}"><strong>${title}</strong>${body}</aside>`;
const status = (s, k) => `<span class="status ${k}">${s}</span>`;
const pageBreak = '<div class="page-break"></div>';

function cover(title, subtitle, code) {
  return `<section class="cover"><div class="brand">&lt;/&gt;</div><div class="kicker">CODEPORTFOLIO · PRUEBAS DE SOFTWARE</div><h1>${title}</h1><p class="subtitle">${subtitle}</p><div class="accent"></div>${table(['Control', 'Valor'], [
    ['Código documental', code], ['Versión', VERSION], ['Fecha', DATE], ['Autor', AUTHOR],
    ['Estado', 'Propuesto / pendiente de aprobación y ejecución'], ['Proyecto', 'CodePortfolio — red social de portafolios de código'],
  ], ['32%', '68%'])}<p class="footnote">Documento interno · Basado en plantilla RUP suministrada por el usuario</p></section>${pageBreak}`;
}

function control() {
  return `<h2>Control del documento</h2><h3>Historial de revisiones</h3>${table(['Fecha', 'Versión', 'Descripción', 'Autor'], [
    ['14/09/2026', '1.0', 'Versión inicial adaptada a CodePortfolio y a la plantilla de casos de prueba suministrada.', AUTHOR],
  ], ['18%', '12%', '50%', '20%'])}<h3>Revisión y aprobación</h3>${table(['Rol', 'Nombre', 'Decisión', 'Firma / fecha'], [
    ['Responsable del producto', AUTHOR, '[ ] Aprobar  [ ] Rechazar', '________________'],
    ['Responsable de calidad', AUTHOR, '[ ] Aprobar  [ ] Rechazar', '________________'],
  ])}`;
}

const css = `
  @page { size: Letter; margin: 18mm 16mm; @bottom-center { content: "CodePortfolio · " string(doccode) " · Página " counter(page) " de " counter(pages); color:#7c746a; font:8pt Arial; } }
  @page:first { @bottom-center { content:""; } }
  *{box-sizing:border-box} html{font-family:Arial,Helvetica,sans-serif;color:#29251f;font-size:10.2pt;line-height:1.43} body{margin:0}
  .doccode{string-set:doccode content(text);display:none}.cover{min-height:235mm;display:flex;flex-direction:column;justify-content:center;padding:10mm 8mm}
  .brand{width:24mm;height:24mm;border-radius:7mm;display:grid;place-items:center;background:linear-gradient(145deg,#9b7d50,#665033);color:#fff;font:bold 20pt Consolas,monospace;box-shadow:0 5mm 14mm rgba(85,65,40,.18)}
  .kicker{margin-top:17mm;color:#8a6f47;font-size:8.5pt;font-weight:700;letter-spacing:1.8pt} h1{margin:4mm 0 3mm;font:500 30pt/1.08 Georgia,serif;color:#201d19}
  .subtitle{max-width:150mm;font:13pt/1.45 Georgia,serif;color:#665f57}.accent{width:36mm;height:1.5mm;border-radius:2mm;background:#3f7d5e;margin:7mm 0}.footnote{margin-top:auto;color:#877e73;font-size:8.5pt}
  h2{break-after:avoid;margin:9mm 0 4mm;padding-bottom:2mm;border-bottom:.35mm solid #d8c9b5;font:19pt Georgia,serif;color:#302a25}h2 span{color:#8a6f47;margin-right:2mm}
  h3{break-after:avoid;margin:6mm 0 2mm;font-size:12pt;color:#3f6d55}p{margin:0 0 3mm;text-align:justify}.lead{font-size:11pt;color:#514b44}ul,ol{margin:1.5mm 0 4mm 6mm;padding-left:5mm}li{margin-bottom:1.2mm}
  table{width:100%;border-collapse:collapse;margin:2.5mm 0 5mm;font-size:8.5pt;break-inside:auto}thead{display:table-header-group}tr{break-inside:avoid}th{padding:2.2mm;text-align:left;vertical-align:bottom;color:#fff;background:#6d5735;border:.2mm solid #6d5735}td{padding:2mm 2.2mm;vertical-align:top;border:.2mm solid #d9d2c8}tbody tr:nth-child(even) td{background:#f7f4ef}
  aside{break-inside:avoid;margin:4mm 0;padding:3.2mm 4mm;border-left:1.4mm solid #8a6f47;background:#f6f0e7}aside strong{display:block;margin-bottom:1mm;color:#6d5735}aside.warn{border-left-color:#b36b35;background:#fff4e9}aside.good{border-left-color:#3f7d5e;background:#edf7f1}
  .status{display:inline-block;white-space:nowrap;padding:.5mm 1.5mm;border-radius:4mm;font-size:7.4pt;font-weight:700;text-transform:uppercase}.ok{background:#dcefe4;color:#2f694c}.pending{background:#f3e3dc;color:#934638}.partial{background:#fff0ce;color:#805d18}
  .page-break{break-after:page}.case{break-before:page}.case-title{display:flex;gap:3mm;align-items:baseline}.case-id{color:#8a6f47;font:700 11pt Consolas,monospace}.blank{min-height:10mm}.blank-lg{min-height:20mm}.checks{font-size:9pt;word-spacing:2mm}.small{font-size:8.5pt;color:#6d665f}code{font-family:Consolas,monospace;font-size:.92em}
`;
function doc(title, subtitle, code, body) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body><span class="doccode">${code}</span>${cover(title, subtitle, code)}${body}</body></html>`;
}

const requirementMap = [
  ['RF-01', 'Registro de usuario', 'CP-001, CP-002'], ['RF-02–04', 'Login, refresh y logout', 'CP-003, CP-004'],
  ['RF-05–09', 'Gestión y privacidad de proyectos', 'CP-005, CP-006, CP-007'], ['RF-10–13', 'Feeds, listados y búsqueda', 'CP-008, CP-009'],
  ['RF-14–15', 'Perfil público y edición', 'CP-010'], ['RF-16–19', 'Interacciones y notificaciones', 'CP-011, CP-012'],
  ['RF-20–22', 'Vacantes y postulaciones', 'CP-013'], ['RF-23–24', 'Contraseña y baja', 'CP-014'],
  ['RF-25', 'Administración y autorización', 'CP-015'], ['RNF-01–16', 'Seguridad, calidad, rendimiento y operación', 'CP-003, CP-007, CP-015, suite técnica'],
];

const planBody = `${control()}
${h2('1.', 'Descripción y propósito')}
${p('Este plan organiza la verificación de CodePortfolio 1.0. Define qué se prueba, cómo, con qué datos y ambiente, quién responde, cuándo se suspende y qué evidencia permite recomendar o rechazar una liberación. Los casos se documentan en el segundo entregable con la estructura de la plantilla RUP suministrada.', 'lead')}
${h3('1.1', 'Objetivos')}${ul([
  'Verificar todos los requisitos funcionales y no funcionales aprobados.',
  'Demostrar que invitados, usuarios y administradores solo acceden a los recursos permitidos.',
  'Validar integridad, sesión, imágenes, migraciones, persistencia y reversión.',
  'Detectar defectos antes de producción y conservar evidencia reproducible de resultados y correcciones.',
])}
${h3('1.2', 'Elementos incluidos')}${table(['Elemento', 'Contenido'], [
  ['Frontend', 'React 19/Vite: acceso, feed, proyectos, perfiles, búsquedas, empleos, notificaciones y configuración.'],
  ['Backend', 'ASP.NET Core 8: controladores REST, JWT, reglas de autorización, repositorios y validación de imágenes.'],
  ['Datos', 'PostgreSQL 16, migraciones Entity Framework, restricciones, cascadas y volúmenes persistentes.'],
  ['Operación', 'Docker Compose, Nginx, variables, proxy, TLS, backup, restauración y rollback.'],
  ['Documentación', 'Requisitos, calidad, implantación, capacitación, riesgos y especificaciones de casos.'],
])}
${h3('1.3', 'Exclusiones')}${p('Mensajería y colaboración en la interfaz, panel gráfico administrativo, correo, pagos, alojamiento/ejecución de código y carga superior a 10.000 usuarios. Las pruebas destructivas no se ejecutan en producción.')}
${h2('2.', 'Estrategia de prueba')}
${table(['Nivel / tipo', 'Objetivo y técnica', 'Responsable', 'Evidencia'], [
  ['Revisión estática', 'Lint, compilación, revisión de código/configuración y búsqueda de secretos.', 'Desarrollo', 'Logs y lista de revisión'],
  ['Unitaria', 'JWT, validación binaria de imágenes, autorización, repositorios y reglas aisladas.', 'Desarrollo', 'Resultados xUnit / frontend'],
  ['Integración', 'API–PostgreSQL, migraciones, refresh token, ficheros y proxy.', 'Desarrollo + calidad', 'Reporte y datos antes/después'],
  ['Sistema/E2E', 'Instancias CP-001 a CP-015 en navegador y API real.', 'Calidad', 'Registro, capturas y defectos'],
  ['Seguridad', 'Matriz invitado/User/Admin, propiedad, token manipulado, rate limit, archivo y errores.', 'Calidad', 'Informe de seguridad'],
  ['Compatibilidad/accesibilidad', '360/768/1440 px; Chrome, Firefox, Safari y Edge; teclado, foco y movimiento reducido.', 'Calidad', 'Matriz y auditoría'],
  ['Rendimiento', 'Lecturas y flujos críticos con perfil de carga documentado.', 'Calidad', 'p50/p95/p99 y errores'],
  ['Recuperación/implantación', 'Backup, restore, humo y rollback cronometrado.', 'Implantación + calidad', 'Acta y checksums'],
])}
${h2('3.', 'Ambiente y datos de prueba')}
${table(['Aspecto', 'Especificación'], [
  ['Versión', 'Commit y artefactos inmutables; registrar hash, migraciones y digest de imágenes.'],
  ['Stack', '.NET 8, Node.js 20+, PostgreSQL 16, Docker/Compose y Nginx; reloj sincronizado.'],
  ['Navegadores', 'Versiones vigentes de Chrome, Firefox, Safari y Edge.'],
  ['Cuentas', '1 Admin, 3 User y 1 cuenta ajena por escenario; contraseñas exclusivas del laboratorio.'],
  ['Datos positivos', 'Proyectos publicados/borradores, imágenes válidas, follows, comentarios, vacantes y postulaciones.'],
  ['Datos negativos', 'Correo duplicado, token caducado/manipulado, recurso ajeno, archivo falso/>5 MB, duplicados y límites.'],
  ['Aislamiento', 'Base y volúmenes exclusivos; reinicio conocido. No usar datos ni secretos reales en capturas.'],
])}
${h2('4.', 'Criterios de entrada, salida, suspensión y reanudación')}
${table(['Control', 'Criterio'], [
  ['Entrada', 'Requisitos aprobados; candidato identificado; ambiente sano; datos cargados; casos revisados; defectos conocidos registrados.'],
  ['Salida', '100 % de casos planificados ejecutados; 100 % críticos aprobados; 0 defectos críticos/altos; RF/RNF trazados; informe firmado.'],
  ['Suspensión', 'Ambiente inestable, pérdida/exposición, candidato modificado o bloqueo que invalida más del 20 % de casos.'],
  ['Reanudación', 'Causa corregida; ambiente restaurado; candidato reconfirmado; casos afectados reiniciados y regresión acordada.'],
])}
${callout('Regla de evaluación', '“Realizada y satisfactoria” solo se marca cuando el resultado real coincide con el esperado y existe evidencia. “Bloqueada” no se contabiliza como aprobada.', 'warn')}
${h2('5.', 'Trazabilidad y cobertura')}${table(['Requisito', 'Función', 'Casos'], requirementMap, ['18%', '48%', '34%'])}
${h2('6.', 'Organización y responsabilidades')}
${table(['Actividad', 'Producto', 'Desarrollo', 'Calidad', 'Implantación'], [
  ['Aprobar alcance/candidato', 'A', 'C', 'C', 'I'], ['Preparar ambiente/datos', 'I', 'R', 'C', 'R'],
  ['Ejecutar estática/unitaria', 'I', 'R', 'C', 'I'], ['Ejecutar integración/E2E/seguridad', 'I', 'C', 'R', 'C'],
  ['Registrar y corregir defecto', 'I', 'R', 'A/R', 'C'], ['Autorizar liberación', 'A', 'C', 'R', 'C'],
])}
${p('Pedro Bonilla ocupa actualmente varios roles. Para reducir sesgo, la revisión final y la aprobación deberían incluir docente, cliente o revisor diferente del autor.')}
${h2('7.', 'Gestión de casos, evidencias y defectos')}
${h3('7.1', 'Estados permitidos')}${table(['Estado', 'Uso'], [
  ['Propuesta', 'Caso redactado, aún no revisado.'], ['Aprobada para ejecución', 'Caso y datos revisados.'],
  ['Pendiente', 'Aprobada pero no ejecutada.'], ['Realizada satisfactoria', 'Esperado = real y evidencia adjunta.'],
  ['Realizada no satisfactoria', 'Hay desviación y defecto asociado.'], ['Bloqueada', 'Precondición o ambiente impide obtener resultado.'],
  ['No aplica', 'Solo con justificación y aprobación.'],
])}
${h3('7.2', 'Severidad de defectos')}${table(['Severidad', 'Definición', 'Liberación'], [
  ['Crítica', 'Pérdida/exposición, autorización eludida o caída total.', 'Bloquea'], ['Alta', 'Flujo principal no funciona sin alternativa.', 'Bloquea'],
  ['Media', 'Función degradada con alternativa.', 'Requiere decisión'], ['Baja', 'Presentación o mejora menor.', 'Puede diferirse'],
])}
${p('La evidencia se nombra <code>&lt;versión&gt;_&lt;fecha&gt;_&lt;caso&gt;_&lt;resultado&gt;</code> y registra ejecutor, ambiente, datos, esperado, real y defecto. No contiene tokens, contraseñas ni datos personales.')}
${h2('8.', 'Cronograma')}${table(['Fase', 'Esfuerzo estimado', 'Salida'], [
  ['Preparación, revisión de casos y datos', '0,5 día', 'Ambiente listo'], ['Estática y unitarias', '0,5 día', 'Logs'],
  ['Integración y API', '1 día', 'Reporte'], ['Sistema CP-001–CP-015', '1,5 días', 'Registros RUP'],
  ['Seguridad, compatibilidad y accesibilidad', '1 día', 'Matrices'], ['Rendimiento y recuperación', '1 día', 'Métricas/acta'],
  ['Regresión e informe final', '0,5 día', 'Recomendación'],
])}
${h2('9.', 'Riesgos de la prueba')}${table(['Riesgo', 'Control'], [
  ['No disponer de .NET 8', 'Ejecutar en CI o máquina preparada y adjuntar TRX.'], ['Datos contaminados', 'Reset determinista y cuentas por caso.'],
  ['Una sola persona prueba su código', 'Revisión externa y casos negativos predefinidos.'], ['Cambios durante la ejecución', 'Congelar hash; reiniciar pruebas afectadas.'],
  ['Falta de navegadores/dispositivos', 'Matriz mínima y servicio remoto controlado.'], ['Evidencia con secretos', 'Redacción/revisión antes de archivar.'],
])}
${h2('10.', 'Estado actual y criterio de liberación')}${table(['Comprobación al 14/09/2026', 'Estado'], [
  ['Frontend: <code>npm run lint</code>', `${status('Conforme', 'ok')} Ejecutado sin error.`],
  ['Frontend: <code>npm run build</code>', `${status('Conforme', 'ok')} Vite generó el artefacto.`],
  ['Pruebas backend', `${status('No ejecutadas', 'pending')} El runtime .NET no está disponible en el entorno de revisión.`],
  ['Integración, sistema, seguridad dinámica, accesibilidad, rendimiento y restore', `${status('Pendientes', 'pending')} No hay evidencia actual.`],
  ['Candidato de liberación', `${status('No congelado', 'pending')} No existe etiqueta Git y hay cambios locales.`],
])}
${callout('Dictamen provisional', 'Plan completo y casos preparados, pero CodePortfolio todavía no cumple los criterios de salida. La liberación requiere ejecutar el conjunto y cerrar o aceptar formalmente sus hallazgos.', 'warn')}
${h2('11.', 'Informe resumen de pruebas')}${table(['Campo', 'Valor a diligenciar'], [
  ['Versión / hash', ''], ['Ambiente y fechas', ''], ['Ejecutor / revisor', ''], ['Planificadas / ejecutadas / aprobadas / fallidas / bloqueadas', ''],
  ['Defectos por severidad', ''], ['Requisitos cubiertos', ''], ['Riesgos residuales', ''], ['Recomendación', '[ ] Liberar  [ ] Liberar con riesgo  [ ] No liberar'],
  ['Aprobación / firma', ''],
])}`;

const cases = [
  {id:'CP-001', name:'Registro válido de usuario', req:'RF-01, RNF-01', type:'Sistema / positiva', pri:'Crítica',
   desc:'Comprobar que un visitante crea una cuenta de desarrollador con datos válidos y que el servidor asigna el rol User.',
   cond:'Aplicación disponible; correo no registrado; base en estado conocido; no hay sesión activa.',
   data:'Nombre: Ana Prueba; correo único generado; contraseña válida; biografía y ubicación opcionales.',
   steps:['Abrir Registro.','Completar los dos pasos con datos válidos.','Enviar el formulario.','Consultar la sesión/perfil y, con evidencia autorizada, el rol asignado.'],
   expected:'Cuenta creada; sesión iniciada; datos visibles; rol User; contraseña no aparece en respuestas.'},
  {id:'CP-002', name:'Validaciones y correo duplicado', req:'RF-01, RNF-01, RNF-07', type:'Sistema / negativa', pri:'Alta',
   desc:'Verificar rechazo de campos inválidos y de un correo existente sin filtrar información interna.',
   cond:'Existe una cuenta con el correo de prueba; formulario de registro disponible.',
   data:'Nombre vacío/límite; correo inválido y duplicado; contraseña corta; campos opcionales en límites.',
   steps:['Probar cada entrada inválida por separado.','Intentar avanzar/enviar.','Repetir con correo ya registrado.','Inspeccionar código y cuerpo de respuesta.'],
   expected:'La UI impide o la API rechaza; no crea cuenta; mensaje en español y sin trazas/SQL/secretos.'},
  {id:'CP-003', name:'Inicio de sesión y protección contra abuso', req:'RF-02, RNF-01, RNF-04, RNF-07', type:'Sistema / seguridad', pri:'Crítica',
   desc:'Validar login correcto, error neutro y límite de solicitudes de autenticación.',
   cond:'Usuario activo conocido; IP/cliente de prueba controlado; ventana del limitador reiniciada.',
   data:'Credenciales correctas; correo inexistente; contraseña incorrecta; 11 solicitudes en un minuto.',
   steps:['Iniciar con credenciales válidas.','Cerrar sesión de UI para repetir negativos.','Probar usuario/contraseña incorrectos.','Enviar 11 intentos dentro de un minuto.'],
   expected:'Login válido emite acceso/refresh; inválidos devuelven error neutro; exceso devuelve 429; sin trazas.'},
  {id:'CP-004', name:'Rotación, expiración y cierre de sesión', req:'RF-03, RF-04, RNF-02', type:'Integración / seguridad', pri:'Crítica',
   desc:'Comprobar el ciclo de vida del refresh token y la revocación al cerrar sesión.',
   cond:'Cuenta autenticada; acceso a cliente HTTP y reloj de prueba; token registrado como hash.',
   data:'Access vigente/caducado; refresh vigente, usado, revocado y caducado.',
   steps:['Renovar usando refresh vigente.','Reutilizar el refresh anterior.','Cerrar sesión con el nuevo refresh.','Intentar renovarlo; probar token caducado/manipulado.'],
   expected:'Rotación produce tokens nuevos; refresh usado/revocado/caducado falla; solo hashes persisten.'},
  {id:'CP-005', name:'Crear, editar y publicar proyecto', req:'RF-05, RF-07, RF-12', type:'Sistema / positiva', pri:'Crítica',
   desc:'Verificar el ciclo draft → published y la edición por el propietario.',
   cond:'User autenticado sin proyecto homónimo; feed y “Mis proyectos” disponibles.',
   data:'Título, descripción, demoUrl y repositoryUrl válidos; estados draft y published.',
   steps:['Crear proyecto como draft.','Comprobarlo en Mis proyectos.','Editar título/enlaces.','Cambiar a published.','Verificar feed/listado público.'],
   expected:'Cambios persistentes; draft no público; published visible; autor y estado correctos.'},
  {id:'CP-006', name:'Carga y sustitución de imagen', req:'RF-06, RNF-06', type:'Sistema / seguridad de archivos', pri:'Alta',
   desc:'Aceptar imágenes válidas y rechazar contenido/tamaño no permitido.',
   cond:'Proyecto propio existente; volumen de imágenes disponible.',
   data:'JPG/PNG/WEBP/GIF válidos; archivo >5 MB; ejecutable renombrado .jpg; archivo vacío.',
   steps:['Subir cada formato válido y abrir su URL.','Sustituir una imagen y verificar la nueva.','Probar tamaño excesivo.','Probar firma falsa y archivo vacío.'],
   expected:'Válidas se sirven con tipo correcto y nombre del servidor; inválidas se rechazan; anterior se elimina al sustituir.'},
  {id:'CP-007', name:'Privacidad y propiedad de proyecto', req:'RF-07, RF-08, RF-09, RNF-03', type:'Seguridad / negativa', pri:'Crítica',
   desc:'Impedir lectura/edición de borrador y escritura sobre proyecto ajeno.',
   cond:'User A posee draft y published; User B y Admin disponibles; sesión invitada disponible.',
   data:'ID de draft y published de A; tokens de A, B, Admin y token manipulado.',
   steps:['Solicitar draft como invitado y B.','Intentar editar/eliminar proyecto de A como B.','Repetir acceso autorizado como A y moderación como Admin.','Probar token manipulado.'],
   expected:'Invitado/B no distinguen draft; B no modifica/elimina; A sí; Admin solo según contrato; token inválido 401.'},
  {id:'CP-008', name:'Feed público y feed de seguidos', req:'RF-10, RF-11', type:'Sistema / integración', pri:'Alta',
   desc:'Validar visibilidad, orden, paginación y filtrado por relaciones.',
   cond:'Tres autores con fechas conocidas; proyectos published/draft; User sigue solo a uno.',
   data:'Páginas 1/2; size 1, 10, 50, 0 y 51.',
   steps:['Consultar feed público como invitado.','Verificar orden descendente y ausencia de drafts.','Consultar following como User.','Probar límites de paginación.'],
   expected:'Solo published; orden correcto; following solo seguidos; límites inválidos devuelven 400.'},
  {id:'CP-009', name:'Búsqueda global y filtros', req:'RF-12, RF-13', type:'Sistema / positiva y frontera', pri:'Media',
   desc:'Buscar proyectos, usuarios y vacantes sin revelar borradores.',
   cond:'Datos con término común y un draft coincidente; listado propio con ambos estados.',
   data:'Término existente, inexistente, espacios, caracteres especiales y >100 caracteres.',
   steps:['Buscar término existente.','Revisar categorías.','Buscar texto del draft como invitado.','Probar vacío y >100.','Filtrar proyectos propios por estado.'],
   expected:'Resultados correctos por categoría; draft ajeno ausente; entradas inválidas rechazadas; filtros propios exactos.'},
  {id:'CP-010', name:'Perfil público, edición y avatar', req:'RF-14, RF-15, RNF-06', type:'Sistema / seguridad', pri:'Alta',
   desc:'Validar datos públicos, contadores, edición propia y privacidad del correo/hash.',
   cond:'User A con actividad; User B; imagen válida; sesiones disponibles.',
   data:'Nombre, bio, ubicación en límites; avatar válido e inválido.',
   steps:['Abrir perfil de A como invitado.','Comprobar proyectos/contadores y ausencia de correo/hash.','Editar perfil/avatar como A.','Intentar modificar A usando B.'],
   expected:'Perfil público mínimo; cambios propios persistentes; B no edita; avatar validado.'},
  {id:'CP-011', name:'Reacción, comentario y seguimiento', req:'RF-16, RF-17, RF-18', type:'Sistema / integración', pri:'Alta',
   desc:'Verificar interacciones sociales, unicidad, autorizaciones y contadores.',
   cond:'A posee proyecto published; B autenticado; relación inexistente al inicio.',
   data:'Comentario válido; IDs de usuarios/proyecto.',
   steps:['B da like dos veces y lo retira.','B comenta; A/B/tercero prueban borrado según permiso.','B sigue dos veces a A y deja de seguir.','Intentar auto-seguimiento.'],
   expected:'Una reacción/follow por par; contadores consistentes; comentario solo autor/Admin elimina; auto-seguimiento rechazado.'},
  {id:'CP-012', name:'Notificaciones propias', req:'RF-19, RNF-03', type:'Sistema / seguridad', pri:'Alta',
   desc:'Generar, listar y marcar notificaciones sin exponer las de otro usuario.',
   cond:'A posee proyecto; B puede interactuar; ambos autenticados.',
   data:'Like y comentario de B sobre proyecto de A.',
   steps:['B reacciona/comenta.','A lista notificaciones.','B intenta acceder/modificar una notificación de A.','A marca una y luego todas desde UI.'],
   expected:'A recibe las previstas; solo A las ve/modifica; estados leídos persisten.'},
  {id:'CP-013', name:'Vacantes y postulación única', req:'RF-20, RF-21, RF-22', type:'Sistema / integración', pri:'Alta',
   desc:'Consultar vacantes, postular y proteger las solicitudes.',
   cond:'Vacante publicada; User A/B; A posee proyecto; no hay postulación previa.',
   data:'Carta opcional; proyecto propio y ajeno; ID de vacante.',
   steps:['Consultar/buscar como invitado.','A postula con proyecto propio.','A repite la postulación y prueba proyecto ajeno.','A consulta Mis postulaciones; B intenta ver la de A.'],
   expected:'Vacante pública; una solicitud por User/vacante; proyecto debe ser propio; solo A ve su solicitud.'},
  {id:'CP-014', name:'Cambio de contraseña y baja de cuenta', req:'RF-23, RF-24, RNF-02, RNF-12', type:'Sistema / seguridad e integridad', pri:'Crítica',
   desc:'Validar contraseña actual, revocación y eliminación consistente de la cuenta.',
   cond:'Cuenta desechable con proyectos/interacciones/postulación y refresh activos; backup de prueba.',
   data:'Contraseña actual correcta/incorrecta; nueva válida; confirmación de baja.',
   steps:['Intentar cambio con actual incorrecta.','Cambiar correctamente y probar sesiones previas.','Entrar con nueva.','Intentar baja con contraseña incorrecta y luego correcta.','Consultar datos dependientes/huérfanos.'],
   expected:'Cambio exige actual y revoca refresh; baja exige contraseña, elimina cuenta/dependencias y no deja huérfanos.'},
  {id:'CP-015', name:'Administración y matriz de autorización', req:'RF-25, RNF-03, RNF-05, RNF-07', type:'API / seguridad', pri:'Crítica',
   desc:'Comprobar funciones Admin y denegación a User/Recruiter/invitado.',
   cond:'Tokens válidos Admin, User y Recruiter; entidades de prueba; cliente HTTP.',
   data:'Empresas, vacantes, aplicaciones, usuarios y contenido; IDs válidos/ajenos/inexistentes.',
   steps:['Ejecutar cada CRUD/estado/moderación como Admin.','Repetir como User, Recruiter e invitado.','Inspeccionar 401/403/404 y cabeceras.','Inducir error controlado.'],
   expected:'Admin ejecuta lo autorizado; otros reciben 401/403; recursos inexistentes 404; headers presentes; sin trazas/secretos.'},
];

function caseSection(c) {
  const stepRows = c.steps.map((step, i) => [`${i + 1}`, step, '', '']);
  return `<section class="case"><div class="case-title"><span class="case-id">${c.id}</span><h2>${c.name}</h2></div>
  ${table(['Atributo', 'Valor'], [['Requisito(s)', c.req], ['Tipo', c.type], ['Prioridad', c.pri], ['Responsable', AUTHOR], ['Estado inicial', 'Pendiente de ejecución']])}
  ${h3('1.', 'Descripción')}${p(c.desc)}
  ${h3('2.', 'Condiciones de ejecución')}${p(c.cond)}
  ${h3('3.', 'Entrada')}${p(c.data)}
  ${h3('4.', 'Procedimiento y registro')}${table(['Paso', 'Acción', 'Resultado real', 'Evidencia'], stepRows, ['8%', '44%', '28%', '20%'])}
  ${h3('5.', 'Resultado esperado')}${p(c.expected)}
  ${h3('6.', 'Evaluación de la prueba')}${table(['Campo', 'Registro'], [
    ['Estado', '<span class="checks">[ ] Propuesta &nbsp; [ ] Pendiente &nbsp; [ ] Satisfactoria &nbsp; [ ] No satisfactoria &nbsp; [ ] Bloqueada &nbsp; [ ] No aplica</span>'],
    ['Resultado real consolidado', '<div class="blank-lg"></div>'], ['Defecto asociado', 'ID: __________________  Severidad: [ ] Crítica [ ] Alta [ ] Media [ ] Baja'],
    ['Ejecutor y fecha/hora', '<div class="blank"></div>'], ['Ambiente / versión / hash', '<div class="blank"></div>'],
    ['Revisor / firma', '<div class="blank"></div>'],
  ])}</section>`;
}

const templateBody = `${control()}
${h2('1.', 'Descripción')}
${p('Este artefacto cubre el conjunto de pruebas de los casos de uso principales de CodePortfolio 1.0. Adapta la plantilla RUP suministrada: para cada instancia conserva descripción, condiciones de ejecución, entrada, resultado esperado y evaluación. Se agregan identificador, requisito, prioridad, pasos, resultado real, evidencia y defecto para asegurar trazabilidad.', 'lead')}
${table(['Caso', 'Nombre', 'Requisitos', 'Prioridad'], cases.map((c) => [c.id, c.name, c.req, c.pri]), ['12%', '42%', '27%', '19%'])}
${h2('2.', 'Instrucciones de diligenciamiento')}${ol([
  'Antes de ejecutar, registrar versión/hash, ambiente, datos y responsable. Confirmar que las condiciones se cumplen.',
  'Ejecutar los pasos en orden sin corregir manualmente el sistema entre ellos, salvo que el caso lo indique.',
  'Anotar el resultado real por paso y vincular evidencia legible, sin contraseñas, tokens ni datos personales.',
  'Marcar “satisfactoria” solo si todos los resultados coinciden. Si falla, crear defecto y marcar “no satisfactoria”.',
  'Si una dependencia impide ejecutar, marcar “bloqueada”, explicar la causa y reprogramar; no contarla como aprobada.',
])}
${callout('Estado del documento', 'Los casos están diseñados y precargados, pero permanecen pendientes. Los campos en blanco son registros de ejecución y firma, no contenido faltante.', 'good')}
${cases.map(caseSection).join('')}
${pageBreak}${h2('Anexo A.', 'Registro resumen de ejecución')}${table(['Caso', 'Estado', 'Defecto', 'Evidencia', 'Ejecutor / fecha'], cases.map((c) => [c.id, '[ ] S [ ] NS [ ] B [ ] NE', '', '', '']), ['12%', '22%', '18%', '25%', '23%'])}
${h2('Anexo B.', 'Dictamen')}${table(['Indicador', 'Resultado'], [
  ['Casos planificados', String(cases.length)], ['Ejecutados', ''], ['Satisfactorios', ''], ['No satisfactorios', ''], ['Bloqueados / no aplica', ''],
  ['Defectos críticos / altos / medios / bajos', ''], ['Requisitos sin cobertura', ''], ['Decisión', '[ ] Liberar  [ ] Liberar con riesgo aceptado  [ ] No liberar'],
  ['Observaciones', '<div class="blank-lg"></div>'], ['Aprobador / firma / fecha', '<div class="blank"></div>'],
])}`;

const planHtml = doc('Plan de Pruebas', 'Estrategia maestra de verificación y validación · CodePortfolio 1.0', 'CP-TP-003', planBody);
const templateHtml = doc('Plantilla de Pruebas', 'Especificación y registro de casos basada en la plantilla RUP suministrada · CodePortfolio 1.0', 'CP-TC-001', templateBody);

fs.writeFileSync(path.join(OUT, '01_PLAN_DE_PRUEBAS_CodePortfolio.html'), planHtml, 'utf8');
fs.writeFileSync(path.join(OUT, '02_PLANTILLA_DE_PRUEBAS_CodePortfolio.html'), templateHtml, 'utf8');
console.log(`Generados 2 documentos fuente en ${OUT}`);
