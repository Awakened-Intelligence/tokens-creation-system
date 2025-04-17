
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? window.location.origin
        : 'http://0.0.0.0:5000'
};

export default config;
