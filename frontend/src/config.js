
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? window.location.origin  // In production, use the same origin
        : 'http://0.0.0.0:5000'  // In development, connect to Flask backend
};

export default config;
