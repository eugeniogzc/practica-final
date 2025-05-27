import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [ediciones, setEdiciones] = useState({});
  const token = localStorage.getItem("token");

  const cargarUsuarios = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      alert("No autorizado o error al cargar usuarios");
    }
  }, [token]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const eliminarUsuario = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Usuario eliminado");
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar usuario");
    }
  };

  const actualizarUsuario = async (id) => {
    const nuevoNombre = ediciones[id];
    if (!nuevoNombre) return alert("Ingresa un nombre válido");

    try {
      await axios.put(
        `http://localhost:3001/api/usuarios/${id}`,
        { nombre: nuevoNombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Usuario actualizado");
      setEdiciones({ ...ediciones, [id]: "" });
      cargarUsuarios();
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div>
      <h2>Usuarios registrados</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre}
            <input
              type="text"
              placeholder="Nuevo nombre"
              value={ediciones[u.id] || ""}
              onChange={(e) =>
                setEdiciones({ ...ediciones, [u.id]: e.target.value })
              }
            />
            <button onClick={() => actualizarUsuario(u.id)}>Actualizar</button>
            <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
