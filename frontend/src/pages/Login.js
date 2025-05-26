import { useState } from "react";
import axios from "axios";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        correo,
        password,
      });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      alert("Login exitoso");
    } catch (err) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}

export default Login;
