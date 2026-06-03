import { useState, useMemo, useEffect } from "react";
import productos from "./data/productos.json";
import Cabecera from "./componentes/Cabecera";
import BarraFiltros from "./componentes/BarraFiltros";
import TarjetaProducto from "./componentes/TarjetaProducto";
import FichaProducto from "./componentes/FichaProducto";
import DesplegableCarrito from "./componentes/DesplegableCarrito";
import FormularioPedido from "./componentes/FormularioPedido";

const PRODUCTOS_POR_PAGINA = 12;

export default function App() {
  // Estado de los filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [marca, setMarca] = useState("");

  // Paginación "Cargar más"
  const [visibles, setVisibles] = useState(PRODUCTOS_POR_PAGINA);

  // Estado de la interfaz: ficha abierta, carrito abierto y vista activa.
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  // Vista actual: "catalogo" o "checkout".
  const [vista, setVista] = useState("catalogo");

  // Al cambiar de categoría, la subcategoría seleccionada deja de ser válida.
  useEffect(() => setSubcategoria(""), [categoria]);

  // Lista filtrada. Se recalcula solo cuando cambia algún filtro.
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      if (categoria && p.categoria !== categoria) return false;
      if (subcategoria && p.subcategoria !== subcategoria) return false;
      if (marca && p.marca !== marca) return false;
      if (texto) {
        const coincide =
          p.descripcion.toLowerCase().includes(texto) ||
          p.ean13.includes(texto);
        if (!coincide) return false;
      }
      return true;
    });
  }, [busqueda, categoria, subcategoria, marca]);

  // Cada vez que cambian los resultados, volvemos a la primera página.
  useEffect(() => setVisibles(PRODUCTOS_POR_PAGINA), [filtrados]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("");
    setSubcategoria("");
    setMarca("");
  };

  const hayFiltrosActivos = busqueda || categoria || subcategoria || marca;
  const mostrados = filtrados.slice(0, visibles);
  const quedanMas = visibles < filtrados.length;

  return (
    <div className="min-h-screen bg-neutral-50 text-negro-bresme">
      <Cabecera alAbrirCarrito={() => setCarritoAbierto(true)} />

      {vista === "checkout" ? (
        // --- Vista de checkout ---
        <FormularioPedido alVolver={() => setVista("catalogo")} />
      ) : (
        // --- Vista de catálogo ---
        <>
          <BarraFiltros
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            categoria={categoria}
            setCategoria={setCategoria}
            subcategoria={subcategoria}
            setSubcategoria={setSubcategoria}
            marca={marca}
            setMarca={setMarca}
          />

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                {filtrados.length}{" "}
                {filtrados.length === 1 ? "producto" : "productos"}
              </p>
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="text-sm font-medium text-rojo-bresme underline-offset-2 hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {mostrados.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mostrados.map((producto) => (
                    <TarjetaProducto
                      key={producto.id}
                      producto={producto}
                      alAbrir={setProductoSeleccionado}
                    />
                  ))}
                </div>

                {/* Paginación "Cargar más".
                    Para scroll infinito: sustituir el botón por un elemento
                    "centinela" observado con IntersectionObserver que llame a
                    setVisibles((v) => v + PRODUCTOS_POR_PAGINA) al entrar en vista. */}
                {quedanMas && (
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <button
                      onClick={() => setVisibles((v) => v + PRODUCTOS_POR_PAGINA)}
                      className="rounded-lg bg-negro-bresme px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Cargar más
                    </button>
                    <span className="text-xs text-neutral-400">
                      Mostrando {mostrados.length} de {filtrados.length}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-20 text-center">
                <p className="text-base font-medium text-neutral-700">
                  No se encontraron productos
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Prueba a cambiar la búsqueda o quitar algún filtro.
                </p>
              </div>
            )}
          </main>
        </>
      )}

      {/* Ficha de producto */}
      {productoSeleccionado && (
        <FichaProducto
          producto={productoSeleccionado}
          alCerrar={() => setProductoSeleccionado(null)}
        />
      )}

      {/* Carrito lateral. "Tramitar pedido" lleva a la vista de checkout. */}
      <DesplegableCarrito
        abierto={carritoAbierto}
        alCerrar={() => setCarritoAbierto(false)}
        alTramitar={() => {
          setCarritoAbierto(false);
          setVista("checkout");
        }}
      />
    </div>
  );
}