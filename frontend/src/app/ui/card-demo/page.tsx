"use client";

import React from "react";
import Card from "@/components/UI/Card";

export default function CardDemoPage() {
    return (
        <div style={{display:"flex", justifyContent:"center", marginTop: "5%"}}>
        <Card title='Prueba' counter='123456'></Card>
        </div>
    )

}