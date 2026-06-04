import { usarCarrito } from "../contexto/ContextoCarrito";

export default function Cabecera({ alAbrirCarrito }) {
  const { numArticulos } = usarCarrito();

  return (
    <>
      {/* Franja superior de envío */}
      <div className="bg-negro-bresme py-2 text-center text-xs font-medium text-red-500">
        ¡Disfruta de tu envío en 24/48 horas!
      </div>

      <header className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logotipo */}
          <a href="/" className="flex items-center" aria-label="Bresme — inicio">
            <img src="/logo-bresme.svg" alt="Bresme" className="h-24 w-auto" />
          </a>

          {/* Botón del carrito */}
          <button
            onClick={alAbrirCarrito}
            className="relative inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-rojo-bresme hover:text-rojo-bresme focus:outline-none focus:ring-2 focus:ring-rojo-bresme/40"
            aria-label={`Abrir carrito, ${numArticulos} artículos`}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span className="hidden sm:inline">Carrito</span>

            {numArticulos > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rojo-bresme px-1 text-xs font-bold text-white">
                {numArticulos}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}