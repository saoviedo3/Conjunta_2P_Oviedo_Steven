import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button, Modal, Form } from "react-bootstrap";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

const Concerts = () => {
  const [concerts, setConcerts] = useState([]); // Lista de conciertos
  const [songs, setSongs] = useState([]); // Lista de canciones disponibles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Mensaje de éxito
  const [showModal, setShowModal] = useState(false); // Para controlar el modal de canciones asignadas
  const [showAddSongModal, setShowAddSongModal] = useState(false); // Para controlar el modal de agregar canción
  const [showAddConcertModal, setShowAddConcertModal] = useState(false); // Para controlar el modal de agregar concierto
  const [selectedConcertSongs, setSelectedConcertSongs] = useState([]); // Canciones asignadas al concierto seleccionado
  const [selectedConcertId, setSelectedConcertId] = useState(null); // ID del concierto seleccionado
  const [selectedSongId, setSelectedSongId] = useState(""); // Canción seleccionada para asignar
  const [newConcertData, setNewConcertData] = useState({
    nombre: "",
    fecha: "",
    cancionesIds: [],
  });

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch("http://localhost:8005/api/conciertos");
        if (!response.ok) {
          throw new Error("Error al obtener la lista de conciertos");
        }
        const data = await response.json();
        console.log("Conciertos obtenidos:", data);
        setConcerts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:8004/api/canciones");
        if (!response.ok) {
          throw new Error("Error al obtener la lista de canciones");
        }
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchConcerts();
    fetchSongs();
  }, []);

  const handleShowSongs = (concertId, canciones) => {
    console.log("Canciones recibidas desde el concierto:", canciones);

    if (!canciones || canciones.length === 0) {
        console.warn("Este concierto no tiene canciones asignadas.");
        setSelectedConcertSongs([]);
        setShowModal(true);
        return;
    }

    // Buscar las canciones en la lista general `songs`
    const cancionesAsignadas = canciones
        .map((c) => songs.find((song) => song.id === c.cancionId))
        .filter((c) => c !== undefined); // Filtrar valores undefined

    console.log("Canciones asignadas al concierto:", cancionesAsignadas);

    setSelectedConcertId(concertId);
    setSelectedConcertSongs(cancionesAsignadas);
    setShowModal(true);
};


