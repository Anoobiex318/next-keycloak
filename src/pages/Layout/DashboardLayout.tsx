import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut, useSession } from 'next-auth/react';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const router = useRouter();
  const handleSignOut = async () => {
    const keycloakIssuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const postLogoutRedirectUri = encodeURIComponent(`${window.location.origin}/`);
    setIsSigningOut(true); // Start the loading spinner

    await signOut({ redirect: false });
    const keycloakLogoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?redirect_uri=${postLogoutRedirectUri}`;
    window.location.href = keycloakLogoutUrl;
  };
   
  useEffect(() => {
    
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    // If the session status is "unauthenticated", redirect to the login page
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const drawerContent = (
    <Box onClick={handleDrawerToggle}  sx={{
        textAlign: 'center',
        mt: { sm: 8 },
      }}
    >
      <List>
        <ListItem >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        {/* Add more list items here */}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1400, // Ensure this is higher than AppBar's zIndex
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size="5rem" />
          </Box>
        )}
         {isSigningOut && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2000, // Make sure this is higher than everything else
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size="5rem" />
        </Box>
      )}
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
    
            <Typography variant="subtitle1" noWrap component="div" sx={{ margin: '0 10px' }}>
             Welcome: <strong>{session?.user?.keycloakUsername ?? 'Unknown User'} </strong> 
            </Typography>
            <AccountCircleIcon sx={{ fontSize: '2rem' }} />
            <Button color="inherit" onClick={handleSignOut}>
            <Tooltip title="Sign Out">
             <LogoutIcon/>
             </Tooltip>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,  top: '55px', },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
        <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
