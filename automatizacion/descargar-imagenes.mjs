/**
 * Automatización de imágenes de producto — Bresme
 * --------------------------------------------------
 * Estrategia: la web de Bresme sirve la imagen de cada producto en una URL
 * predecible a partir de su REFERENCIA (campo "id" del JSON):
 *
 *   https://www.bresme.com/img/personalizacion/bresme/products/zoom/{REF}.jpg
 *   https://www.bresme.com/img/personalizacion/bresme/products/list/{REF}.jpg
 *
 * Para cada producto: construimos la URL, verificamos que existe (la respuesta
 * es 200 y el content-type es una imagen), la descargamos a public/imagenes/
 * y actualizamos el campo "imagen" del JSON. Si no se encuentra, se deja
 * imagen: null y se registra en el informe final.
 *
 * Sin dependencias externas: usa fetch y fs nativos (Node 18+).
 * Uso:  node automation/descargar-imagenes.mjs
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE = "https://www.bresme.com";
const CARPETA_REMOTA = "/img/personalizacion/bresme/products";
const CONCURRENCIA = 6; // peticiones simultáneas (educado con el servidor)

// Rutas relativas a la ubicación del script (no al directorio de ejecución).
const __dirname = dirname(fileURLToPath(import.meta.url));
const RAIZ_PROYECTO = join(__dirname, "..");
const RUTA_JSON = join(RAIZ_PROYECTO, "src", "data", "productos.json");
const CARPETA_IMAGENES = join(RAIZ_PROYECTO, "public", "imagenes");

// Devuelve las URLs candidatas para un producto, en orden de preferencia
// (primero la grande "zoom", luego la miniatura "list" como respaldo).
function urlsCandidatas(referencia) {
  return [
    `${BASE}${CARPETA_REMOTA}/zoom/${referencia}.jpg`,
    `${BASE}${CARPETA_REMOTA}/list/${referencia}.jpg`,
  ];
}

// Intenta descargar la primera URL válida. Devuelve los bytes o null.
async function descargarImagen(referencia) {
  for (const url of urlsCandidatas(referencia)) {
    try {
      const respuesta = await fetch(url, {
        headers: { "User-Agent": "BresmeImagenBot/1.0 (prueba tecnica)" },
      });
      const tipo = respuesta.headers.get("content-type") || "";
      if (respuesta.ok && tipo.startsWith("image/")) {
        const buffer = Buffer.from(await respuesta.arrayBuffer());
        // Descartamos respuestas vacías o sospechosamente pequeñas (placeholders).
        if (buffer.length > 1024) {
          return buffer;
        }
      }
    } catch {
      // Error de red en esta candidata: probamos la siguiente.
    }
  }
  return null;
}

// Procesa los productos en lotes para limitar la concurrencia.
async function procesarEnLotes(productos) {
  const encontradas = [];
  const sinImagen = [];

  for (let i = 0; i < productos.length; i += CONCURRENCIA) {
    const lote = productos.slice(i, i + CONCURRENCIA);
    await Promise.all(
      lote.map(async (producto) => {
        const buffer = await descargarImagen(producto.id);
        if (buffer) {
          const nombreArchivo = `${producto.id}.jpg`;
          await writeFile(join(CARPETA_IMAGENES, nombreArchivo), buffer);
          // Ruta pública servida por Vite desde la carpeta /public.
          producto.imagen = `/imagenes/${nombreArchivo}`;
          encontradas.push(producto.id);
          console.log(`  ✓ ${producto.id}  ${producto.descripcion}`);
        } else {
          producto.imagen = null;
          sinImagen.push(producto.id);
          console.log(`  ✗ ${producto.id}  (sin imagen) ${producto.descripcion}`);
        }
      })
    );
  }

  return { encontradas, sinImagen };
}

async function main() {
  console.log("Leyendo productos…");
  const productos = JSON.parse(await readFile(RUTA_JSON, "utf-8"));

  await mkdir(CARPETA_IMAGENES, { recursive: true });

  console.log(`Descargando imágenes de ${productos.length} productos…\n`);
  const { encontradas, sinImagen } = await procesarEnLotes(productos);

  // Guardamos el JSON actualizado con las rutas de imagen.
  await writeFile(RUTA_JSON, JSON.stringify(productos, null, 2) + "\n", "utf-8");

  // Informe final de cobertura.
  const total = productos.length;
  const cobertura = ((encontradas.length / total) * 100).toFixed(1);
  console.log("\n──────────── INFORME ────────────");
  console.log(`Encontradas:  ${encontradas.length}/${total}  (${cobertura}%)`);
  console.log(`Sin imagen:   ${sinImagen.length}`);
  if (sinImagen.length > 0) {
    console.log(`Referencias sin imagen: ${sinImagen.join(", ")}`);
  }
  console.log("JSON actualizado en src/data/productos.json");
}

main().catch((err) => {
  console.error("Error en la automatización:", err);
  process.exit(1);
});
