"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputNumber, Button } from "antd";
import { vesselSchema, type VesselFormValues } from "@/features/vessels/schemas/vessel.schema";
import { vesselsService, type Vessel } from "@/features/vessels";
import { showAlert } from "@/utils/showAlert";

interface Props {
  current?: (Vessel & { id?: number }) | null;
  onSaved?: (v: Vessel) => void;
  onCancel?: () => void;
}

export default function VesselsForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VesselFormValues>({
    resolver: zodResolver(vesselSchema),
    defaultValues: current ?? {
      name: "",
      registrationNumber: "",
      ismm: "",
      flagState: "",
      callSign: "",
      portOfRegistry: "",
      rif: "",
      serviceType: "",
      constructionMaterial: "",
      sternType: "",
      fuelType: "",
      navigationHours: 0,
    },
  });

  React.useEffect(() => {
    if (current) {
      reset(current);
    }
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
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} status={errors.name ? "error" : undefined} />}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Matrícula</label>
          <Controller
            name="registrationNumber"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.registrationNumber ? "error" : undefined} />
            )}
          />
          {errors.registrationNumber ? (
            <p className="mt-1 text-xs text-red-600">{errors.registrationNumber.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">ISMM</label>
          <Controller
            name="ismm"
            control={control}
            render={({ field }) => <Input {...field} status={errors.ismm ? "error" : undefined} />}
          />
          {errors.ismm ? <p className="mt-1 text-xs text-red-600">{errors.ismm.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bandera</label>
          <Controller
            name="flagState"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.flagState ? "error" : undefined} />
            )}
          />
          {errors.flagState ? (
            <p className="mt-1 text-xs text-red-600">{errors.flagState.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Señal de llamada</label>
          <Controller
            name="callSign"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.callSign ? "error" : undefined} />
            )}
          />
          {errors.callSign ? (
            <p className="mt-1 text-xs text-red-600">{errors.callSign.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Puerto de registro</label>
          <Controller
            name="portOfRegistry"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.portOfRegistry ? "error" : undefined} />
            )}
          />
          {errors.portOfRegistry ? (
            <p className="mt-1 text-xs text-red-600">{errors.portOfRegistry.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">RIF</label>
          <Controller
            name="rif"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="J-12345678-9"
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
          <label className="mb-1 block text-sm font-medium">Tipo de servicio</label>
          <Controller
            name="serviceType"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.serviceType ? "error" : undefined} />
            )}
          />
          {errors.serviceType ? (
            <p className="mt-1 text-xs text-red-600">{errors.serviceType.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Material de construcción</label>
          <Controller
            name="constructionMaterial"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.constructionMaterial ? "error" : undefined} />
            )}
          />
          {errors.constructionMaterial ? (
            <p className="mt-1 text-xs text-red-600">{errors.constructionMaterial.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de popa</label>
          <Controller
            name="sternType"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.sternType ? "error" : undefined} />
            )}
          />
          {errors.sternType ? (
            <p className="mt-1 text-xs text-red-600">{errors.sternType.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de combustible</label>
          <Controller
            name="fuelType"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.fuelType ? "error" : undefined} />
            )}
          />
          {errors.fuelType ? (
            <p className="mt-1 text-xs text-red-600">{errors.fuelType.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Horas de navegación</label>
          <Controller
            name="navigationHours"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                status={errors.navigationHours ? "error" : undefined}
              />
            )}
          />
          {errors.navigationHours ? (
            <p className="mt-1 text-xs text-red-600">{errors.navigationHours.message as string}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
