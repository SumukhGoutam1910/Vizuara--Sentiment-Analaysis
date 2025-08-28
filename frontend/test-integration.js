// Test script to verify frontend-backend integration
// Run this in the browser console when the frontend is loaded

console.log('🧪 Testing Frontend-Backend Integration...\n');

// Test 1: Check if API service is loaded
console.log('1. Testing API Service Loading...');
if (typeof window !== 'undefined' && window.apiService) {
  console.log('✅ API Service loaded successfully');
} else {
  console.log('❌ API Service not found');
}

// Test 2: Test API health check
console.log('\n2. Testing API Health Check...');
async function testHealthCheck() {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('✅ Health check passed:', data.status);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

// Test 3: Test sentiment analysis endpoint
console.log('\n3. Testing Sentiment Analysis...');
async function testSentimentAnalysis() {
  try {
    const response = await fetch('http://localhost:5000/api/sentiment/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "I'm so excited about learning sentiment analysis!",
        context: 'educational'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Sentiment analysis working:', data.data.sentiment);
    return true;
  } catch (error) {
    console.log('❌ Sentiment analysis failed:', error.message);
    return false;
  }
}

// Test 4: Test enhanced analysis
console.log('\n4. Testing Enhanced Analysis...');
async function testEnhancedAnalysis() {
  try {
    const response = await fetch('http://localhost:5000/api/sentiment/analyze-with-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "I feel nervous about the presentation but also excited to share my ideas",
        learningLevel: 'beginner',
        includeExamples: true,
        includeTips: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Enhanced analysis working:', data.data.sentiment);
    console.log('   Confidence:', data.data.confidence + '%');
    console.log('   Has examples:', !!data.data.examples);
    console.log('   Has tips:', !!data.data.learningTips);
    return true;
  } catch (error) {
    console.log('❌ Enhanced analysis failed:', error.message);
    return false;
  }
}

// Test 5: Test CORS (Cross-Origin Resource Sharing)
console.log('\n5. Testing CORS...');
async function testCORS() {
  try {
    const response = await fetch('http://localhost:5000/api/sentiment/info');
    if (response.ok) {
      console.log('✅ CORS working - API accessible from frontend');
      return true;
    } else {
      console.log('❌ CORS issue - API not accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all integration tests...\n');
  
  const results = {
    healthCheck: await testHealthCheck(),
    sentimentAnalysis: await testSentimentAnalysis(),
    enhancedAnalysis: await testEnhancedAnalysis(),
    cors: await testCORS()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('Health Check:', results.healthCheck ? '✅ PASS' : '❌ FAIL');
  console.log('Sentiment Analysis:', results.sentimentAnalysis ? '✅ PASS' : '❌ FAIL');
  console.log('Enhanced Analysis:', results.enhancedAnalysis ? '✅ PASS' : '❌ FAIL');
  console.log('CORS:', results.cors ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Frontend-Backend integration is working perfectly!');
  } else {
    console.log('⚠️  Some tests failed. Check the backend server and CORS configuration.');
  }
}

// Auto-run tests after a short delay
setTimeout(runAllTests, 1000);

console.log('Tests will run automatically in 1 second...');
console.log('You can also run: runAllTests() manually');
