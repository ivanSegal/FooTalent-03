"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button } from "antd";
import {
  FileTextOutlined,
  ToolOutlined,
  CompassOutlined,
  FieldNumberOutlined,
} from "@ant-design/icons";
import { maintenanceActivitiesService } from "../services/maintenanceActivities.service";
import {
  maintenanceActivitySchema,
  type MaintenanceActivityFormValues,
} from "../schemas/maintenanceActivity.schema";
import type { MaintenanceActivityItem } from "../types/maintenanceActivities.types";
import { vesselItemService, type VesselItem } from "@/features/vessels";
import { showAlert } from "@/utils/showAlert";
import { NormalizedApiError } from "@/types/api";

const { TextArea } = Input;

interface Props {
  activities: MaintenanceActivityItem[];
  setActivities: React.Dispatch<React.SetStateAction<MaintenanceActivityItem[]>>;
  activity: MaintenanceActivityItem | null;
  onClose?: () => void;
  initialMaintenanceOrder?: string;
  // New: used to filter vessel items list
  vesselId?: number;
  // New: id de la orden para enviar al backend
  maintenanceOrderId?: number;
}

const defaultValues: Partial<MaintenanceActivityFormValues> = {
  maintenanceOrder: "",
  activityType: "",
  // switch to vesselItemId
  vesselItemId: undefined as unknown as number,
  vesselItemName: "",
  description: "",
  // adaptado a arreglo
  inventoryMovementIds: [],
};

