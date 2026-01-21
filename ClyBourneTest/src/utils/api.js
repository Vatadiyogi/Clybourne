  import axios from "axios";
  const Axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // backend base URL
    withCredentials: true, // if you’re using cookies or sessions
  });

  export default Axios;