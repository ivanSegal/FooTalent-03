"use client";

import React from "react";
import Navbar from "@/components/UI/Navbar";

const Card: React.FC<{ title: string; children: React.ReactNode; description?: string }> = ({
  title,
  description,
  children,
}) => (
  <div className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-[#0E1046]">{title}</h3>
      {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
    </div>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

// Modal accesible
const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, onClose, children }) => {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold text-[#0E1046]">{title}</h3>
          <button
            className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default function NavbarDemoPage() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(3);

  const codeSample = `import Navbar from "@/components/UI/Navbar";

export default function Example() {
  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar por defecto */}
      <Navbar 
        userName="Gary Jimenez"
        onNotificationClick={handleNotifications}
        onSettingsClick={handleSettings}
        notificationCount={5}
      />

      {/* Navbar oscuro */}
      <Navbar 
        variant="dark"
        userName="John Doe"
        avatarSrc="/custom-avatar.jpg"
        notificationCount={12}
        onNotificationClick={handleNotifications}
        onSettingsClick={handleSettings}
      />
    </div>
  );
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSample);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleNotificationClick = () => {
    console.log("Notificación clickeada");
    setNotificationCount(0);
  };

  const handleSettingsClick = () => {
    console.log("Configuración clickeada");
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-gray-50 px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Navbar Demo</h1>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setOpen(true)}
          >
            Guía de uso
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {/* Variante por defecto */}
        <Card
          title="Variante Default"
          description="Navbar con tema claro, fondo blanco y sombra sutil"
        >
          <Navbar
            userName="Gary Jimenez"
            onNotificationClick={handleNotificationClick}
            onSettingsClick={handleSettingsClick}
            notificationCount={notificationCount}
          />
        </Card>

        {/* Variante oscura */}
        <Card title="Variante Dark" description="Navbar con tema oscuro para interfaces dark mode">
          <Navbar
            variant="dark"
            userName="Gary Jimenez"
            onNotificationClick={handleNotificationClick}
            onSettingsClick={handleSettingsClick}
            notificationCount={7}
          />
        </Card>

        {/* Con contador alto de notificaciones */}
        <Card
          title="Contador de Notificaciones"
          description="Muestra badges con diferentes cantidades de notificaciones"
        >
          <div className="space-y-4">
            <Navbar
              userName="Usuario con pocas notificaciones"
              notificationCount={2}
              onNotificationClick={() => console.log("2 notificaciones")}
              onSettingsClick={handleSettingsClick}
            />
            <Navbar
              userName="Usuario con muchas notificaciones"
              notificationCount={127}
              onNotificationClick={() => console.log("127 notificaciones")}
              onSettingsClick={handleSettingsClick}
            />
            <Navbar
              userName="Sin notificaciones"
              notificationCount={0}
              onNotificationClick={() => console.log("Sin notificaciones")}
              onSettingsClick={handleSettingsClick}
            />
          </div>
        </Card>

        {/* Diferentes usuarios */}
        <Card title="Diferentes Usuarios" description="Navbar con diferentes nombres de usuario">
          <div className="space-y-4">
            <Navbar
              userName="María González"
              notificationCount={1}
              onNotificationClick={handleNotificationClick}
              onSettingsClick={handleSettingsClick}
            />
            <Navbar
              userName="Carlos Rodríguez"
              notificationCount={5}
              onNotificationClick={handleNotificationClick}
              onSettingsClick={handleSettingsClick}
            />
            <Navbar
              userName="Ana Martínez"
              onNotificationClick={handleNotificationClick}
              onSettingsClick={handleSettingsClick}
            />
          </div>
        </Card>

        {/* Estados interactivos */}
        <Card
          title="Estados Interactivos"
          description="Demuestra los diferentes estados de hover y focus"
        >
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="mb-4 text-sm text-gray-600">
              Haz hover sobre los iconos para ver los efectos de transición. Haz click en las
              notificaciones para ver cómo cambia el contador.
            </p>
            <Navbar
              userName="Usuario Interactivo"
              notificationCount={notificationCount}
              onNotificationClick={handleNotificationClick}
              onSettingsClick={handleSettingsClick}
            />
          </div>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Cómo usar el Navbar">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Ejemplo básico de uso del componente Navbar con diferentes variantes, estados y
            funcionalidades.
          </p>
          <button
            onClick={handleCopy}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="rounded-lg border bg-gray-50 p-3 text-[11px] leading-5 whitespace-pre-wrap text-gray-900">
          {codeSample}
        </pre>

        <div className="mt-4 text-xs text-gray-600">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-800">Props principales:</h4>
              <ul className="space-y-1">
                <li>
                  <code className="font-mono">userName</code> - Nombre del usuario
                </li>
                <li>
                  <code className="font-mono">variant</code> - default | dark
                </li>
                <li>
                  <code className="font-mono">notificationCount</code> - Número de notificaciones
                </li>
                <li>
                  <code className="font-mono">avatarSrc</code> - URL del avatar personalizado
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-800">Callbacks:</h4>
              <ul className="space-y-1">
                <li>
                  <code className="font-mono">onNotificationClick</code> - Click en notificaciones
                </li>
                <li>
                  <code className="font-mono">onSettingsClick</code> - Click en configuración
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
}
