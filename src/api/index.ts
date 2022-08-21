import axios from "axios";

export class API {
  getProducts = async () => (await axios.get("https://fakestoreapi.com/products")).data;
  getProduct = async (n: number) => (await axios.get(`https://fakestoreapi.com/products/${n}`)).data;
}

export const Api = new API();
