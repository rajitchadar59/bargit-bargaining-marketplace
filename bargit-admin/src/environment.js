let IS_PROD=true;

const server= IS_PROD ?"https://bargit-backend.onrender.com" : "http://localhost:5000/api"

export default server;