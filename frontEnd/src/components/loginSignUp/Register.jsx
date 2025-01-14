import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
    const password = watch("pass");
  const handleUserData = (data) => {
    axios
      .post("http://localhost:2024/api/register", { data })
      .then(() => { alert("user registerd successfully"); navigate("/login") })
      .catch((err) => alert(err.response.data.message));
  };
  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(handleUserData)}>
        <input
          placeholder="firstName"
          autoFocus
          type="text"
          id="firstname"
          {...register("firstname", {
            required: "Please Enter firstname",
          })}
        />
        {errors.firstname && <span>{errors.firstname.message}</span>}
        <input
          placeholder="lastName"
          type="text"
          id="lastname"
          {...register("lastname", {
            required: "please enter last name",
          })}
        />
        {errors.lastname && <span>{errors.lastname.message}</span>}
        <input
          placeholder="email"
          id="email"
          {...register("email", {
            required: "Email required",
            validate: (val) => {
              if (!val.includes("@")) return "email should have @ char";
            },
          })}
        />
        {errors.email && <span>{errors.email.message} </span>}
        <input
          placeholder="password"
          type="password"
          id="password"
          {...register("pass", {
            required: "password required",
            minLength: {
              value: 6,
              message: "password must be at least six char",
            },
          })}
        />{" "}
        {errors.pass && <span>{errors.pass.message}</span>}
        <input
          placeholder="confirmPassword"
          type="password"
          id="confirmpassword"
          {...register("confirmpass", {
            required: "password required",
            validate: (value) => {
              if (value !== password) return "Password do not match";
            },
          })}
        />
        {errors.confirmpass && <span>{errors.confirmpass.message}</span>}
        <button>Create Account</button>{" "}
        <p>
          Do you already have an account?<Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
