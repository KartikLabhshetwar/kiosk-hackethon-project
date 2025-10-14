/**
 * Simple test script to verify Express backend is working
 */

const http = require('http');

// Test the health endpoint
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:8000/health', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Health endpoint working:', response);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Test the root endpoint
const testRoot = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:8000/', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Root endpoint working:', response);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Run tests
const runTests = async () => {
  console.log('🧪 Testing Express backend...\n');

  try {
    await testRoot();
    await testHealth();
    console.log('\n🎉 All tests passed! Express backend is working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running with: npm start');
    process.exit(1);
  }
};

runTests();
