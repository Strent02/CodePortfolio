import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('documentacion/entregables_ieee');
fs.mkdirSync(OUT, { recursive: true });

const DATE = '14 de septiembre de 2026';
const VERSION = '2.0';
const AUTHOR = 'Pedro Bonilla';

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const p = (text, cls = '') => `<p${cls ? ` class="${cls}"` : ''}>${text}</p>`;
const h2 = (n, text) => `<h2><span>${n}</span>${text}</h2>`;
const h3 = (n, text) => `<h3>${n} ${text}</h3>`;
const ul = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const ol = (items) => `<ol>${items.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const code = (text) => `<pre>${esc(text)}</pre>`;
const callout = (title, text, kind = 'note') => `<aside class="${kind}"><strong>${title}</strong>${text}</aside>`;
const table = (headers, rows, widths = []) => `
  <table>
    <colgroup>${headers.map((_, i) => `<col${widths[i] ? ` style="width:${widths[i]}"` : ''}>`).join('')}</colgroup>
    <thead><tr>${headers.map((x) => `<th>${x}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
const status = (label, kind) => `<span class="status ${kind}">${label}</span>`;
const pageBreak = '<div class="page-break"></div>';

function cover(title, subtitle, codeName, docVersion = VERSION) {
  return `<section class="cover">
    <div class="brand">&lt;/&gt;</div>
    <div class="kicker">CODEPORTFOLIO · GOBIERNO Y CALIDAD</div>
    <h1>${title}</h1>
    <p class="subtitle">${subtitle}</p>
    <div class="accent-line"></div>
    ${table(['Control', 'Valor'], [
      ['Código documental', codeName],
      ['Versión', docVersion],
      ['Fecha de corte', DATE],
      ['Autor / responsable', AUTHOR],
      ['Estado', 'Línea base propuesta para revisión y aprobación'],
      ['Proyecto', 'CodePortfolio — red social de portafolios de código'],
    ], ['32%', '68%'])}
    <p class="confidential">Documento interno · Copia controlada al aprobarse</p>
  </section>${pageBreak}`;
}

function control(extraRevision = null) {
  const revisions = [
    ['09/09/2026', '1.0', 'Versiones iniciales y documento consolidado.', AUTHOR],
    ['14/09/2026', '2.0', 'Separación por entregable, contraste con el código, trazabilidad, criterios medibles y registros de evidencia.', AUTHOR],
  ];
  if (extraRevision) revisions.push(extraRevision);
  return `<h2>Control del documento</h2>
  <h3>Historia de revisiones</h3>
  ${table(['Fecha', 'Versión', 'Descripción', 'Responsable'], [
    ...revisions,
  ], ['17%', '12%', '51%', '20%'])}
  <h3>Aprobación</h3>
  ${table(['Rol', 'Nombre', 'Decisión', 'Firma / fecha'], [
    ['Responsable del producto', AUTHOR, '[ ] Aprobado  [ ] Rechazado', '________________'],
    ['Aseguramiento de calidad', AUTHOR, '[ ] Aprobado  [ ] Rechazado', '________________'],
    ['Responsable de implantación', AUTHOR, '[ ] Aprobado  [ ] Rechazado', '________________'],
  ])}`;
}

function documentHtml(title, subtitle, codeName, body, docVersion = VERSION) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${title}</title>
  <style>
    @page { size: Letter; margin: 18mm 16mm 18mm 16mm; @bottom-center { content: "CodePortfolio · ${codeName} · Página " counter(page) " de " counter(pages); color: #756b60; font: 8pt Arial; } }
    @page:first { margin: 16mm; @bottom-center { content: ""; } }
    * { box-sizing: border-box; }
    html { color: #27231f; font-family: Arial, Helvetica, sans-serif; font-size: 10.2pt; line-height: 1.45; }
    body { margin: 0; background: white; }
    .cover { min-height: 235mm; display: flex; flex-direction: column; justify-content: center; padding: 12mm 8mm; }
    .brand { width: 24mm; height: 24mm; border-radius: 7mm; display: grid; place-items: center; background: linear-gradient(145deg,#9b7d50,#665033); color: white; font: bold 20pt Consolas, monospace; box-shadow: 0 5mm 14mm rgba(85,65,40,.18); }
    .kicker { margin-top: 18mm; color: #8a6f47; font-size: 8.5pt; font-weight: 700; letter-spacing: 1.8pt; }
    h1 { margin: 4mm 0 3mm; font-family: Georgia, serif; font-size: 30pt; font-weight: 500; line-height: 1.08; color: #201d19; }
    .subtitle { max-width: 145mm; font: 13pt/1.45 Georgia, serif; color: #665f57; }
    .accent-line { width: 36mm; height: 1.5mm; border-radius: 2mm; background: #3f7d5e; margin: 7mm 0; }
    .confidential { margin-top: auto; color: #877e73; font-size: 8.5pt; }
    h2 { break-after: avoid; margin: 9mm 0 4mm; padding-bottom: 2mm; border-bottom: .35mm solid #d8c9b5; font: 19pt Georgia, serif; color: #2f2a25; }
    h2 span { color: #8a6f47; margin-right: 2mm; }
    h3 { break-after: avoid; margin: 6mm 0 2.2mm; font-size: 12pt; color: #3f6d55; }
    p { margin: 0 0 3mm; text-align: justify; }
    .lead { font-size: 11pt; color: #514b44; }
    ul, ol { margin: 1.5mm 0 4mm 6mm; padding-left: 5mm; }
    li { margin-bottom: 1.3mm; }
    table { width: 100%; border-collapse: collapse; margin: 2.5mm 0 5mm; font-size: 8.5pt; break-inside: auto; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
    th { padding: 2.2mm; text-align: left; vertical-align: bottom; color: white; background: #6d5735; border: .2mm solid #6d5735; }
    td { padding: 2mm 2.2mm; vertical-align: top; border: .2mm solid #d9d2c8; }
    tbody tr:nth-child(even) td { background: #f7f4ef; }
    aside { break-inside: avoid; margin: 4mm 0; padding: 3.2mm 4mm; border-left: 1.4mm solid #8a6f47; background: #f6f0e7; }
    aside strong { display: block; margin-bottom: 1mm; color: #6d5735; }
    aside.warn { border-left-color: #b36b35; background: #fff4e9; }
    aside.good { border-left-color: #3f7d5e; background: #edf7f1; }
    aside.risk { border-left-color: #a8433f; background: #fff0ef; }
    pre { white-space: pre-wrap; break-inside: avoid; padding: 3mm; border: .2mm solid #d9d2c8; border-radius: 2mm; background: #f5f3ef; font: 7.7pt/1.4 Consolas, monospace; color: #3d3934; }
    .status { display: inline-block; white-space: nowrap; padding: .5mm 1.5mm; border-radius: 4mm; font-size: 7.4pt; font-weight: 700; text-transform: uppercase; letter-spacing: .25pt; }
    .ok { background:#dcefe4; color:#2f694c; } .partial { background:#fff0ce; color:#805d18; }
    .pending { background:#f3e3dc; color:#934638; } .info { background:#e5eaf1; color:#495d79; }
    .page-break { break-after: page; }
    .small { font-size: 8.5pt; color: #6f675f; }
    .signature { height: 15mm; }
    a { color: #3f6d55; text-decoration: none; }
  </style></head><body>${cover(title, subtitle, codeName, docVersion)}${body}</body></html>`;
}

const commonReferences = [
  ['IEEE 730-2026', 'Estándar activo para procesos de aseguramiento de calidad de software; sustituye IEEE 730-2014.'],
  ['ISO/IEC/IEEE 29148:2018', 'Ingeniería de requisitos; edición vigente confirmada en 2024 y sucesora del IEEE 830-1998.'],
  ['Repositorio CodePortfolio', 'Código fuente, configuración, migraciones, pruebas automatizadas y guías de ejecución examinados al 14/09/2026.'],
  ['Modelo de Casos de Prueba v1.0', 'Detalle preexistente de casos unitarios, integración, sistema y documentos.'],
  ['Plan de Implantación v1.0', 'Runbook preexistente de despliegue, humo y reversión.'],
];

const sqap = documentHtml(
  'Plan de Aseguramiento de la Calidad del Software',
  'Entregable de calidad adaptado a IEEE 730-2026 · CodePortfolio 1.0',
  'CP-SQAP-002',
  `${control()}
  ${h2('1.', 'Propósito, alcance y adaptación')}
  ${p('Este plan define cómo se inicia, planifica, controla, ejecuta y evidencia el aseguramiento de calidad de CodePortfolio. Cubre la SPA React, la API ASP.NET Core, PostgreSQL, el almacenamiento de imágenes, la configuración de contenedores y los documentos del producto.', 'lead')}
  ${callout('Declaración de conformidad', 'El documento está <em>adaptado</em> a IEEE 730-2026 para un proyecto académico de una sola persona. No declara certificación ni conformidad total: esta requiere aplicar el plan, conservar evidencias, resolver hallazgos y obtener aprobaciones independientes cuando corresponda.', 'note')}
  ${h3('1.1', 'Productos incluidos y exclusiones')}
  ${table(['Incluido', 'Excluido / diferido'], [[
    'Requisitos; diseño y código; migraciones; API; interfaz web; imágenes; contenedores; pruebas; implantación; capacitación; riesgos.',
    'Mensajería directa y colaboración en la interfaz; panel gráfico de administración; correo electrónico; pagos; ejecución o alojamiento de repositorios; pruebas de carga por encima de 10.000 usuarios.'
  ]])}
  ${h3('1.2', 'Referencias')}${table(['Referencia', 'Uso'], commonReferences)}
  ${h2('2.', 'Organización, independencia y responsabilidades')}
  ${p('Pedro Bonilla concentra producto, desarrollo, calidad, implantación y capacitación. Esa realidad es aceptable para el alcance académico, pero crea un riesgo de independencia. Las revisiones de salida y la aceptación final deberán ser realizadas, cuando sea posible, por docente, cliente o revisor distinto del autor.')}
  ${table(['Actividad', 'Producto', 'Desarrollo', 'Calidad', 'Revisor externo'], [
    ['Aprobar alcance y prioridades', 'A/R', 'C', 'C', 'I'],
    ['Implementar y revisar código', 'I', 'R', 'C', 'C'],
    ['Mantener requisitos y trazabilidad', 'A', 'C', 'R', 'C'],
    ['Ejecutar pruebas y registrar evidencia', 'I', 'C', 'R', 'C'],
    ['Autorizar liberación', 'A', 'C', 'R', 'C'],
    ['Auditar entregables', 'I', 'C', 'R', 'A/R recomendado'],
  ])}
  ${h2('3.', 'Objetivos de calidad y métricas')}
  ${table(['ID', 'Objetivo / métrica', 'Meta', 'Evidencia', 'Frecuencia'], [
    ['OC-01', 'Cobertura de requisitos funcionales por casos trazados', '100 % RF con ≥1 caso', 'Matriz RF–CP', 'Cada versión'],
    ['OC-02', 'Resultado de pruebas críticas y de seguridad', '100 % aprobadas', 'Reportes y capturas', 'Cada candidato'],
    ['OC-03', 'Defectos abiertos al liberar', '0 críticos; 0 altos', 'Registro de defectos', 'Go/no-go'],
    ['OC-04', 'Calidad estática', 'Frontend lint y build sin error; backend build/test sin error', 'Registros de comandos', 'Cada cambio'],
    ['OC-05', 'Rendimiento de lectura', 'p95 ≤ 500 ms con carga acordada', 'Informe de rendimiento', 'Antes de liberar'],
    ['OC-06', 'Seguridad de dependencias', '0 vulnerabilidades críticas/altas sin aceptación', 'Inventario y escaneo', 'Semanal / liberación'],
    ['OC-07', 'Recuperabilidad', 'RPO ≤ 24 h; RTO ≤ 60 min; rollback de despliegue ≤ 30 min', 'Prueba de restauración', 'Mensual / liberación'],
    ['OC-08', 'Capacitación', '≥80 % en evaluación y ≥80 % de asistencia', 'Lista, prueba y encuesta', 'Cada cohorte'],
  ])}
  ${h2('4.', 'Actividades, controles y puertas de calidad')}
  ${table(['Puerta', 'Entrada', 'Controles obligatorios', 'Salida / autoridad'], [
    ['G0 · Alcance', 'Necesidad y restricciones', 'ERS revisada; riesgos iniciales; criterios de aceptación', 'Producto aprueba'],
    ['G1 · Construcción', 'RF priorizados', 'Revisión de código; lint/build; pruebas unitarias; migración revisada', 'Desarrollo propone'],
    ['G2 · Verificación', 'Candidato inmutable', 'Integración, sistema, seguridad, accesibilidad y regresión; defectos clasificados', 'Calidad acepta'],
    ['G3 · Liberación', 'G2 conforme', 'Etiqueta/commit; backup restaurado; variables; runbook; plan de reversión', 'Producto decide go/no-go'],
    ['G4 · Producción', 'Servicios desplegados', 'Pruebas de humo; logs; integridad; TLS', 'Calidad recomienda y producto aprueba'],
    ['G5 · Cierre', 'Período de observación', 'Métricas, incidencias, lecciones, actualización de riesgos', 'Producto cierra'],
  ])}
  ${h3('4.1', 'Normas y prácticas aplicables')}
  ${ul([
    '<strong>Requisitos:</strong> identificador único, lenguaje inequívoco, prioridad, fuente, estado, criterio verificable y trazabilidad bidireccional.',
    '<strong>Código:</strong> revisión antes de integrar; secretos fuera del repositorio; validación de entradas; autorización por recurso; migraciones versionadas.',
    '<strong>Configuración:</strong> cada liberación debe vincular versión, commit, migraciones, imágenes, variables documentadas y resultado de pruebas.',
    '<strong>Pruebas:</strong> evidencia reproducible con fecha, versión, entorno, datos, ejecutor, resultado y defecto asociado.',
    '<strong>Documentación:</strong> versión, responsable, aprobación, referencias, historial y estado; los valores por completar no se presentan como hechos.',
  ])}
  ${h3('4.2', 'Revisiones y auditorías')}
  ${table(['Revisión / auditoría', 'Qué comprueba', 'Momento', 'Registro'], [
    ['Revisión de requisitos', 'Completitud, consistencia, factibilidad, verificabilidad y trazabilidad', 'Antes de G1', 'Lista de revisión y acta'],
    ['Revisión técnica', 'Arquitectura, seguridad, migraciones y mantenibilidad', 'Por cambio material', 'Comentarios / acta'],
    ['Auditoría funcional', 'Producto contra RF y casos', 'G2', 'Informe de ejecución'],
    ['Auditoría de configuración', 'Commit, etiqueta, artefactos y migraciones coinciden', 'G3', 'Lista de configuración'],
    ['Auditoría física de liberación', 'Artefactos entregados son completos, legibles y recuperables', 'G3/G5', 'Acta de liberación'],
    ['Revisión posterior', 'Incidentes, métricas, riesgos y acciones', '24–48 h después', 'Informe de cierre'],
  ])}
  ${h2('5.', 'Gestión de defectos y acciones correctivas')}
  ${ol([
    'Registrar el hallazgo con identificador, versión, entorno, pasos, evidencia, resultado esperado/real y severidad.',
    'Triage por producto, desarrollo y calidad: aceptar, duplicar, diferir o asignar.',
    'Corregir en una rama/cambio trazable y añadir o actualizar una prueba de regresión.',
    'Verificar la corrección en el mismo entorno y revisar impactos laterales.',
    'Cerrar únicamente con evidencia. Un defecto diferido exige riesgo aceptado, responsable y fecha objetivo.',
  ])}
  ${table(['Severidad', 'Ejemplo', 'Objetivo de respuesta', 'Regla de liberación'], [
    ['Crítica', 'Pérdida/exposición de datos; indisponibilidad total; control de acceso eludido', 'Contención inmediata', 'Bloquea'],
    ['Alta', 'Flujo principal inutilizable sin alternativa', '≤1 día hábil', 'Bloquea'],
    ['Media', 'Función degradada con alternativa', '≤3 días hábiles', 'Decisión documentada'],
    ['Baja', 'Presentación, texto o mejora menor', 'Siguiente iteración', 'Puede diferirse'],
  ])}
  ${h2('6.', 'Registros, herramientas y conservación')}
  ${table(['Registro', 'Ubicación propuesta', 'Responsable', 'Conservación mínima'], [
    ['ERS y matrices aprobadas', 'documentacion/ y copia de entrega', 'Calidad', 'Vida del proyecto + 1 año'],
    ['Resultados de pruebas', 'evidencias/pruebas/<versión>/<fecha>', 'Calidad', 'Vida del proyecto + 1 año'],
    ['Defectos y acciones', 'Rastreador o registro controlado', 'Calidad', 'Vida del proyecto + 1 año'],
    ['Artefactos y SBOM', 'liberaciones/<versión>', 'Desarrollo', 'Mientras la versión esté soportada'],
    ['Backups y restauraciones', 'Repositorio cifrado de respaldos', 'Implantación', 'Según política; nunca en Git'],
    ['Asistencia y evaluación', 'evidencias/capacitacion', 'Capacitación', '1 año'],
  ])}
  ${p('Herramientas previstas: Git; .NET 8; xUnit; Node.js 20+; ESLint; Vite; Docker Compose; PostgreSQL 16; navegador automatizado; escáner de dependencias. La ausencia de una herramienta no autoriza omitir el control: debe usarse una alternativa y registrarse.')}
  ${h2('7.', 'Estado de la línea base y brechas encontradas')}
  ${table(['Hallazgo al 14/09/2026', 'Estado', 'Acción necesaria antes de producción'], [
    ['Frontend: <code>npm run lint</code> y <code>npm run build</code> ejecutados correctamente.', status('Conforme', 'ok'), 'Conservar los registros y repetir sobre el commit candidato.'],
    ['Backend: existen 9 métodos de prueba xUnit (incluyen teorías), pero no hay runtime .NET disponible en este entorno para ejecutarlos.', status('Sin evidencia', 'pending'), 'Ejecutar restore/build/test con .NET 8 y adjuntar TRX.'],
    ['No existen pruebas automatizadas del frontend ni evidencia actual de integración/sistema.', status('Brecha', 'pending'), 'Automatizar flujos críticos y ejecutar plan manual completo.'],
    ['El repositorio no tiene etiqueta de liberación y contiene cambios locales no confirmados.', status('Bloquea G3', 'pending'), 'Integrar cambios, revisar, fijar commit y crear etiqueta aprobada.'],
    ['Hay respuestas de la API todavía en inglés, mientras RNF-10 exige español.', status('Parcial', 'partial'), 'Unificar mensajes o ajustar explícitamente el requisito.'],
    ['No hay evidencia de prueba de restauración, rendimiento, accesibilidad ni navegador cruzado.', status('Pendiente', 'pending'), 'Ejecutar y archivar los informes definidos.'],
    ['El Compose local publica frontend por HTTP: producción requiere TLS y exposición únicamente mediante proxy autorizado.', status('Pendiente producción', 'partial'), 'Aplicar overlay/configuración de producción y comprobar desde red externa.'],
  ], ['49%', '17%', '34%'])}
  ${callout('Conclusión de calidad', 'La documentación inicial era una base útil, pero el PDF consolidado no reemplazaba un SQAP ejecutable. Esta versión incorpora métricas, puertas, auditorías, control de configuración, defectos, registros y un diagnóstico verificable. El producto no está autorizado para producción hasta cerrar los elementos marcados como bloqueantes.', 'warn')}
  ${h2('8.', 'Aceptación y mantenimiento del plan')}
  ${p('El plan se revisa ante cambios de alcance, arquitectura, riesgos, proceso o estándar, y al menos en cada liberación. Las excepciones deben identificar control omitido, causa, riesgo, compensación, responsable, vencimiento y aprobación. La firma de este documento aprueba el proceso; no sustituye la evidencia de que se ejecutó.')}
  ${table(['Decisión', 'Nombre', 'Firma', 'Fecha'], [['[ ] Aprobar  [ ] Aprobar con acciones  [ ] Rechazar', '', '', '']])}`
);

const implementation = documentHtml(
  'Plan de Implementación o Implantación',
  'Preparación, despliegue, validación, reversión y cierre · CodePortfolio 1.0',
  'CP-IMP-002',
  `${control()}
  ${h2('1.', 'Objetivo y alcance')}
  ${p('Poner en servicio una versión identificable y recuperable de CodePortfolio mediante PostgreSQL 16, API ASP.NET Core 8, SPA React/Nginx y volúmenes persistentes. Este runbook distingue preparación, ejecución, verificación y reversión; ningún comando se considera autorización automática para operar producción.', 'lead')}
  ${h3('1.1', 'Correcciones frente a la versión 1.0')}
  ${ul([
    'Se reemplazan etiquetas fijas inexistentes (<code>v1.0</code>/<code>v0.9</code>) por <code>&lt;VERSION_OBJETIVO&gt;</code> y <code>&lt;VERSION_ANTERIOR&gt;</code>, que deben resolverse antes de la ventana.',
    'Se añade inventario de artefactos, responsables, dependencias, puntos de no retorno, observabilidad y criterios go/no-go.',
    'Se separan RPO, RTO y tiempo de rollback; se exige evidencia de restauración previa.',
    'Se registra como bloqueo el estado real: árbol con cambios locales y backend aún sin resultado ejecutado en este entorno.',
  ])}
  ${h2('2.', 'Arquitectura objetivo y entornos')}
  ${table(['Componente', 'Tecnología', 'Persistencia / exposición', 'Criterio'], [
    ['Proxy público', 'Nginx o equivalente + TLS', 'Único punto expuesto en 443; 80 solo redirige', 'Certificado válido; TLS; cabeceras'],
    ['Frontend', 'React 19 compilado y servido por Nginx', 'Sin estado; red interna', 'Carga y consume /api'],
    ['Backend', 'ASP.NET Core 8', 'Volumen de imágenes; red interna', 'Responde; aplica migraciones'],
    ['Base de datos', 'PostgreSQL 16', 'Volumen persistente; sin exposición pública', 'Healthy; esquema esperado'],
  ])}
  ${table(['Entorno', 'Propósito', 'Datos permitidos', 'Promoción'], [
    ['Desarrollo', 'Trabajo local', 'Sintéticos', 'No se promueve directamente'],
    ['Pruebas', 'Integración, sistema y recuperación', 'Sintéticos o anonimizados', 'Mismo commit/configuración estructural'],
    ['Producción', 'Servicio final', 'Reales', 'Solo tras G3 aprobado'],
  ])}
  ${h2('3.', 'Roles, calendario y dependencias')}
  ${table(['Actividad', 'Producto', 'Desarrollo/implantación', 'Calidad', 'Usuarios'], [
    ['Autorizar ventana', 'A', 'C', 'C', 'I'], ['Preparar backup', 'I', 'R', 'C', 'I'],
    ['Construir/desplegar', 'A', 'R', 'C', 'I'], ['Ejecutar humo', 'I', 'C', 'R', 'I'],
    ['Decidir rollback', 'A', 'R', 'R', 'I'], ['Comunicar/cerrar', 'R', 'C', 'C', 'I'],
  ])}
  ${table(['Hito', 'Momento relativo', 'Duración', 'Salida'], [
    ['Congelar candidato', 'T−5 días', '0,5 día', 'Commit y versión propuestos'],
    ['Regresión / seguridad', 'T−4 a T−2', '2 días', 'Informe y defectos cerrados'],
    ['Ensayo y restauración', 'T−2', '0,5 día', 'Runbook medido y backup verificado'],
    ['Go/no-go', 'T−1', '30 min', 'Acta aprobada'],
    ['Ventana de implantación', 'T', 'Máx. 4 h', 'Sistema o rollback'],
    ['Vigilancia intensiva', 'T a T+1 h', '1 h', 'Sin errores críticos'],
    ['Cierre', 'T+1 día', '30 min', 'Informe y riesgos actualizados'],
  ])}
  ${h2('4.', 'Prerrequisitos y lista go/no-go')}
  ${table(['ID', 'Control obligatorio', 'Evidencia', 'Estado actual'], [
    ['G-01', 'Commit revisado, árbol limpio y etiqueta firmada/aprobada', 'Hash + etiqueta', status('No conforme', 'pending')],
    ['G-02', 'Frontend lint/build y backend restore/build/test conformes', 'Logs + TRX', status('Parcial', 'partial')],
    ['G-03', '0 defectos críticos o altos abiertos', 'Registro de defectos', status('Sin evidencia', 'pending')],
    ['G-04', 'Variables/secretos definidos sin valores de ejemplo', 'Lista redactada, no secretos', status('Por verificar', 'pending')],
    ['G-05', 'Backup de DB e imágenes restaurado en entorno aislado', 'Acta + conteos/checksums', status('Por ejecutar', 'pending')],
    ['G-06', 'TLS, DNS, almacenamiento, CPU/RAM y monitoreo preparados', 'Checklist de infraestructura', status('Por verificar', 'pending')],
    ['G-07', 'Ventana, contactos y comunicación aprobados', 'Acta / mensaje', status('Por completar', 'pending')],
    ['G-08', 'Versión anterior y artefactos de rollback disponibles', 'Hash/imágenes + backup', status('Por completar', 'pending')],
  ])}
  ${callout('Regla go/no-go', 'Si G-01, G-02, G-03, G-05 o G-08 no está conforme, no se inicia la implantación. El responsable del producto no puede aceptar verbalmente un riesgo crítico sin dejar decisión, controles compensatorios y vencimiento.', 'risk')}
  ${h3('4.1', 'Variables requeridas')}
  ${table(['Variable', 'Regla'], [
    ['POSTGRES_DB / POSTGRES_USER', 'Identificadores válidos; no usar cuentas compartidas fuera del servicio.'],
    ['POSTGRES_PASSWORD', 'Secreto robusto; no versionado ni expuesto en evidencia.'],
    ['JWT_KEY', 'Aleatoria, al menos 32 bytes, sin valor de ejemplo.'],
    ['BOOTSTRAP_ADMIN_EMAIL / PASSWORD', 'Solo en alta inicial; retirar/rotar después de verificar la cuenta.'],
    ['Cors__AllowedOrigins', 'Solo orígenes HTTPS reales de producción.'],
  ])}
  ${h2('5.', 'Procedimiento de implantación')}
  ${h3('5.1', 'Preparación y respaldo')}
  ${ol([
    'Registrar fecha, ejecutor, <code>&lt;VERSION_OBJETIVO&gt;</code>, hash, <code>&lt;VERSION_ANTERIOR&gt;</code>, dominio y ubicación del respaldo.',
    'Anunciar inicio; impedir nuevas escrituras deteniendo backend y frontend.',
    'Crear respaldo lógico de PostgreSQL y archivo del volumen de imágenes. Generar SHA-256 y restringir permisos.',
    'Restaurar ambos en un entorno aislado. Comparar tablas críticas y muestrear imágenes. Si falla, abortar antes de tocar la versión instalada.',
  ])}
  ${code(`# Variables resueltas y anotadas en el acta (no dejar marcadores)
cd /opt/codeportfolio
docker compose stop backend frontend
mkdir -p respaldos/<VENTANA>

# La expansión de usuario/base ocurre dentro del contenedor, no depende de exportar .env
docker compose exec -T db sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' \\
  > respaldos/<VENTANA>/codeportfolio.dump

docker run --rm -v codeportfolio_uploads_images:/datos:ro \\
  -v /opt/codeportfolio/respaldos/<VENTANA>:/respaldo alpine \\
  tar czf /respaldo/imagenes.tar.gz -C /datos .

shasum -a 256 respaldos/<VENTANA>/codeportfolio.dump \\
  respaldos/<VENTANA>/imagenes.tar.gz > respaldos/<VENTANA>/SHA256SUMS`)}
  ${h3('5.2', 'Obtención, construcción y arranque')}
  ${code(`git fetch --tags
git switch --detach <VERSION_OBJETIVO>
test -z "$(git status --porcelain)"
git rev-parse HEAD

docker compose build --pull backend frontend
docker compose up -d db
docker compose ps db
docker compose up -d backend
docker compose logs --since 5m backend
docker compose up -d frontend
docker compose ps`)}
  ${p('Registrar digest de las imágenes construidas. El backend debe mostrar arranque sin excepción y la tabla de historial de migraciones debe contener exactamente las migraciones aprobadas para la versión. El arranque automático de migraciones es un punto de cambio de datos: no se continúa si la migración no fue ensayada sobre una copia representativa.')}
  ${h3('5.3', 'Pruebas de humo')}
  ${table(['ID', 'Comprobación', 'Esperado', 'Crítica'], [
    ['PH-01', 'GET /api/feed y carga de /', '200; JSON; interfaz sin errores', 'Sí'],
    ['PH-02', 'TLS y cabeceras en web/API', 'Certificado válido; HSTS/CSP/nosniff/frame/referrer', 'Sí'],
    ['PH-03', 'Registro, login, refresh y logout', 'Ciclo completo; rol User; token revocado', 'Sí'],
    ['PH-04', 'Crear proyecto publicado con imagen', 'Visible en feed e imagen recuperable', 'Sí'],
    ['PH-05', 'Crear borrador y consultar sin sesión', 'No revela el recurso', 'Sí'],
    ['PH-06', 'Comentar, reaccionar, seguir y notificación', 'Estados/contadores correctos', 'Sí'],
    ['PH-07', 'Listar vacantes y postular', 'Una postulación propia, visible en “Mis postulaciones”', 'Sí'],
    ['PH-08', 'Reiniciar backend y frontend', 'Datos e imágenes persisten', 'Sí'],
    ['PH-09', 'Acceso no autorizado y recurso ajeno', '401/403/404 según contrato, sin datos', 'Sí'],
    ['PH-10', 'Logs, salud y recursos', 'Sin 5xx; sin reinicios; uso dentro del umbral', 'No'],
  ])}
  ${h2('6.', 'Reversión y contingencia')}
  ${table(['Disparador', 'Decisión'], [
    ['Migración fallida; pérdida/exposición; PH crítica fallida; reinicio continuo', 'Reversión inmediata'],
    ['Desviación menor aislada con alternativa, sin seguridad ni integridad afectadas', 'Producto puede continuar con riesgo escrito'],
    ['Causa desconocida al agotarse el tiempo de diagnóstico (15 min)', 'Reversión preventiva'],
  ])}
  ${ol([
    'Detener frontend/backend y capturar logs/estado sin alterar la evidencia.',
    'Restaurar base e imágenes desde el respaldo verificado. La restauración destructiva requiere doble validación del nombre de base y aprobación registrada.',
    'Cambiar a <code>&lt;VERSION_ANTERIOR&gt;</code> o a sus imágenes inmutables y levantar servicios.',
    'Ejecutar PH-01, PH-02, PH-03, PH-08 y comparación de conteos; comunicar restablecimiento.',
    'Abrir incidente y análisis causal en 48 horas; añadir prueba de regresión y actualizar riesgos.',
  ])}
  ${table(['Objetivo', 'Meta'], [['Rollback técnico', '≤30 min desde la decisión'], ['RTO del servicio', '≤60 min'], ['RPO operativo', '≤24 h; para la ventana, punto justo antes del despliegue']])}
  ${h2('7.', 'Comunicación, observabilidad y cierre')}
  ${table(['Momento', 'Destinatarios', 'Contenido mínimo'], [
    ['T−48 h', 'Usuarios / interesados', 'Ventana, afectación, contacto'], ['Inicio', 'Interesados', 'Hora, versión, estado'],
    ['Cambio de decisión', 'Interesados', 'Continuación, extensión o rollback'], ['Fin', 'Usuarios', 'Restablecimiento y novedades'],
    ['T+24 h', 'Responsables', 'Acta, métricas, incidencias y acciones'],
  ])}
  ${p('Durante la primera hora se observan códigos 5xx, latencia, reinicios, uso de CPU/memoria/disco, conexiones a PostgreSQL y errores de imágenes. El cierre adjunta la lista de pasos, horas, resultados PH, hashes, migraciones, decisión, incidencias y firmas.')}
  ${h2('8.', 'Registro de ejecución')}
  ${table(['Paso', 'Inicio/fin', 'Ejecutor', 'Resultado', 'Evidencia / observación'], Array.from({length: 10}, (_, i) => [`${i+1}`, '', '', '[ ] C  [ ] NC', '']))}
  ${p('<strong>Decisión final:</strong> [ ] Continuar &nbsp;&nbsp; [ ] Continuar con riesgo aceptado &nbsp;&nbsp; [ ] Revertir')}
  ${table(['Aprobación', 'Nombre', 'Firma', 'Fecha/hora'], [['Responsable del producto', '', '', ''], ['Calidad', '', '', '']])}`
);

const rfRows = [
  ['RF-01', 'Registro', 'CP-SIS-01'], ['RF-02', 'Autenticación', 'CP-SIS-02'], ['RF-03', 'Renovación de sesión', 'CP-INT-01'],
  ['RF-04', 'Cierre/revocación', 'CP-INT-01'], ['RF-05', 'Crear proyecto', 'CP-SIS-03'], ['RF-06', 'Imagen de proyecto', 'CP-SIS-03 / CP-SEG-05'],
  ['RF-07', 'Editar proyecto propio', 'CP-SIS-04'], ['RF-08', 'Eliminar proyecto', 'CP-SIS-04 / CP-SEG-02'], ['RF-09', 'Privacidad de borrador', 'CP-SEG-01'],
  ['RF-10', 'Feed público', 'CP-SIS-05'], ['RF-11', 'Feed de seguidos', 'CP-SIS-06'], ['RF-12', 'Listados y filtros', 'CP-SIS-07'],
  ['RF-13', 'Búsqueda global', 'CP-SIS-08'], ['RF-14', 'Perfil público', 'CP-SIS-09'], ['RF-15', 'Editar perfil/avatar', 'CP-SIS-10'],
  ['RF-16', 'Reacciones', 'CP-SIS-11'], ['RF-17', 'Comentarios', 'CP-SIS-12'], ['RF-18', 'Seguimiento', 'CP-SIS-13'],
  ['RF-19', 'Notificaciones', 'CP-SIS-14'], ['RF-20', 'Vacantes públicas', 'CP-SIS-15'], ['RF-21', 'Postulación única', 'CP-SIS-16'],
  ['RF-22', 'Mis postulaciones', 'CP-SIS-16'], ['RF-23', 'Cambiar contraseña', 'CP-SEG-03'], ['RF-24', 'Eliminar cuenta', 'CP-SEG-04'],
  ['RF-25', 'Administración por API', 'CP-SEG-06 / CP-API-01'],
];

const testPlan = documentHtml(
  'Plan de Pruebas',
  'Estrategia, casos, trazabilidad, criterios y evidencia · CodePortfolio 1.0',
  'CP-TP-002',
  `${control()}
  ${h2('1.', 'Objetivo y elementos de prueba')}
  ${p('Demostrar, con evidencia reproducible, que CodePortfolio satisface los requisitos funcionales y no funcionales aprobados, que los controles de seguridad no se pueden eludir y que un candidato puede implantarse y revertirse de forma segura.', 'lead')}
  ${table(['Elemento', 'Identificación'], [
    ['Frontend', 'React 19 + Vite; páginas de acceso, feed, proyectos, perfil, búsqueda, empleo, notificaciones y configuración'],
    ['Backend', 'ASP.NET Core 8; controladores /api, JWT, repositorios, validación de imágenes'],
    ['Persistencia', 'PostgreSQL 16; migraciones EF y restricciones'],
    ['Despliegue', 'Docker Compose, Nginx, volúmenes y variables'],
    ['Documentos', 'ERS, SQAP, implantación, capacitación y riesgos'],
  ])}
  ${h3('1.1', 'Fuera del alcance')}${p('Carga superior a 10.000 usuarios, pruebas destructivas sobre producción, servicios de correo/pagos inexistentes y navegadores fuera de soporte. Las funciones de colaboradores/mensajes sin interfaz se consideran diferidas; sus CRUD administrativos solo se prueban como superficie de API y autorización.')}
  ${h2('2.', 'Estrategia por nivel')}
  ${table(['Nivel / tipo', 'Técnica', 'Responsable', 'Herramienta / evidencia'], [
    ['Estática', 'Lint, compilación, revisión y secretos', 'Desarrollo', 'ESLint, Vite, dotnet build, revisión'],
    ['Unitaria', 'Clases aisladas y casos de borde', 'Desarrollo', 'xUnit; runner frontend por incorporar'],
    ['Integración', 'API–DB, sesión, archivos, migración, proxy', 'Desarrollo/Calidad', 'Entorno efímero + reportes'],
    ['Sistema', 'Flujos E2E y negativos', 'Calidad', 'Navegador real + capturas/video'],
    ['Seguridad', 'Autorización, token, rate limit, archivo, errores, headers', 'Calidad', 'HTTP client + pruebas automatizadas'],
    ['Accesibilidad', 'Teclado, nombres, foco, contraste, movimiento reducido', 'Calidad', 'Navegador + auditoría automática/manual'],
    ['Rendimiento', 'p50/p95/p99 y errores con volumen acordado', 'Calidad', 'Informe de carga'],
    ['Recuperación', 'Backup, restauración y rollback cronometrados', 'Implantación/Calidad', 'Acta, checksums y conteos'],
  ])}
  ${h2('3.', 'Entorno y datos')}
  ${table(['Aspecto', 'Configuración controlada'], [
    ['Software', '.NET 8; Node 20+; PostgreSQL 16; Docker/Compose; Chrome, Firefox, Safari y Edge vigentes'],
    ['Configuración', 'Mismo commit candidato; variables de prueba; CORS del entorno; reloj sincronizado'],
    ['Datos base', 'Admin, 3 usuarios, 2 empresas, 6 vacantes, proyectos publicados/borradores, relaciones y notificaciones'],
    ['Datos negativos', 'Tokens caducados/manipulados; usuario ajeno; archivos falsos/grandes; entradas límite; duplicados'],
    ['Aislamiento', 'Base y volúmenes exclusivos; reinicio conocido; nunca credenciales ni datos reales en evidencia'],
    ['Nomenclatura', '<versión>_<entorno>_<fecha>_<caso>_<resultado>'],
  ])}
  ${h2('4.', 'Criterios de entrada, salida y suspensión')}
  ${table(['Tipo', 'Criterios'], [
    ['Entrada', 'ERS aprobada; commit/artefacto identificable; entorno sano; datos cargados; casos revisados; defectos conocidos registrados.'],
    ['Salida', '100 % de casos ejecutados; 100 % críticos aprobados; 0 defectos críticos/altos; cada RF trazado; RNF medidos; informe firmado.'],
    ['Suspensión', 'Entorno inestable, datos contaminados, bloqueo que invalida >20 % de casos, pérdida/exposición o candidato cambiado durante la ejecución.'],
    ['Reanudación', 'Causa corregida; entorno restaurado; candidato identificado; casos afectados reiniciados y regresión acordada.'],
  ])}
  ${h2('5.', 'Casos funcionales y trazabilidad')}
  ${table(['Requisito', 'Función', 'Caso(s) principal(es)', 'Resultado'], rfRows.map((r) => [...r, '[ ] C  [ ] NC  [ ] NE']), ['13%', '34%', '32%', '21%'])}
  ${h3('5.1', 'Procedimientos E2E mínimos')}
  ${table(['Caso', 'Precondición y acción esencial', 'Resultado esperado'], [
    ['CP-SIS-01', 'Registrar correo nuevo; intentar duplicado y datos inválidos.', 'Cuenta User; sesión iniciada; 400/409 sin fuga ante negativos.'],
    ['CP-SIS-02', 'Login válido/inválido; logout y reuso del refresh.', 'Tokens válidos; error neutro; token revocado no se reutiliza.'],
    ['CP-SIS-03', 'Crear publicado y borrador; subir JPG/PNG/WEBP/GIF válidos.', 'Datos persistentes; publicado visible; borrador privado; imagen correcta.'],
    ['CP-SIS-04', 'Editar/eliminar propio y luego solicitarlo.', 'Cambio visible; dependencias eliminadas; recurso ausente.'],
    ['CP-SIS-05/06', 'Comparar feed público y de seguidos con orden conocido.', 'Solo publicados; orden descendente; siguiendo solo autores seguidos.'],
    ['CP-SIS-08', 'Buscar texto en proyecto, autor y vacante; vacío y >100 caracteres.', 'Resultados por categoría; sin borradores; errores controlados.'],
    ['CP-SIS-11/12/13', 'Like/unlike; comentar/eliminar; follow/unfollow y repetir.', 'Idempotencia/reglas únicas; contadores e integridad correctos.'],
    ['CP-SIS-14', 'Generar notificación; marcar una y todas desde UI.', 'Solo destinatario; estado leído persistente.'],
    ['CP-SIS-16', 'Postular, repetir, consultar propias; intentar ver ajenas.', 'Una por vacante; estado propio; ajenas no expuestas.'],
  ])}
  ${h2('6.', 'Requisitos no funcionales')}
  ${table(['RNF', 'Verificación', 'Umbral / esperado'], [
    ['RNF-01/02', 'Hash de contraseña; expiración/rotación/revocación', 'BCrypt; acceso 60 min; refresh 7 días; un solo uso'],
    ['RNF-03', 'Matriz dueño/ajeno/admin/invitado por recurso', 'Ningún acceso fuera de política'],
    ['RNF-04', '11 intentos de autenticación en una ventana', 'El excedente obtiene 429 por cliente'],
    ['RNF-05/07', 'Inspección de respuestas y errores inducidos', 'Headers completos; sin trazas/SQL/secretos'],
    ['RNF-06', 'Firmas válidas/falsas, extensiones y tamaños frontera', 'Solo JPG/PNG/WEBP/GIF ≤5 MB; nombre de servidor'],
    ['RNF-08/09', '360/768/1440 px; 4 navegadores; teclado/lector/movimiento', 'Flujos críticos utilizables; sin bloqueo AA crítico'],
    ['RNF-10', 'Recorrido de UI y catálogo de mensajes API', '100 % español — hoy existe brecha conocida'],
    ['RNF-11', 'Carga acordada sobre lecturas', 'p95 ≤500 ms; error <1 %'],
    ['RNF-12', 'Duplicados, FK, cascadas y huérfanos', 'Restricciones efectivas; 0 huérfanos'],
    ['RNF-13/14', 'Build reproducible y despliegue limpio', 'Sin error; contenedores; migración determinista'],
    ['RNF-15', 'Auditoría de matriz RF–CP', '100 % trazado en ambos sentidos'],
  ])}
  ${h2('7.', 'Defectos, evidencias y reporte')}
  ${p('Cada resultado incluye versión/hash, fecha, entorno, ejecutor, datos, pasos, esperado, real y vínculo a evidencia. Un fallo crea un defecto con severidad crítica/alta/media/baja; la reejecución no borra el resultado inicial.')}
  ${table(['Entregable', 'Contenido'], [
    ['Registro de ejecución', 'Caso, estado C/NC/Bloqueado/NE, duración, defecto y evidencia'],
    ['Registro de defectos', 'Severidad, prioridad, responsable, versión, reproducción, causa y cierre'],
    ['Informe resumen', 'Alcance, entorno, totales, tasas, defectos, riesgos residuales y recomendación'],
    ['Matriz de trazabilidad', 'RF/RNF ↔ casos ↔ resultados ↔ defectos ↔ versión'],
  ])}
  ${h2('8.', 'Cronograma y estimación')}
  ${table(['Fase', 'Esfuerzo', 'Dependencia'], [
    ['Preparación y datos', '0,5 día', 'Candidato congelado'], ['Estática/unitaria', '0,5 día', 'Herramientas disponibles'],
    ['Integración/API', '1 día', 'DB y backend'], ['Sistema/navegadores', '1 día', 'Stack completo'],
    ['Seguridad/accesibilidad', '1 día', 'Cuentas y utilidades'], ['Rendimiento/recuperación', '1 día', 'Entorno representativo'],
    ['Regresión/informe', '0,5 día', 'Defectos corregidos'],
  ])}
  ${h2('9.', 'Estado de ejecución al corte')}
  ${table(['Control', 'Resultado'], [
    ['Frontend lint', `${status('Conforme', 'ok')} Ejecutado el 14/09/2026.`],
    ['Frontend build', `${status('Conforme', 'ok')} Vite completó 25 módulos y generó dist.`],
    ['Backend tests', `${status('No ejecutado', 'pending')} El runtime .NET no está disponible en este entorno.`],
    ['Integración, E2E, seguridad dinámica, accesibilidad, rendimiento, restore', `${status('Sin evidencia', 'pending')} Deben ejecutarse antes de recomendar liberación.`],
  ])}
  ${callout('Dictamen provisional', 'El plan y la cobertura prevista están definidos, pero no existe todavía evidencia suficiente para declarar el sistema aprobado. El Modelo de Casos v1.0 sigue siendo material de detalle; este plan añade gobierno, entorno, criterios, suspensión, trazabilidad y reporte.', 'warn')}`
);

const training = documentHtml(
  'Plan de Capacitación',
  'Formación de usuarios, administradores y operación · CodePortfolio 1.0',
  'CP-TRN-002',
  `${control(['14/09/2026', '2.1', 'Se añade modalidad presencial y se normalizan los campos marcables.', AUTHOR])}
  ${h2('1.', 'Propósito y resultados esperados')}
  ${p('Preparar a los participantes para usar y operar CodePortfolio de manera segura, medible y autónoma. La capacitación termina cuando cada perfil demuestra las tareas definidas; asistir no equivale a aprobar.', 'lead')}
  ${ul([
    'El usuario crea y protege su cuenta, publica un proyecto, interactúa y se postula sin exponer datos sensibles.',
    'El administrador gestiona empresas, vacantes y postulaciones mediante la API autorizada; no se promete un panel gráfico inexistente.',
    'Operación implanta, respalda, restaura, monitorea y revierte siguiendo registros controlados.',
    'Soporte clasifica incidencias, reúne evidencia útil y escala de acuerdo con severidad.',
  ])}
  ${h2('2.', 'Audiencias, prerrequisitos y tamaño')}
  ${table(['Modalidad', 'Lugar', 'Idioma', 'Responsable'], [[
    '<strong>Presencial</strong>', 'Aula o sala de capacitación con acceso al entorno de práctica; ubicación por confirmar en la convocatoria.', 'Español', AUTHOR
  ]])}
  ${table(['Perfil', 'Prerrequisito', 'Cupo recomendado', 'Trayecto'], [
    ['Usuario/desarrollador', 'Navegación web y correo accesible', '≤20 por facilitador', 'M1–M4'],
    ['Administrador funcional', 'M1–M4; nociones de API/Swagger', '≤8', 'M5'],
    ['Operación/soporte', 'Linux, Git, Docker, PostgreSQL básico', '≤6', 'M6–M7'],
    ['Formador', 'Producto completo y técnicas de facilitación', '2 máximo', 'Todos + guía'],
  ])}
  ${h2('3.', 'Malla curricular')}
  ${table(['Módulo', 'Duración', 'Objetivos y práctica', 'Criterio'], [
    ['M1 · Orientación y seguridad', '30 min', 'Alcance, roles, privacidad, contraseña, sesión y reporte.', 'Cuestionario ≥80 %'],
    ['M2 · Perfil y proyectos', '60 min', 'Editar perfil/avatar; crear borrador; publicar, editar y eliminar proyecto.', 'Proyecto publicado con datos válidos'],
    ['M3 · Comunidad y búsqueda', '45 min', 'Feed, seguidores, búsqueda, reacciones, comentarios y notificaciones.', 'Completa escenario sin ayuda crítica'],
    ['M4 · Empleo', '30 min', 'Consultar vacantes, postular y revisar estado.', 'Postulación única visible'],
    ['M5 · Administración por API', '75 min', 'Autenticar Admin; gestionar empresa/vacante; revisar/cambiar estado; moderar.', 'Escenario + control de acceso'],
    ['M6 · Implantación y recuperación', '120 min', 'Variables, build, backup/restore, migraciones, humo y rollback.', 'Ensayo dentro de RTO'],
    ['M7 · Soporte y calidad', '45 min', 'Severidades, evidencia, protección de secretos, escalamiento y cierre.', 'Ticket completo correctamente clasificado'],
  ])}
  ${h3('3.1', 'Guiones de práctica')}
  ${table(['Escenario', 'Tarea', 'Evidencia'], [
    ['P-01', 'Registrar cuenta de práctica, cerrar sesión y volver a entrar.', 'Cuenta User y captura sin credenciales'],
    ['P-02', 'Crear borrador, verificar privacidad y publicarlo con imagen.', 'URL/ID y lista del observador'],
    ['P-03', 'Seguir a otro usuario, comentar/reaccionar y gestionar notificación.', 'Estados antes/después'],
    ['P-04', 'Buscar una vacante, postular una sola vez y consultar el estado.', 'Postulación visible; duplicado rechazado'],
    ['P-05', 'Crear empresa/vacante como Admin e intentar lo mismo como User.', 'Admin exitoso; User 403'],
    ['P-06', 'Restaurar backup de prueba y ejecutar humo.', 'Acta, tiempo, checksums y conteos'],
  ])}
  ${h2('4.', 'Metodología y logística')}
  ${p('La capacitación se realizará en modalidad <strong>presencial</strong>. Se aplicará el modelo 20–30–50: aproximadamente 20 % explicación, 30 % demostración y 50 % práctica. Cada módulo usa un entorno de capacitación separado, datos sintéticos y una cuenta por participante. El facilitador demuestra una vez, los participantes ejecutan y un observador evalúa con lista objetiva.')}
  ${table(['Antes', 'Durante', 'Después'], [[
    'Convocatoria 5 días antes; accesos 48 h antes; prueba técnica; diagnóstico; materiales accesibles.',
    'Objetivos visibles; demostración; práctica; pausas; canal de preguntas; asistencia; incidentes sin secretos.',
    'Evaluación; encuesta; plan de refuerzo; certificados/constancias; soporte por 2 semanas.'
  ]])}
  ${h3('4.1', 'Accesibilidad y contingencias')}
  ${ul([
    'Material en formato digital seleccionable, contraste suficiente, texto alternativo y subtítulos/transcripción cuando haya video.',
    'Navegación demostrada con teclado; ritmo y descansos ajustables; alternativa asincrónica si se solicita.',
    'Si el entorno falla más de 15 minutos, se continúa con demostración grabada y se reprograma la práctica evaluada; nunca se aprueba sin práctica.',
    'No se usan contraseñas reales ni datos personales. Las cuentas de práctica caducan o se eliminan al cierre.',
  ])}
  ${h2('5.', 'Materiales y responsabilidades')}
  ${table(['Material', 'Responsable', 'Disponible'], [
    ['Guía rápida de usuario (registro → postulación)', 'Capacitación', 'T−2 días'],
    ['Guía de administración por API', 'Desarrollo', 'T−2 días'],
    ['Runbook de implantación/reversión', 'Implantación', 'T−2 días'],
    ['Datos y cuentas de laboratorio', 'Operación', 'T−1 día'],
    ['Diapositivas, ejercicios, rúbrica, encuesta y asistencia', 'Capacitación', 'T−2 días'],
    ['FAQ y canales de soporte', 'Producto/soporte', 'Día T'],
  ])}
  ${h2('6.', 'Cronograma de cohorte')}
  ${table(['Día', 'Sesión', 'Participantes', 'Modalidad', 'Duración'], [
    ['1', 'M1 + M2', 'Usuarios', 'Presencial', '1 h 30'], ['2', 'M3 + M4 + evaluación', 'Usuarios', 'Presencial', '1 h 30'],
    ['3', 'M5', 'Administradores', 'Presencial', '1 h 15'], ['4', 'M6', 'Operación', 'Presencial', '2 h'],
    ['5', 'M7 + recuperación', 'Soporte / rezagados', 'Presencial', '1 h 15'], ['+14', 'Clínica y medición de adopción', 'Todos', 'Presencial', '45 min'],
  ])}
  ${h2('7.', 'Evaluación, aprobación y mejora')}
  ${table(['Instrumento', 'Peso', 'Aprobación'], [
    ['Diagnóstico', '0 %', 'Identifica apoyos; no excluye'], ['Conocimiento', '30 %', '≥80 %'],
    ['Práctica observada', '60 %', '≥80 % y ningún error crítico de seguridad'], ['Participación/asistencia', '10 %', '≥80 % del trayecto'],
  ])}
  ${p('Resultado final ≥80 %. Quien no apruebe recibe una tutoría y un segundo intento dentro de 5 días hábiles. Persistiendo el fallo, no se habilita el rol administrativo u operativo y se acuerda acompañamiento adicional. La encuesta mide claridad, pertinencia, entorno y confianza; las preguntas con <80 % de acierto obligan a revisar el material.')}
  ${h3('7.1', 'Rúbrica resumida')}
  ${table(['Criterio', '2 · Autónomo', '1 · Con ayuda', '0 · No logra / inseguro'], [
    ['Navegación', 'Completa ruta correcta', 'Una pista menor', 'Se bloquea o abandona'],
    ['Exactitud', 'Resultado correcto', 'Corrige tras pista', 'Datos incorrectos'],
    ['Seguridad', 'Protege secretos/datos', 'Recordatorio menor', 'Expone credencial o elude control'],
    ['Evidencia', 'Registro completo', 'Falta dato menor', 'No permite reproducir'],
  ])}
  ${h2('8.', 'Registros y cierre')}
  ${table(['Participante', 'Perfil', 'Asistencia', 'Teoría', 'Práctica', 'Resultado / refuerzo'], Array.from({length: 8}, () => ['', '', '', '', '', '']))}
  ${callout('Brecha de la versión anterior', 'El plan resumido existente enumeraba módulos y evaluación, pero no definía prerrequisitos, prácticas observables, logística, accesibilidad, contingencia, rúbrica, refuerzo ni registros. Esos elementos quedan incorporados aquí.', 'good')}`,
  '2.1'
);

const requirements = [
  ['RF-01', 'Registro de usuario', 'Crear cuenta con nombre, correo único, contraseña y datos opcionales; el servidor asigna User.', 'Alta', 'UI/API', 'Correo duplicado rechazado; nunca se acepta rol del cliente.'],
  ['RF-02', 'Autenticación', 'Iniciar sesión y emitir acceso + refresh.', 'Alta', 'UI/API', 'Credenciales válidas autentican; inválidas no revelan cuál dato falló.'],
  ['RF-03', 'Renovación', 'Rotar refresh válido y emitir acceso nuevo.', 'Alta', 'API', 'El token usado queda inutilizable; vigencia 7 días.'],
  ['RF-04', 'Cierre', 'Revocar refresh al cerrar sesión.', 'Alta', 'UI/API', 'Reutilizar el refresh revocado falla.'],
  ['RF-05', 'Crear proyecto', 'Título, descripción, URLs y estado published/draft.', 'Alta', 'UI/API', 'Propietario autenticado; validación y persistencia.'],
  ['RF-06', 'Imagen destacada', 'Subir/sustituir imagen válida de hasta 5 MB.', 'Media', 'UI/API', 'Firma válida; nombre de servidor; anterior eliminada al sustituir.'],
  ['RF-07', 'Editar proyecto', 'Solo autor edita contenido/estado.', 'Alta', 'UI/API', 'Ajeno no modifica.'],
  ['RF-08', 'Eliminar proyecto', 'Autor o Admin elimina y limpia dependencias.', 'Alta', 'UI/API', 'Recurso, comentarios y reacciones dejan de existir.'],
  ['RF-09', 'Privacidad de borrador', 'Solo autor o Admin accede a draft.', 'Alta', 'API', 'Invitado/ajeno no distingue existencia.'],
  ['RF-10', 'Feed público', 'Listar publicados recientes con paginación.', 'Alta', 'UI/API', 'Solo published; orden descendente; size 1–50.'],
  ['RF-11', 'Feed de seguidos', 'Listar publicados de autores seguidos.', 'Media', 'UI/API', 'Requiere sesión y excluye no seguidos.'],
  ['RF-12', 'Exploración y filtros', 'Explorar publicados; en propios filtrar published/draft y buscar.', 'Media', 'UI', 'Filtros no revelan borradores ajenos.'],
  ['RF-13', 'Búsqueda global', 'Buscar proyectos publicados, usuarios y vacantes por término.', 'Media', 'UI/API', '1–100 caracteres; resultados por categoría; sin drafts.'],
  ['RF-14', 'Perfil público', 'Nombre, biografía, ubicación, avatar, contadores y proyectos publicados.', 'Alta', 'UI/API', 'No devuelve correo ni hash.'],
  ['RF-15', 'Editar perfil', 'Propietario edita datos y avatar.', 'Media', 'UI/API', 'Identidad tomada del token.'],
  ['RF-16', 'Reacciones', 'Like/unlike único por usuario/proyecto visible.', 'Media', 'UI/API', 'Contador consistente; restricción única.'],
  ['RF-17', 'Comentarios', 'Crear en publicado; autor/Admin elimina.', 'Media', 'UI/API', 'Autor del proyecto recibe notificación si corresponde.'],
  ['RF-18', 'Seguimiento', 'Follow/unfollow a otro usuario y listar relaciones.', 'Media', 'UI/API', 'No auto-seguimiento; relación única.'],
  ['RF-19', 'Notificaciones', 'Listar propias y marcar una o todas desde UI.', 'Media', 'UI/API', 'El endpoint individual solo afecta al destinatario.'],
  ['RF-20', 'Vacantes', 'Listar/consultar/buscar vacantes públicamente.', 'Media', 'UI/API', 'Respuesta incluye empresa y datos de la oferta.'],
  ['RF-21', 'Postulación', 'Usuario postula con carta opcional y proyecto propio opcional.', 'Media', 'UI/API', 'Una por usuario/vacante; proyecto adjunto debe ser propio.'],
  ['RF-22', 'Mis postulaciones', 'Consultar solo solicitudes propias y estado.', 'Media', 'UI/API', 'No expone postulaciones de otros.'],
  ['RF-23', 'Contraseña', 'Cambiar verificando actual y revocar sesiones.', 'Alta', 'UI/API', 'Actual incorrecta falla; refresh previos inválidos.'],
  ['RF-24', 'Baja de cuenta', 'Eliminar cuenta verificando contraseña.', 'Alta', 'UI/API', 'Datos dependientes eliminados; sesión finaliza.'],
  ['RF-25', 'Administración', 'Admin gestiona empresas, vacantes, estados, usuarios y moderación mediante API.', 'Media', 'API', 'User/Recruiter sin permiso obtiene 403; UI gráfica fuera de alcance.'],
];

const srs = documentHtml(
  'Especificación de Requisitos del Software',
  'Estructura solicitada IEEE 830, actualizada con criterios ISO/IEC/IEEE 29148:2018 · CodePortfolio 1.0',
  'CP-SRS-002',
  `${control()}
  ${h2('1.', 'Introducción')}
  ${p('Esta ERS establece una línea base verificable de lo que CodePortfolio 1.0 debe hacer y de las restricciones bajo las que debe operar. Está dirigida a producto, desarrollo, pruebas, implantación, capacitación y aceptación.', 'lead')}
  ${callout('Vigencia normativa', 'IEEE 830-1998 está sustituida por ISO/IEC/IEEE 29148. Se conserva la organización familiar de IEEE 830 porque fue solicitada, y se añaden atributos, criterios y gestión de trazabilidad compatibles con la práctica vigente.', 'note')}
  ${h3('1.1', 'Ámbito')}${p('CodePortfolio es una red social web para desarrolladores: portafolios de proyectos, comunidad y acceso a vacantes. No aloja código ni ejecuta demos; solo conserva metadatos, imágenes y enlaces externos.')}
  ${h3('1.2', 'Definiciones')}${table(['Término', 'Definición'], [
    ['Usuario', 'Cuenta individual con rol User, Recruiter o Admin.'], ['Proyecto', 'Publicación de código con metadatos, estado y posible imagen.'],
    ['Borrador', 'Proyecto no público, visible solo para autor y Admin.'], ['Refresh token', 'Credencial rotatoria de sesión almacenada en forma de hash.'],
    ['Candidato', 'Commit y artefactos identificados que se someten a pruebas.'], ['Conforme (C)', 'El resultado observado satisface todo el criterio de aceptación.'],
  ])}
  ${h2('2.', 'Descripción general')}
  ${h3('2.1', 'Perspectiva y arquitectura')}
  ${p('La SPA React consume una API REST ASP.NET Core. La API aplica reglas de negocio, autenticación JWT, persistencia EF Core/PostgreSQL y manejo de imágenes en volumen. Nginx sirve la SPA y actúa como proxy interno; un terminador TLS protege la exposición pública.')}
  ${h3('2.2', 'Clases de usuario')}
  ${table(['Actor', 'Capacidades', 'Limitaciones'], [
    ['Invitado', 'Feed, proyectos públicos, perfiles, búsqueda y vacantes.', 'No escribe ni ve datos privados.'],
    ['User/desarrollador', 'Cuenta, proyectos, comunidad, notificaciones y postulaciones.', 'Solo recursos propios salvo interacción permitida.'],
    ['Recruiter', 'Rol previsto.', 'En 1.0 no posee permisos diferenciados; no se debe prometer gestión.'],
    ['Admin', 'CRUD administrativo, estados, moderación y acceso excepcional a borradores.', 'Operación por API; no hay panel gráfico 1.0.'],
  ])}
  ${h3('2.3', 'Restricciones, supuestos y dependencias')}
  ${ul([
    'Contenedores; PostgreSQL 16; .NET 8; Node.js 20+; React 19; migraciones EF como mecanismo de esquema.',
    'HTTPS obligatorio en producción; secretos por entorno/gestor, nunca en Git; imágenes fuera de la base.',
    'Interfaz en español y adaptable desde 360 px. Dependencia de enlaces externos para demos/repositorios.',
    'Volumen de diseño inicial: hasta 10.000 usuarios; las metas de rendimiento deben validarse con datos representativos.',
    'Empresas/vacantes son creadas por Admin. No hay autorregistro de empresa.',
  ])}
  ${h3('2.4', 'Fuera de alcance')}${p('Mensajería directa y colaboradores en la UI, panel gráfico Admin, correo electrónico, pagos, internacionalización, ejecución/alojamiento de código y alta disponibilidad multirregión. Aunque existen modelos o endpoints administrativos heredados para mensajes/colaboradores, no constituyen una función de usuario aceptada en 1.0.')}
  ${h2('3.', 'Interfaces externas')}
  ${table(['Interfaz', 'Especificación'], [
    ['Usuario', 'SPA responsive; navegación lateral ≥769 px e inferior ≤768 px; formularios con nombre accesible; teclado; movimiento reducido.'],
    ['API', 'HTTP/JSON bajo /api; Bearer JWT; multipart/form-data para imágenes; códigos 2xx/4xx/5xx consistentes.'],
    ['Datos', 'PostgreSQL UTF-8, UUID, UTC para fechas; restricciones únicas/FK/cascadas versionadas.'],
    ['Archivos', 'JPG, PNG, WEBP o GIF por firma; ≤5 MB; nombre generado; servidos bajo /images.'],
    ['Comunicaciones', 'HTTPS en producción; CORS por allowlist; red interna para API/DB.'],
  ])}
  ${h2('4.', 'Requisitos funcionales')}
  ${table(['ID', 'Nombre', 'Especificación', 'Prioridad', 'Superficie', 'Criterio de aceptación'], requirements, ['8%', '13%', '29%', '9%', '10%', '31%'])}
  ${h2('5.', 'Reglas de negocio y modelo de estados')}
  ${table(['ID', 'Regla'], [
    ['RN-01', 'El registro público asigna User con independencia del cuerpo enviado.'], ['RN-02', 'Email es único sin distinción operativa de mayúsculas según normalización del repositorio.'],
    ['RN-03', 'Un usuario no puede reaccionar dos veces al mismo proyecto, seguir dos veces al mismo usuario ni postular dos veces a la misma vacante.'],
    ['RN-04', 'Solo published participa en feed/búsqueda pública; draft se trata como inexistente para no autorizados.'],
    ['RN-05', 'Estado de postulación: pending → accepted o rejected; cambios reservados a Admin.'],
    ['RN-06', 'El identificador de usuario de operaciones propias proviene del token, no de parámetros manipulables.'],
    ['RN-07', 'El borrado debe mantener integridad referencial y retirar archivos que dejan de estar referenciados.'],
  ])}
  ${h2('6.', 'Requisitos no funcionales')}
  ${table(['ID', 'Atributo', 'Requisito medible', 'Verificación'], [
    ['RNF-01', 'Credenciales', 'BCrypt; contraseña ≥8 caracteres; hashes nunca salen de API.', 'Inspección + pruebas'],
    ['RNF-02', 'Sesión', 'Access 60 min; refresh 7 días, hash SHA-256, rotación y revocación.', 'Pruebas con reloj/control DB'],
    ['RNF-03', 'Autorización', '100 % de escrituras y lecturas privadas validan rol/propiedad.', 'Matriz actor–recurso'],
    ['RNF-04', 'Fuerza bruta', 'Máx. 10 solicitudes/min/cliente en rutas auth; excedente 429.', 'Prueba dinámica'],
    ['RNF-05', 'Headers', 'nosniff, DENY, Referrer-Policy, Permissions-Policy, CSP; HSTS en producción.', 'curl/navegador'],
    ['RNF-06', 'Archivos', 'Solo firmas JPG/PNG/WEBP/GIF ≤5 MB; nombre no controlado por cliente.', 'Pruebas frontera'],
    ['RNF-07', 'Errores', '0 trazas, SQL, secretos o rutas internas en respuestas.', 'Errores inducidos'],
    ['RNF-08', 'Compatibilidad', 'Flujos críticos en Chrome/Firefox/Safari/Edge vigentes y 360–1440 px.', 'Matriz de navegadores'],
    ['RNF-09', 'Accesibilidad', 'Teclado, nombre accesible, foco visible y movimiento reducido sin fallos críticos.', 'Auditoría manual/automática'],
    ['RNF-10', 'Idioma', '100 % de textos de usuario y errores de API en español.', 'Recorrido/catálogo'],
    ['RNF-11', 'Rendimiento', 'Lecturas p95 ≤500 ms, error <1 %, con perfil de carga documentado.', 'Prueba de carga'],
    ['RNF-12', 'Integridad', '0 duplicados prohibidos y 0 huérfanos tras bajas.', 'SQL + integración'],
    ['RNF-13', 'Mantenibilidad', 'Lint/build/test sin error para candidato; revisión obligatoria.', 'Pipeline / logs'],
    ['RNF-14', 'Portabilidad', 'Despliegue reproducible por contenedores y migraciones.', 'Ensayo limpio'],
    ['RNF-15', 'Recuperación', 'RPO ≤24 h, RTO ≤60 min, rollback ≤30 min.', 'Restore cronometrado'],
    ['RNF-16', 'Trazabilidad', '100 % de RF/RNF vinculados a pruebas y resultados.', 'Auditoría de matriz'],
  ])}
  ${h2('7.', 'Modelo de información')}
  ${table(['Entidad', 'Datos principales', 'Relaciones / integridad'], [
    ['Role', 'id, name único, description', 'Uno a muchos con User'], ['User', 'id, fullName, email único, password, bio, location, avatar, date, role', 'Proyectos, comentarios, reacciones, follows, notificaciones, postulaciones, refresh'],
    ['Project', 'id, title, description, image, demoUrl, repositoryUrl, status, publishDate', 'Pertenece a User; comentarios/reacciones; borrado en cascada'],
    ['Comment / Reaction', 'contenido/tipo, fecha', 'User + Project; Reaction única por par'], ['Follow', 'follower, followed, fecha, project opcional heredado', 'Único por par de usuarios'],
    ['Company / JobOpening', 'empresa; oferta y modalidad', 'Empresa publica vacantes'], ['Application', 'cover, status, date, project opcional', 'Única por User + JobOpening'],
    ['Notification', 'message, date, isRead', 'Pertenece a User; Company opcional'], ['RefreshToken', 'tokenHash, expiry, revoked, created', 'Único; pertenece a User'],
  ])}
  ${h2('8.', 'Trazabilidad, estado y cambios')}
  ${p('La matriz oficial se mantiene en el Plan de Pruebas. Cada cambio de requisito registra solicitante, motivo, impacto, decisión, versión y pruebas afectadas. Los códigos no se reutilizan; los retirados conservan estado “eliminado”.')}
  ${table(['Aspecto verificado en código', 'Estado al corte'], [
    ['RF-01 a RF-24', `${status('Implementación visible', 'ok')} Existen rutas API y superficies UI principales; falta completar evidencia E2E.`],
    ['RF-25', `${status('Parcial', 'partial')} API Admin existente; no hay panel gráfico y se declara fuera de alcance.`],
    ['RNF-10', `${status('No conforme', 'pending')} Persisten respuestas en inglés en controladores y desafíos JWT.`],
    ['RNF-11/RNF-15', `${status('Sin evidencia', 'pending')} No hay informe actual de carga ni restauración.`],
    ['Candidato 1.0', `${status('No congelado', 'pending')} Sin etiqueta Git; árbol con cambios locales.`],
  ])}
  ${callout('Criterio de aceptación de la ERS', 'La existencia de código no demuestra conformidad. Un requisito pasa a “verificado” solo cuando su caso asociado se ejecuta sobre una versión identificada y conserva evidencia.', 'warn')}`
);

const risks = [
  ['R-01', 'Pérdida/corrupción de datos en migración o baja', 'Técnico', '2', '5', '10 A', 'Implantación', 'Backup DB+imágenes; migración ensayada; cascadas probadas', 'Restore verificado; rollback; congelar escrituras', '1', '5', '5 M', 'Abierto'],
  ['R-02', 'Exposición de secretos o datos personales', 'Seguridad', '3', '5', '15 C', 'Desarrollo', 'Variables; .gitignore; errores neutros; evidencia redactada', 'Rotar/revocar; aislar; investigar alcance; notificar según obligación', '2', '5', '10 A', 'Abierto'],
  ['R-03', 'Acceso indebido a recurso ajeno o rol Admin', 'Seguridad', '3', '5', '15 C', 'Calidad', 'JWT; [Authorize]; propiedad; pruebas actor–recurso', 'Bloquear liberación; revocar sesiones; corregir y regresión', '1', '5', '5 M', 'Abierto'],
  ['R-04', 'Fuerza bruta / abuso del login', 'Seguridad', '3', '4', '12 A', 'Desarrollo', '10 solicitudes/min/cliente; mensajes neutros', 'Bloqueo temporal/WAF; revisar IP real y logs', '2', '4', '8 M', 'Controlado'],
  ['R-05', 'Archivo malicioso o agotamiento de almacenamiento', 'Seguridad', '2', '4', '8 M', 'Desarrollo', 'Firma, tipo, 5 MB, nombre del servidor, volumen', 'Aislar/eliminar; ampliar cuota; escanear y revisar logs', '1', '4', '4 B', 'Controlado'],
  ['R-06', 'Indisponibilidad de contenedor/servidor', 'Operación', '3', '4', '12 A', 'Operación', 'Restart; health DB; monitoreo; capacidad', 'Reiniciar/failover proveedor; restaurar versión estable', '2', '4', '8 M', 'Abierto'],
  ['R-07', 'Persona única concentra conocimiento y aprobación', 'Proyecto', '4', '4', '16 C', 'Producto', 'Runbooks; repositorio; registros; capacitación cruzada', 'Revisor externo; suplente; congelar cambios de alto riesgo', '3', '4', '12 A', 'Abierto'],
  ['R-08', 'Requisito ambiguo o cambio tardío', 'Alcance', '3', '3', '9 M', 'Producto', 'ERS versionada; criterios; control de cambios', 'Replanificar; diferir con aceptación; actualizar pruebas', '2', '3', '6 M', 'Abierto'],
  ['R-09', 'Estimación/calendario insuficiente', 'Proyecto', '3', '3', '9 M', 'Producto', 'Hitos, puertas y seguimiento semanal', 'Reducir alcance no crítico; priorizar defectos y controles', '2', '3', '6 M', 'Abierto'],
  ['R-10', 'Degradación de rendimiento/crecimiento', 'Técnico', '3', '3', '9 M', 'Desarrollo', 'Paginación; índices; límite 50; meta p95', 'Optimizar consulta/índice; limitar tráfico; escalar recursos', '2', '3', '6 M', 'Abierto'],
  ['R-11', 'Vulnerabilidad de dependencia o imagen', 'Cadena suministro', '3', '4', '12 A', 'Desarrollo', 'Lockfile; imágenes versionadas; revisión/escaneo', 'Actualizar/pinear; retirar versión; aceptar temporalmente con control', '2', '4', '8 M', 'Abierto'],
  ['R-12', 'Contenido abusivo / enlaces externos dañinos', 'Producto', '3', '3', '9 M', 'Producto', 'Moderación Admin; rel=noopener; reporte por soporte', 'Retirar contenido/usuario; registrar evidencia; bloquear dominio', '2', '3', '6 M', 'Abierto'],
  ['R-13', 'Pérdida o inconsistencia de imágenes', 'Datos', '3', '3', '9 M', 'Operación', 'Volumen persistente; backup conjunto; sustitución controlada', 'Restaurar volumen; marcador temporal; reconciliar referencias', '2', '3', '6 M', 'Abierto'],
  ['R-14', 'Despliegue fallido / etiqueta incorrecta', 'Operación', '3', '4', '12 A', 'Implantación', 'Gates; tag/hash; ensayo; humo; versión anterior', 'Rollback ≤30 min; comunicar; análisis causal', '1', '4', '4 B', 'Abierto'],
  ['R-15', 'Baja adopción o errores de usuario', 'Adopción', '2', '3', '6 M', 'Capacitación', 'Práctica; evaluación; guía; soporte 2 semanas', 'Refuerzo; tutoría; mejorar interfaz/material', '1', '3', '3 B', 'Abierto'],
  ['R-16', 'Inconsistencia de idioma y mensajes', 'Calidad', '4', '2', '8 M', 'Desarrollo', 'RNF-10; catálogo; revisión', 'Corregir strings; regresión; aceptar explícitamente si se difiere', '2', '2', '4 B', 'Materializado'],
  ['R-17', 'Ausencia de evidencia backend/E2E/restore', 'Calidad', '4', '5', '20 C', 'Calidad', 'Plan, puertas G2/G3, formatos de evidencia', 'No liberar; habilitar herramientas; ejecutar y documentar', '1', '5', '5 M', 'Materializado'],
  ['R-18', 'Candidato no reproducible por cambios locales/sin tag', 'Configuración', '4', '4', '16 C', 'Desarrollo', 'Árbol limpio; tag; digest; migraciones inventariadas', 'Congelar, revisar e identificar nueva línea base', '1', '4', '4 B', 'Materializado'],
  ['R-19', 'TLS/CORS/proxy mal configurados', 'Operación/seguridad', '3', '5', '15 C', 'Operación', 'Overlay producción; allowlist; prueba externa; headers', 'Retirar exposición; corregir; rotar secretos si hubo fuga', '1', '5', '5 M', 'Abierto'],
  ['R-20', 'Borrado en cascada incompleto o excesivo', 'Datos', '2', '5', '10 A', 'Desarrollo', 'FK revisadas; pruebas de huérfanos; backup', 'Restaurar; corregir migración/repositorio; regresión', '1', '5', '5 M', 'Abierto'],
];

const riskDoc = documentHtml(
  'Matriz de Riesgos',
  'Identificación, tratamiento, seguimiento y aceptación · CodePortfolio 1.0',
  'CP-RSK-002',
  `${control()}
  ${h2('1.', 'Método y apetito de riesgo')}
  ${p('Se valora probabilidad (P) e impacto (I) de 1 a 5. La exposición es P×I antes y después de controles. La matriz cubre riesgos de producto, proyecto, operación, seguridad, datos, cadena de suministro, calidad y adopción.', 'lead')}
  ${table(['Valor', 'Probabilidad', 'Impacto'], [
    ['1', 'Rara: excepcional', 'Insignificante: sin interrupción ni dato afectado'], ['2', 'Improbable', 'Menor: alternativa simple'],
    ['3', 'Posible', 'Moderado: función/cronograma afectado'], ['4', 'Probable', 'Mayor: flujo crítico, >1 día o datos en riesgo'],
    ['5', 'Casi seguro', 'Catastrófico: pérdida/exposición, autorización eludida o indisponibilidad prolongada'],
  ])}
  ${table(['P×I', 'Nivel', 'Tratamiento'], [['1–4', 'Bajo (B)', 'Aceptar/observar'], ['5–9', 'Medio (M)', 'Mitigar con responsable'], ['10–14', 'Alto (A)', 'Plan y seguimiento frecuente'], ['15–25', 'Crítico (C)', 'Bloquea liberación salvo reducción/aprobación excepcional']])}
  ${callout('Apetito', 'No se acepta para producción riesgo residual crítico, ni riesgo alto de seguridad/integridad sin aprobación explícita y control compensatorio. Un riesgo materializado se gestiona además como hallazgo o defecto.', 'risk')}
  ${h2('2.', 'Registro de riesgos')}
  ${table(['ID', 'Riesgo', 'Categoría', 'P', 'I', 'Inh.', 'Dueño', 'Prevención / mitigación', 'Contingencia', 'Pr', 'Ir', 'Residual', 'Estado'], risks, ['5%', '16%', '8%', '3%', '3%', '5%', '7%', '19%', '18%', '3%', '3%', '5%', '5%'])}
  ${h2('3.', 'Indicadores, disparadores y escalamiento')}
  ${table(['Riesgo(s)', 'Indicador / disparador', 'Umbral', 'Acción'], [
    ['R-01/R-13/R-20', 'Backup/restore, conteos, huérfanos', 'Un restore fallido o diferencia no explicada', 'No-go; investigar y repetir'],
    ['R-02/R-03/R-04/R-05/R-19', 'Alertas, 401/403/429, secretos, archivos', 'Una fuga o bypass; aumento anómalo', 'Contener y escalar de inmediato'],
    ['R-06/R-10', '5xx, p95, reinicios, CPU/RAM/disco', '5xx ≥1 % o p95 >500 ms sostenido', 'Diagnóstico; capacidad; rollback si afecta críticos'],
    ['R-07', 'Revisiones y cobertura de suplente', 'Sin revisor/suplente en G3', 'Reprogramar o aceptar formalmente exposición'],
    ['R-11', 'Escaneo de paquetes/imágenes', 'CVE crítica/alta explotable', 'Bloquear hasta parche/control aprobado'],
    ['R-16', 'Mensajes no españoles', 'Cualquier mensaje de usuario', 'Corregir o registrar excepción RNF-10'],
    ['R-17', 'Casos con resultado y evidencia', '<100 % críticos o backend sin resultado', 'No liberar'],
    ['R-18', 'Git status/tag/digest', 'Árbol sucio o versión sin identificar', 'Congelar nueva línea base'],
  ])}
  ${h2('4.', 'Priorización actual')}
  ${table(['Prioridad', 'Riesgos', 'Decisión requerida'], [
    ['1 · Bloqueantes actuales', 'R-17, R-18', 'Habilitar/ejecutar backend y E2E; integrar cambios y etiquetar candidato.'],
    ['2 · Críticos inherentes', 'R-02, R-03, R-07, R-19', 'Probar controles; incorporar revisor/suplente; verificar producción.'],
    ['3 · Altos operativos', 'R-01, R-04, R-06, R-11, R-14, R-20', 'Ensayo, restore, escaneo, monitoreo y rollback.'],
    ['4 · Calidad materializada', 'R-16', 'Resolver mensajes en inglés o ajustar el requisito.'],
  ])}
  ${h2('5.', 'Cadencia y ciclo de vida')}
  ${ol([
    'Revisar semanalmente y en cada puerta G0–G5; registrar fecha, cambio de P/I, evidencia y decisión.',
    'El dueño ejecuta acciones; calidad desafía valoración y verifica evidencia; producto acepta el residual.',
    'Cerrar solo si la causa desaparece o el control demuestra riesgo bajo estable. Conservar el registro histórico.',
    'Todo incidente actualiza esta matriz, el plan de pruebas y, si aplica, requisitos, capacitación o implantación.',
  ])}
  ${h3('5.1', 'Registro de revisión')}
  ${table(['Fecha', 'Riesgo', 'Cambio / evidencia', 'P/I residual', 'Decisión', 'Responsable'], Array.from({length: 8}, () => ['', '', '', '', '', '']))}
  ${h2('6.', 'Aceptación de riesgos')}
  ${table(['ID', 'Residual aceptado', 'Justificación / control compensatorio', 'Vencimiento', 'Aprobador / firma'], Array.from({length: 5}, () => ['', '[ ] Sí [ ] No', '', '', '']))}
  ${callout('Mejora frente a la matriz previa', 'La versión inicial listaba riesgo, P, I y mitigación, pero no tenía dueño, riesgo residual, estado, disparadores, apetito, aceptación ni registro de revisión. Esta matriz incorpora esos controles y añade los riesgos materializados durante la revisión del repositorio.', 'good')}`
);

const write = (filename, html) => fs.writeFileSync(path.join(OUT, filename), html, 'utf8');
write('01_Plan_Aseguramiento_Calidad_IEEE730_CodePortfolio_v2.html', sqap);
write('02_Plan_Implantacion_CodePortfolio_v2.html', implementation);
write('03_Plan_Pruebas_CodePortfolio_v2.html', testPlan);
write('04_Plan_Capacitacion_CodePortfolio_v2.html', training);
write('05_Especificacion_Requisitos_IEEE830_CodePortfolio_v2.html', srs);
write('06_Matriz_Riesgos_CodePortfolio_v2.html', riskDoc);

console.log(`Generated ${fs.readdirSync(OUT).length} HTML sources in ${OUT}`);
