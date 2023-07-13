'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

import classes from '../styles/LoginPage.module.css';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();

    setError('');

    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    // Validate password
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (response.error) {
        setError('Login failed. Please check your credentials and try again.');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className={classes.container}>
      <div>
        <div>
          <form className={classes.formContainer} onSubmit={submitHandler}>
            <h1 className={classes.title}>Login</h1>
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

            {error && <p className={classes.error}>{error}</p>}

            <button type="submit" className={classes.button}>
              Sign in
            </button>

            <div className={classes.textCenter}>
              <p>
                Not a member? <Link href="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
