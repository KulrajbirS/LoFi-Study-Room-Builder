import React, { useRef, useEffect, useState } from 'react';
import './RoomCanvas.css';

const RoomCanvas = ({ roomItems, onItemMove, onItemSelect, selectedItem }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
      // Draw chair with seat and backrest
      ctx.fillStyle = color;
      // Seat
      ctx.fillRect(x, y + height * 0.4, width, height * 0.2);
      // Backrest
      ctx.fillRect(x + width * 0.1, y, width * 0.1, height * 0.6);
      // Chair legs
      const legSize = width * 0.08;
      ctx.fillRect(x + 2, y + height * 0.6, legSize, height * 0.4);
      ctx.fillRect(x + width - legSize - 2, y + height * 0.6, legSize, height * 0.4);
      ctx.fillRect(x + 2, y + height * 0.9, legSize, height * 0.1);
      ctx.fillRect(x + width - legSize - 2, y + height * 0.9, legSize, height * 0.1);
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
    
    // Draw room background
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor
    ctx.fillStyle = '#3a3a5e';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
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
  }, [roomItems, selectedItem]);

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