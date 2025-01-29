import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";

const Home = () => {
  return (
    <>
      <AppNavbar />
      <div className="hero-section text-center text-white d-flex align-items-center justify-content-center">
        <div>
          <h1 className="display-4">Bienvenido a Gestión de Conciertos</h1>
          <p className="lead">Administra conciertos y canciones de manera fácil y eficiente.</p>
          <Button variant="primary" size="lg" className="mt-3">
            Explorar
          </Button>
        </div>
      </div>
      <Container className="my-5">
        <Row>
          <Col md={6} className="text-center mb-4">
            <div className="feature-card shadow p-4 bg-white rounded">
              <FontAwesomeIcon icon={faMusic} size="3x" className="mb-3 text-primary" />
              <h4>Gestión de Canciones</h4>
              <p>Administra tu lista de canciones con opciones avanzadas.</p>
              <Button variant="outline-primary">Ir a Canciones</Button>
            </div>
          </Col>
          <Col md={6} className="text-center mb-4">
            <div className="feature-card shadow p-4 bg-white rounded">
              <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="mb-3 text-success" />
              <h4>Gestión de Conciertos</h4>
              <p>Organiza y gestiona tus conciertos de manera eficiente.</p>
              <Button variant="outline-success" >Ir a Conciertos</Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
