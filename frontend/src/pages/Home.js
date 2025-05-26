import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:3001/api/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuarios(res.data);
      } catch (err) {
        setError("No autorizado o error al cargar usuarios");
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div>
      <h2>Usuarios registrados</h2>
      {error && <p>{error}</p>}
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
