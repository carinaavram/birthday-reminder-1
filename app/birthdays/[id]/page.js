'use client';

import Card from '@/components/UI/Card';
import { useRouter } from 'next/navigation';
import fetcher from '@/helpers/fetcher';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';

import classes from '@/app/styles/AddBirthdayPage.module.css';

export default function Page({ params }) {

  const id = params.id;
  const router = useRouter();

  const { data, error} = useSWR(
    `/api/birthdays/${id}`,
    fetcher
  );

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [gifts, setGifts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eror, setError] = useState(null);

  useEffect(() => {
    if(error){
      return notFound();
    }
    if (data) {
      setName(data.name || '');
      setDate(data.date? data.date.substring(0, 10) : '');
      setGifts(data.gifts || '');
    }
  }, [data, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedBirthday = {
      name,
      date,
      gifts,
    };

    if (
      updatedBirthday.name === data.name &&
      updatedBirthday.date === data.date &&
      updatedBirthday.gifts === data.gifts
    ) {
      // No changes, navigate back to birthdays page
      setIsLoading(false);
      router.push('/birthdays');
      return;
    }

    try {
      const response = await fetch(`/api/birthdays/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBirthday),
      });

      if (!response.ok) {
        throw new Error('Failed to submit birthday form');
      }

      setIsLoading(false);
      router.push('/birthdays');
      router.refresh('/birthdays');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setError('Something went wrong');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this birthday?');
    if (confirmDelete) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/birthdays/${id}`, {method: 'DELETE'});
        if (!response.ok) {
          setError('Failed to delete birthday');
        } else {
          router.push('/birthdays')
          router.refresh('/birthdays');
        }
      }catch (error) {
        console.error(error);
        setError('Database error');
      }
      setIsLoading(false);
    }
  };

  if (eror) return <div>{eror}</div>;


  return (
    <Card>
      <div className={classes.formContainer}>
        <form onSubmit={handleSubmit} >
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label>Gifts:</label>
            <input
              type="text"
              value={gifts}
              onChange={(e) => setGifts(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" style={{backgroundColor: '#808080'}}>Update</button>
            <button type='button' onClick={handleDelete} style={{backgroundColor: '#F87474'}}>Delete</button>
          </div>
        </form>
      </div>
    </Card>
  );
}
