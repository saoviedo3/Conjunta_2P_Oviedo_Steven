import React, { useState, useEffect } from "react"; 
import { Table, Container, Alert, Button, Modal, Form } from "react-bootstrap";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";

const Matricula = () => {
  const [courses, setCourses] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [selectedCourseId, setSelectedCourseId] = useState(null); 
  const [selectedCourseUsers, setSelectedCourseUsers] = useState([]); 
  const [selectedUserId, setSelectedUserId] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8005/api/cursos");
        if (!response.ok) throw new Error("Error al obtener los cursos.");
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8004/api/usuarios");
        if (!response.ok) throw new Error("Error al obtener los usuarios.");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
    fetchUsers();
  }, []);

  const handleShowUsers = (courseId, users) => {
    setSelectedCourseId(courseId);
    setSelectedCourseUsers(users);
    setShowModal(true);
  };

  const handleAddUser = async () => {
    try {
      const body = { id: parseInt(selectedUserId) };
      const response = await fetch(
        `http://localhost:8005/api/cursos/${selectedCourseId}/usuarios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error("No se pudo matricular al usuario.");

      const newUser = users.find((user) => user.id === body.id);
      setSelectedCourseUsers((prevUsers) => [...prevUsers, newUser]);

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourseId
            ? { ...course, usuarios: [...course.usuarios, newUser] }
            : course
        )
      );

      setSuccessMessage("Usuario matriculado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setError(null), 3000);
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowModal(false); 
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8005/api/cursos/${selectedCourseId}/usuarios/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("No se pudo desmatricular al usuario.");

      setSelectedCourseUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourseId
            ? { ...course, usuarios: course.usuarios.filter((user) => user.id !== userId) }
            : course
        )
      );

      setSuccessMessage("Usuario desmatriculado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setError(null), 3000);
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowModal(false); 
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="my-5">
        <h1 className="text-center page-title">Gestión de Matrícula</h1>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive="sm" className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre del Curso</th>
              <th>Usuarios Matriculados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>{course.nombre}</td>
                <td>{course.usuarios.length}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleShowUsers(course.id, course.usuarios)}
                  >
                    Ver Matrícula
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Footer />

      {/* Modal para gestionar matrícula */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Matrícula de Usuarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive="sm" className="mb-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourseUsers.length > 0 ? (
                selectedCourseUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.email}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Desmatricular
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay usuarios matriculados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Form>
            <Form.Group controlId="formUserSelect">
              <Form.Label>Seleccionar Usuario para Matricular</Form.Label>
              <Form.Control
                as="select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Seleccione un usuario</option>
                {users
                  .filter(
                    (user) =>
                      !selectedCourseUsers.some(
                        (matriculado) => matriculado.id === user.id
                      )
                  )
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nombre} {user.apellido}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddUser} disabled={!selectedUserId}>
            Matricular Usuario
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Matricula;
