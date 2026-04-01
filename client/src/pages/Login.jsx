import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/auth/login", form);
    login(data);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input name="password" placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <button>Login</button>
        <Link to="/register">Register</Link>
      </form>
    </div>
  );
};

export default Login;