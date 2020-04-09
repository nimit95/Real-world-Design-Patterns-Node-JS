const cluster = require('cluster');
if (cluster.isMaster) {
  // Mediate between master class and forks
  class MasterProcessMediator {
    constructor() {
      this.forks = [];
    }
    init() {
      const worker = cluster.fork();
      this.forks.push(worker);
      // 
      worker.on('message', 
        (() => (message) => this.handleMessageFromWorker(worker.id, message))()
      );
    }
  
    // handler for various workers
    handleMessageFromWorker(workerId, message) {
      console.log("Worker " + workerId + " says hi with msg " + message);
    }
  
    notifyAllWorker() {
      this.forks.map(fork => fork.send("received Msg"));
    }
  }

  const mediator = new MasterProcessMediator();
  mediator.init();

  mediator.notifyAllWorker();
} else {
  process.on('message', (message) => {
    console.log(cluster.worker.id + " " + message);
  });
  process.send("working");
  setTimeout(() => process.kill(process.pid), 0);
}

