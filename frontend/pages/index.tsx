import type { NextPage } from 'next'
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL, URL } from '../constants/url';
import styles from '../styles/Home.module.css'

interface AuthData {
  email: string;
  password: string;
  username: string;
}

const Home: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const validate = ({ username, password, email }: AuthData) => {
    return username.trim() || password.trim() || email.trim();
  };

  const signUp = async (e: FormEvent) => {
    e.preventDefault();

    const isValid = validate({ username, password, email });

    if (!isValid) return;

    const response = await fetch(`${BASE_URL}${URL.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();

    if (data.message === 'User already exists') {
      toast.error('This username is taken', {
        type: 'error',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    if (data.error === null) {
      toast('Successfully registered!', {
        type: 'success',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={signUp} className={styles.content}>
          <input autoComplete="username" placeholder="username" type="text" value={username} onChange={({ target: { value } }) => setUsername(value)} />
          <input autoComplete="email" placeholder="email" type="email" value={email} onChange={({ target: { value } }) => setEmail(value)} />
          <input autoComplete="current-password" placeholder="password" type="password" value={password} onChange={({ target: { value } }) => setPassword(value)} />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </>
  );
}

export default Home
