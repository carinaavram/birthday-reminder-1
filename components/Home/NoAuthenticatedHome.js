import Link from 'next/link';
import classes from './NoAuthenticatedHome.module.css';
import Card from '../UI/Card';

export default function NoAuthenticatedHome() {
  return (
    <Card>
      <div className={classes.container}>
        <div className={classes.descriptionGroup}>
          <h1 className={classes.title}>Never Forget a Birthday Again!</h1>
          <p className={classes.description}>
            Let us handle the task of remembering birthdays for you, so you can
            focus on celebrating and making memories.
          </p>
          <div className={classes.buttnGroup}>
            <button className={classes.button}>
              <span className={classes.buttonText}>
                <Link href="/login">Get Started</Link>
              </span>
              <span className={classes.buttonIcon}>&#10148;</span>
            </button>
          </div>
        </div>
        <div className={classes.imageContainer}>
          <img
            src="https://media-api.xogrp.com/images/df1be9be-d60a-4723-ab51-f1091ecb1d4c~cr_0.0.988.662"
            alt="people celebrating"
            width={800}
            height={800}
            className={classes.image}
          />
        </div>
      </div>
    </Card>
  );
}
