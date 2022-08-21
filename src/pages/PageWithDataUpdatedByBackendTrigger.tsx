import { cachedDB } from "../cachedDB/access";
import { Api } from "../api";

interface ProductType {
  id: number;
  title: string;
  pirce: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const Home = ({ products }: { products: ProductType[] }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>E-commerce products</title>
      </head>
      <body>
        <h1 style={{ fontSize: 42 }}>Products available online (Cached)</h1>
        <div>
          <a style={{ padding: 4 }} href="/PageWithDataFetchedAtEachRender">
            PageWithDataFetchedAtEachRender
          </a>
          <a style={{ padding: 4 }} href="/PageWithDataInCache">
            PageWithDataInCache
          </a>
        </div>
        <div style={{ flex: 1, flexDirection: "row", width: "100%" }}>
          {products.map((p) => (
            <Product p={p} key={p.id} />
          ))}
        </div>
      </body>
    </html>
  );
};

const Product = ({ p }: { p: ProductType }) => {
  return (
    <div style={{ width: 370 }}>
      <img src={p.image} style={{ width: 370, height: 500, objectFit: "cover" }} />
      <p style={{ fontSize: 18 }}>{p.title}</p>
      <p style={{ fontSize: 14, color: "gray" }}>{p.description}</p>
      <p style={{ fontSize: 14, color: "blueviolet" }}>{p.category}</p>
    </div>
  );
};

export const getStaticProps = async () => {
  const products = await Api.getProducts();
  return { products };
};

export default Home;
