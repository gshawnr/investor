import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../apis/apiClient"; // Adjust the import path as necessary
import { useError } from "../contexts/ErrorContext";

import styles from "./Login.module.css";
import ApiError from "../utils/ApiError";
import { TextField, InputAdornment, IconButton } from "@mui/material";

const initialState = { email: "", password: "" };

const Login: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setError } = useError();

  const { login } = useAuth();

  const validate = () => {
    const errs: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      errs.email = "Email is not valid.";
    }

    if (!form.password.trim()) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }

      const url = `${import.meta.env.VITE_BASE_URL}/users/login`;

      const options = {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      };

      const { token, userId }: any = await apiClient(url, options);

      login({ username: form.email, token, userId });
    } catch (err) {
      const message = (err as Error).message || "unknown error";
      if (err instanceof ApiError) {
        const { status = 500 } = err;
        setError({ message, statusCode: status, source: "Login" });
      } else {
        setError({ message, source: "Login" });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className={styles.background}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Sign In</h2>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email || " "}
            fullWidth
            margin="normal"
            required
            autoComplete="email"
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password || " "}
            fullWidth
            margin="normal"
            required
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
