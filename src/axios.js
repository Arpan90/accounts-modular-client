import axios from 'axios';


const instance = axios.create({
        headers: {
            'Content-Type': 'application/json'
        },
        baseURL: "http://localhost:5000/",
        timeout: 60000,
        cancelToken: axios.CancelToken.source().token
});

export default instance;