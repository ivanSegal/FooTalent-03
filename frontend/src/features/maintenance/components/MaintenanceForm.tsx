"use client";
import React, { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, DatePicker, Button } from "antd";
import {
  FileTextOutlined,
  ToolOutlined,
  FlagOutlined,
  ScheduleOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { MaintenanceFormValues, maintenanceSchema } from "../schemas/maintenance.schema";
import { MaintenanceListItem, maintenanceService } from "@/features/maintenance";

import { vasselsService, type Vassel } from "@/features/vassels";

const { TextArea } = Input;

interface Props {
  maintenanceLists: MaintenanceListItem[];
  setMaintenanceLists: React.Dispatch<React.SetStateAction<MaintenanceListItem[]>>;
  maintenanceList: MaintenanceListItem | null;
  hideMaintenanceFormDialog: () => void;
}

const defaultValues: Partial<MaintenanceFormValues> = {
  vesselName: "",
  maintenanceReason: "",
  maintenanceType: "PREVENTIVO",
  status: "SOLICITADO",
  scheduledAt: null,
  startedAt: null,
  finishedAt: null,
};

dayjs.extend(customParseFormat);

export const MaintenanceForm: React.FC<Props> = ({
  maintenanceLists,
  setMaintenanceLists,
  maintenanceList,
  hideMaintenanceFormDialog,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    control,
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues,
  });

  // Cargar embarcaciones para el select
  const [vassels, setVassels] = React.useState<Vassel[]>([]);
  useEffect(() => {
    void (async () => {
      try {
        const res = await vasselsService.list({ page: 0, size: 100 });
        setVassels(res.content);
      } catch {
        // Ignorar error de carga inicial
      }
    })();
  }, []);

  useEffect(() => {
    if (maintenanceList) {
      // Prefill al editar
      reset({ ...defaultValues, ...maintenanceList } as MaintenanceFormValues);
    } else {
      // Valores limpios al crear
      reset(defaultValues as MaintenanceFormValues);
    }
  }, [maintenanceList, reset]);

  const onSubmit: SubmitHandler<MaintenanceFormValues> = async (data) => {
    try {
      // Incluir vesselId si el usuario eligió una embarcación válida
      const selected = vassels.find((v) => v.name === data.vesselName);
      const payload: Partial<MaintenanceListItem> = selected
        ? { ...data, vesselId: selected.id }
        : { ...data };

      if (maintenanceList) {
        const updatedMaintenance = await maintenanceService.update(maintenanceList.id, payload);
        console.log("Updated maintenance order:", updatedMaintenance);
        const updatedMaintenanceLists = maintenanceLists.map((t) =>
          t.id === updatedMaintenance.id ? updatedMaintenance : t,
        );
        setMaintenanceLists(updatedMaintenanceLists);
        // showToast("success", "Éxito", "Mantenimiento actualizado");
      } else {
        const newMaintenance = await maintenanceService.create(payload);
        setMaintenanceLists([newMaintenance, ...maintenanceLists]);
        // showToast("success", "Éxito", "Mantenimiento creado");
      }
      // hideTanqueFormDialog();
      hideMaintenanceFormDialog();
    } catch (error) {
      // handleFormError(error, toast); // Pasamos la referencia del toast
      console.error(error);
    } finally {
      // setMaintenanceList(null);
    }
  };
  console.log("errors", errors);
  // console.log("test", watch());
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Embarcación */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="vesselName">
            <CompassOutlined className="mr-1 text-gray-600" /> Embarcación
          </label>
          <Controller
            control={control}
            name="vesselName"
            render={({ field }) => (
              <Select
                id="vesselName"
                showSearch
                placeholder="Selecciona embarcación"
                optionFilterProp="label"
                value={field.value ?? undefined}
                onChange={(val) => field.onChange(val)}
                options={vassels.map((v) => ({ label: v.name, value: v.name }))}
              />
            )}
          />
          {errors.vesselName && (
            <p className="mt-1 text-xs text-red-600">{errors.vesselName.message as string}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="flex flex-col md:col-span-2">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="maintenanceReason"
          >
            <FileTextOutlined className="text-gray-600" /> Motivo / Descripción
          </label>
          <Controller
            control={control}
            name="maintenanceReason"
            render={({ field }) => (
              <TextArea
                id="maintenanceReason"
                placeholder="Describe la tarea de mantenimiento"
                autoSize={{ minRows: 3 }}
                {...field}
                value={field.value ?? ""}
                status={errors.maintenanceReason ? "error" : undefined}
              />
            )}
          />
          {errors.maintenanceReason && (
            <p className="mt-1 text-xs text-red-600">
              {errors.maintenanceReason.message as string}
            </p>
          )}
        </div>
        {/* Tipo de mantenimiento */}
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="maintenanceType"
          >
            <ToolOutlined className="text-gray-600" /> Tipo de mantenimiento
          </label>
          <Controller
            control={control}
            name="maintenanceType"
            render={({ field }) => (
              <Select
                id="maintenanceType"
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                options={[
                  { label: "Preventivo", value: "PREVENTIVO" },
                  { label: "Correctivo", value: "CORRECTIVO" },
                ]}
              />
            )}
          />
        </div>
        {/* Estado */}
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="status"
          >
            <FlagOutlined className="text-gray-600" /> Estado
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                id="status"
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                options={[
                  { label: "Solicitado", value: "SOLICITADO" },
                  { label: "En proceso", value: "EN_PROCESO" },
                  { label: "Esperando insumos", value: "ESPERANDO_INSUMOS" },
                  { label: "Finalizado", value: "FINALIZADO" },
                  { label: "Anulado", value: "ANULADO" },
                  { label: "Rechazado", value: "RECHAZADO" },
                ]}
              />
            )}
          />
        </div>
        {/* Fechas */}
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="scheduledAt"
          >
            <ScheduleOutlined className="text-gray-600" /> Fecha Programada
          </label>
          <Controller
            control={control}
            name="scheduledAt"
            render={({ field }) => (
              <DatePicker
                id="scheduledAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="startedAt"
          >
            <FieldTimeOutlined className="text-gray-600" /> Fecha Inicio
          </label>
          <Controller
            control={control}
            name="startedAt"
            render={({ field }) => (
              <DatePicker
                id="startedAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <label
            className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700"
            htmlFor="finishedAt"
          >
            <CheckCircleOutlined className="text-gray-600" /> Fecha Fin
          </label>
          <Controller
            control={control}
            name="finishedAt"
            render={({ field }) => (
              <DatePicker
                id="finishedAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        {hideMaintenanceFormDialog && (
          <Button htmlType="button" onClick={hideMaintenanceFormDialog}>
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

export default MaintenanceForm;
