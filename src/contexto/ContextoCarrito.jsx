import { createContext, useContext, useReducer, useEffect } from "react";

const ContextoCarrito = createContext(null);

const CLAVE_ALMACENAMIENTO = "bresme-carrito";

// Tipo de IVA aplicado. Decisión de negocio (documentada en el README):
// asumimos que el PVP es la BASE imponible y el 21 % se suma encima.
// Si el PVP ya incluyera IVA, habría que extraerlo (base = pvp / 1.21).
const IVA = 0.21;

// Lee el carrito guardado al iniciar. Si no hay nada o está corrupto, vacío.
function cargarEstadoInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

// Reductor con las acciones del carrito.
function reductorCarrito(articulos, accion) {
  switch (accion.tipo) {
    case "AGREGAR": {
      const existente = articulos.find((a) => a.id === accion.producto.id);
      if (existente) {
        return articulos.map((a) =>
          a.id === accion.producto.id
            ? { ...a, cantidad: a.cantidad + accion.cantidad }
            : a
        );
      }
      return [...articulos, { ...accion.producto, cantidad: accion.cantidad }];
    }
    case "ELIMINAR":
      return articulos.filter((a) => a.id !== accion.id);
    case "CAMBIAR_CANTIDAD":
      // Cantidad mínima 1; para quitar del todo se usa ELIMINAR.
      return articulos.map((a) =>
        a.id === accion.id
          ? { ...a, cantidad: Math.max(1, accion.cantidad) }
          : a
      );
    case "VACIAR":
      return [];
    default:
      return articulos;
  }
}

export function ProveedorCarrito({ children }) {
  const [articulos, despachar] = useReducer(
    reductorCarrito,
    undefined,
    cargarEstadoInicial
  );

  // Persistencia: cada cambio del carrito se guarda en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(articulos));
    } catch {
      // Almacenamiento no disponible (modo privado, etc.): se ignora.
    }
  }, [articulos]);

  // Acciones expuestas a los componentes.
  const agregar = (producto, cantidad = 1) =>
    despachar({ tipo: "AGREGAR", producto, cantidad });
  const eliminar = (id) => despachar({ tipo: "ELIMINAR", id });
  const cambiarCantidad = (id, cantidad) =>
    despachar({ tipo: "CAMBIAR_CANTIDAD", id, cantidad });
  const vaciar = () => despachar({ tipo: "VACIAR" });

  // Totales derivados (no se guardan: se recalculan en cada render).
  const subtotal = articulos.reduce((acc, a) => acc + a.pvp * a.cantidad, 0);
  const importeIva = subtotal * IVA;
  const total = subtotal + importeIva;
  const numArticulos = articulos.reduce((acc, a) => acc + a.cantidad, 0);

  const valor = {
    articulos,
    agregar,
    eliminar,
    cambiarCantidad,
    vaciar,
    subtotal,
    importeIva,
    total,
    numArticulos,
    IVA,
  };

  return (
    <ContextoCarrito.Provider value={valor}>
      {children}
    </ContextoCarrito.Provider>
  );
}

// Hook de acceso al carrito. Lanza un error claro si se usa fuera del proveedor.
export function usarCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error("usarCarrito debe usarse dentro de <ProveedorCarrito>");
  }
  return contexto;
}