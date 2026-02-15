
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' })); // Adjust to match your React dev port
app.use(express.json());

// Auth0 Token Cache
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Obtain Management API Token via M2M Flow
 */
const getManagementApiToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry > (now + 60)) {
    return cachedToken;
  }

  try {
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials'
    });

    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in;
    
    console.log('Successfully obtained new Auth0 Management Token');
    return cachedToken;
  } catch (error) {
    console.error('Failed to obtain Auth0 token:', error.response?.data || error.message);
    throw new Error('Authentication with Management API failed');
  }
};

/**
 * GET /users
 * Returns all users from Auth0 Management API
 */
app.get('/api/users', async (req, res) => {
  try {
    const token = await getManagementApiToken();
    
    const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    res.status(status).json({ error: message });
  }
});

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'active', node: process.version }));

app.listen(PORT, () => {
  console.log(`KNOUX Identity Backend running on port ${PORT}`);
});
