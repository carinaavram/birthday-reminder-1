import Link from 'next/link';
import dbConnect from '@/config/dbConnect';
import Birthday from '@/models/birthday';
import { getServerSession } from 'next-auth';
import Card from '@/components/UI/Card';
import classes from '@/app/styles/BirthdaysPage.module.css';
import BirthdayItem from '@/components/BirthdayItem';
import formatDate from '@/helpers/formatDate';

export async function getBirthdays(userEmail) {
  try {
    dbConnect();
    const birthdays = await Birthday.find({ email: userEmail });
    return birthdays;
  } catch (error) {
    throw new Error('Database Error');
  }
}

export default async function BirthdaysPage() {
  const session = await getServerSession();
  const userEmail = session.user.email;

  const birthdays = await getBirthdays(userEmail);

  const birthdayList = birthdays.map((birthday) => (
    <div key={birthday._id}>
      <div className={classes.actions}>
        <Link href={`/birthdays/${birthday._id}`}>Edit</Link>
      </div>
      <BirthdayItem
        date={formatDate(birthday.date)}
        name={birthday.name}
        gifts={birthday.gifts.join(', ')}
      />
    </div>
  ));

  const cardStyle = {
    backgroundColor: 'rgba(238, 235, 178, 0.8)',
    maxHeight: '800px',
    overflowY: 'auto',
  };

  return (
    <section className={classes.birthdays}>
      <h2>Your Birthdays</h2>
      <Card style={cardStyle}>
        {birthdays.length > 0 ? (
          <ul className={classes.birthdayList}>{birthdayList}</ul>
        ) : (
          <p>No birthdays found!</p>
        )}
        <Link href="birthdays/add-birthday" className={classes.addLink}>
          Add Birthday
        </Link>
      </Card>
    </section>
  );
}
