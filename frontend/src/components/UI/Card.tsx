import React from "react";
import { CardInterface } from "@/types/card";

const Card = ({ title, body, counter }: CardInterface) => {
  return (
    <div
      className="card"
      // TEMPORAL, pasar a css
      style={{
        display: "flex",
        backgroundColor: "white",
        color: "#2E2E48",
        boxShadow: "0px 4px 4px #FFFFFF40",
        width: "25%",
        minWidth: "380px",
        borderRadius: "30px",
        padding: "16px",
        justifyContent: "center",
      }}
    >
      <div
        className="card-content"
        style={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        <h4
          className="card-title"
          style={{
            fontSize: "26px",
            textAlign: "center",
          }}
        >
          {title}
        </h4>
        <p>
          {body}
          {/* Falta definir estilos para body*/}
        </p>
        <p
          style={{
            fontSize: "46px",
            textAlign: "center",
          }}
        >
          {counter}
        </p>
      </div>
    </div>
  );
};

export default Card;
