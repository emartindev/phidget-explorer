export default function SensorInformation({ sensor }) {
  return (
    <div className="sensor-information">
      <h2>{sensor.name}</h2>
      <p>{sensor.description}</p>
      <p>Current value: {sensor.value}</p>
    </div>
  );
}