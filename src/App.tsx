import MapComponent from './MapComponent';

function App() {
  // 示例 WKT：北京故宫附近的一个多边形
  const testWKT = "POLYGON((116.390 39.910, 116.410 39.910, 116.410 39.920, 116.390 39.920, 116.390 39.910))";

  return (
    <div style={{ padding: '20px' }}>
      <h1>React + AMap + WKT 绘制</h1>
      <MapComponent wktString={testWKT} />
    </div>
  );
}

export default App;