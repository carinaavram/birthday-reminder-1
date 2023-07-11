'use client';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Card from '@/components/UI/Card';
import Link from 'next/link';
import classes from '@/app/styles/ProfilePage.module.css';
import Loading from '../loading';

const ProfilePage = () => {
  const { data: sessionData } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (sessionData?.user?.email) {
      async function getUser() {
        try {
          const response = await fetch(
            `/api/user?userEmail=${sessionData.user.email}`
          );
          if (response.ok) {
            const user = await response.json();
            setUser(user);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error(error);
          window.alert('Failed to load user data');
        }
      }
      getUser();
    }
  }, [sessionData?.user?.email]);
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (name !== '' && name.trim() === '') {
      window.alert('Name field cannot be empty');
      setIsLoading(false);
      return;
    }
    if (password !== '' && password.length < 8) {
      window.alert('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== '' && !email.match(emailRegex)) {
      window.alert('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    const updatedFields = {};
    if (name !== user.name) {
      updatedFields.name = name;
    }
    if (email !== user.email) {
      updatedFields.email = email;
    }
    if (password !== '') {
      updatedFields.password = password;
    }
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          updatedFields,
        }),
      });
      if (response.ok) {
        window.alert(
          'Your profile is updated succesfully. Please log in again to apply the changes.'
        );
        signOut();
      }
    } catch (error) {
      console.error(error);
      window.alert('Failed to update profile');
    }
    setIsLoading(false);
  };
  if (user === null) {
    return <Loading />;
  }

  return (
    <Card>
      <div className={classes.profile}>
        <h1 className={classes.title}>Your Profile</h1>
        <div className={classes.userInformation}>
          <h2>User Information</h2>
          <p>
            <span className={classes.label}>Name:</span> {user.name}
          </p>
          <p>
            <span className={classes.label}>Email:</span> {user.email}
          </p>
          <h2>Notifications</h2>
          <p>
            {user.receiveEmailNotification ? (
              <>
                <span className={classes.label}>
                  You are currently subscribed to receive email notifications
                  for upcoming birthdays.
                </span>
                <br/>
                <br/>
                <span className={classes.label}>
                  You will receive these notifications {user.notificationDays}{' '}
                  days before the actual birthday.
                </span>
              </>
            ) : (
              <span className={classes.label}>
                Currently, you are not receiving email notifications regarding
                the upcoming birthdays.
              </span>
            )}
          </p>
          <div className={classes.updateNotification}>
            <h3>Update Notifications Settings</h3>
            <p className={classes.link}>
              <Link href="/birthdays/set-notifications">Click here</Link> to
              customize your notification preferences.
            </p>
          </div>
        </div>

        <div className={classes.updateInformation}>
          <h2>Update Your Information</h2>
          <form onSubmit={handleSaveChanges}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            {passwordError && <p className={classes.error}>{passwordError}</p>}
            <button
              type="submit"
              className={classes.button}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default ProfilePage;
