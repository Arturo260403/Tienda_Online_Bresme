import { useState } from "react";
import { usarCarrito } from "../contexto/ContextoCarrito";
import { usarInventario } from "../contexto/ContextoInventario";
import { formatearPrecio } from "../librerias/formato";

export default function FormularioPedido({ alVolver }) {
  const { articulos, subtotal, importeIva, total, IVA, vaciar } = usarCarrito();
  const { descontar } = usarInventario();

  const [datos, setDatos] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    notas: "",
  });

  // Guardamos número, total y correo ANTES de vaciar, para la pantalla de éxito.
  const [pedido, setPedido] = useState(null);

  const actualizarCampo = (campo) => (e) =>
    setDatos((prev) => ({ ...prev, [campo]: e.target.value }));

  const realizarPedido = (e) => {
    e.preventDefault();

    const numero = Math.floor(1000 + Math.random() * 9000);

    setPedido({
      numero,
      total,
      correo: datos.correo,
      nombre: datos.nombre,
    });

    descontar(articulos); // baja el stock de cada artículo del pedido
    vaciar(); // checkout simulado: se vacía el carrito
  };

  // --- Pantalla de éxito ---
  if (pedido) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-negro-bresme">
          ¡Pedido recibido!
        </h1>
        <p className="mt-2 text-lg font-semibold text-rojo-bresme">
          Pedido #{pedido.numero}
        </p>

        <p className="mt-4 text-sm text-neutral-600">
          Gracias{pedido.nombre ? `, ${pedido.nombre}` : ""}. Hemos registrado tu
          pedido por un importe de{" "}
          <span className="font-semibold text-negro-bresme">
            {formatearPrecio(pedido.total)}
          </span>
          {pedido.correo && (
            <>
              . Te enviaremos la confirmación a{" "}
              <span className="font-medium">{pedido.correo}</span>
            </>
          )}
          .
        </p>

        <button
          onClick={alVolver}
          className="mt-8 rounded-lg bg-rojo-bresme px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
        >
          Volver al catálogo
        </button>
      </main>
    );
  }

  // --- Carrito vacío ---
  if (articulos.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-base font-medium text-neutral-700">
          No hay productos en el carrito
        </p>
        <button
          onClick={alVolver}
          className="mt-6 rounded-lg bg-rojo-bresme px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro"
        >
          Volver al catálogo
        </button>
      </main>
    );
  }

  // --- Formulario de envío ---
  const claseCampo =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-rojo-bresme focus:ring-2 focus:ring-rojo-bresme/30";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button
        onClick={alVolver}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-500 transition hover:text-rojo-bresme"
      >
        <span aria-hidden="true">←</span> Volver al catálogo
      </button>

      <h1 className="text-2xl font-bold text-negro-bresme">Datos de envío</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Completa tus datos para finalizar el pedido.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={realizarPedido} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-neutral-700">
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              required
              value={datos.nombre}
              onChange={actualizarCampo("nombre")}
              className={claseCampo}
            />
          </div>

          <div>
            <label htmlFor="direccion" className="mb-1 block text-sm font-medium text-neutral-700">
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              required
              value={datos.direccion}
              onChange={actualizarCampo("direccion")}
              className={claseCampo}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-neutral-700">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                required
                value={datos.telefono}
                onChange={actualizarCampo("telefono")}
                className={claseCampo}
              />
            </div>

            <div>
              <label htmlFor="correo" className="mb-1 block text-sm font-medium text-neutral-700">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                required
                value={datos.correo}
                onChange={actualizarCampo("correo")}
                className={claseCampo}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notas" className="mb-1 block text-sm font-medium text-neutral-700">
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              rows={3}
              value={datos.notas}
              onChange={actualizarCampo("notas")}
              className={`${claseCampo} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-rojo-bresme px-4 py-3 text-sm font-semibold text-white transition hover:bg-rojo-bresme-oscuro focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
          >
            Realizar pedido
          </button>
        </form>

        <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-bold text-negro-bresme">Resumen</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {articulos.map((articulo) => (
              <li key={articulo.id} className="flex justify-between gap-2">
                <span className="text-neutral-600">
                  {articulo.cantidad} × {articulo.descripcion}
                </span>
                <span className="shrink-0 font-medium text-neutral-800">
                  {formatearPrecio(articulo.pvp * articulo.cantidad)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1 border-t border-neutral-100 pt-3 text-sm">
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
        </aside>
      </div>
    </main>
  );
}