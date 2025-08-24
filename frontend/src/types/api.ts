export type FieldErrors = Record<string, string>;

export interface NormalizedApiError extends Error {
  name: "ApiError";
  status?: number;
  code?: string | number;
  fieldErrors?: FieldErrors;
  raw?: unknown;
}
