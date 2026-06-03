/**
 * Descarga los recursos de marca de Bresme (logo y favicon) a la carpeta
 * public/, para usarlos en la cabecera y en la pestaña del navegador.
 * Uso:  node automatizacion/descargar-marca.mjs
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

// Recursos a descargar: [URL de origen, nombre de archivo destino en public/]
const RECURSOS = [
  [
    "https://www.bresme.com/img/personalizacion/bresme/base/logo-bresme.svg",
    "logo-bresme.svg",
  ],
  [
    "https://www.bresme.com/img/personalizacion/bresme/ico/ms-icon-144x144.png",
    "favicon-bresme.png",
  ],
];

async function main() {
  for (const [url, nombre] of RECURSOS) {
    try {
      const respuesta = await fetch(url, {
        headers: { "User-Agent": "BresmeMarcaBot/1.0 (prueba tecnica)" },
      });
      if (!respuesta.ok) {
        console.log(`  ✗ ${nombre}  (HTTP ${respuesta.status})`);
        continue;
      }
      const buffer = Buffer.from(await respuesta.arrayBuffer());
      await writeFile(join(PUBLIC, nombre), buffer);
      console.log(`  ✓ ${nombre}  (${buffer.length} bytes)`);
    } catch (err) {
      console.log(`  ✗ ${nombre}  (${err.message})`);
    }
  }
  console.log("Recursos de marca guardados en public/");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