export const MaintenanceActivityForm: React.FC<Props> = ({
  activities,
  setActivities,
  activity,
  onClose,
  initialMaintenanceOrder,
  vesselId,
  maintenanceOrderId,
}) => {
  console.log("activity", activity); // React Hook Form
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<MaintenanceActivityFormValues>({
    resolver: zodResolver(maintenanceActivitySchema),
    defaultValues,
  });

  // New: vessel items state and search
  const [items, setItems] = useState<VesselItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  const vesselItemPlaceholder = useMemo(
    () => (vesselId ? "Buscar ítem por nombre" : "Seleccione una orden con embarcación"),
    [vesselId],
  );

  // Helper para extraer vesselId desde distintas formas del backend
  type VesselRef = Partial<{ vesselId: number; vessel_id: number; vessel: { id?: number } }>;
  const getVesselIdFromItem = React.useCallback((it: VesselItem): number | undefined => {
    const ref = it as unknown as VesselRef;
    return ref.vesselId ?? ref.vessel_id ?? ref.vessel?.id;
  }, []);

  useEffect(() => {
    if (!vesselId) {
      setItems([]);
      return;
    }
    let ignore = false;
    const load = async () => {
      setItemsLoading(true);
      try {
        // Cargar todas las páginas y luego filtrar por vesselId en cliente
        const pageSize = 100;
        const first = await vesselItemService.list({
          page: 0,
          size: pageSize,
          search: itemSearch || undefined,
        });
        let all = first.content;
        const totalPages = Math.max(first.totalPages ?? 1, 1);
        for (let p = 1; p < totalPages; p += 1) {
          const res = await vesselItemService.list({
            page: p,
            size: pageSize,
            search: itemSearch || undefined,
          });
          all = all.concat(res.content);
        }
        const filtered = all.filter((it) => getVesselIdFromItem(it) === vesselId);
        if (!ignore) setItems(filtered);
      } catch {
        // silent fail; keep previous options
      } finally {
        if (!ignore) setItemsLoading(false);
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, [vesselId, itemSearch, getVesselIdFromItem]);

  useEffect(() => {
    if (activity) {
      reset({ ...defaultValues, ...activity } as MaintenanceActivityFormValues);
    } else {
      reset({
        ...(defaultValues as MaintenanceActivityFormValues),
        maintenanceOrder: initialMaintenanceOrder ?? "",
      });
    }
  }, [activity, reset, initialMaintenanceOrder]);

  const onSubmit: SubmitHandler<MaintenanceActivityFormValues> = async (data) => {
    try {
      if (activity) {
        const payload = {
          ...data,
          maintenanceOrderId: activity.maintenanceOrderId ?? maintenanceOrderId,
        };
        const updated = await maintenanceActivitiesService.update(activity.id, payload);
        setActivities(activities.map((a) => (a.id === updated.id ? updated : a)));
        void showAlert("Éxito", "Actividad actualizada correctamente.", "success");
      } else {
        // build payload with maintenanceOrderId for backend
        const parsedId = Number.parseInt((data.maintenanceOrder || "").split("-")[0] ?? "", 10);
        const orderIdToSend = Number.isFinite(parsedId) ? parsedId : maintenanceOrderId;
        const payload = {
          ...data,
          maintenanceOrderId: orderIdToSend,
        };
        const created = await maintenanceActivitiesService.create(payload);
        setActivities([created, ...activities]);
        void showAlert("Éxito", "Actividad creada correctamente.", "success");
      }
      onClose?.();
    } catch (e) {
      const err = e as NormalizedApiError;
      await showAlert(
        "Error",
        err?.message || "No se pudo guardar la actividad. Revisa los datos e intenta nuevamente.",
        "error",
      );
    }
  };

  const onInvalid = async () => {
    await showAlert("Formulario incompleto", "Por favor corrige los errores marcados.", "warning");
  };

  const movementOptions = useMemo(() => {
    const ids = Array.from(new Set([...(activity?.inventoryMovementIds ?? []), 1, 2, 3, 4, 5]));
    return ids.map((id) => ({ label: `Movimiento #${id}`, value: id }));
  }, [activity]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Orden de mantenimiento */}
        <div className="flex flex-col md:col-span-2">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="maintenanceOrder"
          >
            <CompassOutlined className="text-gray-600" /> Orden de mantenimiento
          </label>
          <Controller
            control={control}
            name="maintenanceOrder"
            render={({ field }) => (
              <Input id="maintenanceOrder" placeholder="Ej. 2-Titanic II-PREVENTIVO" {...field} />
            )}
          />
          {errors.maintenanceOrder && (
            <p className="mt-1 text-xs text-red-600">{errors.maintenanceOrder.message as string}</p>
          )}
        </div>

        {/* Tipo de actividad */}
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="activityType"
          >
            <ToolOutlined className="text-gray-600" /> Tipo de actividad
          </label>
          <Controller
            control={control}
            name="activityType"
            render={({ field }) => (
              <Select
                id="activityType"
                {...field}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                placeholder="Selecciona tipo"
                options={[
                  { label: "Inspección", value: "INSEPCCION" },
                  { label: "Limpieza", value: "LIMPIEZA" },
                  { label: "Lubricación", value: "LUBRICACION" },
                  { label: "Ajustes", value: "AJUSTES" },
                  { label: "Calibración", value: "CALIBRACION" },
                  { label: "Cambio programado", value: "CAMBIO_PROGRAMADO" },
                  { label: "Reemplazo por fallo", value: "REEMPLAZO_FALLO" },
                  { label: "Reparación", value: "REPARACION" },
                ]}
              />
            )}
          />
          {errors.activityType && (
            <p className="mt-1 text-xs text-red-600">{errors.activityType.message as string}</p>
          )}
        </div>

        {/* Ítem de embarcación */}
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="vesselItemId"
          >
            <CompassOutlined className="text-gray-600" /> Ítem de embarcación
          </label>

          <Controller
            control={control}
            name="vesselItemId"
            render={({ field }) => (
              <Select
                id="vesselItemId"
                showSearch
                placeholder={vesselItemPlaceholder}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                onSearch={(v) => setItemSearch(v)}
                filterOption={false}
                loading={itemsLoading}
                disabled={!vesselId}
                options={items.map((it) => ({ label: it.name, value: it.id }))}
              />
            )}
          />
          {errors.vesselItemId && (
            <p className="mt-1 text-xs text-red-600">{errors.vesselItemId.message as string}</p>
          )}
        </div>

        {/* Movimientos de inventario (múltiples opcionales) */}
        <div className="flex flex-col md:col-span-2">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="inventoryMovementIds"
          >
            <FieldNumberOutlined className="text-gray-600" /> Movimientos de inventario (opcional)
          </label>
          <Controller
            control={control}
            name="inventoryMovementIds"
            render={({ field }) => (
              <Select
                id="inventoryMovementIds"
                mode="multiple"
                className="w-full"
                placeholder="Ej. selecciona uno o más IDs: 1, 2, 3"
                value={field.value ?? []}
                onChange={(v) => field.onChange(v)}
                options={movementOptions}
                allowClear
              />
            )}
          />
          {errors.inventoryMovementIds && (
            <p className="mt-1 text-xs text-red-600">
              {errors.inventoryMovementIds.message as unknown as string}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="flex flex-col md:col-span-2">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            <FileTextOutlined className="text-gray-600" /> Descripción de la actividad
          </label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextArea
                id="description"
                placeholder="Describe la actividad realizada"
                autoSize={{ minRows: 3 }}
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <Button htmlType="button" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button htmlType="submit" type="primary" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isDirty ? "Guardar cambios" : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceActivityForm;
