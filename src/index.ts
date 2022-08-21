import { cachedDB } from "./cachedDB/access";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { render } from "./utils/render";
import { Timer } from "./utils/timer";

import Home, * as HomeExports from "./pages";
import PageFetched, * as PageFetchedExports from "./pages/PageWithDataFetchedAtEachRender";
import PageCached, * as PageCachedExports from "./pages/PageWithDataInCache";
import PageWithTrigger, * as PageWithTriggerExports from "./pages/PageWithDataUpdatedByBackendTrigger";

const app = express();
const port = 8080; // default port to listen
const timer = new Timer();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const pages: { [key: string]: any } = {
  PageWithTriggerIncremental: { valid: true },
  PageWithTriggerLimitInTime: { valid: true, revalidate: 30, lastUpdate: new Date().getTime() },
};

/**
 * Generate the static pages
 */
render(PageWithTrigger, PageWithTriggerExports.getStaticProps, "PageWithTrigger");

/**
 * This route is the main page where the links of all the other pages are.
 */
app.get("/", async (_, res: any) => {
  await render(Home, HomeExports.getStaticProps, "Home");
  res.sendFile(path.join(__dirname, "../output/Home.html"));
});

/**
 * This route build the html with the data of a public API accessible through
 * fakestoreapi.com. This build contains the time of the request done to the server.
 */
app.get("/PageFetched", async (_, res: any) => {
  await timer.timeFunction(() => render(PageFetched, PageFetchedExports.getStaticProps, "PageFetched"));
  res.sendFile(path.join(__dirname, "../output/PageFetched.html"));
});

/**
 * This route build the html with the data stored in cache if available
 */
app.get("/PageCached", async (_, res: any) => {
  await timer.timeFunction(() => render(PageCached, PageCachedExports.getStaticProps, "PageCached"));
  res.sendFile(path.join(__dirname, "../output/PageCached.html"));
});

/**
 * This route does not build the HTML because it is either build at the deployment
 * or re-build at each rebuild triggered by the backend
 */
app.get("/PageWithTrigger", async (_, res: any) => {
  res.sendFile(path.join(__dirname, "../output/PageWithTrigger.html"));
});

/**
 * This route send the page stored in the server for the requested route and
 * rerender the page for the next request
 */
app.get("/PageWithTriggerIncremental", async (_, res: any) => {
  // The server does not wait for the new page to be re-render and send
  // the previous version of the HTML
  res.sendFile(path.join(__dirname, "../output/PageWithTriggerIncremental.html"));
  // Render the page for the next request only if the page is outdated
  if (!pages["PageWithTriggerIncremental"].valid)
    render(PageCached, PageCachedExports.getStaticProps, "PageWithTriggerIncremental");
});

/**
 * This route send the page stored in the server for the requested route and
 * rerender the page for the next request
 */
app.get("/PageWithTriggerIncremental", async (_, res: any) => {
  // The server does not wait for the new page to be re-render and send
  // the previous version of the HTML
  res.sendFile(path.join(__dirname, "../output/PageWithTriggerIncremental.html"));
  // Render the page for the next request only if the page is outdated
  if (!pages["PageWithTriggerIncremental"].valid)
    render(PageCached, PageCachedExports.getStaticProps, "PageWithTriggerIncremental");
});

/**
 * This route send the page stored in the server for the requested route and
 * rerender the page for the next request
 */
app.get("/PageWithTimeLimit", async (_, res: any) => {
  // The server does not wait for the new page to be re-render and send
  // the previous version of the HTML
  res.sendFile(path.join(__dirname, "../output/PageWithTriggerIncremental.html"));
  // Render the page for the next request only if the page is outdated
  if (!pages["PageWithTimeLimit"].valid)
    render(PageCached, PageCachedExports.getStaticProps, "PageWithTriggerIncremental");
});

/**
 * This route allows the backend to trigger the server to build a new HTML and make
 * a new request to the backend.
 */
app.post("/Rebuild", async (req: any, res: any) => {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) return res.status(401).json({ message: "Invalid token" });
  await timer.timeFunction(() => render(PageWithTrigger, PageWithTriggerExports.getStaticProps, "PageWithTrigger"));
  res.status(200).send("Success");
});

/**
 * Notify the server that a page needs to be rerendered
 */
app.post("/InvalidatePage", async (req: any, res: any) => {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) return res.status(401).json({ message: "Invalid token" });
  if (req.body.page && pages[req.body.page]) pages[req.body.page].valid = false;
  res.status(200).send("Success");
});

/**
 * Notify the server that a page needs to be rerendered
 */
app.post("/InvalidatePageWithTimeLimit", async (req: any, res: any) => {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) return res.status(401).json({ message: "Invalid token" });
  if (!req.body.page || !pages[req.body.page]) return res.status(401).json({ message: "Page not found" });
  // Check if enough time has passed between two consecutive update of the Data
  if (pages[req.body.page].lastUpdate < new Date().getTime() - pages[req.body.page].revalidate)
    render(PageWithTrigger, PageWithTriggerExports.getStaticProps, req.body.page);
  // If not invalidate the page
  else pages[req.body.page].valid = false;
  res.status(200).send("Success");
});

/**
 * This route allows the backend to trigger the server to build a new HTML and make
 * a new request to the backend.
 */
app.post("/InvalidateCache", async (req: any, res: any) => {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) return res.status(401).json({ message: "Invalid token" });
  if (!req?.body?.id) res.status(500).send("Please provide an id");
  cachedDB.delete(req.body.id);
  res.status(200).send("Success");
});

/**
 * Setup the server to listen to the port 8080
 */
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
