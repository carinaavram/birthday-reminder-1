import classes from './Footer.module.css';

const Footer = () => {
    return (
      <footer className={classes.footer}>
        <hr className={classes.divider} />
        <p className={classes.copyright}>
          &copy; {new Date().getFullYear()} BirthdayReminder. All rights reserved.
        </p>
      </footer>
    );
  };
  
  export default Footer;