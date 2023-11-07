import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Head from 'next/head';



const IndexPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Delay the loading spinner by 1 second (1000 milliseconds)
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 1000);

    if (status === 'authenticated') {
      clearTimeout(timer); // Clear the timer if the user is authenticated
      router.push('/dashboard');
    } else if (status === 'unauthenticated') {
      signIn('keycloak'); // Redirect to Keycloak's login page
    }

    return () => clearTimeout(timer); // Clean up the timer when the component unmounts
  }, [session, status, router]);

  if (status === 'loading' && showLoading) {
    // Show the loading spinner only after the delay
    return (
      <Box
        sx={{
          position: 'fixed', // Fixed position
          top: 0,
          left: 0,
          width: '100%', // Full width
          height: '100%', // Full height
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          zIndex: 1300, // Higher than the AppBar
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center', // Center vertically
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render nothing or a minimal placeholder until the loading state kicks in
  return null;
};

export default IndexPage;
