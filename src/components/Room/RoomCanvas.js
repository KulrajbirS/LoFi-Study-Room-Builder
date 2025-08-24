import React, { useRef, useEffect, useState } from 'react';
import './RoomCanvas.css';

const RoomCanvas = ({ roomItems, onItemMove, onItemSelect, selectedItem, roomSettings }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Theme configurations
  const themes = {
    dark: {
      background: '#2a2a3e',
      floor: '#3a3a5e',
      wall: '#4a4a6e',
      accent: '#5a5a7e',
      lighting: 0.8
    },
    warm: {
      background: '#4a3c2a',
      floor: '#5a4c3a',
      wall: '#6a5c4a',
      accent: '#7a6c5a',
      lighting: 1.0
    },
    minimal: {
      background: '#f5f5f5',
      floor: '#e0e0e0',
      wall: '#d0d0d0',
      accent: '#c0c0c0',
      lighting: 1.2
    },
    nature: {
      background: '#2d4a3e',
      floor: '#3d5a4e',
      wall: '#4d6a5e',
      accent: '#5d7a6e',
      lighting: 0.9
    }
  };

  const currentTheme = themes[roomSettings?.theme] || themes.dark;
  const lightingMultiplier = (roomSettings?.lighting || 50) / 100;

  const drawItem = (ctx, item) => {
    const { x, y, width, height, id, color } = item;
    
    if (id.startsWith('desk')) {
      // Draw desk with surface and legs
      ctx.fillStyle = color;
      // Desktop surface
      ctx.fillRect(x, y, width, height * 0.2);
      // Desk legs
      const legWidth = width * 0.1;
      const legHeight = height * 0.8;
      ctx.fillRect(x + 5, y + height * 0.2, legWidth, legHeight);
      ctx.fillRect(x + width - legWidth - 5, y + height * 0.2, legWidth, legHeight);
      // Drawer
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + width * 0.6, y + height * 0.05, width * 0.35, height * 0.1);
    } 
    else if (id.startsWith('chair')) {
      // Draw chair with better proportions
      ctx.fillStyle = color;
      
      // Seat (wider and better positioned)
      const seatHeight = height * 0.15;
      const seatY = y + height * 0.5;
      ctx.fillRect(x + width * 0.05, seatY, width * 0.9, seatHeight);
      
      // Backrest (taller and better positioned)
      const backrestWidth = width * 0.15;
      const backrestHeight = height * 0.5;
      ctx.fillRect(x + width * 0.05, y + height * 0.05, backrestWidth, backrestHeight);
      
      // Chair legs (4 legs with better positioning)
      const legWidth = width * 0.06;
      const legHeight = height * 0.35;
      const legY = seatY + seatHeight;
      
      // Front legs
      ctx.fillRect(x + width * 0.1, legY, legWidth, legHeight);
      ctx.fillRect(x + width * 0.8, legY, legWidth, legHeight);
      
      // Back legs (slightly thicker for support)
      ctx.fillRect(x + width * 0.08, legY, legWidth, legHeight);
      ctx.fillRect(x + width * 0.08, y + height * 0.4, legWidth, height * 0.25);
      
      // Seat cushion detail
      ctx.strokeStyle = '#5a4a3a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + width * 0.1, seatY + 2, width * 0.8, seatHeight - 4);
    }
    else if (id.startsWith('bookshelf')) {
      // Draw bookshelf with shelves and books
      ctx.fillStyle = color;
      // Main frame
      ctx.fillRect(x, y, width, height);
      // Shelves
      ctx.fillStyle = '#8B4513';
      const numShelves = 4;
      for (let i = 1; i < numShelves; i++) {
        const shelfY = y + (height / numShelves) * i;
        ctx.fillRect(x + 2, shelfY - 2, width - 4, 4);
      }
      // Books on shelves
      const bookColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
      for (let shelf = 0; shelf < numShelves; shelf++) {
        const shelfY = y + (height / numShelves) * shelf + 8;
        const shelfHeight = (height / numShelves) - 12;
        let bookX = x + 5;
        for (let book = 0; book < 6; book++) {
          const bookWidth = Math.random() * 8 + 4;
          ctx.fillStyle = bookColors[book % bookColors.length];
          ctx.fillRect(bookX, shelfY, bookWidth, shelfHeight);
          bookX += bookWidth + 1;
          if (bookX > x + width - 10) break;
        }
      }
    }
    else if (id.startsWith('plant')) {
      // Draw plant with pot and leaves
      ctx.fillStyle = '#8B4513';
      // Pot
      ctx.fillRect(x + width * 0.2, y + height * 0.7, width * 0.6, height * 0.3);
      // Plant stem and leaves
      ctx.fillStyle = color;
      ctx.fillRect(x + width * 0.45, y + height * 0.3, width * 0.1, height * 0.4);
      // Leaves (simple circles)
      ctx.beginPath();
      ctx.arc(x + width * 0.3, y + height * 0.2, width * 0.15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width * 0.7, y + height * 0.25, width * 0.12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width * 0.5, y + height * 0.1, width * 0.18, 0, 2 * Math.PI);
      ctx.fill();
    }
    else if (id.startsWith('lamp')) {
      // Draw lamp with base and shade
      ctx.fillStyle = '#654321';
      // Base
      ctx.fillRect(x + width * 0.3, y + height * 0.8, width * 0.4, height * 0.2);
      // Pole
      ctx.fillRect(x + width * 0.45, y + height * 0.2, width * 0.1, height * 0.6);
      // Lampshade
      ctx.fillStyle = color;
      ctx.fillRect(x + width * 0.1, y, width * 0.8, height * 0.3);
    }
    else {
      // Default rectangle for other items
      ctx.fillStyle = color || '#8a8aa0';
      ctx.fillRect(x, y, width, height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply lighting effect
    const lightingEffect = currentTheme.lighting * lightingMultiplier;
    
    // Draw room background with theme colors
    ctx.fillStyle = adjustBrightness(currentTheme.background, lightingEffect);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor with theme colors
    ctx.fillStyle = adjustBrightness(currentTheme.floor, lightingEffect);
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    // Add subtle room details based on theme
    drawRoomDetails(ctx, canvas, currentTheme, lightingEffect);
    
    // Draw items
    roomItems.forEach((item, index) => {
      ctx.save();
      
      // Highlight selected item
      if (selectedItem === index) {
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 3;
        ctx.strokeRect(item.x - 5, item.y - 5, item.width + 10, item.height + 10);
      }
      
      // Draw item based on type
      drawItem(ctx, item);
      
      // Draw item label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, item.x + item.width / 2, item.y + item.height + 15);
      
      ctx.restore();
    });
    
    // Apply lighting overlay if needed
    if (roomSettings?.lighting < 50) {
      const darkness = (50 - roomSettings.lighting) / 50 * 0.3;
      ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [roomItems, selectedItem, roomSettings]);

  // Helper function to adjust brightness
  const adjustBrightness = (color, factor) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Function to draw room details based on theme
  const drawRoomDetails = (ctx, canvas, theme, lighting) => {
    if (roomSettings?.theme === 'nature') {
      // Add window with nature view
      ctx.fillStyle = adjustBrightness('#87CEEB', lighting);
      ctx.fillRect(canvas.width * 0.8, 50, canvas.width * 0.18, 150);
      ctx.fillStyle = adjustBrightness('#228B22', lighting);
      ctx.fillRect(canvas.width * 0.8, 120, canvas.width * 0.18, 80);
    } else if (roomSettings?.theme === 'warm') {
      // Add warm lighting effects
      ctx.fillStyle = 'rgba(255, 200, 100, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (roomSettings?.theme === 'minimal') {
      // Add clean lines and geometric shapes
      ctx.strokeStyle = adjustBrightness(theme.accent, lighting);
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on an item
    const clickedItemIndex = roomItems.findIndex(item => 
      x >= item.x && x <= item.x + item.width &&
      y >= item.y && y <= item.y + item.height
    );
    
    if (clickedItemIndex !== -1) {
      const item = roomItems[clickedItemIndex];
      setIsDragging(true);
      setDragOffset({
        x: x - item.x,
        y: y - item.y
      });
      onItemSelect(clickedItemIndex);
    } else {
      onItemSelect(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedItem === null) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onItemMove(selectedItem, {
      x: x - dragOffset.x,
      y: y - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="room-canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="room-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default RoomCanvas;