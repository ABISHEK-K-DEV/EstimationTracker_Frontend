import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'
import theme from './theme/theme'
import { AuthProvider } from './context/AuthContext'
import axios from 'axios'

// Set base URL for API calls
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Set default headers
axios.defaults.headers.post['Content-Type'] = 'application/json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)