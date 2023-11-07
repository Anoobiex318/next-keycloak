import React from 'react';
import DashboardLayout from './Layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { Card, CardContent, Typography, Avatar, Grid, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Head from 'next/head'; 
const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Dashboard</title> 
      </Head>
    <DashboardLayout>
      <Card sx={{ display: 'flex', maxWidth:650, margin: 'auto', mt: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography gutterBottom variant="h5">
                {session?.user?.name ?? 'Unknown User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                 Email: {session?.user?.email ?? 'No email'}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main' }}>
                  <AccountCircleIcon sx={{ fontSize: '3rem' }} />
                </Avatar>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
      </Card>
    </DashboardLayout>
    </>
  );

}

export default Dashboard;
