const axios = require('axios');
const API_BASE_URL = 'http://localhost:3000';

async function testAllEndpoints() {
    console.log('Testing Bookstore API Endpoints...\n');
    
    try {
        // Test Task 1: Get all books
        console.log('1. Testing GET /books');
        const response1 = await axios.get(`${API_BASE_URL}/books`);
        console.log(`✅ Success! Status: ${response1.status}, Books: ${response1.data.count}`);
        
        // Test Task 2: Get book by ISBN
        console.log('\n2. Testing GET /books/isbn/9780140283334');
        const response2 = await axios.get(`${API_BASE_URL}/books/isbn/9780140283334`);
        console.log(`✅ Success! Status: ${response2.status}, Title: ${response2.data.book.title}`);
        
        // Test Task 3: Get books by author
        console.log('\n3. Testing GET /books/author/George Orwell');
        const response3 = await axios.get(`${API_BASE_URL}/books/author/George%20Orwell`);
        console.log(`✅ Success! Status: ${response3.status}, Books found: ${response3.data.count}`);
        
        // Test Task 4: Get books by title
        console.log('\n4. Testing GET /books/title/The');
        const response4 = await axios.get(`${API_BASE_URL}/books/title/The`);
        console.log(`✅ Success! Status: ${response4.status}, Books found: ${response4.data.count}`);
        
        // Test Task 5: Get book reviews
        console.log('\n5. Testing GET /books/9780140283334/reviews');
        const response5 = await axios.get(`${API_BASE_URL}/books/9780140283334/reviews`);
        console.log(`✅ Success! Status: ${response5.status}, Reviews: ${response5.data.reviews.length}`);
        
        // Test Task 6: Register user
        console.log('\n6. Testing POST /register');
        const response6 = await axios.post(`${API_BASE_URL}/register`, {
            username: 'testuser_' + Date.now(),
            password: 'testpass123'
        });
        console.log(`✅ Success! Status: ${response6.status}, User ID: ${response6.data.userId}`);
        
        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Run tests
testAllEndpoints();