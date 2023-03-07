const WebSocketServer = require("ws");
const PORT = 8800;
const wss = new WebSocketServer.Server({
  port: PORT
});

const services = {
  serviceA: {
    status: "online",
  },
  serviceB: {
    status: "offline",
  },
  serviceC: {
    status: "online",
  },
  serviceD: {
    status: "idle",
  },
};
var intervalId = -1;
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({ message: "Connect successfully", type: "common" }));

  ws.on("message", (data) => {
    console.log(`Client has sent: ${data}`);
    ws.send(JSON.stringify({ services, type: "health-check" }));
  });

  ws.on("close", () => {
    console.log("the client has disconnected");
    clearInterval(intervalId);
  });

  // handling client connection error
  ws.onerror = function () {
    console.log("Some Error occurred");
  };

  intervalId = setInterval(() => {
    updateStatus();
    ws.send(JSON.stringify({ services, type: "health-check" }));
  }, 3000);
});

console.log(`The WebSocket server is running on port ${PORT}`);

function updateStatus() {
  console.log("Update status service A -> D");
  services.serviceA.status =
    Math.round(Math.random()) === 1 ? "online" : "offline";
  services.serviceB.status =
    Math.round(Math.random()) === 1 ? "online" : "offline";
  services.serviceC.status =
    Math.round(Math.random()) === 1 ? "online" : "offline";
  services.serviceD.status =
    Math.round(Math.random()) === 1 ? "online" : "offline";
}
