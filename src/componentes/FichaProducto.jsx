import { useState, useEffect, useRef } from "react";
import MiniaturaProducto from "./MiniaturaProducto";
import { formatearPrecio, obtenerEstiloDisponibilidad } from "../librerias/formato";
import { usarCarrito } from "../contexto/ContextoCarrito";
import { usarInventario } from "../contexto/ContextoInventario";

export default function FichaProducto({ producto, alCerrar }) {
  const { agregar } = usarCarrito();
  const { stockDe, disponibilidadDe } = usarInventario();
  const [cantidad, setCantidad] = useState(1);
  const refBotonCerrar = useRef(null);

  const stock = stockDe(producto.id);
  const disponibilidad = disponibilidadDe(producto.id);
  const agotado = stock <= 0;
  const superaStock = cantidad > stock;

  // Cerrar con Escape + bloquear scroll del fondo.
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

  // Permite escribir cualquier número >= 1; el aviso se muestra si supera el stock.
  const alEscribirCantidad = (e) => {
    const valor = parseInt(e.target.value, 10);
    if (Number.isNaN(valor)) return setCantidad(1);
    setCantidad(Math.max(1, valor));
  };

  const agregarAlCarrito = () => {
    if (agotado || superaStock) return;
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

        <div className="grid gap-5 overflow-y-auto p-5 sm:grid-cols-2">
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
                  disponibilidad
                )}`}
              >
                {disponibilidad}
              </span>
            </div>

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

            {/* Selector de cantidad (editable) + añadir */}
            <div className="mt-auto pt-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-neutral-300">
                  <button
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    disabled={agotado || cantidad <= 1}
                    className="px-3 py-2 text-neutral-600 transition hover:text-rojo-bresme disabled:opacity-40"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <label htmlFor="cantidad" className="sr-only">
                    Cantidad
                  </label>
                  <input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    disabled={agotado}
                    onChange={alEscribirCantidad}
                    className="w-14 border-x border-neutral-300 py-2 text-center text-sm font-medium tabular-nums outline-none focus:ring-2 focus:ring-inset focus:ring-rojo-bresme/30 disabled:opacity-40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setCantidad((c) => c + 1)}
                    disabled={agotado || cantidad >= stock}
                    className="px-3 py-2 text-neutral-600 transition hover:text-rojo-bresme disabled:opacity-40"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={agregarAlCarrito}
                  disabled={agotado || superaStock}
                  className="flex-1 rounded-lg bg-rojo-bresme px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  {agotado ? "Sin stock" : "Añadir al carrito"}
                </button>
              </div>

              {/* Aviso si la cantidad pedida supera el stock disponible */}
              {superaStock && !agotado && (
                <p className="mt-2 text-xs font-medium text-rojo-bresme">
                  Solo quedan {stock} unidades.
                </p>
              )}

              {!agotado && !superaStock && (
                <p className="mt-2 text-xs text-neutral-400">
                  El stock no se reserva hasta confirmar el pedido.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
