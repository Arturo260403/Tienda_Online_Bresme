import { useState, useMemo, useEffect } from "react";
import productos from "./data/productos.json";
import Cabecera from "./componentes/Cabecera";
import BarraFiltros from "./componentes/BarraFiltros";
import TarjetaProducto from "./componentes/TarjetaProducto";
import FichaProducto from "./componentes/FichaProducto";
import DesplegableCarrito from "./componentes/DesplegableCarrito";
import FormularioPedido from "./componentes/FormularioPedido";
import PanelAlmacen from "./componentes/PanelAlmacen";

const PRODUCTOS_POR_PAGINA = 12;

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [marca, setMarca] = useState("");

  const [visibles, setVisibles] = useState(PRODUCTOS_POR_PAGINA);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  // Vista actual: "catalogo", "checkout" o "almacen".
  const [vista, setVista] = useState("catalogo");

  // Al cambiar de categoría, la subcategoría deja de ser válida.
  useEffect(() => setSubcategoria(""), [categoria]);

  // Lista filtrada.
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

  // Vista de checkout
  if (vista === "checkout") {
    return (
      <div className="min-h-screen bg-neutral-50 text-negro-bresme">
        <Cabecera alAbrirCarrito={() => setCarritoAbierto(true)} />
        <FormularioPedido alVolver={() => setVista("catalogo")} />
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

  // Vista de almacén
  if (vista === "almacen") {
    return (
      <div className="min-h-screen bg-neutral-50 text-negro-bresme">
        <Cabecera alAbrirCarrito={() => setCarritoAbierto(true)} />
        <PanelAlmacen alVolver={() => setVista("catalogo")} />
      </div>
    );
  }

  // Vista de catálogo
  return (
    <div className="min-h-screen bg-neutral-50 text-negro-bresme">
      {/* Cabecera + filtros (suben con el scroll, no fijos) */}
      <div className="border-b border-neutral-200">
        <Cabecera alAbrirCarrito={() => setCarritoAbierto(true)} />
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
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-negro-bresme">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Catálogo profesional
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            Ferretería y maquinaria para profesionales
          </h2>
          <p className="mt-4 max-w-xl text-sm text-neutral-300 sm:text-base">
            Herramienta, maquinaria, jardín, fontanería y mucho más.
          </p>
        </div>
        <div
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rojo-bresme/20 blur-2xl"
          aria-hidden="true"
        />
      </section>

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
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {mostrados.map((producto) => (
                <TarjetaProducto
                  key={producto.id}
                  producto={producto}
                  alAbrir={setProductoSeleccionado}
                />
              ))}
            </div>

            {quedanMas && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  onClick={() => setVisibles((v) => v + PRODUCTOS_POR_PAGINA)}
                  className="rounded-lg bg-negro-bresme px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Cargar más
                </button>
                <span className="text-xs text-neutral-500">
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

      {/* Pie de página */}
      <footer className="relative overflow-hidden bg-negro-bresme text-neutral-300">
        <div
          className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-rojo-bresme/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <span className="text-2xl font-black tracking-tight text-white">
              BRESME
            </span>
            <p className="mt-4 text-sm leading-relaxed">
              Bresme Madrid S.L. Fundada en el año 2000. Empresa dedicada a la
              venta de artículos de ferretería. Especializada en herramienta
              manual, productos para el cuidado y riego y utensilios para el
              hogar.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Información
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Aviso legal</li>
              <li>Política de privacidad</li>
              <li>Términos y condiciones</li>
              <li>Política de cookies</li>
              <li>Política de devoluciones</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Pol. Ind. "Monte Boyal"</li>
              <li>Avda. de la constitución 248</li>
              <li>C.P. 45.950 Casarrubios del Monte (Toledo)</li>
              <li className="text-red-500">918 170 990</li>
              <li className="text-red-500">info@bresme.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Marcas destacadas
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>HAUKKA</li>
            </ul>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-neutral-400 sm:flex-row sm:px-6">
            <span>© {new Date().getFullYear()} Bresme · Ferretería y maquinaria</span>
            <button
              onClick={() => setVista("almacen")}
              className="text-neutral-400 underline-offset-2 transition hover:text-white hover:underline"
            >
              Acceso almacén
            </button>
          </div>
        </div>
      </footer>

      {/* Ficha de producto */}
      {productoSeleccionado && (
        <FichaProducto
          producto={productoSeleccionado}
          alCerrar={() => setProductoSeleccionado(null)}
        />
      )}

      {/* Carrito lateral */}
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