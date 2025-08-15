"use client";

import React from "react";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";

interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, children }) => (
  <div className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-[#0E1046]">{title}</h3>
      {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

export default function ModalDemoPage() {
  // States for each demo variation
  const [openBasic, setOpenBasic] = React.useState(false);
  const [openSizes, setOpenSizes] = React.useState<null | "sm" | "md" | "lg" | "xl">(null);
  const [openScroll, setOpenScroll] = React.useState(false);
  const [openFooter, setOpenFooter] = React.useState(false);
  const [openLock, setOpenLock] = React.useState(false);
  const [openFocus, setOpenFocus] = React.useState(false);
  const [openCustom, setOpenCustom] = React.useState(false);
  const [openGuide, setOpenGuide] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const focusRef = React.useRef<HTMLInputElement>(null);

  const codeSample = `import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Título" description="Descripción opcional">
        Contenido del modal.
      </Modal>
    </>
  );
}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codeSample);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  // Long lorem for scroll example
  const longContent = Array.from({ length: 25 }, (_, i) => (
    <p key={i} className="mb-3 last:mb-0">
      Línea {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula,
      neque non varius malesuada, urna elit dictum massa.
    </p>
  ));

  return (
    <main className="mx-auto max-w-6xl px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Modal Demo</h1>
        <Button appearance="outlined" severity="approved" onClick={() => setOpenGuide(true)}>
          Guía de uso
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Card title="Básico" description="Ejemplo mínimo">
          <Button onClick={() => setOpenBasic(true)}>Abrir básico</Button>
        </Card>

        <Card title="Tamaños" description="sm, md, lg, xl">
          <Button onClick={() => setOpenSizes("sm")}>sm</Button>
          <Button onClick={() => setOpenSizes("md")}>md</Button>
          <Button onClick={() => setOpenSizes("lg")}>lg</Button>
          <Button onClick={() => setOpenSizes("xl")}>xl</Button>
        </Card>

        <Card title="Contenido scroll" description="Demuestra área scroll interno">
          <Button onClick={() => setOpenScroll(true)}>Ver scroll</Button>
        </Card>

        <Card title="Footer acciones" description="Footer con botones secundarios + primario">
          <Button onClick={() => setOpenFooter(true)}>Abrir con footer</Button>
        </Card>

        <Card title="No cerrable (preventClose)" description="Bloquea backdrop y Escape">
          <Button onClick={() => setOpenLock(true)}>Abrir bloqueado</Button>
        </Card>

        <Card title="Focus inicial" description="Auto focus en input interno">
          <Button onClick={() => setOpenFocus(true)}>Abrir con focus</Button>
        </Card>

        <Card title="Custom style" description="Clase adicional y padding custom">
          <Button onClick={() => setOpenCustom(true)}>Abrir custom</Button>
        </Card>
      </div>

      {/* Modals */}
      <Modal
        open={openBasic}
        onClose={() => setOpenBasic(false)}
        title="Modal básico"
        description="Pequeño texto descriptivo."
      >
        <p className="text-sm">
          Esto es un modal básico. Usa <code className="font-mono">open</code>,{" "}
          <code className="font-mono">onClose</code>.
        </p>
      </Modal>

      <Modal
        open={openSizes === "sm"}
        onClose={() => setOpenSizes(null)}
        size="sm"
        title="SM"
        description="Tamaño pequeño"
      >
        <p className="text-sm">Contenido tamaño sm.</p>
      </Modal>
      <Modal
        open={openSizes === "md"}
        onClose={() => setOpenSizes(null)}
        size="md"
        title="MD"
        description="Tamaño mediano"
      >
        <p className="text-sm">Contenido tamaño md.</p>
      </Modal>
      <Modal
        open={openSizes === "lg"}
        onClose={() => setOpenSizes(null)}
        size="lg"
        title="LG"
        description="Tamaño grande"
      >
        <p className="text-sm">Contenido tamaño lg.</p>
      </Modal>
      <Modal
        open={openSizes === "xl"}
        onClose={() => setOpenSizes(null)}
        size="xl"
        title="XL"
        description="Tamaño extra grande"
      >
        <p className="text-sm">Contenido tamaño xl.</p>
      </Modal>

      <Modal
        open={openScroll}
        onClose={() => setOpenScroll(false)}
        size="lg"
        title="Scroll interno"
        description="Lista larga para forzar scroll"
      >
        <div className="space-y-0 text-sm">{longContent}</div>
      </Modal>

      <Modal
        open={openFooter}
        onClose={() => setOpenFooter(false)}
        size="md"
        title="Acciones"
        description="Footer personalizado"
        footer={
          <>
            <Button appearance="outlined" severity="neutral" onClick={() => setOpenFooter(false)}>
              Cancelar
            </Button>
            <Button severity="approved" onClick={() => setOpenFooter(false)}>
              Confirmar
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Usa la prop <code className="font-mono">footer</code> para añadir acciones.
        </p>
      </Modal>

      <Modal
        open={openLock}
        onClose={() => setOpenLock(false)}
        size="sm"
        title="Bloqueado"
        description="No cierra con backdrop ni Escape"
        preventClose
        footer={
          <Button severity="primary" onClick={() => setOpenLock(false)}>
            Cerrar manual
          </Button>
        }
      >
        <p className="text-sm">
          Pasar <code className="font-mono">preventClose</code> mantiene el modal abierto hasta
          acción explícita.
        </p>
      </Modal>

      <Modal
        open={openFocus}
        onClose={() => setOpenFocus(false)}
        size="md"
        title="Focus inicial"
        description="Input recibe focus al abrir"
        initialFocusRef={focusRef as unknown as React.RefObject<HTMLElement>}
        footer={
          <Button severity="primary" onClick={() => setOpenFocus(false)}>
            Cerrar
          </Button>
        }
      >
        <form className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nombre</label>
            <input
              ref={focusRef}
              data-autofocus
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Correo</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
              placeholder="email@dominio.com"
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={openCustom}
        onClose={() => setOpenCustom(false)}
        size="lg"
        title="Custom style"
        description="Añadiendo clase personalizada"
        className="border-[#0E1046]/20 shadow-2xl"
        footer={
          <Button severity="primary" onClick={() => setOpenCustom(false)}>
            Listo
          </Button>
        }
      >
        <p className="text-sm">
          Puedes usar <code className="font-mono">className</code> para ajustar estilos del panel.
        </p>
      </Modal>

      <Modal
        open={openGuide}
        onClose={() => setOpenGuide(false)}
        title="Cómo usar el Modal"
        size="lg"
        description="Props y ejemplos básicos"
        footer={
          <Button appearance="outlined" severity="primary" onClick={() => setOpenGuide(false)}>
            Cerrar guía
          </Button>
        }
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Ejemplo básico + variaciones (tamaños, scroll, footer, preventClose, focus, custom).
          </p>
          <button
            onClick={copy}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="rounded-lg border bg-gray-50 p-3 text-[11px] leading-5 whitespace-pre-wrap text-gray-900">
          {codeSample}
        </pre>
        <div className="mt-4 text-xs text-gray-600">
          Props: <code className="font-mono">open</code>, <code className="font-mono">onClose</code>
          , <code className="font-mono">title</code>, <code className="font-mono">description</code>
          , <code className="font-mono">size</code>, <code className="font-mono">footer</code>,{" "}
          <code className="font-mono">hideCloseButton</code>,{" "}
          <code className="font-mono">initialFocusRef</code>,{" "}
          <code className="font-mono">preventClose</code>,{" "}
          <code className="font-mono">className</code>.
        </div>
      </Modal>
    </main>
  );
}
