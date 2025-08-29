// Environment configuration utility
const config = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/sentiment',
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  healthCheckUrl: process.env.REACT_APP_HEALTH_CHECK_URL || 'http://localhost:5000/health',
  
  // Application Settings
  appName: process.env.REACT_APP_NAME || 'Sentiment Analysis Storybook',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  
  // Feature Flags
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDebugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  enableMockData: process.env.REACT_APP_ENABLE_MOCK_DATA === 'true',
  
  // UI Configuration
  defaultTheme: process.env.REACT_APP_DEFAULT_THEME || 'light',
  showLoadingAnimations: process.env.REACT_APP_SHOW_LOADING_ANIMATIONS !== 'false',
  
  // Learning Settings
  defaultLearningLevel: process.env.REACT_APP_DEFAULT_LEARNING_LEVEL || 'beginner',
  maxTextLength: parseInt(process.env.REACT_APP_MAX_TEXT_LENGTH) || 5000,
  
  // Helper methods
  isDevelopment: () => config.environment === 'development',
  isProduction: () => config.environment === 'production',
  
  // Validate configuration
  validate: () => {
    const required = [
      'apiBaseUrl',
      'backendUrl',
      'healthCheckUrl'
    ];
    
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      console.warn('Missing required environment variables:', missing);
    }
    
    return missing.length === 0;
  }
};

// Validate configuration on load (only in development)
if (config.enableDebugMode) {
  config.validate();
  console.log('Environment Configuration Loaded:', {
    environment: config.environment,
    apiBaseUrl: config.apiBaseUrl,
    backendUrl: config.backendUrl,
    enableDebugMode: config.enableDebugMode
  });
}

export default config;
