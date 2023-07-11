import Link from 'next/link';
import Card from '../UI/Card';
import classes from './AuthenticatedHome.module.css';

const options = [
  {
    id: '1',
    name: 'View Birthdays',
    description: 'Manage and view your birthdays',
    link: '/birthdays',
  },
  {
    id: '2',
    name: 'Add Birthdays',
    description: 'Add new birthdays to your list',
    link: '/birthdays/add-birthday',
  },
  {
    id: '3',
    name: 'Set Notifications',
    description: 'Configure notifications for upcoming birthdays',
    link: '/birthdays/set-notifications',
  },
  {
    id: '4',
    name: 'View Your Profile',
    description: 'Update your profile information',
    link: '/profile',
  },
];

const AuthenticatedHome = () => {
  return (
    <Card>
      <div className={classes.imageContainer}>
        <img
          src="https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="people celebrating"
          width={800}
          height={800}
          className={classes.image}
        />
        <div className={classes.optionsContainer}>
          <ul className={classes.optionsList}>
            {options.map((op) => (
              <li key={op.id} className={classes.option}>
                <Link href={op.link}>
                  <button>{op.name}</button>
                </Link>
                <p>{op.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AuthenticatedHome;
