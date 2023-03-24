import { useEffect, useState } from "react";
import styles from "../styles/sensorinformation.module.css";
import SensorInformation from "./SensorInformation";

export default function SensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [triggerData, setTriggerData] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setInterval(() => {
      fetch("http://localhost:8080/sensor-data")
        .then((res) => res.json())
        .then((data) => setSensorData(data));
    }, 1000);
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetch("http://localhost:8080/trigger-data")
        .then((res) => res.json())
        .then((data) => setTriggerData(data));
    }, 1000);
  }, []);



  // console.log("Sensor data: ", sensorData);

  const handleTrigger = () => {
    fetch('http://127.0.0.1:7070/trigger-command', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "TRIGGER" }),
    })
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  console.log("Trigger data: ", triggerData);



  return (
    <>

      <div className={styles.sensorGrid}>
        <div className={styles.sensor}>
          <h3>Sensor 1: {sensorData.sensorOneDistance}</h3>
          <h4>Sensor 1 Port: {sensorData.sensorOnePort}</h4>
        </div>
        <div className={styles.sensor}>
          <h3>Sensor 2: {sensorData.sensorTwoDistance}</h3>
          <h4>Sensor 2 Port: {sensorData.sensorTwoPort}</h4>
        </div>
        <div className={styles.sensor}>
          <h3>Sensor 3: {sensorData.sensorThreeDistance}</h3>
          <h4>Sensor 3 Port: {sensorData.sensorThreePort}</h4>
        </div>
        <div className={styles.sensor}>
          <h3>Sensor 4: {sensorData.sensorFourDistance}</h3>
          <h4>Sensor 4 Port: {sensorData.sensorFourPort}</h4>
        </div>
      </div>
      <div className={styles.tcpGrid}>

        <div className={styles.hub}>
          <h1>Hub Data</h1>
          <h3>Hub Serial Number: {sensorData.hubData?.hubSerialNumber}</h3>
          <h3>Hub Version: {sensorData.hubData?.hubVersion}</h3>
          <h3>Hub Name: {sensorData.hubData?.hubName}</h3>
        </div>
        <div className={styles.tcp}>
          <h1>Trigger Data</h1>
          <h3>Trigger Status: {triggerData.type}</h3>
          <h3>Trigger Time: {triggerData.timestamp}</h3>
          <h3>Trigger Count: {triggerData.count}</h3>
          <h3>Trigger TCP Client Data: </h3>
          <h4>Trigger TCP Client Address: {triggerData.tcpClient?.addr}</h4>
          <h4>Trigger TCP Client Port: {triggerData.tcpClient?.port}</h4>
        </div>
      </div>

      <br />



      <button onClick={handleTrigger}>Send Test Trigger</button>
    </>
  );

}
