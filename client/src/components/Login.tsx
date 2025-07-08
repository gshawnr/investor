import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../apis/apiClient"; // Adjust the import path as necessary
import { useError } from "../contexts/ErrorContext";

import styles from "./Login.module.css";
import ApiError from "../utils/ApiError";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const { error, clearError, setError } = useError();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLocalError("");
      if (!email || !password) {
        setLocalError("Please enter both email and password.");
        return;
      }

      const url = `${import.meta.env.VITE_BASE_URL}/users/login`;

      const options = {
        method: "POST",
        body: JSON.stringify({ email, password }),
      };

      const { token, userId }: any = await apiClient(url, options);

      login({ username: email, token, userId });
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

  return (
    <div className={styles.background}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Sign In</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label className={styles.label}>
            Email
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.iconButton}
                aria-label="Toggle password visibility"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <div className={styles.errorPlaceholder}>
            <span className={styles.error}>
              {localError ? localError : "\u00A0"}
            </span>
          </div>

          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
