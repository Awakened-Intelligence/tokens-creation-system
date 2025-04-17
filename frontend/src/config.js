
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? window.location.origin
        : 'http://49a2f327-6c4f-4d57-be79-c89166596690-00-1p2yyelcsyfe2.sisko.replit.dev:5000'
};

export default config;
