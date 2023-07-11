'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/UI/Card';
import classes from '@/app/styles/AddBirthdayPage.module.css';

const AddBirthday = () => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [gifts, setGifts] = useState('');
  const session = useSession();
  const router = useRouter()
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const birthdayData = {
      date,
      name,
      gifts: gifts.split(',').map((gift) => gift.trim()), // Convert gifts to an array
      email: session.data.user.email,
    };

    try {
      const response = await fetch('/api/birthdays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(birthdayData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit birthday form');
      }

      // Clear the form fields
      setDate('');
      setName('');
      setGifts('');

      window.alert('Birthday created succesfully!');
      router.refresh('/birthdays');
      router.push('/birthdays');
    } catch (error) {
      console.log('Something went wrong', error);
      window.alert('Failed to submit birthday form');
    }
  };

  const cancelHandler = () => {
    router.push('..');
  }

  return (
    <Card>
      <div className={classes.formContainer}>
        <form onSubmit={handleSubmit}>
          <h2>Add Birthday</h2>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Gifts (comma-separated):</label>
            <input
              type="text"
              value={gifts}
              onChange={(e) => setGifts(e.target.value)}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={cancelHandler}>Cancel</button>
        </form>
      </div>
    </Card>
  );
};

export default AddBirthday;
