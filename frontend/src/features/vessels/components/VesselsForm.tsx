"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputNumber, Button, Select } from "antd";
import {
  IdcardOutlined,
  NumberOutlined,
  FormOutlined,
  FlagOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ProfileOutlined,
  AppstoreOutlined,
  BuildOutlined,
  ToolOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  vesselSchema,
  type VesselFormValues,
  VESSEL_STATUS,
} from "@/features/vessels/schemas/vessel.schema";
import { vesselsService, type Vessel } from "@/features/vessels";
import { showAlert } from "@/utils/showAlert";

interface Props {
  current?: (Vessel & { id?: number }) | null;
  onSaved?: (v: Vessel) => void;
  onCancel?: () => void;
}

const isVesselStatus = (v: unknown): v is VesselFormValues["status"] =>
  typeof v === "string" && (VESSEL_STATUS as readonly string[]).includes(v);

// Mapeo a etiquetas en español para la vista del usuario
const VESSEL_STATUS_LABELS: Record<VesselFormValues["status"], string> = {
  OPERATIONAL: "Operativa",
  OUT_OF_SERVICE: "Fuera de servicio",
  UNDER_MAINTENANCE: "En mantenimiento",
};

// Opciones de banderas latinoamericanas
const LATAM_FLAGS: { value: string; label: string }[] = [
  { value: "Argentina", label: "🇦🇷 Argentina" },
  { value: "Bolivia", label: "🇧🇴 Bolivia" },
  { value: "Brasil", label: "🇧🇷 Brasil" },
  { value: "Chile", label: "🇨🇱 Chile" },
  { value: "Colombia", label: "🇨🇴 Colombia" },
  { value: "Costa Rica", label: "🇨🇷 Costa Rica" },
  { value: "Cuba", label: "🇨🇺 Cuba" },
  { value: "República Dominicana", label: "🇩🇴 República Dominicana" },
  { value: "Ecuador", label: "🇪🇨 Ecuador" },
  { value: "El Salvador", label: "🇸🇻 El Salvador" },
  { value: "Guatemala", label: "🇬🇹 Guatemala" },
  { value: "Honduras", label: "🇭🇳 Honduras" },
  { value: "México", label: "🇲🇽 México" },
  { value: "Nicaragua", label: "🇳🇮 Nicaragua" },
  { value: "Panamá", label: "🇵🇦 Panamá" },
  { value: "Paraguay", label: "🇵🇾 Paraguay" },
  { value: "Perú", label: "🇵🇪 Perú" },
  { value: "Uruguay", label: "🇺🇾 Uruguay" },
  { value: "Venezuela", label: "🇻🇪 Venezuela" },
];

// Tipos de servicio sugeridos
const SERVICE_TYPES: { value: string; label: string }[] = [
  { value: "Carga", label: "Carga" },
  { value: "Transporte de pasajeros", label: "Transporte de pasajeros" },
  { value: "Investigación", label: "Investigación" },
  { value: "Servicios offshore", label: "Servicios offshore" },
];

// Materiales de construcción sugeridos
const CONSTRUCTION_MATERIALS: { value: string; label: string }[] = [
  { value: "Acero Naval", label: "Acero Naval" },
  { value: "Aluminio", label: "Aluminio" },
  { value: "Fibra de vidrio", label: "Fibra de vidrio" },
];

// Tipos de combustible sugeridos
const FUEL_TYPES: { value: string; label: string }[] = [
  { value: "Diésel", label: "Diésel" },
  { value: "Gasolina", label: "Gasolina" },
  { value: "Fuelóleo", label: "Fuelóleo" },
];

// Tipos de popa sugeridos
const STERN_TYPES: { value: string; label: string }[] = [
  { value: "Espejo", label: "Espejo" },
  { value: "Redonda", label: "Redonda" },
  { value: "Inclinada", label: "Inclinada" },
];

