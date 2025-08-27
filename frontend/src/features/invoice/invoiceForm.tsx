// src/components/InvoiceForm.tsx
"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, DatePicker, Space, Typography, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { InvoiceFormValues, invoiceSchema, InvoiceFormInput } from "./invoiceShema";

const { Title } = Typography;

const InvoiceForm = () => {
  // Configuración del formulario
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: "",
      items: [{ productName: "", quantity: 1, price: 1 }], // Valor inicial válido
    },
  });

  // Configuración del array de ítems
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Función que se ejecuta cuando el formulario es válido
  const onSubmit = (rawData: InvoiceFormInput) => {
    // Aseguramos tipos parseando con el esquema
    const data: InvoiceFormValues = invoiceSchema.parse(rawData);
    console.log("Factura enviada:", data);
    alert("Formulario válido. Revisa la consola para ver los datos.");
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <Title level={3}>Crear Factura</Title>

      {/* --- Campos Principales de la Factura --- */}
      <Form.Item
        label="Nombre del Cliente"
        validateStatus={errors.customerName ? "error" : ""}
        help={errors.customerName?.message as string}
      >
        <Input {...register("customerName")} />
      </Form.Item>

      <Form.Item
        label="Fecha de la Factura"
        validateStatus={errors.invoiceDate ? "error" : ""}
        help={errors.invoiceDate?.message as string}
      >
        <Controller
          name="invoiceDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ? dayjs(field.value as unknown as Date) : null}
              onChange={(val) => field.onChange(val)}
              style={{ width: "100%" }}
            />
          )}
        />
      </Form.Item>

      <Divider>Ítems de la Factura</Divider>

      {/* --- Lista Dinámica de Ítems --- */}
      {fields.map((item, index) => (
        <Space key={item.id} style={{ display: "flex", marginBottom: 8 }} align="baseline">
          <Form.Item
            label="Producto"
            validateStatus={errors.items?.[index]?.productName ? "error" : ""}
            help={errors.items?.[index]?.productName?.message as string}
          >
            <Input {...register(`items.${index}.productName`)} placeholder="Nombre del producto" />
          </Form.Item>

          <Form.Item
            label="Cantidad"
            validateStatus={errors.items?.[index]?.quantity ? "error" : ""}
            help={errors.items?.[index]?.quantity?.message as string}
          >
            <Input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            />
          </Form.Item>

          <Form.Item
            label="Precio"
            validateStatus={errors.items?.[index]?.price ? "error" : ""}
            help={errors.items?.[index]?.price?.message as string}
          >
            <Input type="number" {...register(`items.${index}.price`, { valueAsNumber: true })} />
          </Form.Item>

          <Button type="primary" danger onClick={() => remove(index)} icon={<DeleteOutlined />} />
        </Space>
      ))}
      {errors.items?.message && <p style={{ color: "red" }}>{errors.items.message as string}</p>}

      <Form.Item>
        <Button
          type="dashed"
          onClick={() => append({ productName: "", quantity: 1, price: 1 })}
          icon={<PlusOutlined />}
          block
        >
          Agregar Ítem
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar Factura
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InvoiceForm;
