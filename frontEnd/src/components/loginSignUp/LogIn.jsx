import axios from "axios";
import "./login.css";
import { useForm } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
const LogIn = () => {
    const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
    const handlelogin = (data) => {
        axios.post("http://localhost:2024/api/login", { data })
            .then((result) => navigate('/',{state:result.data.message}))
      .catch((err) => alert(err));
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit(handlelogin)}>
        <h2>Log In</h2>
        <input
          autoFocus
          placeholder="Enter your Email"
          name=""
          id="email"
          {...register("email", {
            required: "email required",
            validate: (value) => {
              if (!value.includes("@")) return "email should include @ char";
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
        <input
          type="password"
          placeholder="Password"
          name=""
          id="password"
          {...register("pass", {
            required: "password required",
            minLength: {
              value: 6,
              message: "Password should be at least 6 char",
            },
          })}
        />
        {errors.pass && <span>{errors.pass.message}</span>}
        <label htmlFor="remember">
          <input type="checkbox" id="remember" />
          Remember me
        </label>
        <button>Log In</button>
      </form>
      <div>
        <p>
          do not have an account? <Link to="/register"> Create Account</Link>
        </p>
        {/* <Link to="/forgot"> Forgot password</Link> */}
      </div>
    </div>
  );
};

export default LogIn;
