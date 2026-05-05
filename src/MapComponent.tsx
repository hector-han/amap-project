import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { parse } from 'terraformer-wkt-parser';

interface MapProps {
  wktString: string;
}

const MapComponent: React.FC<MapProps> = ({ wktString }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<AMap.Map | null>(null);
  const polygonRef = useRef<AMap.Polygon | null>(null);

  useEffect(() => {
    (window as any)._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
    };

    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Polygon'],
    })
      .then((AMapInstance) => {
        if (!mapRef.current) return;

        const map = new AMapInstance.Map(mapRef.current, {
          viewMode: '3D',
          zoom: 12,
          center: [116.397428, 39.90923],
          // 隐藏默认的缩放控件（如果需要界面更清爽）
          zoomEnable: true,
        });

        mapInstance.current = map;
        if (wktString) drawWKT(wktString);
      })
      .catch((e) => console.error(e));

    return () => mapInstance.current?.destroy();
  }, []);

  // 2. 监听 wktString 变化并重绘
  useEffect(() => {
    if (mapInstance.current && wktString) {
      drawWKT(wktString);
    }
  }, [wktString]);

  const drawWKT = (wkt: string) => {
    const map = mapInstance.current;
    if (!map) return;

    try {
      // 解析 WKT
      const geojson: any = parse(wkt);
      
      // 验证是否为 Polygon
      if (geojson.type !== 'Polygon') {
        alert('目前仅支持绘制 POLYGON 格式');
        return;
      }

      const path = geojson.coordinates[0].map((coord: [number, number]) => {
        return new AMap.LngLat(coord[0], coord[1]);
      });

      // 清理旧的多边形
      if (polygonRef.current) {
        map.remove(polygonRef.current);
      }

      // 创建新的多边形
      const polygon = new AMap.Polygon({
        path: path,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        strokeColor: '#1791fc',
        strokeWeight: 2,
      });

      map.add(polygon);
      polygonRef.current = polygon; // 保存引用

      // 自动缩放视角
      map.setFitView([polygon]);
      
    } catch (error) {
      console.error('WKT 解析失败:', error);
      alert('WKT 格式错误，请检查输入');
    }
  };

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%', // 改为 100% 以填充父容器
        backgroundColor: '#f0f0f0' 
      }} 
    />
  );
};

export default MapComponent;