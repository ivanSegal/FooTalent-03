"use client";
import React, { ReactElement } from "react";
import { PDFViewer as OriginalPDFViewer } from "@react-pdf/renderer";

import type { DocumentProps } from "@react-pdf/renderer";

interface PDFViewerProps {
  children: ReactElement<DocumentProps>;
  width?: string | number;
  height?: string | number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ children, width = "100%", height = "600px" }) => {
  return (
    <div
      style={{
        width,
        height,
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        margin: "20px 0",
      }}
    >
      <OriginalPDFViewer width="100%" height="100%">
        {children}
      </OriginalPDFViewer>
    </div>
  );
};

export default PDFViewer;
