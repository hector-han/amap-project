import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { parse } from 'terraformer-wkt-parser';

interface MapProps {
  wktString: string;
}

const MapComponent: React.FC<MapProps> = ({ wktString }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const amapInstance = useRef<any>(null);

  useEffect(() => {
    // 设置安全密钥（自2021年12月2日起，必须设置）
    (window as any)._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
    };

    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Polygon'],
    })
      .then((AMap) => {
        if (!mapRef.current) return;

        const map = new AMap.Map(mapRef.current, {
          viewMode: '3D',
          zoom: 10,
          center: [116.397428, 39.90923], // 默认北京
        });

        amapInstance.current = map;

        // 绘制 WKT
        drawWKT(AMap, map, wktString);
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
      });

    return () => {
      amapInstance.current?.destroy();
    };
  }, []);

  const drawWKT = (AMap: any, map: any, wkt: string) => {
    try {
      // 1. 将 WKT 解析为 GeoJSON 对象
      const geojson: any = parse(wkt);
      
      // 2. 转换坐标格式
      // 注意：WKT 是 [lon, lat]，高德也是 [lon, lat]
      // 但 GeoJSON 的 Polygon 坐标结构是 [[[lng, lat], ...]]
      const path = geojson.coordinates[0].map((coord: number[]) => {
        return new AMap.LngLat(coord[0], coord[1]);
      });

      // 3. 创建多边形
      const polygon = new AMap.Polygon({
        path: path,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        strokeColor: '#1791fc',
        strokeWeight: 2,
      });

      map.add(polygon);
      
      // 4. 自动缩放到图形可见范围
      map.setFitView([polygon]);
    } catch (error) {
      console.error('WKT 解析或绘制失败:', error);
    }
  };

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;