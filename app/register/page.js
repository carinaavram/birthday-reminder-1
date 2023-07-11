'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import classes from '../styles/RegisterPage.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');

    if (!validateEmail() || !validatePassword()) {
      return;
    }

    //check if password and confirm password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-Requested-With': 'XMLHttpRequest', // Adding X-Requested-With header for CSRF protection
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        router.push('/login?success=Account has been created');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed'); // Display a generic error message to the user
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.formContainer} onSubmit={submitHandler}>
        <h1 className={classes.title}>Register</h1>
        <div className={classes.formGroup}>
          <label htmlFor="name_field">Name</label>
          <input
            type="text"
            id="name_field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="email_field">Email address</label>
          <input
            type="email"
            id="email_field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
           {emailError && <p className={classes.error}>{emailError}</p>}
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="password_field">Password</label>
          <input
            type="password"
            id="password_field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p className={classes.error}>{passwordError}</p>}
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="confirm_password_field">Confirm Password</label>
          <input
            type="password"
            id="confirm_password_field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={classes.button}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
