import { useState, useEffect, useRef } from "react";
import MiniaturaProducto from "./MiniaturaProducto";
import { formatearPrecio, obtenerEstiloDisponibilidad } from "../librerias/formato";
import { usarCarrito } from "../contexto/ContextoCarrito";

export default function FichaProducto({ producto, alCerrar }) {
  const { agregar } = usarCarrito();
  const [cantidad, setCantidad] = useState(1);
  const refBotonCerrar = useRef(null);

  // Cerrar con Escape + bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    const alPulsarTecla = (e) => e.key === "Escape" && alCerrar();
    document.addEventListener("keydown", alPulsarTecla);
    document.body.style.overflow = "hidden";
    refBotonCerrar.current?.focus();
    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = "";
    };
  }, [alCerrar]);

  if (!producto) return null;

  const agregarAlCarrito = () => {
    agregar(
      {
        id: producto.id,
        descripcion: producto.descripcion,
        marca: producto.marca,
        pvp: producto.pvp,
        imagen: producto.imagen,
      },
      cantidad
    );
    alCerrar();
  };

  // Especificaciones técnicas que se muestran en la ficha.
  const especificaciones = [
    ["Referencia", producto.id],
    ["EAN13", producto.ean13],
    ["Marca", producto.marca],
    ["Calidad", producto.calidad],
    ["Categoría", producto.categoria],
    ["Subcategoría", producto.subcategoria],
    ["Unidad de medida", producto.unidadMedida],
  ];

  return (
    // Fondo oscuro: cierra al hacer clic fuera del panel.
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={alCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-ficha"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        {/* Cabecera de la ficha */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-rojo-bresme">
            {producto.marca}
          </span>
          <button
            ref={refBotonCerrar}
            onClick={alCerrar}
            aria-label="Cerrar ficha"
            className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="grid gap-5 overflow-y-auto p-5 sm:grid-cols-2">
          {/* Imagen */}
          <div className="relative aspect-square overflow-hidden rounded-xl border border-neutral-100">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.descripcion}
                className="h-full w-full object-contain"
              />
            ) : (
              <MiniaturaProducto descripcion={producto.descripcion} />
            )}
            {producto.enLiquidacion && (
              <span className="absolute left-2 top-2 rounded-full bg-rojo-bresme px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                En liquidación
              </span>
            )}
          </div>

          {/* Datos y especificaciones */}
          <div className="flex flex-col">
            <h2
              id="titulo-ficha"
              className="text-lg font-semibold leading-snug text-negro-bresme"
            >
              {producto.descripcion}
            </h2>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-negro-bresme">
                {formatearPrecio(producto.pvp)}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${obtenerEstiloDisponibilidad(
                  producto.disponibilidad
                )}`}
              >
                {producto.disponibilidad}
              </span>
            </div>

            {/* Ficha técnica */}
            <dl className="mt-4 divide-y divide-neutral-100 border-y border-neutral-100 text-sm">
              {especificaciones.map(([etiqueta, valor]) => (
                <div
                  key={etiqueta}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <dt className="text-neutral-500">{etiqueta}</dt>
                  <dd className="text-right font-medium text-neutral-800">
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Selector de cantidad + añadir al carrito */}
            <div className="mt-auto flex items-center gap-3 pt-5">
              <div className="flex items-center rounded-lg border border-neutral-300">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1}
                  className="px-3 py-2 text-neutral-600 transition hover:text-rojo-bresme disabled:opacity-40"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="px-3 py-2 text-neutral-600 transition hover:text-rojo-bresme"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                onClick={agregarAlCarrito}
                className="flex-1 rounded-lg bg-rojo-bresme px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}