import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/auth/register", form);
    login(data);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input name="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input name="password" placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;