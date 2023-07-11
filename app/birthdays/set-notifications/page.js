'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Card from '@/components/UI/Card';
import { useRouter } from 'next/navigation';

import classes from '@/app/styles/SetNotificationPage.module.css';
import Loading from '@/app/loading';

function NotificationsPage() {
  const [notificationDays, setNotificationDays] = useState('');
  const [receiveEmailNotification, setReceiveEmailNotification] =
    useState(true);
  const session  = useSession();
  const router = useRouter();

  useEffect(() => {
    // Fetch user's notification settings from the backend
    if (session.data?.user?.email) {
      const fetchNotificationSettings = async () => {
        try {
          const response = await fetch(
            `/api/notifications?userEmail=${session.data.user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            const { notificationDays, receiveEmailNotification } = data;
            setNotificationDays(notificationDays.toString());
            setReceiveEmailNotification(receiveEmailNotification);
          } else {
            console.log('Failed to fetch notification settings');
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchNotificationSettings();
    }
  }, [session.data?.user?.email]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (notificationDays < 1) {
      return;
    }

    try {
      //Updating the notificationDays in the db
      const response = await fetch('http://localhost:3000/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session.data.user.email,
          notificationDays: Number(notificationDays),
          receiveEmailNotification,
        }),
      });
      if (response.ok) {
        window.alert('Notifications set succesfully!');
        router.push('..');
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEmailNotificationChange = () => {
    setReceiveEmailNotification((prevState) => !prevState);
  };

  if (!session.data?.user?.email) {
    return <Loading/>;
  }

  return (
    <Card>
      <div className={classes.container}>
        <h2 className={classes.title}>Email Notifications</h2>
        <form onSubmit={handleFormSubmit}>
          <div className={classes.formGroup}>
            <label
              htmlFor="emailNotifications"
              className={classes.checkboxLabel}
            >
              Receive email notifications for upcoming birthdays
            </label>
            <input
              id="emailNotifications"
              type="checkbox"
              checked={receiveEmailNotification}
              onChange={handleEmailNotificationChange}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="notificationDaysInput" className={classes.label}>
              Select how many days in advance to receive birthday reminders:
            </label>
            <input
              id="notificationDaysInput"
              type="number"
              value={notificationDays}
              onChange={(event) => setNotificationDays(event.target.value)}
              min={1}
              max={20}
              className={classes.input}
              disabled = {!receiveEmailNotification}
            />
          </div>
          <button type="submit" className={classes.button}>
            Save Notification Settings
          </button>
        </form>
      </div>
    </Card>
  );
}

export default NotificationsPage;
