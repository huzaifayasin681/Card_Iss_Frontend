'use client';
import { useEffect, useRef } from 'react';

export default function KioskMap({ kiosks }) {
  const mapRef = useRef(null);
  
  useEffect(() => {
    // This is a simplified map representation
    // In a real application, you would integrate with a map provider like Google Maps or Leaflet
    
    if (mapRef.current && kiosks.length > 0) {
      const canvas = mapRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some simple roads
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 3;
      
      // Horizontal roads
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * canvas.height / 5);
        ctx.lineTo(canvas.width, i * canvas.height / 5);
        ctx.stroke();
      }
      
      // Vertical roads
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(i * canvas.width / 5, 0);
        ctx.lineTo(i * canvas.width / 5, canvas.height);
        ctx.stroke();
      }
      
      // Draw kiosks as points
      kiosks.forEach((kiosk, index) => {
        // Generate position based on kiosk id to make it deterministic
        const x = (kiosk.id % 5) * canvas.width / 5 + canvas.width / 10;
        const y = Math.floor(kiosk.id / 5) * canvas.height / 5 + canvas.height / 10;
        
        // Draw kiosk point
        ctx.fillStyle = '#007bff';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw kiosk label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(kiosk.location, x, y - 12);
      });
      
      // Draw "You are here" marker
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You are here', centerX, centerY - 12);
    }
  }, [kiosks]);
  
  return (
    <div className="relative h-96 bg-white rounded-lg shadow-card overflow-hidden">
      <canvas ref={mapRef} className="w-full h-full"></canvas>
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold shadow-sm hover:bg-gray-100">+</button>
        <button className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold shadow-sm hover:bg-gray-100">-</button>
        <button className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm hover:bg-gray-100">
          <span>📍</span>
        </button>
      </div>
    </div>
  );
}