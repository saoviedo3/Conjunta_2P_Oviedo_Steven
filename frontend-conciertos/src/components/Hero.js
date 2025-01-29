import React from "react";
import { Container, Button } from "react-bootstrap";

const Hero = () => {
  return (
    <div
      style={{
        backgroundImage: "url('https://via.placeholder.com/1920x500')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "100px 0",
        textAlign: "center",
      }}
    >
      <Container>
      <br />
        <h1 className="display-4 fw-bold">¡Bienvenido al Sistema de Gestión de Conciertos!</h1>
        <br />
        <br />
        <p className="lead">
          Administra canciones y conciertos de manera fácil y eficiente.
        </p>
        
      </Container>
    </div>
  );
};

export default Hero;
