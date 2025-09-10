import React, { useState, useEffect, useRef } from "react";
import "./BottomLeftCounters.css";
import { SketchPicker } from "react-color"; // Google style color picker

export default function BottomLeftCounter({ onMapTypeChange }) {
  const [showExtra, setShowExtra] = useState(false);
  const [showSecondCard, setShowSecondCard] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Third map icon with sub-icons
  const [showThirdIcons, setShowThirdIcons] = useState(false);

  // Color state (default black)
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });

  const cardRef = useRef(null);

    
  // outside click listener color card
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowSecondCard(false);
      }
    };

    if (showSecondCard) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSecondCard]);

  
  // Toggle extra icons when map clicked
  const handleMapClick = () => {
    setShowExtra(!showExtra);

    if (showExtra) {
      setShowSecondCard(false);
      setShowColorPicker(false);
    }
  };

  // Convert RGB → string
  const toRGB = (c) => `rgb(${c.r}, ${c.g}, ${c.b})`;

  // Active icons state
  const [activeIcons, setActiveIcons] = useState(new Set());

  // outside click → reset all active icons map
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveIcons(new Set());
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Handle map icon click map 4 size fixed set 
  const handleIconClick = (type, e) => {
    e.stopPropagation(); // Prevent outside click reset

    setActiveIcons((prev) => {
      const next = new Set(prev);
      next.add(type); // Always add (don’t remove)
      return next;
    });

    onMapTypeChange(type); // Map apply
  };

  return (
    <div className="bottom-left-counters">
      {/* Map Counter */}
      <div
        className="counter-card map-card"
        onClick={handleMapClick}
        title="Map Type"
      >
        <div className="counter-icon1">
          <img src="/maps.jpg" alt="Map" />
        </div>

        {/* Show/Hide extra icons */}
        {showExtra && (
          <div className="extra-icons" title="">
            {/* Third icon with 4 sub-icons */}
            <div className="third-icon-wrapper">
              <div
                className="small-card"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowThirdIcons(!showThirdIcons);
                }}
              >
                <img src="/map3.jpg" alt="Location" />
              </div>

              {/* 4 icons visible only when clicked */}
              {showThirdIcons && (
                <div className="sub-icons1">
                  {/* Roadmap */}
                  <div
                    className={`sub-icon ${
                      activeIcons.has("roadmap") ? "active" : ""
                    }`}
                    title="Road Map"
                    onClick={(e) => handleIconClick("roadmap", e)}
                  >
                    <img src="/roadmap.jpg" alt="Roadmap" />
                  </div>

                  {/* Satellite */}
                  <div
                    className={`sub-icon ${
                      activeIcons.has("satellite") ? "active" : ""
                    }`}
                    title="Satellite Map"
                    onClick={(e) => handleIconClick("satellite", e)}
                  >
                    <img src="/satellite.jpg" alt="Satellite" />
                  </div>

                  {/* Terrain */}
                  <div
                    className={`sub-icon ${
                      activeIcons.has("terrain") ? "active" : ""
                    }`}
                    title="Terrain Map"
                    onClick={(e) => handleIconClick("terrain", e)}
                  >
                    <img src="/Terrain-map.jpg" alt="Terrain" />
                  </div>

                  {/* 3D */}
                  <div
                    className={`sub-icon ${
                      activeIcons.has("3d") ? "active" : ""
                    }`}
                    title="3D View Map"
                    onClick={(e) => handleIconClick("3d", e)}
                  >
                    <img src="/3d-view.jpg" alt="3D View" />
                  </div>
                </div>
              )}
            </div>

            {/* Second icon with inline popup color */}
    <div className="second-icon-wrapper">
  {showSecondCard && (
    <div className="inline-card" onClick={(e) => e.stopPropagation()}>
      {/* Left side color preview */}
     <div
  className="color-preview"
  style={{ backgroundColor: toRGB(color), marginLeft: "-3px" }}
  onClick={(e) => {
    e.stopPropagation();           // prevent card close
    setShowColorPicker(!showColorPicker); // toggle picker only
  }}
/>

      <span>Choose a color for map roads</span>

      {/* Show Picker only when user clicks black icon */}
      {showColorPicker && (
        <div className="color-picker-wrapper" onClick={(e) => e.stopPropagation()}>
          <SketchPicker
            color={color}
            onChange={(updatedColor) => setColor(updatedColor.rgb)}
          />
        </div>
      )}
    </div>
  )}

  {/* Black icon to open/close card */}
  <button
    className="icon-btn"
    onClick={(e) => {
      e.stopPropagation();
      setShowSecondCard(!showSecondCard); // toggle card
    
    }}
  >
    <img src="/map2.jpg" alt="Choose color" className="icon-img1" />
  </button>
</div>



          </div>
        )}
      </div>

      {/* Android Counter */}
      <div className="counter-card" title="Android App Users">
        <div className="counter-value">800+</div>
        <div className="counter-icon">
          <img src="/adroid.jpg" alt="Work Orders" />
        </div>
      </div>

      {/* iOS Counter */}
      <div className="counter-card" title="ios App Users">
        <div className="counter-value">500+</div>
        <div className="counter-icon">
          <img src="/ioss.jpg" alt="Contractors" />
        </div>
      </div>
    </div>
  );
}
