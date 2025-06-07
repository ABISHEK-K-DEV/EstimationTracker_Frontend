import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.95)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    info: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    surface: {
      main: '#1e293b',
      light: '#334155',
      dark: '#0f172a',
    },
    accent: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Fira Code", "Source Code Pro", "Monaco", "Consolas", monospace',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
    },
    h2: {
      fontWeight: 600,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '0.005em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body1: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.015em',
    },
    code: {
      fontFamily: '"JetBrains Mono", "Fira Code", "Source Code Pro", monospace',
      fontSize: '0.875rem',
      fontWeight: 400,
      backgroundColor: 'rgba(100, 116, 139, 0.12)',
      padding: '2px 6px',
      borderRadius: '4px',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#1e293b',
          borderRadius: '10px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(135deg, #475569, #64748b)',
          borderRadius: '10px',
          border: '2px solid #1e293b',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'linear-gradient(135deg, #64748b, #94a3b8)',
        },
        body: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'code': {
          fontFamily: '"JetBrains Mono", "Fira Code", "Source Code Pro", monospace',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid transparent',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
          },
        },
        outlined: {
          border: '1px solid rgba(59, 130, 246, 0.5)',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            border: '1px solid rgba(59, 130, 246, 0.8)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 16,
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'subtract',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'subtract',
          },
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            '&::before': {
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6))',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            transition: 'all 0.3s ease',
            fontFamily: '"Inter", sans-serif',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.5)',
            },
            '&.Mui-focused': {
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.8)',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#3b82f6',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#f8fafc',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
          fontFamily: '"JetBrains Mono", monospace',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        colorPrimary: {
          background: 'rgba(37, 99, 235, 0.2)',
          color: '#60a5fa',
          border: '1px solid rgba(37, 99, 235, 0.3)',
        },
        colorSecondary: {
          background: 'rgba(139, 92, 246, 0.2)',
          color: '#a78bfa',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
        colorSuccess: {
          background: 'rgba(5, 150, 105, 0.2)',
          color: '#34d399',
          border: '1px solid rgba(5, 150, 105, 0.3)',
        },
        colorWarning: {
          background: 'rgba(217, 119, 6, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(217, 119, 6, 0.3)',
        },
        colorError: {
          background: 'rgba(220, 38, 38, 0.2)',
          color: '#f87171',
          border: '1px solid rgba(220, 38, 38, 0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(59, 130, 246, 0.1)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
            color: '#60a5fa',
            borderLeft: '3px solid #3b82f6',
            transform: 'translateX(6px)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.4) 0%, rgba(124, 58, 237, 0.4) 100%)',
            },
            '& .MuiListItemIcon-root': {
              color: '#60a5fa',
            },
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            color: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
          },
          '& .MuiTableBody-root .MuiTableRow-root': {
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.05)',
              transform: 'scale(1.01)',
            },
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(100, 116, 139, 0.1)',
            color: '#cbd5e1',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
            boxShadow: '0 12px 40px rgba(37, 99, 235, 0.6)',
            transform: 'scale(1.1) translateY(-2px)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          backgroundColor: 'rgba(100, 116, 139, 0.2)',
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
    '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
    ...Array(19).fill('none'), // Fill remaining shadow levels
  ],
});

export default theme;