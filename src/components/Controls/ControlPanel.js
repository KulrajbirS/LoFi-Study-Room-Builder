import React, { useState } from 'react';
import './ControlPanel.css';

const ControlPanel = ({ 
  selectedItem, 
  roomItems, 
  onItemUpdate, 
  onItemDelete, 
  onRoomSettingsChange,
  roomSettings 
}) => {
  const [activeTab, setActiveTab] = useState('room');

  const handleItemPropertyChange = (property, value) => {
    if (selectedItem !== null) {
      onItemUpdate(selectedItem, { [property]: value });
    }
  };

  const handleRoomSettingChange = (setting, value) => {
    onRoomSettingsChange({ ...roomSettings, [setting]: value });
  };

  const deleteSelectedItem = () => {
    if (selectedItem !== null && window.confirm('Delete this item?')) {
      onItemDelete(selectedItem);
    }
  };

  const currentItem = selectedItem !== null ? roomItems[selectedItem] : null;

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h3>🎮 Controls</h3>
      </div>

      <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'room' ? 'active' : ''}`}
          onClick={() => setActiveTab('room')}
        >
          Room
        </button>
        <button
          className={`tab-btn ${activeTab === 'item' ? 'active' : ''}`}
          onClick={() => setActiveTab('item')}
        >
          Item
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'room' && (
          <div className="room-controls">

            <div className="control-group">
              <label>Lighting</label>
              <input
                type="range"
                min="0"
                max="100"
                value={roomSettings?.lighting || 50}
                onChange={(e) => handleRoomSettingChange('lighting', parseInt(e.target.value))}
                className="control-slider"
              />
              <span className="slider-value">{roomSettings?.lighting || 50}%</span>
            </div>

            <div className="control-group">
              <label>Background Music Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={roomSettings?.musicVolume || 50}
                onChange={(e) => handleRoomSettingChange('musicVolume', parseInt(e.target.value))}
                className="control-slider"
              />
              <span className="slider-value">{roomSettings?.musicVolume || 50}%</span>
            </div>

            <div className="control-group">
              <label>Ambient Sounds</label>
              <select
                value={roomSettings?.ambientSound || 'none'}
                onChange={(e) => handleRoomSettingChange('ambientSound', e.target.value)}
                className="control-input"
              >
                <option value="none">None</option>
                <option value="rain">Rain</option>
                <option value="fire">Fireplace</option>
                <option value="cafe">Coffee Shop</option>
                <option value="forest">Forest</option>
              </select>
            </div>

            <div className="control-group">
              <label>Show Grid</label>
              <input
                type="checkbox"
                checked={roomSettings?.showGrid || false}
                onChange={(e) => handleRoomSettingChange('showGrid', e.target.checked)}
                className="control-checkbox"
              />
            </div>
          </div>
        )}

        {activeTab === 'item' && (
          <div className="item-controls">
            {currentItem ? (
              <>
                <div className="selected-item-info">
                  <h4>{currentItem.name}</h4>
                  <p>Click and drag to move</p>
                </div>

                <div className="control-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={currentItem.color}
                    onChange={(e) => handleItemPropertyChange('color', e.target.value)}
                    className="color-input"
                  />
                </div>

                <div className="control-group">
                  <label>Width</label>
                  <input
                    type="number"
                    value={currentItem.width}
                    onChange={(e) => handleItemPropertyChange('width', parseInt(e.target.value))}
                    className="control-input"
                    min="10"
                    max="200"
                  />
                </div>

                <div className="control-group">
                  <label>Height</label>
                  <input
                    type="number"
                    value={currentItem.height}
                    onChange={(e) => handleItemPropertyChange('height', parseInt(e.target.value))}
                    className="control-input"
                    min="10"
                    max="200"
                  />
                </div>

                <div className="control-group">
                  <label>Position X</label>
                  <input
                    type="number"
                    value={Math.round(currentItem.x)}
                    onChange={(e) => handleItemPropertyChange('x', parseInt(e.target.value))}
                    className="control-input"
                    min="0"
                    max="800"
                  />
                </div>

                <div className="control-group">
                  <label>Position Y</label>
                  <input
                    type="number"
                    value={Math.round(currentItem.y)}
                    onChange={(e) => handleItemPropertyChange('y', parseInt(e.target.value))}
                    className="control-input"
                    min="0"
                    max="600"
                  />
                </div>

                <button onClick={deleteSelectedItem} className="delete-btn">
                  🗑️ Delete Item
                </button>
              </>
            ) : (
              <div className="no-selection">
                <p>Select an item from the canvas to edit its properties</p>
                <div className="selection-hint">
                  <span>💡</span>
                  <p>Click on any item in your room to customize it</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="panel-footer">
        <div className="room-stats">
          <span>Items: {roomItems.length}</span>
          <span>•</span>
          <span>Selected: {currentItem?.name || 'None'}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;