const toFormDefaults = (v?: (Vessel & { id?: number }) | null): VesselFormValues => ({
  name: v?.name ?? "",
  registrationNumber: v?.registrationNumber ?? "",
  ismm: v?.ismm ?? "",
  flagState: v?.flagState ?? "",
  callSign: v?.callSign ?? "",
  portOfRegistry: v?.portOfRegistry ?? "",
  rif: v?.rif ?? "",
  serviceType: v?.serviceType ?? "",
  constructionMaterial: v?.constructionMaterial ?? "",
  sternType: v?.sternType ?? "",
  fuelType: v?.fuelType ?? "",
  navigationHours: typeof v?.navigationHours === "number" ? v.navigationHours : 0,
  status: isVesselStatus(v?.status) ? (v?.status as VesselFormValues["status"]) : "OPERATIONAL",
});

export default function VesselsForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VesselFormValues>({
    resolver: zodResolver(vesselSchema),
    defaultValues: toFormDefaults(current ?? null),
  });

  React.useEffect(() => {
    reset(toFormDefaults(current ?? null));
  }, [current, reset]);
  const onSubmit = async (values: VesselFormValues) => {
    try {
      let saved: Vessel;
      if (current?.id) {
        saved = await vesselsService.update(current.id, values);
      } else {
        saved = await vesselsService.create(values);
      }
      await showAlert("Éxito", "Embarcación guardada correctamente", "success");
      onSaved?.(saved);
      onCancel?.();
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo guardar", "error");
    }
  };

  // Allowed RIF prefix letters and type guard
  const allowedLetters = ["J", "G", "V", "E", "P"] as const;
  const isAllowedLetter = (c: string): c is (typeof allowedLetters)[number] =>
    (allowedLetters as readonly string[]).includes(c);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <IdcardOutlined className="text-gray-500" />
            <span>Nombre</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: Aurora"
                status={errors.name ? "error" : undefined}
              />
            )}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <NumberOutlined className="text-gray-500" />
            <span>Matrícula</span>
          </label>
          <Controller
            name="registrationNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: AB-1234"
                status={errors.registrationNumber ? "error" : undefined}
              />
            )}
          />
          {errors.registrationNumber ? (
            <p className="mt-1 text-xs text-red-600">{errors.registrationNumber.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <FormOutlined className="text-gray-500" />
            <span>ISMM</span>
          </label>
          <Controller
            name="ismm"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: ISMM-00123"
                status={errors.ismm ? "error" : undefined}
              />
            )}
          />
          {errors.ismm ? <p className="mt-1 text-xs text-red-600">{errors.ismm.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <FlagOutlined className="text-gray-500" />
            <span>Bandera</span>
          </label>
          <Controller
            name="flagState"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                showSearch
                allowClear
                placeholder="Ej: 🇻🇪 Venezuela"
                options={LATAM_FLAGS}
                optionFilterProp="label"
                status={errors.flagState ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.flagState ? (
            <p className="mt-1 text-xs text-red-600">{errors.flagState.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <PhoneOutlined className="text-gray-500" />
            <span>Señal de llamada</span>
          </label>
          <Controller
            name="callSign"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: YV1234"
                status={errors.callSign ? "error" : undefined}
              />
            )}
          />
          {errors.callSign ? (
            <p className="mt-1 text-xs text-red-600">{errors.callSign.message}</p>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <EnvironmentOutlined className="text-gray-500" />
            <span>Puerto de registro</span>
          </label>
          <Controller
            name="portOfRegistry"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: La Guaira"
                status={errors.portOfRegistry ? "error" : undefined}
              />
            )}
          />
          {errors.portOfRegistry ? (
            <p className="mt-1 text-xs text-red-600">{errors.portOfRegistry.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <ProfileOutlined className="text-gray-500" />
            <span>RIF</span>
          </label>
          <Controller
            name="rif"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: J-12345678-9"
                maxLength={12}
                allowClear
                onChange={(e) => {
                  const prev = (field.value ?? "").toString().toUpperCase();
                  const raw = (e.target.value ?? "").toString().toUpperCase();

                  // Determine prefix letter
                  const firstLetter = raw.replace(/[^A-Z]/g, "")[0] ?? "";
                  const prevPrefix = isAllowedLetter(prev[0] ?? "") ? prev[0] : "";
                  const prefix = isAllowedLetter(firstLetter) ? firstLetter : prevPrefix;

                  // Gather digits
                  const digits = raw.replace(/[^0-9]/g, "");
                  const middle = digits.slice(0, 8);
                  const last = digits.slice(8, 9);

                  // Compose formatted value
                  let formatted = prefix;
                  if (prefix) formatted += "-";
                  formatted += middle;
                  if (prefix && middle.length === 8) formatted += "-";
                  formatted += last;

                  field.onChange(formatted);
                }}
                status={errors.rif ? "error" : undefined}
              />
            )}
          />
          {errors.rif ? (
            <p className="mt-1 text-xs text-red-600">{errors.rif.message}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Formato: J-12345678-9</p>
          )}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <AppstoreOutlined className="text-gray-500" />
            <span>Tipo de servicio</span>
          </label>
          <Controller
            name="serviceType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                showSearch
                allowClear
                placeholder="Ej: Carga"
                options={SERVICE_TYPES}
                optionFilterProp="label"
                status={errors.serviceType ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.serviceType ? (
            <p className="mt-1 text-xs text-red-600">{errors.serviceType.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <BuildOutlined className="text-gray-500" />
            <span>Material de construcción</span>
          </label>
          <Controller
            name="constructionMaterial"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                showSearch
                allowClear
                placeholder="Ej: Acero Naval"
                options={CONSTRUCTION_MATERIALS}
                optionFilterProp="label"
                status={errors.constructionMaterial ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.constructionMaterial ? (
            <p className="mt-1 text-xs text-red-600">{errors.constructionMaterial.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <ToolOutlined className="text-gray-500" />
            <span>Tipo de popa</span>
          </label>
          <Controller
            name="sternType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                showSearch
                allowClear
                placeholder="Ej: Espejo"
                options={STERN_TYPES}
                optionFilterProp="label"
                status={errors.sternType ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.sternType ? (
            <p className="mt-1 text-xs text-red-600">{errors.sternType.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <FireOutlined className="text-gray-500" />
            <span>Tipo de combustible</span>
          </label>
          <Controller
            name="fuelType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                showSearch
                allowClear
                placeholder="Ej: Diésel"
                options={FUEL_TYPES}
                optionFilterProp="label"
                status={errors.fuelType ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.fuelType ? (
            <p className="mt-1 text-xs text-red-600">{errors.fuelType.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <ClockCircleOutlined className="text-gray-500" />
            <span>Horas de navegación</span>
          </label>
          <Controller
            name="navigationHours"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                placeholder="Ej: 1200"
                style={{ width: "100%" }}
                status={errors.navigationHours ? "error" : undefined}
              />
            )}
          />
          {errors.navigationHours ? (
            <p className="mt-1 text-xs text-red-600">{errors.navigationHours.message as string}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-normal text-gray-600">
            <CheckCircleOutlined className="text-gray-500" />
            <span>Estado</span>
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                placeholder="Ej: Operativa"
                options={VESSEL_STATUS.map((v) => ({ label: VESSEL_STATUS_LABELS[v], value: v }))}
                status={errors.status ? "error" : undefined}
              />
            )}
          />
          {errors.status ? (
            <p className="mt-1 text-xs text-red-600">{errors.status.message as string}</p>
          ) : null}
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-2 pt-2 md:grid-cols-2">
        <Button onClick={onCancel} className="w-full">
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting} className="w-full">
          {isSubmitting
            ? "Guardando..."
            : current?.id
              ? "Modificar Embarcación"
              : "Agregar Embarcación"}
        </Button>
      </div>
    </form>
  );
}
