export class Timer {
  private startTime = 0;
  private endTime = 0;

  start() {
    this.startTime = new Date().getTime();
  }

  end = () => {
    this.endTime = new Date().getTime();
  };

  printElapsedTime = () => {
    console.log(`Time: ${this.endTime - this.startTime}ms elapsed`);
  };

  timeFunction = async (fn: () => any) => {
    this.start();
    await fn();
    this.end();
    this.printElapsedTime();
    return this.endTime - this.startTime;
  };
}
