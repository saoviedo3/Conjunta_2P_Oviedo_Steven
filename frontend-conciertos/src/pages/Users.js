import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button, Modal, Form } from "react-bootstrap";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Modal para añadir canción
  const [editingSong, setEditingSong] = useState(null); // Canción seleccionada para editar
  const [formData, setFormData] = useState({
    titulo: "",
    artista: "",
    duracion: "",
  });
  const [validationErrors, setValidationErrors] = useState({}); // Almacena los errores de validación

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:8004/api/canciones");
        if (!response.ok) {
          throw new Error("Error al obtener la lista de canciones");
        }
        const data = await response.json();
        setSongs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8004/api/canciones/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("No se pudo eliminar la canción");
      }
      setSuccessMessage("Canción eliminada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
    } catch (err) {
      setError("No se pudo eliminar la canción.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      titulo: song.titulo,
      artista: song.artista,
      duracion: song.duracion,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8004/api/canciones/${editingSong.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setValidationErrors(errorData.errors || {});
        throw new Error("Validación fallida");
      }

      const updatedSong = await response.json();

      setSongs((prevSongs) =>
        prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song))
      );

      setSuccessMessage("Canción actualizada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowModal(false);
      setValidationErrors({});
    } catch (err) {
      setError("No se pudo actualizar la canción.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAdd = () => {
    setFormData({
      titulo: "",
      artista: "",
      duracion: "",
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = async () => {
    try {
      const response = await fetch("http://localhost:8004/api/canciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setValidationErrors(errorData.errors || {});
        throw new Error("Validación fallida");
      }

      const newSong = await response.json();

      setSongs((prevSongs) => [...prevSongs, newSong]);

      setSuccessMessage("Canción añadida correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowAddModal(false);
      setValidationErrors({});
    } catch (err) {
      setError("No se pudo añadir la canción.");
      setTimeout(() => setError(null), 3000);
      setShowModal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };


  return (
    <>
     <AppNavbar />
<div className="content">
  <Container className="my-5">
    <h1 className="text-center page-title">Gestión de Canciones</h1>
    <div className="mb-3">
      <Button variant="primary" onClick={handleAdd}>
        Agregar Canción
      </Button>
    </div>
    {successMessage && (
      <Alert variant="success" className="text-center">
        {successMessage}
      </Alert>
    )}
    {error && (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    )}
    {loading ? (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <span className="visually-hidden">Cargando...</span>
      </div>
    ) : (
      <Table striped bordered hover responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Artista</th>
            <th>Duración (segundos)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={song.id}>
              <td>{index + 1}</td>
              <td>{song.titulo}</td>
              <td>{song.artista}</td>
              <td>{song.duracion}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="mx-1"
                  onClick={() => handleEdit(song)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="mx-1"
                  onClick={() => handleDelete(song.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Container>
</div>
<Footer />


      {/* Modal para editar una canción */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Editar Canción</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Validación para el Título */}
      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={(e) => {
            if (/^[a-zA-Z0-9\s]*$/.test(e.target.value)) {
              handleInputChange(e); // Solo permite letras, números y espacios
            }
          }}
          isInvalid={!!validationErrors.titulo}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.titulo}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Validación para el Artista */}
      <Form.Group className="mb-3">
        <Form.Label>Artista</Form.Label>
        <Form.Control
          type="text"
          name="artista"
          value={formData.artista}
          onChange={(e) => {
            if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
              handleInputChange(e); // Solo permite letras y espacios
            }
          }}
          isInvalid={!!validationErrors.artista}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.artista}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Validación para la Duración */}
      <Form.Group className="mb-3">
        <Form.Label>Duración (segundos)</Form.Label>
        <Form.Control
          type="number"
          name="duracion"
          value={formData.duracion}
          onChange={(e) => {
            if (/^\d+$/.test(e.target.value)) {
              handleInputChange(e); // Solo permite números positivos
              if (parseInt(e.target.value, 10) >= 10) {
                setValidationErrors((prev) => ({ ...prev, duracion: null }));
              } else {
                setValidationErrors((prev) => ({
                  ...prev,
                  duracion: "La duración debe ser al menos de 10 segundos.",
                }));
              }
            }
          }}
          isInvalid={!!validationErrors.duracion}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.duracion}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancelar
    </Button>
    <Button
      variant="primary"
      onClick={handleSave}
      disabled={
        !!Object.values(validationErrors).find((error) => error) || // Si hay errores
        !formData.titulo ||
        !formData.artista ||
        !formData.duracion
      }
    >
      Guardar
    </Button>
  </Modal.Footer>
</Modal>


      
      {/* Modal para añadir una canción */}
<Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Añadir Canción</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Validación para el Título */}
      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={(e) => {
            if (/^[a-zA-Z0-9\s]*$/.test(e.target.value)) {
              handleInputChange(e); // Solo permite letras, números y espacios
            }
          }}
          isInvalid={!!validationErrors.titulo}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.titulo}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Validación para el Artista */}
      <Form.Group className="mb-3">
        <Form.Label>Artista</Form.Label>
        <Form.Control
          type="text"
          name="artista"
          value={formData.artista}
          onChange={(e) => {
            if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
              handleInputChange(e); // Solo permite letras y espacios
            }
          }}
          isInvalid={!!validationErrors.artista}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.artista}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Validación para la Duración */}
      <Form.Group className="mb-3">
        <Form.Label>Duración (segundos)</Form.Label>
        <Form.Control
          type="number"
          name="duracion"
          value={formData.duracion}
          onChange={(e) => {
            if (/^\d+$/.test(e.target.value)) {
              handleInputChange(e); // Solo permite números positivos
              if (parseInt(e.target.value, 10) >= 10) {
                setValidationErrors((prev) => ({ ...prev, duracion: null }));
              } else {
                setValidationErrors((prev) => ({
                  ...prev,
                  duracion: "La duración debe ser al menos de 10 segundos.",
                }));
              }
            }
          }}
          isInvalid={!!validationErrors.duracion}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.duracion}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
      Cancelar
    </Button>
    <Button
      variant="primary"
      onClick={handleSaveAdd}
      disabled={
        !!Object.values(validationErrors).find((error) => error) || // Si hay errores
        !formData.titulo ||
        !formData.artista ||
        !formData.duracion
      }
    >
      Guardar
    </Button>
  </Modal.Footer>
</Modal>

      
    </>
  );
};

export default Songs;
