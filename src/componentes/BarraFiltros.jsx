import { useMemo } from "react";
import productos from "../data/productos.json";

// Componente controlado: recibe los valores de los filtros y sus setters
// desde App. Las opciones de los desplegables se derivan de los datos.
export default function BarraFiltros({
  busqueda,
  setBusqueda,
  categoria,
  setCategoria,
  subcategoria,
  setSubcategoria,
  marca,
  setMarca,
}) {
  // Opciones estáticas (se calculan una sola vez).
  const categorias = useMemo(
    () =>
      [...new Set(productos.map((p) => p.categoria))].sort((a, b) =>
        a.localeCompare(b, "es")
      ),
    []
  );

  const marcas = useMemo(
    () =>
      [...new Set(productos.map((p) => p.marca))].sort((a, b) =>
        a.localeCompare(b, "es")
      ),
    []
  );

  // Subcategorías encadenadas: solo las de la categoría seleccionada.
  // Así el valor de respaldo "General" nunca es ambiguo entre categorías.
  const subcategorias = useMemo(() => {
    if (!categoria) return [];
    const propias = productos
      .filter((p) => p.categoria === categoria)
      .map((p) => p.subcategoria);
    return [...new Set(propias)].sort((a, b) => {
      if (a === "General") return 1; // respaldo siempre al final
      if (b === "General") return -1;
      return a.localeCompare(b, "es");
    });
  }, [categoria]);

  const claseCampo =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-rojo-bresme focus:ring-2 focus:ring-rojo-bresme/30";

  return (
    <div className="sticky top-[73px] z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Buscador */}
          <div>
            <label htmlFor="busqueda" className="sr-only">
              Buscar por descripción o EAN13
            </label>
            <input
              id="busqueda"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o EAN13…"
              className={`${claseCampo} placeholder:text-neutral-400`}
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="sr-only">
              Categoría
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={claseCampo}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategoría (depende de la categoría) */}
          <div>
            <label htmlFor="subcategoria" className="sr-only">
              Subcategoría
            </label>
            <select
              id="subcategoria"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              disabled={!categoria}
              className={`${claseCampo} disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400`}
            >
              <option value="">
                {categoria
                  ? "Todas las subcategorías"
                  : "Elige una categoría primero"}
              </option>
              {subcategorias.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Marca */}
          <div>
            <label htmlFor="marca" className="sr-only">
              Marca
            </label>
            <select
              id="marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className={claseCampo}
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
