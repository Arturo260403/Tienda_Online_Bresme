import { useEffect } from "react";
import { usarCarrito } from "../contexto/ContextoCarrito";
import { formatearPrecio } from "../librerias/formato";
import MiniaturaProducto from "./MiniaturaProducto";

export default function DesplegableCarrito({ abierto, alCerrar, alTramitar }) {
  const {
    articulos,
    eliminar,
    cambiarCantidad,
    vaciar,
    subtotal,
    importeIva,
    total,
    IVA,
  } = usarCarrito();

  // Cerrar con Escape mientras el panel está abierto.
  useEffect(() => {
    if (!abierto) return;
    const alPulsarTecla = (e) => e.key === "Escape" && alCerrar();
    document.addEventListener("keydown", alPulsarTecla);
    return () => document.removeEventListener("keydown", alPulsarTecla);
  }, [abierto, alCerrar]);

  return (
    <>
      {/* Fondo oscuro */}
      <div
        onClick={alCerrar}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Panel lateral derecho */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de la compra"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-base font-bold text-negro-bresme">Tu carrito</h2>
          <button
            onClick={alCerrar}
            aria-label="Cerrar carrito"
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

        {/* Lista de artículos */}
        {articulos.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-neutral-700">
              Tu carrito está vacío
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Añade productos desde el catálogo.
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto">
            {articulos.map((articulo) => (
              <li key={articulo.id} className="flex gap-3 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-100">
                  {articulo.imagen ? (
                    <img
                      src={articulo.imagen}
                      alt={articulo.descripcion}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <MiniaturaProducto descripcion={articulo.descripcion} />
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="line-clamp-2 text-sm font-medium text-neutral-800">
                    {articulo.descripcion}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {formatearPrecio(articulo.pvp)} / ud.
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Selector de cantidad */}
                    <div className="flex items-center rounded-md border border-neutral-300">
                      <button
                        onClick={() =>
                          cambiarCantidad(articulo.id, articulo.cantidad - 1)
                        }
                        disabled={articulo.cantidad <= 1}
                        className="px-2 py-1 text-neutral-600 transition hover:text-rojo-bresme disabled:opacity-40"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {articulo.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          cambiarCantidad(articulo.id, articulo.cantidad + 1)
                        }
                        className="px-2 py-1 text-neutral-600 transition hover:text-rojo-bresme"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => eliminar(articulo.id)}
                      className="text-xs font-medium text-neutral-400 transition hover:text-rojo-bresme"
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                <span className="text-sm font-semibold text-negro-bresme">
                  {formatearPrecio(articulo.pvp * articulo.cantidad)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Resumen + acciones */}
        {articulos.length > 0 && (
          <div className="border-t border-neutral-200 p-5">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between text-neutral-600">
                <dt>Subtotal (base)</dt>
                <dd>{formatearPrecio(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-neutral-600">
                <dt>IVA ({Math.round(IVA * 100)}%)</dt>
                <dd>{formatearPrecio(importeIva)}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2 text-base font-bold text-negro-bresme">
                <dt>Total</dt>
                <dd>{formatearPrecio(total)}</dd>
              </div>
            </dl>

            <button
              onClick={alTramitar}
              className="mt-4 w-full rounded-lg bg-rojo-bresme px-4 py-3 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
            >
              Tramitar pedido
            </button>
            <button
              onClick={vaciar}
              className="mt-2 w-full text-center text-xs font-medium text-neutral-400 transition hover:text-rojo-bresme"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}