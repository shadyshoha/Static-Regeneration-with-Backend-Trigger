const Home = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>E-commerce products</title>
      </head>
      <body>
        <h1 style={{ fontSize: 42 }}>Test e-commmerce</h1>
        <h1 style={{ fontSize: 24 }}>Optimising static generation of dynamic pages for search engine optimisation.</h1>
        <div>
          <a style={{ padding: 4 }} href="/PageWithDataFetchedAtEachRender">
            PageWithDataFetchedAtEachRender
          </a>
          <a style={{ padding: 4 }} href="/PageWithDataInCache">
            PageWithDataInCache
          </a>
          <a style={{ padding: 4 }} href="/PageWithDataUpdatedByBackendTrigger">
            PageWithDataUpdatedByBackendTrigger
          </a>
        </div>
      </body>
    </html>
  );
};

export const getStaticProps = async () => {
  return {};
};

export default Home;
