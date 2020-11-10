import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/",
  //baseURL: "http://merit.vikingind.com:8085/",
  //headers: { "X-Custom-Header": "foobar" },
});
export default instance;
