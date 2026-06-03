// Placeholder visual que se muestra mientras un producto no tiene imagen real.
// El script de automatización de imágenes rellenará producto.imagen en su fase.
export default function MiniaturaProducto({ descripcion, className = "" }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 ${className}`}
    >
      <svg
        className="h-10 w-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.1-2.1 2.4-2.4Z" />
      </svg>
      <span className="px-3 text-center text-xs font-medium leading-tight">
        Sin imagen
      </span>
      {/* Texto solo para lectores de pantalla: identifica el producto. */}
      <span className="sr-only">{descripcion}</span>
    </div>
  );
}