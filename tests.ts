import axios from "axios";
import { Api } from "./src/api/index";
import { Timer } from "./src/utils/timer";

const timer = new Timer();

const main = async () => {
  console.log("Get home (not interesting)");
  await timer.timeFunction(() => axios.get("http://localhost:8080/"));

  console.log("\n##############\n");
  console.log("Get PageFetched, the page which make a request to the api each time the page is requested");
  await timer.timeFunction(() => axios.get("http://localhost:8080/PageFetched"));
  console.log("\n##############\n");
  console.log("Get PageCached, the page make a request to the Api only if the data is not present in the cache");
  await timer.timeFunction(() => axios.get("http://localhost:8080/PageCached"));

  console.log("\n##############\n");
  console.log("Get PageWithTrigger, the frontend is notified when the data is changed");
  await timer.timeFunction(() => axios.get("http://localhost:8080/PageWithTrigger"));

  const times = [];

  for (const i in Array(100).fill(0)) times.push(await timer.timeFunction(() => Api.getProducts()));

  console.log("Mean request time:   ", mean(times));
  console.log("Median request time: ", median(times));
  console.log("Standard deviation:  ", standardDeviation(times));
  console.log("Min request time:    ", Math.min(...times));
  console.log("Max request time:    ", Math.max(...times));

  // Render the first page for to avoid the first query of the data
  await axios.get("http://localhost:8080/PageCached");
  for (const i in Array(100).fill(0))
    times.push(await timer.timeFunction(() => axios.get("http://localhost:8080/PageCached")));

  console.log("Mean request time:   ", mean(times));
  console.log("Median request time: ", median(times));
  console.log("Standard deviation:  ", standardDeviation(times));
  console.log("Min request time:    ", Math.min(...times));
  console.log("Max request time:    ", Math.max(...times));
};

const mean = (times: number[]) => {
  return times.reduce((s, t) => s + t, 0) / times.length;
};

const median = (times: number[]) => {
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
};

const standardDeviation = (times: number[]) => {
  const n = times.length;
  const mean = times.reduce((a, b) => a + b) / n;
  return Math.sqrt(times.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

main();
