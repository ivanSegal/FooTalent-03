"use client";

import React from "react";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";

// Simple card wrapper for nicer presentation
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
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

export default function ButtonDemoPage() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const codeSample = `import Button from "@/components/UI/Button";

export default function Example() {
  return (
    <div className="flex flex-col gap-4">
      {/* Sólido primario */}
      <Button severity="primary" appearance="solid">Botón Principal</Button>

      {/* Outlined por severidad */}
      <Button severity="secondary" appearance="outlined">Secundario Outlined</Button>

      {/* Loading + icono */}
      <Button severity="approved" appearance="solid" loading leftIcon={<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d="M10 2a8 8 0 100 16 8 8 0 000-16z" /></svg>}>
        Procesando…
      </Button>

      {/* Full width */}
      <Button fullWidth disabled>Continuar</Button>
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

  return (
    <main className="mx-auto max-w-6xl px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Button Demo</h1>
        <div className="flex items-center gap-2">
          <Button appearance="outlined" severity="approved" onClick={() => setOpen(true)}>
            Guía de uso
          </Button>
        </div>
      </div>

      {/* Lista vertical de tarjetas */}
      <div className="flex flex-col gap-4">
        {/* Severidades sólidas */}
        <Card
          title="Severidades (solid)"
          description="primary, secondary, approved, neutral, error"
        >
          <Button severity="primary" appearance="solid">
            Primary
          </Button>
          <Button severity="secondary" appearance="solid">
            Secondary
          </Button>
          <Button severity="approved" appearance="solid">
            Approved
          </Button>
          <Button severity="neutral" appearance="solid">
            Neutral
          </Button>
          <Button severity="error" appearance="solid">
            Error
          </Button>
        </Card>

        {/* Outlined por severidad */}
        <Card title="Outlined por severidad" description="Todas las severidades con outlined">
          <Button severity="primary" appearance="outlined">
            Primary
          </Button>
          <Button severity="secondary" appearance="outlined">
            Secondary
          </Button>
          <Button severity="approved" appearance="outlined">
            Approved
          </Button>
          <Button severity="neutral" appearance="outlined">
            Neutral
          </Button>
          <Button severity="error" appearance="outlined">
            Error
          </Button>
        </Card>

        {/* Tamaños y full width + íconos */}
        <Card
          title="Tamaños / Full width / Íconos / Disabled"
          description="sm, md, lg; ancho completo e íconos disabled"
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <div className="w-full">
            <Button fullWidth>Full Width</Button>
          </div>
          <Button
            leftIcon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
              </svg>
            }
          >
            Left Icon
          </Button>
          <Button
            rightIcon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M7 5l5 5-5 5" />
              </svg>
            }
          >
            Right Icon
          </Button>
          {/* Loading example */}
          <Button loading>Procesando…</Button>
          <Button severity="primary" appearance="solid" disabled>
            Disabled
          </Button>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cómo usar el Button"
        description="Ejemplos de severidad, apariencia, tamaños, loading, íconos y full width."
        footer={
          <Button appearance="outlined" severity="primary" onClick={handleCopy}>
            {copied ? "Copiado" : "Copiar código"}
          </Button>
        }
        size="xl"
      >
        <pre className="rounded-lg border bg-gray-50 p-3 text-[11px] leading-5 whitespace-pre-wrap text-gray-900">
          {codeSample}
        </pre>
        <div className="mt-4 text-xs text-gray-600">
          Props principales: <code className="font-mono">severity</code>,{" "}
          <code className="font-mono">appearance</code>, <code className="font-mono">size</code>,{" "}
          <code className="font-mono">fullWidth</code>, <code className="font-mono">loading</code>,{" "}
          <code className="font-mono">leftIcon</code>, <code className="font-mono">rightIcon</code>.
        </div>
      </Modal>
    </main>
  );
}
