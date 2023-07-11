'use client';

import { useSession } from 'next-auth/react';
import AuthenticatedHome from '@/components/Home/AuthenticatedHome';
import NoAuthenticatedHome from '@/components/Home/NoAuthenticatedHome';
import Loading from './loading';
const Home = () => {
  const session = useSession();
  if (session.status === 'loading') return <Loading/>
  if (session.status === 'authenticated'){
    return <AuthenticatedHome />
  } else {
    return <NoAuthenticatedHome />;
  }
};
export default Home;
