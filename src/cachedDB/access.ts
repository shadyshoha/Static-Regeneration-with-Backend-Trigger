import LRU from "lru-cache";

console.log("New cache");
const cache = new LRU({ max: 12 });

export class CachedDB {
  public async get(id: string, req: () => Promise<any>) {
    const cachedRes = cache.get(id);
    if (cachedRes) {
      console.log("In cache");
      return cachedRes;
    } else {
      console.log("Not in cache");
      return req().then((res) => {
        cache.set(id, res);
        return res;
      });
    }
  }
  public delete(id: string) {
    cache.delete(id);
  }
}

export const cachedDB = new CachedDB();
