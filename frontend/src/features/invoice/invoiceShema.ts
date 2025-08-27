// src/schemas/invoiceSchema.ts
import { z } from "zod";

// Esquema para un solo ítem de la factura
export const invoiceItemSchema = z.object({
  productName: z.string().min(1, "El nombre del producto es requerido."),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a 0."),
  price: z.coerce.number().positive("El precio debe ser mayor a 0."),
});

// Type guard para detectar Dayjs-like (u otros objetos con toDate)
const hasToDate = (v: unknown): v is { toDate: () => Date } =>
  typeof v === "object" &&
  v !== null &&
  "toDate" in (v as { toDate?: unknown }) &&
  typeof (v as { toDate?: unknown }).toDate === "function";

// Esquema para la fecha: acepta Dayjs/Date/string y normaliza a Date
const dateFromAny = z.preprocess((val: unknown) => {
  if (hasToDate(val)) return val.toDate();
  return val;
}, z.date());

// Esquema para la factura completa
export const invoiceSchema = z.object({
  customerName: z.string().min(3, "El nombre del cliente es requerido."),
  invoiceDate: dateFromAny,
  items: z.array(invoiceItemSchema).min(1, "Debe agregar al menos un ítem."),
});

// Tipos de entrada/salida del esquema
export type InvoiceFormInput = z.input<typeof invoiceSchema>;
export type InvoiceFormValues = z.output<typeof invoiceSchema>;
