import Link from 'next/link';
import classes from './styles/HomePage.module.css';

export default function Home() {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Never Forget a Birthday Again!</h1>
      <p className={classes.description}>
        Let us handle the task of remembering birthdays for you, so you can
        focus on celebrating and making memories.
      </p>
      <div>
        <div className={classes.buttonGroup}>
          <button className={classes.button}>
            <span className={classes.buttonText}>
              <Link href="/login">Login</Link>
            </span>
            <span className={classes.buttonIcon}>&#10148;</span>
          </button>
          <button className={`${classes.button} ${classes.registerButton}`}>
            <span className={classes.buttonText}>
              Not a member?
              <Link href="/register"> Signup</Link>
            </span>
            <span className={classes.buttonIcon}>&#10148;</span>
          </button>
        </div>
      </div>
      <div className={classes.imageContainer}>
        <img
          src="https://media-api.xogrp.com/images/df1be9be-d60a-4723-ab51-f1091ecb1d4c~cr_0.0.988.662"
          alt="people celebrating"
          className={classes.image}
        />
      </div>
    </div>
  );
}
