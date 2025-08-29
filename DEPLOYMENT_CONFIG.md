# Environment Configuration Guide

This document explains how to configure the environment variables for both frontend and backend applications for different deployment environments.

## Frontend Environment Variables

### Development (.env)
- Used for local development
- API points to localhost backend

### Production (.env.production)
- Used for production deployment
- **Update the following URLs when deploying:**
  - `REACT_APP_API_BASE_URL`: Replace with your hosted backend API URL
  - `REACT_APP_BACKEND_URL`: Replace with your hosted backend URL
  - `REACT_APP_HEALTH_CHECK_URL`: Replace with your hosted backend health endpoint

## Backend Environment Variables

### Development (.env)
- Used for local development
- CORS allows localhost frontend

### Production (.env.production)
- Used for production deployment
- **Update the following before deploying:**
  - `FRONTEND_URL`: Replace with your hosted frontend URL for CORS
  - `BACKEND_URL`: Replace with your hosted backend URL
  - `API_BASE_URL`: Replace with your hosted API base URL
  - `JWT_SECRET` & `SESSION_SECRET`: Use strong, unique secrets

## Deployment Steps

### For Frontend:
1. Update `.env.production` with your actual hosted backend URLs
2. Build with: `npm run build`
3. Deploy the `build` folder to your hosting service

### For Backend:
1. Update `.env.production` with your actual hosted URLs and secrets
2. Set `NODE_ENV=production` on your hosting service
3. Ensure all environment variables are set on your hosting platform

## Example Production URLs

### If deploying on Netlify/Vercel (Frontend) and Heroku/Railway (Backend):

**Frontend .env.production:**
```
REACT_APP_API_BASE_URL=https://your-app-name.herokuapp.com/api/sentiment
REACT_APP_BACKEND_URL=https://your-app-name.herokuapp.com
REACT_APP_HEALTH_CHECK_URL=https://your-app-name.herokuapp.com/health
```

**Backend .env.production:**
```
FRONTEND_URL=https://your-frontend-app.netlify.app
BACKEND_URL=https://your-app-name.herokuapp.com
API_BASE_URL=https://your-app-name.herokuapp.com/api
```

## Testing Configuration

### Local Testing with Production Config:
```bash
# Frontend
REACT_APP_ENV=production npm start

# Backend
NODE_ENV=production npm start
```

### Health Check:
After deployment, test the endpoints:
- Frontend: `https://your-frontend-url.com`
- Backend Health: `https://your-backend-url.com/health`
- API Endpoint: `https://your-backend-url.com/api/sentiment/info`

## Security Notes

1. Never commit real API keys or secrets to version control
2. Use your hosting platform's environment variable settings
3. Rotate secrets regularly in production
4. Keep development and production secrets separate
