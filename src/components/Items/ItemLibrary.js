import React from 'react';
import './ItemLibrary.css';

const ItemLibrary = ({ onItemAdd }) => {
  const items = [
    { 
      id: 'desk', 
      name: 'Desk', 
      width: 80, 
      height: 40, 
      color: '#8B4513',
      category: 'furniture'
    },
    { 
      id: 'chair', 
      name: 'Chair', 
      width: 40, 
      height: 50, 
      color: '#654321',
      category: 'furniture'
    },
    { 
      id: 'bookshelf', 
      name: 'Bookshelf', 
      width: 50, 
      height: 120, 
      color: '#A0522D',
      category: 'furniture'
    },
    { 
      id: 'plant', 
      name: 'Plant', 
      width: 25, 
      height: 35, 
      color: '#228B22',
      category: 'decor'
    },
    { 
      id: 'lamp', 
      name: 'Lamp', 
      width: 20, 
      height: 45, 
      color: '#FFD700',
      category: 'lighting'
    },
    { 
      id: 'coffee', 
      name: 'Coffee Cup', 
      width: 15, 
      height: 15, 
      color: '#8B4513',
      category: 'accessories'
    },
    { 
      id: 'window', 
      name: 'Window', 
      width: 60, 
      height: 80, 
      color: '#87CEEB',
      category: 'structure'
    },
    { 
      id: 'rug', 
      name: 'Rug', 
      width: 120, 
      height: 80, 
      color: '#DC143C',
      category: 'decor'
    }
  ];

  const categories = [...new Set(items.map(item => item.category))];

  const handleItemClick = (item) => {
    onItemAdd({
      ...item,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 100,
      id: `${item.id}_${Date.now()}`
    });
  };

  return (
    <div className="item-library">
      <h3>Item Library</h3>
      {categories.map(category => (
        <div key={category} className="category-section">
          <h4 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
          <div className="items-grid">
            {items
              .filter(item => item.category === category)
              .map(item => (
                <div
                  key={item.id}
                  className="item-card"
                  onClick={() => handleItemClick(item)}
                  title={`Add ${item.name} to room`}
                >
                  <div
                    className="item-preview"
                    style={{
                      backgroundColor: item.color,
                      width: Math.min(item.width, 40),
                      height: Math.min(item.height, 40)
                    }}
                  />
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemLibrary;