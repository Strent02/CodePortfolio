import fs from 'node:fs';
import path from 'node:path';

const output = path.resolve('documentacion/entregables_ieee/06_Matriz_Riesgos_CodePortfolio.xlsx');
const rows = [
  ['ID','Riesgo','Categoría','P','I','Nivel','Responsable','Mitigación','Contingencia','Estado'],
  ['R-01','Pérdida o corrupción de datos','Datos','2','5','Alto','Operación','Backup de DB e imágenes; migración ensayada','Restaurar copia verificada y congelar escrituras','Abierto'],
  ['R-02','Exposición de secretos o datos personales','Seguridad','3','5','Crítico','Desarrollo','Variables de entorno y revisión','Rotar claves, aislar y evaluar alcance','Abierto'],
  ['R-03','Acceso a recurso ajeno o rol Admin','Seguridad','3','5','Crítico','Calidad','JWT, autorización y pruebas de propiedad','Revocar sesiones, corregir y hacer regresión','Abierto'],
  ['R-04','Fuerza bruta en inicio de sesión','Seguridad','3','4','Alto','Desarrollo','Rate limit: 10 solicitudes por minuto','Revisar IP, logs y controles perimetrales','Controlado'],
  ['R-05','Archivo malicioso o falta de espacio','Seguridad','2','4','Medio','Desarrollo','Firma binaria, tipo permitido y máximo 5 MB','Aislar archivo y ampliar cuota controlada','Controlado'],
  ['R-06','Indisponibilidad de contenedores','Operación','3','4','Alto','Operación','Healthcheck DB, restart y monitoreo','Reiniciar o volver a versión estable','Abierto'],
  ['R-07','Conocimiento concentrado en una persona','Proyecto','4','4','Crítico','Producto','Runbooks, revisión externa y documentación','Asignar suplente y congelar cambios riesgosos','Abierto'],
  ['R-08','Degradación por crecimiento','Técnico','3','3','Medio','Desarrollo','Paginación, índices y monitoreo p95','Optimizar consultas o escalar recursos','Abierto'],
  ['R-09','Vulnerabilidad de dependencia o imagen','Cadena de suministro','3','4','Alto','Desarrollo','Lockfile, versiones fijas y escaneo','Actualizar o retirar versión afectada','Abierto'],
  ['R-10','Despliegue o migración fallidos','Operación','3','4','Alto','Implantación','Tag/hash, backup, ensayo y humo','Rollback y análisis causal','Abierto'],
];
const x = (v) => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const col = (n) => { let s=''; while(n>=0){s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)-1;} return s; };
const cells = rows.map((r,i)=>`<row r="${i+1}">${r.map((v,j)=>`<c r="${col(j)}${i+1}" t="inlineStr"><is><t>${x(v)}</t></is></c>`).join('')}</row>`).join('');
const files = {
  '[Content_Types].xml':'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
  '_rels/.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
  'xl/workbook.xml':'<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Matriz de riesgos" sheetId="1" r:id="rId1"/></sheets></workbook>',
  'xl/_rels/workbook.xml.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
  'xl/worksheets/sheet1.xml':`<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" state="frozen"/></sheetView></sheetViews><cols>${[8,35,20,6,6,12,18,48,48,14].map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${cells}</sheetData><autoFilter ref="A1:J${rows.length}"/></worksheet>`
};
let crcTable; const crc=(data)=>{if(!crcTable)crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});let c=0xffffffff;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
const u16=(n)=>Buffer.from([n&255,n>>>8&255]),u32=(n)=>Buffer.from([n&255,n>>>8&255,n>>>16&255,n>>>24&255]);
let offset=0;const locals=[],central=[];
for(const [name,text] of Object.entries(files)){const data=Buffer.from(text),fn=Buffer.from(name),sum=crc(data);const local=Buffer.concat([Buffer.from('PK\x03\x04'),u16(20),u16(0),u16(0),u16(0),u16(0),u32(sum),u32(data.length),u32(data.length),u16(fn.length),u16(0),fn,data]);locals.push(local);central.push(Buffer.concat([Buffer.from('PK\x01\x02'),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(sum),u32(data.length),u32(data.length),u16(fn.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),fn]));offset+=local.length;}
const directory=Buffer.concat(central);fs.writeFileSync(output,Buffer.concat([...locals,directory,Buffer.from('PK\x05\x06'),u16(0),u16(0),u16(central.length),u16(central.length),u32(directory.length),u32(offset),u16(0)]));
console.log('Matriz XLSX generada:',output);
