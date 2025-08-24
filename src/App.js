import React, { useState } from 'react';
import './App.css';
import RoomCanvas3D from './components/Room/RoomCanvas3D';
import ItemLibrary from './components/Items/ItemLibrary';
import AudioPlayer from './components/Audio/AudioPlayer';
import ControlPanel from './components/Controls/ControlPanel';

function App() {
  const [roomItems, setRoomItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [roomSettings, setRoomSettings] = useState({
    theme: 'minimal',
    lighting: 50,
    musicVolume: 50,
    ambientSound: 'none',
    showGrid: false
  });

  // UI visibility states
  const [showItemLibrary, setShowItemLibrary] = useState(true);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [showAudioPlayer, setShowAudioPlayer] = useState(true);

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
      {/* Immersive 3D Room Background */}
      <div className="room-background">
        <RoomCanvas3D 
          roomItems={roomItems}
          onItemMove={handleItemMove}
          onItemSelect={handleItemSelect}
          selectedItem={selectedItem}
          roomSettings={roomSettings}
        />
      </div>

      {/* Floating Header */}
      <header className="app-header">
        <h1>🏠 Lo-Fi Study Room Builder</h1>
        <p>Create your perfect study space with ambient sounds and customizable furniture</p>
      </header>

      {/* Main Menu Bar */}
      <div className="main-menu-bar">
        <button 
          className={`menu-button ${showItemLibrary ? 'active' : ''}`}
          onClick={() => setShowItemLibrary(!showItemLibrary)}
        >
          <span className="menu-button-icon">🪑</span>
          Furniture
        </button>
        
        <button 
          className={`menu-button ${showControlPanel ? 'active' : ''}`}
          onClick={() => setShowControlPanel(!showControlPanel)}
        >
          <span className="menu-button-icon">⚙️</span>
          Settings
        </button>
        
        <button 
          className={`menu-button ${showAudioPlayer ? 'active' : ''}`}
          onClick={() => setShowAudioPlayer(!showAudioPlayer)}
        >
          <span className="menu-button-icon">🎵</span>
          Audio
        </button>
      </div>

      {/* Floating UI Overlays */}
      <div className={`ui-overlay left-panel-overlay ${!showItemLibrary ? 'hidden' : ''}`}>
        <ItemLibrary onItemAdd={handleItemAdd} />
      </div>
      
      <div className={`ui-overlay right-panel-overlay ${!showControlPanel ? 'hidden' : ''}`}>
        <ControlPanel 
          selectedItem={selectedItem}
          roomItems={roomItems}
          onItemUpdate={handleItemUpdate}
          onItemDelete={handleItemDelete}
          onRoomSettingsChange={handleRoomSettingsChange}
          roomSettings={roomSettings}
        />
      </div>
      
      <div className={`ui-overlay bottom-panel-overlay ${!showAudioPlayer ? 'hidden' : ''}`}>
        <AudioPlayer />
      </div>
    </div>
  );
}

export default App;
