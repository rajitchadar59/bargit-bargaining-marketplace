let IS_PROD=false;

const server= IS_PROD ?"https://bargit-backend.onrender.com/api" : "http://localhost:5000/api"

export default server;