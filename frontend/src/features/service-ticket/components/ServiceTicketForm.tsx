"use client";

import React, { useEffect } from "react";
import {
  useForm,
  Controller,
  type SubmitHandler,
  type Resolver,
  type Path,
  type ErrorOption,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, DatePicker, Button, Select, Steps, Switch } from "antd";
import dayjs from "dayjs";
import {
  CalendarOutlined,
  FieldNumberOutlined,
  ContainerOutlined,
  CompassOutlined,
  UserOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";

import {
  type ServiceTicketDetail,
  ServiceTicketDetailForm,
  type ServiceTicketFormValues,
  serviceTicketSchema,
  serviceTicketService,
  type ServiceTicketListItem,
} from "@/features/service-ticket";
import { showAlert } from "@/utils/showAlert";
import { vesselsService, type Vessel } from "@/features/vessels";
import type { NormalizedApiError } from "@/types/api";

interface Props {
  items: ServiceTicketListItem[];
  setItems: React.Dispatch<React.SetStateAction<ServiceTicketListItem[]>>;
  current: ServiceTicketListItem | null;
  onClose: () => void;
  // nuevos opcionales para orquestación externa
  onSaved?: (ticket: ServiceTicketListItem) => void;
  closeOnSave?: boolean;
  // nuevo: detalle asociado y paso inicial
  currentDetail?: ServiceTicketDetail | null;
  initialStep?: number; // 0: boleta, 1: detalle
  // callback para propagar guardado de detalle hacia el padre
  onDetailSaved?: (detail: ServiceTicketDetail) => void;
}

const defaultValues: Partial<ServiceTicketFormValues> = {
  travelNro: 0,
  travelDate: "",
  vesselAttended: "",
  solicitedBy: "",
  reportTravelNro: "",
  // code: "",
  // checkingNro: 0,
  vesselName: "",
  status: true,

  responsibleUsername: "",
};

export const ServiceTicketForm: React.FC<Props> = ({
  items,
  setItems,
  current,
  onClose,
  onSaved,
  closeOnSave = true,
  currentDetail,
  initialStep = 0,
  onDetailSaved,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setError,
    setFocus,
    watch,
    setValue,
  } = useForm<ServiceTicketFormValues>({
    resolver: zodResolver(serviceTicketSchema) as unknown as Resolver<ServiceTicketFormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  // steps state
  const [step, setStep] = React.useState<number>(initialStep ?? 0);
  const [savedTicket, setSavedTicket] = React.useState<ServiceTicketListItem | null>(current);

  // Cargar embarcaciones para el select
  const [vessels, setVessels] = React.useState<Vessel[]>([]);
  useEffect(() => {
    void (async () => {
      try {
        const res = await vesselsService.list({ page: 0, size: 100 });
        setVessels(res.content);
      } catch {
        // opcional: ignorar error silenciosamente
      }
    })();
  }, []);

  useEffect(() => {
    if (current) {
      reset({ ...defaultValues, ...current } as ServiceTicketFormValues);
      setSavedTicket(current);
      setStep(initialStep ?? 0);
    } else {
      reset(defaultValues as ServiceTicketFormValues);
      setSavedTicket(null);
      setStep(0);
    }
  }, [current, reset, initialStep]);

  const goToStep = async (target: number) => {
    if (target === step) return;
    if (target === 0) {
      // Volver a Boleta: prellenar con ticket guardado o current
      if (savedTicket) {
        reset({ ...defaultValues, ...savedTicket } as ServiceTicketFormValues);
      } else if (current) {
        reset({ ...defaultValues, ...current } as ServiceTicketFormValues);
      }
      setStep(0);
      return;
    }
    // Ir a Detalle: asegurar ticket existente
    const id = current?.id ?? savedTicket?.id;
    if (!id) {
      // Guardar boleta primero
      await handleSubmit(onSubmit, onInvalid)();
      return;
    }
    setStep(1);
  };

  // Derivar N° Reporte de Viaje: ABC-25-<nro>
  const vesselNameWatch = watch("vesselName");
  const travelNroWatch = watch("travelNro");
  useEffect(() => {
    const name = (vesselNameWatch ?? "").toString().trim();
    const trip = Number(travelNroWatch ?? 0) || 0;
    if (name && trip > 0) {
      const prefix = name.slice(0, 3).toUpperCase();
      const value = `${prefix}-25-${trip}`;
      setValue("reportTravelNro", value, { shouldValidate: true, shouldDirty: false });
    } else {
      setValue("reportTravelNro", "", { shouldValidate: true, shouldDirty: false });
    }
  }, [vesselNameWatch, travelNroWatch, setValue]);

  const onSubmit: SubmitHandler<ServiceTicketFormValues> = async (data) => {
    try {
      const selected = vessels.find((v) => v.name === data.vesselName);
      const payload = selected ? { ...data, vesselId: selected.id } : data;

      const idToUpdate = current?.id ?? savedTicket?.id;
      if (idToUpdate) {
        const updated = await serviceTicketService.update(idToUpdate, payload);
        setItems(items.map((t) => (t.id === updated.id ? updated : t)));
        setSavedTicket(updated);
        onSaved?.(updated);
        await showAlert(
          "Éxito",
          `Boleta #${updated.id}${updated.reportTravelNro ? ` – ${updated.reportTravelNro}` : ""} modificada correctamente`,
          "success",
        );
        // Cerrar solo si provenimos de edicion directa (current)
        if (current && closeOnSave) onClose();
        else setStep(1);
      } else {
        const created = await serviceTicketService.create(payload);
        setItems([created, ...items]);
        reset({ ...defaultValues, ...created } as ServiceTicketFormValues);
        onSaved?.(created);
        setSavedTicket(created);
        setStep(1); // avanzar a Detalle
      }
    } catch (e) {
      const apiErr = e as NormalizedApiError;
      // Aplica errores sólo a campos conocidos del formulario
      if (apiErr?.fieldErrors) {
        const keys: Array<keyof ServiceTicketFormValues> = [
          "travelNro",
          "travelDate",
          "vesselAttended",
          "solicitedBy",
          "reportTravelNro",
          // "code",
          // "checkingNro",
          "vesselName",
          "status",
        ];
        for (const k of keys) {
          const msg = apiErr.fieldErrors[k as string];
          if (msg) {
            setError(
              k as Path<ServiceTicketFormValues>,
              {
                type: "server",
                message: String(msg),
              } as ErrorOption,
            );
          }
        }
      }
      await showAlert(
        "No se pudo guardar",
        apiErr?.message || "Ocurrió un error. Intenta nuevamente.",
        "error",
      );
    }
  };

  const onInvalid = async (formErrors: FieldErrors<ServiceTicketFormValues>) => {
    // Enfocar el primer campo con error y mostrar alerta
    const first = Object.keys(formErrors)[0] as Path<ServiceTicketFormValues> | undefined;
    if (first) setFocus(first);
    await showAlert(
      "Completa los campos requeridos",
      "Revisa los campos marcados en rojo.",
      "warning",
    );
  };

  return (
    <div>
      <Steps
        current={step}
        items={[{ title: "Boleta" }, { title: "Detalle" }]}
        onChange={(v) => void goToStep(v)}
      />
      <div className="mt-4">
        {step === 0 ? (
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Embarcación primero */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="vesselName">
                  <span className="inline-flex items-center gap-1">
                    <CompassOutlined />
                    Embarcación
                  </span>
                </label>
                <Controller
                  control={control}
                  name="vesselName"
                  render={({ field }) => (
                    <Select
                      id="vesselName"
                      showSearch
                      placeholder="Ej: Embarcación 1"
                      optionFilterProp="label"
                      value={field.value ?? undefined}
                      onChange={(val) => field.onChange(val)}
                      options={vessels.map((v) => ({ label: v.name, value: v.name }))}
                      status={errors.vesselName ? "error" : undefined}
                    />
                  )}
                />
                {errors.vesselName && (
                  <p className="mt-1 text-xs text-red-600">{errors.vesselName.message as string}</p>
                )}
              </div>

              {/* N° Viaje */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="travelNro">
                  <span className="inline-flex items-center gap-1">
                    <FieldNumberOutlined />
                    N° Viaje
                  </span>
                </label>
                <Controller
                  control={control}
                  name="travelNro"
                  render={({ field }) => (
                    <Input
                      id="travelNro"
                      type="number"
                      placeholder="Ej: 12"
                      {...field}
                      value={field.value ?? 0}
                      status={errors.travelNro ? "error" : undefined}
                    />
                  )}
                />
                {errors.travelNro && (
                  <p className="mt-1 text-xs text-red-600">{errors.travelNro.message as string}</p>
                )}
              </div>

              {/* Fecha de viaje */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="travelDate">
                  <span className="inline-flex items-center gap-1">
                    <CalendarOutlined />
                    Fecha de viaje
                  </span>
                </label>
                <Controller
                  control={control}
                  name="travelDate"
                  render={({ field }) => (
                    <DatePicker
                      id="travelDate"
                      format="DD-MM-YYYY"
                      placeholder="Ej: 15-09-2025"
                      value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                      onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : "")}
                      className="w-full"
                      status={errors.travelDate ? "error" : undefined}
                    />
                  )}
                />
                {errors.travelDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.travelDate.message as string}</p>
                )}
              </div>

              {/* Solicitado por */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="solicitedBy">
                  <span className="inline-flex items-center gap-1">
                    <UserOutlined />
                    Solicitado por
                  </span>
                </label>
                <Controller
                  control={control}
                  name="solicitedBy"
                  render={({ field }) => (
                    <Input
                      id="solicitedBy"
                      placeholder="Ej: Juan Pérez"
                      {...field}
                      value={field.value ?? ""}
                      status={errors.solicitedBy ? "error" : undefined}
                    />
                  )}
                />
                {errors.solicitedBy && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.solicitedBy.message as string}
                  </p>
                )}
              </div>
              {/* Embarcación atendida */}
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="vesselAttended">
                  <span className="inline-flex items-center gap-1">
                    <ContainerOutlined />
                    Embarcación atendida
                  </span>
                </label>
                <Controller
                  control={control}
                  name="vesselAttended"
                  render={({ field }) => (
                    <Input
                      id="vesselAttended"
                      placeholder="Ej: Pescadora II"
                      {...field}
                      value={field.value ?? ""}
                      status={errors.vesselAttended ? "error" : undefined}
                    />
                  )}
                />
                {errors.vesselAttended && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.vesselAttended.message as string}
                  </p>
                )}
              </div>

              {/* N° Reporte de Viaje */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="reportTravelNro">
                  <span className="inline-flex items-center gap-1">
                    <FileTextOutlined />
                    N° Reporte de Viaje
                  </span>
                </label>
                <Controller
                  control={control}
                  name="reportTravelNro"
                  render={({ field }) => (
                    <Input
                      id="reportTravelNro"
                      placeholder="Ej: ABC-25-12"
                      {...field}
                      value={field.value ?? ""}
                      status={errors.reportTravelNro ? "error" : undefined}
                      readOnly
                    />
                  )}
                />
                {errors.reportTravelNro && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.reportTravelNro.message as string}
                  </p>
                )}
              </div>

              {/* Estado (junto al reporte, como switch) */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="status">
                  <span className="inline-flex items-center gap-1">
                    <LockOutlined />
                    Estado
                  </span>
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Switch
                      id="status"
                      checked={!!field.value}
                      onChange={(val) => field.onChange(val)}
                      checkedChildren="Abierta"
                      unCheckedChildren="Cerrada"
                      style={{ backgroundColor: field.value ? "#16a34a" : "#dc2626" }}
                    />
                  )}
                />
                {errors.status && (
                  <p className="mt-1 text-xs text-red-600">{errors.status.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 pt-2 md:grid-cols-2">
              <Button onClick={onClose} className="w-full">
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting} className="w-full">
                {isSubmitting
                  ? "Guardando..."
                  : current?.id
                    ? "Modificar Boleta"
                    : "Agregar Boleta"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={() => void goToStep(0)}>Atrás</Button>
              <div className="flex items-center gap-2">
                <Button onClick={() => onClose?.()}>Cerrar</Button>
              </div>
            </div>
            <ServiceTicketDetailForm
              serviceTicketId={savedTicket?.id ?? current?.id ?? 0}
              current={currentDetail ?? undefined}
              onSaved={(d) => onDetailSaved?.(d)}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceTicketForm;
