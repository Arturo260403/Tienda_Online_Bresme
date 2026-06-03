// Funciones auxiliares de formato, compartidas por varios componentes.

// Formateador de precios en euros, configuración regional España (1.234,56 €).
const formateadorEuros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

// Devuelve un número formateado como precio en euros.
export function formatearPrecio(valor) {
  return formateadorEuros.format(valor);
}

// Clases de color asociadas a cada etiqueta de disponibilidad (stock).
export const ESTILOS_DISPONIBILIDAD = {
  Disponible: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Pocas unidades": "bg-amber-50 text-amber-700 ring-amber-600/30",
  "Sin stock": "bg-neutral-100 text-neutral-500 ring-neutral-400/30",
};

// Devuelve las clases de estilo para una etiqueta de stock concreta.
// Si la etiqueta no existe, usa el estilo de "Sin stock" como seguro.
export function obtenerEstiloDisponibilidad(etiqueta) {
  return ESTILOS_DISPONIBILIDAD[etiqueta] ?? ESTILOS_DISPONIBILIDAD["Sin stock"];
}