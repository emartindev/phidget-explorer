const express = require('express');
const cors = require('cors');
const phidget22 = require('phidget22');
const bodyParser = require('body-parser');
const net = require('net');


const app = express();
let COMMAND = null;

app.use(cors());

let sensorData = {
  sensorOneDistance: 0,
  sensorOnePort: null,
  sensorTwoDistance: 0,
  sensorTwoPort: null,
  sensorThreeDistance: 0,
  sensorThreePort: null,
  sensorFourDistance: 0,
  sensorFourPort: null,
  hubData: {
    hubName: null,
    hubSerialNumber: null,
    hubVersion: null,
  },
};

const triggerData = {
  type: COMMAND, // specifies which command is triggered (null when not triggered)
  count: 0, // counts the number of triggers sent
  tcpClient: {
    // settings for connecting to the TCP client
    addr: "127.0.0.1",
    port: 8744,
  },
  timestamp: null, // stores the time of request triggering
};


async function runExplorer() {
  const conn = new phidget22.USBConnection();

  // const conn = new phidget22.NetworkConnection({
  //   hostname: 'localhost',
  //   port: 5661,
  // });
  await conn.connect();

  const vintHub = new phidget22.Hub();
  await vintHub.open(5000);

  const hubSerialNumber = vintHub.getDeviceSerialNumber();
  const hubVersion = vintHub.getDeviceVersion();
  const hubName = vintHub.getDeviceName();

  sensorData.hubData.hubSerialNumber = hubSerialNumber;
  sensorData.hubData.hubVersion = hubVersion;
  sensorData.hubData.hubName = hubName;




  const distanceSensor0 = new phidget22.DistanceSensor();
  const distanceSensor1 = new phidget22.DistanceSensor();
  const distanceSensor2 = new phidget22.DistanceSensor();
  const distanceSensor3 = new phidget22.DistanceSensor();


  distanceSensor0.setHubPort(0);
  distanceSensor1.setHubPort(1);
  distanceSensor2.setHubPort(3);
  distanceSensor3.setHubPort(4);

  sensorData.sensorOnePort = distanceSensor0.getHubPort();
  sensorData.sensorTwoPort = distanceSensor1.getHubPort();
  sensorData.sensorThreePort = distanceSensor2.getHubPort();
  sensorData.sensorFourPort = distanceSensor3.getHubPort();



  distanceSensor0.onDistanceChange = (distance) => {
    sensorData.sensorOneDistance = distance;
    // console.log('Sensor data: ', distance);
  };

  distanceSensor1.onDistanceChange = (distance) => {
    sensorData.sensorTwoDistance = distance;
    // console.log('Sensor data: ', distance);
  };

  distanceSensor2.onDistanceChange = (distance) => {
      sensorData.sensorThreeDistance = distance;
      // console.log('Sensor data: ', distance);
  };

  distanceSensor3.onDistanceChange = (distance) => {
      sensorData.sensorFourDistance = distance;
      // console.log('Sensor data: ', distance);
  };



  await distanceSensor0.open(5000);
  await distanceSensor1.open(5000);
  await distanceSensor2.open(5000);
  await distanceSensor3.open(5000);

  await distanceSensor0.setSonarQuietMode(false);
  await distanceSensor1.setSonarQuietMode(false);
  await distanceSensor2.setSonarQuietMode(false);
  await distanceSensor3.setSonarQuietMode(false);

  await distanceSensor0.setDataInterval(100);
  await distanceSensor1.setDataInterval(100);
  await distanceSensor2.setDataInterval(100);
  await distanceSensor3.setDataInterval(100);

  




}
runExplorer();


const TCP_PORT = 8744;

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    const message = data.toString().trim();
    if (message === 'TRIGGER') {
      console.log(`Trigger received from client: ${socket.remoteAddress}:${socket.remotePort}`);
      triggerData.type = message;
      setTimeout(() => {
        COMMAND = "NOT_TRIGGERED"; // set command to not triggered
        triggerData.type = COMMAND;
        triggerData.timestamp = new Date().toISOString();
        console.log(
          `Command set to ${COMMAND} after 10 seconds of receiving TRIGGER`
        );
      }, 20000);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error(`Error: ${err}`);
  });
});

server.listen(TCP_PORT, () => {
  console.log(`Server listening on port ${TCP_PORT}`);
});


app.get('/sensor-data', (req, res) => {
  res.json(sensorData);
});

app.get('/trigger-data', (req, res) => {
  res.json(triggerData);
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

