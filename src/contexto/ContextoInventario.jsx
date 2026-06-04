import { createContext, useContext, useReducer, useEffect } from "react";
import productos from "../data/productos.json";

const ContextoInventario = createContext(null);

const CLAVE_ALMACENAMIENTO = "bresme-inventario";

// Mismos umbrales que se usaron al procesar el JSON.
function etiquetaDisponibilidad(unidades) {
  if (unidades <= 0) return "Sin stock";
  if (unidades <= 10) return "Pocas unidades";
  return "Disponible";
}

// Stock inicial a partir del JSON: { [id]: unidades }.
function stockInicialDesdeJson() {
  const inicial = {};
  for (const p of productos) inicial[p.id] = p.stock;
  return inicial;
}

// Lee el inventario guardado; si no hay, parte de los valores del JSON.
function cargarEstadoInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // localStorage no disponible: usamos el inicial.
  }
  return stockInicialDesdeJson();
}

function reductorInventario(stock, accion) {
  switch (accion.tipo) {
    case "DESCONTAR": {
      // Resta del stock las unidades de cada artículo del pedido.
      const nuevo = { ...stock };
      for (const articulo of accion.articulos) {
        const actual = nuevo[articulo.id] ?? 0;
        nuevo[articulo.id] = Math.max(0, actual - articulo.cantidad);
      }
      return nuevo;
    }
    case "REPONER":
      // Restablece el stock a los valores originales del catálogo.
      return stockInicialDesdeJson();
    default:
      return stock;
  }
}

export function ProveedorInventario({ children }) {
  const [stock, despachar] = useReducer(
    reductorInventario,
    undefined,
    cargarEstadoInicial
  );

  // Persistencia del inventario en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(stock));
    } catch {
      // Almacenamiento no disponible: se ignora.
    }
  }, [stock]);

  const stockDe = (id) => stock[id] ?? 0;
  const disponibilidadDe = (id) => etiquetaDisponibilidad(stockDe(id));
  const descontar = (articulos) => despachar({ tipo: "DESCONTAR", articulos });
  const reponer = () => despachar({ tipo: "REPONER" });

  const valor = { stock, stockDe, disponibilidadDe, descontar, reponer };

  return (
    <ContextoInventario.Provider value={valor}>
      {children}
    </ContextoInventario.Provider>
  );
}

export function usarInventario() {
  const contexto = useContext(ContextoInventario);
  if (!contexto) {
    throw new Error("usarInventario debe usarse dentro de <ProveedorInventario>");
  }
  return contexto;
}