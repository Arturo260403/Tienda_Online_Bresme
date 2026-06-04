import MiniaturaProducto from "./MiniaturaProducto";
import { formatearPrecio, obtenerEstiloDisponibilidad } from "../librerias/formato";
import { usarInventario } from "../contexto/ContextoInventario";

export default function TarjetaProducto({ producto, alAbrir }) {
  const { disponibilidadDe } = usarInventario();
  const disponibilidad = disponibilidadDe(producto.id);

  // role="button" + teclado (un <button> no debe envolver bloques como <h3>).
  const manejarTecla = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      alAbrir(producto);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => alAbrir(producto)}
      onKeyDown={manejarTecla}
      aria-label={`Ver ficha de ${producto.descripcion}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:border-rojo-bresme/40 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
    >
      <div className="relative aspect-square overflow-hidden border-b border-neutral-100 bg-white">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.descripcion}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
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

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rojo-bresme">
            {producto.marca}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${obtenerEstiloDisponibilidad(
              disponibilidad
            )}`}
          >
            {disponibilidad}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-800 transition group-hover:text-negro-bresme">
          {producto.descripcion}
        </h3>

        <p className="text-xs text-neutral-500">
          {producto.categoria}
          {producto.subcategoria !== "General" && ` · ${producto.subcategoria}`}
        </p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="font-mono text-[11px] text-neutral-500">
            Ref. {producto.id}
          </span>
          <span className="text-lg font-bold text-negro-bresme">
            {formatearPrecio(producto.pvp)}
          </span>
        </div>
      </div>
    </article>
  );
}