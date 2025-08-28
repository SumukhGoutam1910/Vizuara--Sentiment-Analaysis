const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testTexts = [
  "I am so excited about learning sentiment analysis!",
  "I feel sad because I didn't understand the lesson",
  "This is a neutral statement about the weather"
];

async function testAPI() {
  console.log('🧪 Testing Sentiment Analysis Backend API\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('');

    // Test 2: Root endpoint
    console.log('2. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint working:', rootResponse.data.message);
    console.log('');

    // Test 3: Service info
    console.log('3. Testing service info...');
    const infoResponse = await axios.get(`${BASE_URL}/api/sentiment/info`);
    console.log('✅ Service info retrieved:', infoResponse.data.service);
    console.log('Features:', infoResponse.data.features.length);
    console.log('');

    // Test 4: Basic sentiment analysis
    console.log('4. Testing basic sentiment analysis...');
    const analysisResponse = await axios.post(`${BASE_URL}/api/sentiment/analyze`, {
      text: testTexts[0],
      context: 'educational'
    });
    console.log('✅ Analysis completed:', analysisResponse.data.data.sentiment);
    console.log('Confidence:', analysisResponse.data.data.confidence);
    console.log('');

    // Test 5: Enhanced analysis with context
    console.log('5. Testing enhanced analysis...');
    const enhancedResponse = await axios.post(`${BASE_URL}/api/sentiment/analyze-with-context`, {
      text: testTexts[1],
      learningLevel: 'beginner',
      includeExamples: true,
      includeTips: true
    });
    console.log('✅ Enhanced analysis completed:', enhancedResponse.data.data.sentiment);
    console.log('Explanation:', enhancedResponse.data.data.explanation.substring(0, 100) + '...');
    console.log('');

    // Test 6: Batch analysis
    console.log('6. Testing batch analysis...');
    const batchResponse = await axios.post(`${BASE_URL}/api/sentiment/batch-analyze`, {
      texts: testTexts,
      batchSize: 3,
      learningLevel: 'beginner'
    });
    console.log('✅ Batch analysis completed:', batchResponse.data.totalAnalyzed, 'texts analyzed');
    console.log('');

    console.log('🎉 All tests passed! The backend is working correctly.');
    console.log('\n📊 Summary:');
    console.log('- Health check: ✅');
    console.log('- Root endpoint: ✅');
    console.log('- Service info: ✅');
    console.log('- Basic analysis: ✅');
    console.log('- Enhanced analysis: ✅');
    console.log('- Batch analysis: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend is running (npm run dev)');
    console.log('2. Check if port 5000 is available');
    console.log('3. Verify your Gemini API key is set in .env file');
    console.log('4. Check the backend console for error messages');
  }
}

// Run tests
testAPI();
