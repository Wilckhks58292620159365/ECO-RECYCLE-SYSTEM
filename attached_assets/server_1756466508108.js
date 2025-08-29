import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Container, AppBar, Toolbar, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PlayCircle, TrendingUp, Restore, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot.tsx';


const LandingPage = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // تحقق من وجود التوكن
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // جلب بيانات المستخدم
    if (token) {
      fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setIsAdmin(data?.role === 'admin');
        })
        .catch(() => setProfile(null));
    } else {
      setProfile(null);
      setIsAdmin(false);
    }
  }, []);

  // بعد تسجيل الدخول: تحويل حسب الدور
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      navigate('/admin');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setProfile(null);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar position="fixed" color="transparent" sx={{ backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          {!isLoggedIn ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ borderRadius: '50px' }}
              >
                تسجيل الدخول
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #00ff88, #00ccff)',
                  color: 'white',
                }}
              >
                إنشاء حساب
              </Button>
            </>
          ) : (
            <>
              <IconButton onClick={handleProfileMenu} color="inherit">
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem disabled>
                  {profile ? `${profile.firstName || ''} ${profile.lastName || ''}` : 'User'}
                </MenuItem>
                <MenuItem disabled>
                  {profile ? profile.email : ''}
                </MenuItem>
                <MenuItem onClick={handleLogout}>تسجيل خروج</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: 8,
        }}
      >
        {/* Background Animation */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
          animate={{
            background: [
              'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
              'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h1" color="primary" gutterBottom>
                  EcoRecycle
                </Typography>
                <Typography variant="h4" color="secondary" gutterBottom>
                  Recycle Like a Pro
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  انضم إلى مجتمعنا وابدأ في إعادة التدوير مع أنيميشن مبهر ونظام نقاط رائع!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayCircle />}
                      sx={{
                        background: 'linear-gradient(45deg, #00ff88, #00ccff)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                      }}
                      onClick={() => isLoggedIn ? navigate('/waste') : navigate('/login')}
                    >
                      رفع المخلفات
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<TrendingUp />}
                      sx={{
                        color: '#ff0066',
                        borderColor: '#ff0066',
                        borderRadius: '50px',
                        px: 4,
                      }}
                    >
                      استكشف
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ textAlign: 'center' }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Restore
                      sx={{
                        fontSize: '10rem',
                        color: '#00ff88',
                        filter: 'drop-shadow(0 0 20px #00ff88)',
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
        {/* زر المحادثة */}
        <Chatbot />
      </Box>
    </Box>
  );
};

export default LandingPage;