const handleAddSong = async () => {
  try {
      const body = [parseInt(selectedSongId)]; // Enviar un array con un solo ID

      const response = await fetch(
          `http://localhost:8005/api/conciertos/${selectedConcertId}/canciones`,
          {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
          }
      );

      if (!response.ok) {
          throw new Error("No se pudo agregar la canción al concierto");
      }

      // 🔹 Recargar la lista de conciertos desde la API
      const updatedConcertsResponse = await fetch("http://localhost:8005/api/conciertos");
      const updatedConcerts = await updatedConcertsResponse.json();
      setConcerts(updatedConcerts);

      setSuccessMessage("Canción agregada correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowAddConcertModal(false);
        setShowAddSongModal(false);
        setShowModal(false);
  } catch (err) {
      setError("No se pudo agregar la canción al concierto.");
      setTimeout(() => setError(null), 3000);
      setShowAddConcertModal(false);
        setShowAddSongModal(false);
        setShowModal(false);
  }
};




  const handleDeleteSong = async (songId) => {
    try {
        const response = await fetch(
            `http://localhost:8005/api/conciertos/${selectedConcertId}/canciones/${songId}`,
            { method: "DELETE" }
        );

        if (!response.ok) {
            throw new Error("No se pudo eliminar la canción del concierto");
        }

        setSelectedConcertSongs((prevSongs) =>
            prevSongs.filter((song) => song.id !== songId)
        );

        setConcerts((prevConcerts) =>
            prevConcerts.map((concert) =>
                concert.id === selectedConcertId
                    ? {
                        ...concert,
                        cancionesIds: concert.cancionesIds.filter((id) => id !== songId),
                    }
                    : concert
            )
        );

        setSuccessMessage("Canción eliminada correctamente.");
        setTimeout(() => setSuccessMessage(null), 3000);
        setShowAddConcertModal(false);
        setShowAddSongModal(false);
        setShowModal(false);
    } catch (err) {
        setError("No se pudo eliminar la canción del concierto.");
        setTimeout(() => setError(null), 3000);
        setShowAddConcertModal(false);
        setShowAddSongModal(false);
        setShowModal(false);
    }
};


  const handleDeleteConcert = async (concertId, cancionesCount) => {
    if (cancionesCount > 0) {
      setError("No se puede eliminar un concierto con canciones asignadas.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8005/api/conciertos/${concertId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el concierto");
      }

      setConcerts((prevConcerts) => prevConcerts.filter((concert) => concert.id !== concertId));

      setSuccessMessage("Concierto eliminado correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("No se pudo eliminar el concierto.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddConcert = async () => {
    const { nombre, fecha, cancionesIds } = newConcertData;

    if (
      nombre.trim().length === 0 ||
      fecha.trim().length === 0 ||
      cancionesIds.length === 0
    ) {
      setError("Validación fallida: Asegúrese de que el nombre y la fecha no estén vacíos y haya al menos una canción asignada.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const response = await fetch("http://localhost:8005/api/conciertos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConcertData),
      });

      if (!response.ok) {
        throw new Error("No se pudo agregar el concierto");
      }

      const newConcert = await response.json();
      setConcerts((prevConcerts) => [...prevConcerts, newConcert]);

      setSuccessMessage("Concierto agregado correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowAddConcertModal(false);
      setNewConcertData({ nombre: "", fecha: "", cancionesIds: [] }); // Limpia los campos
    } catch (err) {
      setError("No se pudo agregar el concierto.");
      setTimeout(() => setError(null), 3000);
      setShowModal(false);
      setShowAddConcertModal(false);
    }
  };

  const handleConcertInputChange = (e) => {
    const { name, value } = e.target;
    setNewConcertData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <>
      <AppNavbar />
<div className="content">
  <Container className="my-5">
    <h1 className="text-center page-title">Gestión de Conciertos</h1>
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
    <Button
      variant="primary"
      className="mb-3"
      onClick={() => setShowAddConcertModal(true)}
    >
      Agregar un Concierto
    </Button>
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
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Canciones Asignadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {concerts.map((concert, index) => (
            <tr key={concert.id}>
              <td>{index + 1}</td>
              <td>{concert.nombre}</td>
              <td>{new Date(concert.fecha).toLocaleString()}</td>
              <td>{concert.canciones.length}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleShowSongs(concert.id, concert.canciones)}
                  className="mx-1"
                >
                  Ver Canciones
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteConcert(concert.id, concert.canciones.length)}
                  className="mx-1"
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


      {/* Modal para mostrar canciones asignadas */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Canciones Asignadas</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div style={{ overflowX: "auto" }}>
      {selectedConcertSongs && selectedConcertSongs.length > 0 ? (
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
            {selectedConcertSongs.map((cancion, index) => (
              cancion ? (
                <tr key={cancion.id}>
                  <td>{index + 1}</td>
                  <td>{cancion.titulo}</td>
                  <td>{cancion.artista}</td>
                  <td>{cancion.duracion}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteSong(cancion.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No hay canciones asignadas a este concierto.</p>
      )}
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowAddSongModal(true)}>
      Agregar Canción
    </Button>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>



      {/* Modal para agregar canción */}
<Modal show={showAddSongModal} onHide={() => setShowAddSongModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Agregar Canción</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group>
        <Form.Label>Seleccionar Canción</Form.Label>
        <Form.Control
          as="select"
          value={selectedSongId}
          onChange={(e) => setSelectedSongId(e.target.value)}
        >
          <option value="">Seleccione una canción</option>
          {songs.map(
            (song) =>
              !selectedConcertSongs.some((c) => c.id === song.id) && (
                <option key={song.id} value={song.id}>
                  {song.titulo} - {song.artista}
                </option>
              )
          )}
        </Form.Control>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="primary"
      onClick={handleAddSong}
      disabled={!selectedSongId}
    >
      Asignar
    </Button>
    <Button variant="secondary" onClick={() => setShowAddSongModal(false)}>
      Cancelar
    </Button>
  </Modal.Footer>
</Modal>


     {/* Modal para agregar concierto */}
<Modal show={showAddConcertModal} onHide={() => setShowAddConcertModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Agregar Concierto</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Nombre del Concierto */}
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Concierto</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={newConcertData.nombre}
          onChange={handleConcertInputChange}
          placeholder="Ingrese el nombre del concierto"
        />
      </Form.Group>

      {/* Fecha del Concierto */}
      <Form.Group className="mb-3">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="datetime-local"
          name="fecha"
          value={newConcertData.fecha}
          onChange={handleConcertInputChange}
        />
      </Form.Group>

      {/* Selección de Canciones */}
      <Form.Group className="mb-3">
        <Form.Label>Seleccionar Canciones</Form.Label>
        <Form.Control
          as="select"
          multiple
          value={newConcertData.cancionesIds}
          onChange={(e) =>
            setNewConcertData({
              ...newConcertData,
              cancionesIds: [...e.target.selectedOptions].map((option) => parseInt(option.value)),
            })
          }
        >
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.titulo} - {song.artista}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="primary"
      onClick={handleAddConcert}
      disabled={!newConcertData.nombre || !newConcertData.fecha || newConcertData.cancionesIds.length === 0}
    >
      Guardar
    </Button>
    <Button variant="secondary" onClick={() => setShowAddConcertModal(false)}>
      Cancelar
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default Concerts;
