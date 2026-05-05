import { useState } from 'react';
import MapComponent from './MapComponent';

function App() {
  const defaultWKT = "POLYGON((116.39 39.91, 116.41 39.91, 116.41 39.92, 116.39 39.92, 116.39 39.91))";
  
  const [inputValue, setInputValue] = useState(defaultWKT);
  const [wktToDraw, setWktToDraw] = useState(defaultWKT);

  const handleDraw = () => {
    setWktToDraw(inputValue);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 1. 地图容器（铺满全屏） */}
      <MapComponent wktString={wktToDraw} />

      {/* 2. 左上角输入面板 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10, // 确保在地图之上
        width: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>WKT 数据输入</div>
        
        <textarea
          style={{
            width: '100%',
            height: '120px', // 调大输入框高度
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
          placeholder="请输入 POLYGON WKT..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        
        <button 
          onClick={handleDraw}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1791fc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1078d1'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1791fc'}
        >
          解析并更新地图
        </button>
      </div>
    </div>
  );
}

export default App;