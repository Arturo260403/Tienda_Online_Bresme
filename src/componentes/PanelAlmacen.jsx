import { useMemo, useState } from "react";
import productos from "../data/productos.json";
import { usarInventario } from "../contexto/ContextoInventario";
import { obtenerEstiloDisponibilidad } from "../librerias/formato";

export default function PanelAlmacen({ alVolver }) {
  const { stockDe, disponibilidadDe, reponer } = usarInventario();
  const [filtro, setFiltro] = useState(""); // "", "bajo", "agotado"

  // Lista de productos con su stock y estado actuales.
  const filas = useMemo(
    () =>
      productos.map((p) => ({
        id: p.id,
        descripcion: p.descripcion,
        categoria: p.categoria,
        stock: stockDe(p.id),
        estado: disponibilidadDe(p.id),
      })),
    [stockDe, disponibilidadDe]
  );

  const visibles = filas.filter((f) => {
    if (filtro === "bajo") return f.estado === "Pocas unidades";
    if (filtro === "agotado") return f.estado === "Sin stock";
    return true;
  });

  // Resumen.
  const totalUnidades = filas.reduce((acc, f) => acc + f.stock, 0);
  const numBajos = filas.filter((f) => f.estado === "Pocas unidades").length;
  const numAgotados = filas.filter((f) => f.estado === "Sin stock").length;

  const claseFiltro = (valor) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      filtro === valor
        ? "bg-negro-bresme text-white"
        : "border border-neutral-300 text-neutral-600 hover:border-rojo-bresme hover:text-rojo-bresme"
    }`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button
        onClick={alVolver}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-500 transition hover:text-rojo-bresme"
      >
        <span aria-hidden="true">←</span> Volver al catálogo
      </button>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-negro-bresme">
            Panel de almacén
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Stock actual de cada producto. Uso interno.
          </p>
        </div>
        <button
          onClick={reponer}
          className="rounded-lg bg-rojo-bresme px-4 py-2 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
        >
          Reponer stock
        </button>
      </div>

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Referencias</p>
          <p className="text-xl font-bold text-negro-bresme">{filas.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Unidades totales</p>
          <p className="text-xl font-bold text-negro-bresme">{totalUnidades}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Pocas unidades</p>
          <p className="text-xl font-bold text-amber-600">{numBajos}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Sin stock</p>
          <p className="text-xl font-bold text-rojo-bresme">{numAgotados}</p>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setFiltro("")} className={claseFiltro("")}>
          Todos
        </button>
        <button onClick={() => setFiltro("bajo")} className={claseFiltro("bajo")}>
          Pocas unidades
        </button>
        <button
          onClick={() => setFiltro("agotado")}
          className={claseFiltro("agotado")}
        >
          Sin stock
        </button>
      </div>

      {/* Tabla */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Referencia</th>
              <th className="px-4 py-3 font-semibold">Descripción</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 text-right font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {visibles.map((f) => (
              <tr key={f.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                  {f.id}
                </td>
                <td className="px-4 py-3 text-neutral-800">{f.descripcion}</td>
                <td className="px-4 py-3 text-neutral-500">{f.categoria}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-negro-bresme">
                  {f.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${obtenerEstiloDisponibilidad(
                      f.estado
                    )}`}
                  >
                    {f.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibles.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-neutral-500">
            No hay productos en este estado.
          </p>
        )}
      </div>
    </main>
  );
}