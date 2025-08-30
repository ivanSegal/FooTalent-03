"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Modal } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";

type PDFGeneratorProps<T> = {
  template: React.ComponentType<{ data: T } & Record<string, unknown>>;
  data: T;
  fileName?: string;
  showPreview?: boolean;
  downloadText?: string;
  // Extra props to pass directly to the template
  templateProps?: Record<string, unknown>;
  // Optional async loader invoked before opening preview; its result will be spread into template props
  onBeforeOpen?: () => Promise<Record<string, unknown>>;
};

// Carga dinámica para evitar SSR del visor
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        border: "1px dashed #ccc",
      }}
    >
      Cargando vista previa...
    </div>
  ),
});

const PDFGenerator = <T,>({
  template: Template,
  data,
  showPreview = true,
  fileName = "document.pdf",
  downloadText = "Descargar PDF",
  templateProps,
  onBeforeOpen,
}: PDFGeneratorProps<T>) => {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [extra, setExtra] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (onBeforeOpen) {
      try {
        setLoading(true);
        const loaded = await onBeforeOpen();
        setExtra(loaded || {});
      } finally {
        setLoading(false);
      }
    }
    setShowFullPreview(true);
  };

  const mergedProps = { ...(templateProps ?? {}), ...(extra ?? {}) } as Record<string, unknown>;

  return (
    <div className="pdf-generator m-0">
      <div className="pdf-actions">
        {showPreview && (
          <Button
            icon={<PrinterOutlined />}
            onClick={() => void handleOpen()}
            shape="circle"
            size="small"
            loading={loading}
          />
        )}
      </div>

      {showFullPreview && (
        <Modal
          open={showFullPreview}
          title="Vista previa del PDF"
          onCancel={() => setShowFullPreview(false)}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, width: "100%" }}>
              <Button key="close" onClick={() => setShowFullPreview(false)}>
                Cerrar
              </Button>
              <PDFDownloadLink
                key="download"
                document={<Template data={data} {...mergedProps} />}
                fileName={fileName}
              >
                {({ loading: downloadLoading }) => (
                  <Button type="primary" loading={downloadLoading}>
                    {downloadText}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          }
          width="80%"
          bodyProps={{ style: { height: "60vh" } }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <PDFViewer width="100%" height="100%">
              <Template data={data} {...mergedProps} />
            </PDFViewer>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .pdf-generator {
          margin: 0px 0;
        }
        .pdf-actions {
          display: flex;
          align-items: center;
        }
        .pdf-preview-container {
          margin-top: 20px;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          styleverflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PDFGenerator;
