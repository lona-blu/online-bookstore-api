const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

class BookstoreAPI {
    constructor() {
        this.token = null;
        this.userId = null;
    }

    // Task 10: Get all books using async/await
    async getAllBooks() {
        try {
            console.log('\n=== Task 10: Get all books (Async/Await) ===');
            console.log('Endpoint: GET /books');
            console.log('Description: Fetching all books from the bookstore');
            
            const response = await axios.get(`${API_BASE_URL}/books`);
            
            console.log('\n✅ Success!');
            console.log(`Status: ${response.status}`);
            console.log(`Total books: ${response.data.count}`);
            console.log('\nBooks:');
            response.data.books.forEach((book, index) => {
                console.log(`${index + 1}. "${book.title}" by ${book.author} (ISBN: ${book.isbn})`);
            });
            
            return response.data;
        } catch (error) {
            console.error('\n❌ Error fetching all books:', error.message);
            if (error.response) {
                console.error('Response:', error.response.data);
            }
            throw error;
        }
    }

    // Task 11: Search by ISBN using Promises
    searchByISBN(isbn) {
        console.log('\n=== Task 11: Search by ISBN (Using Promises) ===');
        console.log(`Endpoint: GET /books/isbn/${isbn}`);
        console.log(`Description: Searching for book with ISBN: ${isbn}`);
        
        return new Promise((resolve, reject) => {
            axios.get(`${API_BASE_URL}/books/isbn/${isbn}`)
                .then(response => {
                    console.log('\n✅ Success!');
                    console.log(`Status: ${response.status}`);
                    console.log('\nBook Details:');
                    console.log(`Title: ${response.data.book.title}`);
                    console.log(`Author: ${response.data.book.author}`);
                    console.log(`Year: ${response.data.book.year}`);
                    console.log(`ISBN: ${response.data.book.isbn}`);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error(`\n❌ Error searching by ISBN ${isbn}:`);
                    if (error.response) {
                        console.error(`Status: ${error.response.status}`);
                        console.error('Error:', error.response.data.error);
                    } else {
                        console.error('Error:', error.message);
                    }
                    reject(error);
                });
        });
    }

    // Task 12: Search by author
    async searchByAuthor(author) {
        try {
            console.log('\n=== Task 12: Search by Author ===');
            console.log(`Endpoint: GET /books/author/${author}`);
            console.log(`Description: Searching for books by author: ${author}`);
            
            const response = await axios.get(`${API_BASE_URL}/books/author/${author}`);
            
            console.log('\n✅ Success!');
            console.log(`Status: ${response.status}`);
            console.log(`Books found: ${response.data.count}`);
            
            if (response.data.count > 0) {
                console.log('\nBooks by this author:');
                response.data.books.forEach((book, index) => {
                    console.log(`${index + 1}. "${book.title}" (${book.year}) - ISBN: ${book.isbn}`);
                });
            } else {
                console.log('No books found by this author.');
            }
            
            return response.data;
        } catch (error) {
            console.error(`\n❌ Error searching by author ${author}:`, error.message);
            if (error.response) {
                console.error('Response:', error.response.data);
            }
            throw error;
        }
    }

    // Task 13: Search by title
    async searchByTitle(title) {
        try {
            console.log('\n=== Task 13: Search by Title ===');
            console.log(`Endpoint: GET /books/title/${title}`);
            console.log(`Description: Searching for books with title containing: "${title}"`);
            
            const response = await axios.get(`${API_BASE_URL}/books/title/${title}`);
            
            console.log('\n✅ Success!');
            console.log(`Status: ${response.status}`);
            console.log(`Books found: ${response.data.count}`);
            
            if (response.data.count > 0) {
                console.log('\nMatching books:');
                response.data.books.forEach((book, index) => {
                    console.log(`${index + 1}. "${book.title}" by ${book.author} (ISBN: ${book.isbn})`);
                });
            } else {
                console.log('No books found with this title.');
            }
            
            return response.data;
        } catch (error) {
            console.error(`\n❌ Error searching by title "${title}":`, error.message);
            if (error.response) {
                console.error('Response:', error.response.data);
            }
            throw error;
        }
    }

    // Additional methods for testing
    async registerUser(username, password) {
        try {
            console.log('\n=== User Registration ===');
            console.log('Endpoint: POST /register');
            console.log(`Username: ${username}`);
            
            const response = await axios.post(`${API_BASE_URL}/register`, {
                username,
                password
            });
            
            console.log('\n✅ Registration successful!');
            console.log(`Status: ${response.status}`);
            console.log(`User ID: ${response.data.userId}`);
            console.log(`Username: ${response.data.username}`);
            
            return response.data;
        } catch (error) {
            console.error('\n❌ Registration failed:');
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error('Error:', error.response.data.error);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        }
    }

    async loginUser(username, password) {
        try {
            console.log('\n=== User Login ===');
            console.log('Endpoint: POST /login');
            console.log(`Username: ${username}`);
            
            const response = await axios.post(`${API_BASE_URL}/login`, {
                username,
                password
            });
            
            this.token = response.data.token;
            this.userId = response.data.userId;
            
            console.log('\n✅ Login successful!');
            console.log(`Status: ${response.status}`);
            console.log(`User ID: ${response.data.userId}`);
            console.log('Token received (first 20 chars):', response.data.token.substring(0, 20) + '...');
            
            return response.data;
        } catch (error) {
            console.error('\n❌ Login failed:');
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error('Error:', error.response.data.error);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        }
    }

    async addReview(isbn, review, rating) {
        if (!this.token) {
            throw new Error('User must be logged in to add reviews');
        }
        try {
            console.log('\n=== Add Book Review ===');
            console.log(`Endpoint: POST /books/${isbn}/reviews`);
            console.log(`Book ISBN: ${isbn}`);
            console.log(`Review: "${review}"`);
            console.log(`Rating: ${rating}/5`);
            
            const response = await axios.post(
                `${API_BASE_URL}/books/${isbn}/reviews`,
                { review, rating },
                { headers: { Authorization: `Bearer ${this.token}` } }
            );
            
            console.log('\n✅ Review added successfully!');
            console.log(`Status: ${response.status}`);
            console.log('Review details:', response.data.review);
            
            return response.data;
        } catch (error) {
            console.error('\n❌ Failed to add review:');
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error('Error:', error.response.data.error);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        }
    }

    async deleteReview(isbn) {
        if (!this.token) {
            throw new Error('User must be logged in to delete reviews');
        }
        try {
            console.log('\n=== Delete Book Review ===');
            console.log(`Endpoint: DELETE /books/${isbn}/reviews`);
            console.log(`Book ISBN: ${isbn}`);
            
            const response = await axios.delete(
                `${API_BASE_URL}/books/${isbn}/reviews`,
                { headers: { Authorization: `Bearer ${this.token}` } }
            );
            
            console.log('\n✅ Review deleted successfully!');
            console.log(`Status: ${response.status}`);
            console.log('Message:', response.data.message);
            
            return response.data;
        } catch (error) {
            console.error('\n❌ Failed to delete review:');
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error('Error:', error.response.data.error);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        }
    }
}

// Demonstration function
async function demonstrateAPIFunctionality() {
    console.log('='.repeat(60));
    console.log('📚 ONLINE BOOKSTORE API DEMONSTRATION');
    console.log('='.repeat(60));
    
    const api = new BookstoreAPI();
    
    try {
        // Task 10: Get all books (Async/Await)
        await api.getAllBooks();
        
        // Task 11: Search by ISBN (Promises)
        await api.searchByISBN('9780140283334');
        
        // Task 12: Search by Author
        await api.searchByAuthor('George Orwell');
        
        // Task 13: Search by Title
        await api.searchByTitle('The');
        
        console.log('\n' + '='.repeat(60));
        console.log('👤 USER AUTHENTICATION & REVIEWS DEMONSTRATION');
        console.log('='.repeat(60));
        
        // Additional Tasks Demonstration
        await api.registerUser('john_doe', 'password123');
        await api.loginUser('john_doe', 'password123');
        
        // Add review (Task 8)
        await api.addReview('9780140283334', 'Amazing book! Highly recommended!', 5);
        
        // Delete review (Task 9)
        await api.deleteReview('9780140283334');
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL TASKS COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('\n❌ Demonstration failed:', error.message);
    }
}

// Run demonstration
if (require.main === module) {
    demonstrateAPIFunctionality().catch(console.error);
}

module.exports = BookstoreAPI;