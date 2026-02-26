/**
 * EFV API Configuration
 */
const CONFIG = {
    // Automatically detect if we are on localhost or live production
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8080'
        : 'https://efv-b.onrender.com' // Replace this with your actual Render backend URL
};
