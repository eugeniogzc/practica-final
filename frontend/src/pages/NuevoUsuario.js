import { useState } from "react";
import axios from "axios";

export default function NuevoUsuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3001/api/usuarios",
        { nombre, correo, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Usuario creado con éxito!");
    } catch (err) {
      alert("Error al crear usuario!");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Crear nuevo usuario</h2>
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Crear</button>
    </div>
  );
}
