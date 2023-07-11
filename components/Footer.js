import classes from './Footer.module.css';

const Footer = () => {
  return (
    <div className={classes.footerContainer}>
        <hr className={classes.divider} />
        <p className={classes.copyright}>
          &copy; {new Date().getFullYear()} BirthdayReminder. All rights
          reserved.
        </p>
      </div>
  );
};

export default Footer;
