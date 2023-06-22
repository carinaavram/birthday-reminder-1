"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import classes from '../styles/RegisterPage.module.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', {
        name, email, password
      })
      router.push('/');

    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <div>
        <div>
          <form
            className={classes.formContainer}
            onSubmit={submitHandler}
          >
            <h1 className={classes.title}>Register</h1>
            <div className={classes.formGroup}>
              <label className="form-label" htmlFor="name_field">
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={classes.formGroup}>
              <label className="form-label" htmlFor="email_field">
                Email address
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={classes.formGroup}>
              <label className="form-label" htmlFor="password_field">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={classes.button}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;