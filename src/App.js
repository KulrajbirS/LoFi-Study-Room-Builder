import React, { useState } from 'react';
import './App.css';
import RoomCanvas from './components/Room/RoomCanvas';
import ItemLibrary from './components/Items/ItemLibrary';
import AudioPlayer from './components/Audio/AudioPlayer';
import ControlPanel from './components/Controls/ControlPanel';

function App() {
  const [roomItems, setRoomItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [roomSettings, setRoomSettings] = useState({
    theme: 'dark',
    lighting: 50,
    musicVolume: 50,
    ambientSound: 'none',
    showGrid: false
  });

  const handleItemAdd = (newItem) => {
    setRoomItems(prev => [...prev, newItem]);
  };

  const handleItemMove = (index, newPosition) => {
    setRoomItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, ...newPosition } : item
      )
    );
  };

  const handleItemUpdate = (index, updates) => {
    setRoomItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  };

  const handleItemDelete = (index) => {
    setRoomItems(prev => prev.filter((_, i) => i !== index));
    setSelectedItem(null);
  };

  const handleItemSelect = (index) => {
    setSelectedItem(index);
  };

  const handleRoomSettingsChange = (newSettings) => {
    setRoomSettings(newSettings);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏠 Lo-Fi Study Room Builder</h1>
        <p>Create your perfect study space with ambient sounds and customizable furniture</p>
      </header>
      
      <main className="app-main">
        <div className="left-panel">
          <ItemLibrary onItemAdd={handleItemAdd} />
          <AudioPlayer />
        </div>
        
        <div className="center-panel">
          <RoomCanvas 
            roomItems={roomItems}
            onItemMove={handleItemMove}
            onItemSelect={handleItemSelect}
            selectedItem={selectedItem}
          />
        </div>
        
        <div className="right-panel">
          <ControlPanel 
            selectedItem={selectedItem}
            roomItems={roomItems}
            onItemUpdate={handleItemUpdate}
            onItemDelete={handleItemDelete}
            onRoomSettingsChange={handleRoomSettingsChange}
            roomSettings={roomSettings}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
