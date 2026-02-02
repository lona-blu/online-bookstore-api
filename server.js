const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'bookstore-secret-key-2024';

app.use(bodyParser.json());
app.use(express.static('public'));

// Sample data
let books = [
    {
        "isbn": "9780140283334",
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "year": 1960,
        "reviews": []
    },
    {
        "isbn": "9780061120084",
        "title": "1984",
        "author": "George Orwell",
        "year": 1949,
        "reviews": []
    },
    {
        "isbn": "9780743273565",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "year": 1925,
        "reviews": []
    },
    {
        "isbn": "9780544003415",
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "year": 1937,
        "reviews": []
    },
    {
        "isbn": "9780451524935",
        "title": "Animal Farm",
        "author": "George Orwell",
        "year": 1945,
        "reviews": []
    }
];

let users = [];
let loggedInUsers = {};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Home route
app.get('/', (req, res) => {
    res.send(`
        <h1>Bookstore API</h1>
        <p>Server is running. Available endpoints:</p>
        <ul>
            <li>GET /books - Get all books</li>
            <li>GET /books/isbn/:isbn - Get book by ISBN</li>
            <li>GET /books/author/:author - Get books by author</li>
            <li>GET /books/title/:title - Get books by title</li>
            <li>GET /books/:isbn/reviews - Get book reviews</li>
            <li>POST /register - Register new user</li>
            <li>POST /login - Login user</li>
            <li>POST /books/:isbn/reviews - Add/modify review (requires auth)</li>
            <li>DELETE /books/:isbn/reviews - Delete review (requires auth)</li>
        </ul>
    `);
});

// Task 1: Get all books
app.get('/books', (req, res) => {
    console.log('GET /books - Fetching all books');
    res.json({
        success: true,
        count: books.length,
        books: books
    });
});

// Task 2: Get book by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    console.log(`GET /books/isbn/${isbn} - Searching by ISBN`);
    
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json({
            success: true,
            book: book
        });
    } else {
        res.status(404).json({ 
            success: false,
            error: 'Book not found' 
        });
    }
});

// Task 3: Get books by author
app.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    console.log(`GET /books/author/${author} - Searching by author`);
    
    const authorBooks = books.filter(b => 
        b.author.toLowerCase().includes(author.toLowerCase())
    );
    
    res.json({
        success: true,
        count: authorBooks.length,
        books: authorBooks
    });
});

// Task 4: Get books by title
app.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
    console.log(`GET /books/title/${title} - Searching by title`);
    
    const titleBooks = books.filter(b => 
        b.title.toLowerCase().includes(title.toLowerCase())
    );
    
    res.json({
        success: true,
        count: titleBooks.length,
        books: titleBooks
    });
});

// Task 5: Get book reviews
app.get('/books/:isbn/reviews', (req, res) => {
    const isbn = req.params.isbn;
    console.log(`GET /books/${isbn}/reviews - Getting reviews`);
    
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json({
            success: true,
            isbn: isbn,
            title: book.title,
            reviews: book.reviews
        });
    } else {
        res.status(404).json({ 
            success: false,
            error: 'Book not found' 
        });
    }
});

// Task 6: Register new user
app.post('/register', async (req, res) => {
    try {
        console.log('POST /register - Registering new user');
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Username and password required' 
            });
        }
        
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ 
                success: false,
                error: 'Username already exists' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            registeredAt: new Date().toISOString()
        };
        
        users.push(user);
        console.log(`User registered: ${username}`);
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            userId: user.id,
            username: user.username
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Registration failed' 
        });
    }
});

// Task 7: Login user
app.post('/login', async (req, res) => {
    try {
        console.log('POST /login - User login attempt');
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Login failed: Invalid password');
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }
        
        const token = jwt.sign(
            { userId: user.id, username: user.username }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        
        loggedInUsers[user.id] = token;
        console.log(`User logged in: ${username}`);
        
        res.json({ 
            success: true,
            message: 'Login successful',
            token: token,
            userId: user.id,
            username: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed' 
        });
    }
});

// Task 8: Add/Modify book review (Authenticated)
app.post('/books/:isbn/reviews', authenticateToken, (req, res) => {
    const { review, rating } = req.body;
    const { isbn } = req.params;
    
    console.log(`POST /books/${isbn}/reviews - Adding/modifying review`);
    
    if (!review || !rating) {
        return res.status(400).json({ 
            success: false,
            error: 'Review and rating required' 
        });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
            success: false,
            error: 'Rating must be between 1 and 5' 
        });
    }
    
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ 
            success: false,
            error: 'Book not found' 
        });
    }
    
    // Check if user already reviewed this book
    const existingReviewIndex = book.reviews.findIndex(r => r.userId === req.user.userId);
    
    if (existingReviewIndex >= 0) {
        // Modify existing review
        book.reviews[existingReviewIndex] = {
            userId: req.user.userId,
            username: req.user.username,
            review,
            rating: parseInt(rating),
            timestamp: new Date().toISOString(),
            updated: true
        };
        
        console.log(`Review updated for book: ${book.title}`);
        
        res.json({ 
            success: true,
            message: 'Review updated successfully',
            review: book.reviews[existingReviewIndex]
        });
    } else {
        // Add new review
        const newReview = {
            userId: req.user.userId,
            username: req.user.username,
            review,
            rating: parseInt(rating),
            timestamp: new Date().toISOString()
        };
        
        book.reviews.push(newReview);
        console.log(`Review added for book: ${book.title}`);
        
        res.status(201).json({ 
            success: true,
            message: 'Review added successfully',
            review: newReview
        });
    }
});

// Task 9: Delete book review (Authenticated)
app.delete('/books/:isbn/reviews', authenticateToken, (req, res) => {
    const { isbn } = req.params;
    console.log(`DELETE /books/${isbn}/reviews - Deleting review`);
    
    const book = books.find(b => b.isbn === isbn);
    
    if (!book) {
        return res.status(404).json({ 
            success: false,
            error: 'Book not found' 
        });
    }
    
    const initialLength = book.reviews.length;
    book.reviews = book.reviews.filter(r => r.userId !== req.user.userId);
    
    if (book.reviews.length < initialLength) {
        console.log(`Review deleted from book: ${book.title}`);
        res.json({ 
            success: true,
            message: 'Review deleted successfully' 
        });
    } else {
        res.status(404).json({ 
            success: false,
            error: 'No review found from this user' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`📚 Bookstore API Server is running at:`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`\nAvailable Endpoints:`);
    console.log(`   GET    /books                   - Get all books`);
    console.log(`   GET    /books/isbn/:isbn        - Get book by ISBN`);
    console.log(`   GET    /books/author/:author    - Get books by author`);
    console.log(`   GET    /books/title/:title      - Get books by title`);
    console.log(`   GET    /books/:isbn/reviews     - Get book reviews`);
    console.log(`   POST   /register                - Register user`);
    console.log(`   POST   /login                   - Login user`);
    console.log(`   POST   /books/:isbn/reviews     - Add review (auth required)`);
    console.log(`   DELETE /books/:isbn/reviews     - Delete review (auth required)`);
});