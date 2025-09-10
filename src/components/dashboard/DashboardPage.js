import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { filtersInitial,workOrders } from "./filtersData";
import DocsSidebar from "./DocsSidebars";
import BottomLeftCounter from "./BottomLeftCounters";

import "./DashboardPage.css";

import {
  MdPerson,
  MdPhoneAndroid,
  MdDesktopWindows,
  MdMessage,
  MdPhoto,
  MdSearch,
  MdSync,
  MdOutlineVisibilityOff,
} from "react-icons/md";

/** =========================
 *  CONFIG
 *  ========================= */
const MAPS_API_KEY = "AIzaSyDySVQA2TaTa7OjJbPaz_dnjE4sj87DjPI"; // replace with your API key
const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 18.5204, lng: 73.8567 };

const routeCoords = [
  { lat: 18.553, lng: 73.86 },
  { lat: 18.551, lng: 73.865 },
  { lat: 18.545, lng: 73.868 },
  { lat: 18.539, lng: 73.871 },
  { lat: 18.534, lng: 73.875 },
  { lat: 18.529, lng: 73.879 },
  { lat: 18.525, lng: 73.884 },
  { lat: 18.522, lng: 73.888 },
  { lat: 18.518, lng: 73.894 },
  { lat: 18.515, lng: 73.899 },
  { lat: 18.513, lng: 73.904 },
];

const vehicles = [
  { id: 1, name: "Roller", count: 65, icon: "/rollers.jpg" },
  { id: 2, name: "Paver", count: 60, icon: "/river.jpg" },
  { id: 3, name: "Tipper", count: 65, icon: "/dumpers.jpg" },
  { id: 4, name: "Tm", count: 13, icon: "/mixers.jpg" },
  { id: 5, name: "Bell", count: 1, icon: "/bell.jpg" },
  { id: 6, name: "Docs", count: 0, icon: "/image.jpg", noBadge: true },
];

/** =========================
 *  Dashboard Component
 *  ========================= */
export default function DashboardPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAPS_API_KEY,
  });

  const navigate = useNavigate();

  // Map ref + type
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState("roadmap");

  // Popups
  const [activePopup, setActivePopup] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [filters] = useState(filtersInitial);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [query, setQuery] = useState("");

  // Toggle popups
  const handleToggle = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  //nav bar filters click show click on
    const [selectedFilter, setSelectedFilter] = useState(null);


  const handleFilterClick = (key) => {
  setActiveKeys((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(key)) {
      // 🔴 agar pehle se open hai to remove kardo (CLOSE)
      newSet.delete(key);
    } else {
      // 🟢 otherwise open karo
      newSet.add(key);
    }
    return newSet;
  });
};

 const handleClick = (filterKey) => {
    setSelectedFilter((prev) =>
      prev === filterKey ? null : filterKey
    );
  };



  // Polyline options
  const polylineOptions = useMemo(
    () => ({
      strokeOpacity: mapType === "3d" ? 1 : 0.8, // highlight polyline in 3D
      strokeColor: "#2c7be5",
    }),
    [mapType]
  );

  // Map type change handler
  const handleMapTypeChange = (type) => {
    if (!mapRef.current) return;

    console.log("MapTypeChange called:", type);
    setMapType(type);

    mapRef.current.setCenter(defaultCenter);

    if (type === "3d") {
      mapRef.current.setMapTypeId("roadmap");
      mapRef.current.setZoom(19);

      const listener = mapRef.current.addListener("idle", () => {
        mapRef.current.setTilt(45);
        mapRef.current.setHeading(0);
        listener.remove();
        console.log("3D Roadmap: Tilt 45° applied");
      });
    } else {
      mapRef.current.setMapTypeId(type);
      mapRef.current.setTilt(0);
      mapRef.current.setHeading(0);
      mapRef.current.setZoom(12);
      console.log(`Normal Map: ${type} with tilt 0`);
    }
  };

  const toggleFilter = (key) => {
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
          console.log(" Active Keys:", Array.from(next)); // DEBUG

      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setShowProfile(false);
    navigate("/login");
  };



  return (
    <div className="dash-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Search for location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-ico">
            <MdSearch size={22} />
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`chip ${activeKeys.has(f.key) ? "active" : ""}`}
              onClick={() => toggleFilter(f.key)}
              title={f.label}
            >
              {f.label}
              <span className="badge">{f.count}</span>
            </button>
          ))}
          <button className="chip1" title="Sync">
            <MdSync size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="actions-bar">
          {/* Active Users */}
          <div className="active-users-wrapper">
            <button
              title="Active Users"
              onClick={() => handleToggle("activeUsers")}
              className="active-users-btn"
            >
              <MdPerson className="action-icon" />
              <span>0</span>
            </button>

            {activePopup === "activeUsers" && (
              <div className="active-users-popup">
                <div className="popup-header1">
                  <img
                    src="/activeuser.jpg"
                    alt="active users"
                    className="popup-icon"
                  />
                  <span className="popup-title">Active Users</span>
                </div>
                <div className="popup-body">
                  <p
                    style={{
                      fontSize: "14px",
                      color: "black",
                      textAlign: "left",
                      padding: "6px 4px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    No live users found
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Users */}
          <button
            title="Mobile Users"
            onClick={() => handleToggle("mobileUsers")}
          >
            <MdPhoneAndroid className="action-icon" />
            <span>0</span>
          </button>

          {activePopup === "mobileUsers" && (
            <div className="screen-popup1">
              <div className="popup-header">
                <img src="/mobileuser.jpg" alt="PC" className="popup-icon" />
                <span className="popup-title">Mobile App Users</span>
              </div>
              <hr className="popup-divider" />
              <div className="popup-body">
                <p
                  style={{
                    fontSize: "14px",
                    color: "black",
                    textAlign: "left",
                    padding: "6px 4px",
                    margin: 0,
                    fontWeight: "bold",
                  }}
                >
                  No mobile users found
                </p>
              </div>
            </div>
          )}

          {/* Web Users */}
          <button
            title="Web Users"
            onClick={() => handleToggle("webUsers")}
            className="screen-btn"
          >
            <MdDesktopWindows className="action-icon" />
            <span>1</span>
          </button>

          {activePopup === "webUsers" && (
            <div className="screen-popup">
              <div className="popup-header">
                <img src="/webuser.jpg" alt="PC" className="popup-icon" />
                <span className="popup-title">Web App Users</span>
              </div>
              <hr className="popup-divider" />
              <div className="popup-body">
                <div className="popup-row">
                  <MdDesktopWindows className="popup-left-icon" />
                  <div className="popup-info">
                    <p className="popup-company">
                      Vasundhara IT Pvt Ltd (vasundhara)
                    </p>
                    <p className="popup-date">03/09/2025 | 09:34</p>
                  </div>
                  <MdOutlineVisibilityOff className="popup-right-icon" />
                </div>
              </div>
            </div>
          )}

          <button title="SMS Alerts">
            <MdMessage className="action-icon" />
            <span>0</span>
          </button>
          <button title="Work Progress Images">
            <MdPhoto className="action-icon" />
            <span>0</span>
          </button>

          {/* Profile */}
          <div className="profile-container">
            <div
              className="avatar"
              onClick={() => setShowProfile(!showProfile)}
            >
              <img src="/punecm.jpg" alt="Profile" />
            </div>

            {showProfile && (
              <div className="profile-card">
                <div className="profile-header">
                  <img
                    src="/punecm.jpg"
                    alt="Profile"
                    className="profile-img"
                  />
                  <div>
                    <h3 className="username">vasundhara</h3>
                    <span className="role">Integrator</span>
                  </div>
                </div>

                <div className="profile-info">
                  <div className="registered-row">
                    <img src="/date.png" alt="calendar" className="icon" />
                    <div className="text-block">
                      <p className="label">REGISTERED</p>
                      <p className="date">Sat Aug 26 2017 15:03:11</p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "8vh",
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "11px 22px",
                      marginTop: "20px",
                      fontSize: "16px",
                      background: "#6b8eff",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/logount3.png"
                      alt="logout"
                      style={{ width: "18px", height: "18px" }}
                    />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


{/*  Selected Filter Content nav bar*/}
<div className={`filters-content ${activeKeys.size > 0 ? "active" : ""}`}>
{activeKeys.has("wo") && (
  <div className="card-list">
    {workOrders.map((wo) => (
      <div key={wo.id} className="card-item">
        {/* Top Row: ID + time */}
        <div className="card-top">
          <span className="status-dot" /> 
          <span className="wo-id">{wo.id}</span>
          <span className="wo-time">{wo.time}</span>
        </div>

        {/* Title */}
        <div className="wo-title">{wo.title}</div>

        {/* Info */}
        <div className="wo-info">
          <p>{wo.contractor}</p>
          <p>{wo.zone}</p>
          <p>{wo.project}</p>
          <p>{wo.age}</p>
        </div>

        {/* Bottom Icons nav bar*/}
       <div className="wo-icons-container">
  {/* Top icons with badge */}
  <div className="track">
    <div className="moving-icon">
      <img src="/rollers.jpg" alt="Roller" />
      <span className="icon-count">0</span>
    </div>
    <div className="moving-icon">
      <img src="/river.jpg" alt="Paver" />
      <span className="icon-count">0</span>
    </div>
     <div className="moving-icon">
      <img src="/dumpers.jpg" alt="Tipper" />
      <span className="icon-count">0</span>
    </div>
    <div className="moving-icon">
      <img src="/mixers.jpg" alt="TM" />
      <span className="icon-count">0</span>
    </div>
  </div>


  

  {/* Empty track for travelling icons */}
 
</div>

      </div>
    ))}
  </div>
)}


  {activeKeys.has("plant") && (
    <div className="card-list">
      <h3>Plants</h3>
      {/* Map plant data here dynamically */}
    </div>
  )}

  {activeKeys.has("contractor") && (
    <div className="card-list">
      <h3>Contractors</h3>
      {/* Map contractor data here dynamically */}
    </div>
  )}
</div>



      {/* Map Area */}
      <div className="map-area">
        {!isLoaded ? (
          <div className="map-loading">Loading map…</div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            mapTypeId="roadmap"
            options={{
              zoomControl: true,
              disableDefaultUI: true,
              mapId: "f370bcbb5d9b318581f7f28e", // your Map ID
            }}
            onLoad={(map) => (mapRef.current = map)}
          >
            <Polyline path={routeCoords} options={polylineOptions} />
            <Marker position={routeCoords[0]} label="A" />
            <Marker position={routeCoords[routeCoords.length - 1]} label="B" />
          </GoogleMap>
        )}

        {/* Map Type Buttons */}
        <div style={{ marginTop: 10 }}>
          <button onClick={() => handleMapTypeChange("roadmap")}>
            Normal Map
          </button>
          <button onClick={() => handleMapTypeChange("3d")}>3D Roadmap</button>
          <button onClick={() => handleMapTypeChange("satellite")}>
            Satellite
          </button>
          <button onClick={() => handleMapTypeChange("terrain")}>Terrain</button>
        </div>

        {/* Bottom-left counter */}
        <BottomLeftCounter onMapTypeChange={handleMapTypeChange} />

        {/* Right Rail Vehicles */}
        <div className="right-rail">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`v-item ${v.noBadge ? "no-badge" : ""}`}
              title={v.name}
              onClick={() => v.name === "Docs" && setIsDocsOpen(true)}
            >
              <div className="v-ico">
                <img src={v.icon} alt={v.name} />
              </div>
              {!v.noBadge && v.count > 0 && (
                <div className="v-badge">{v.count}</div>
              )}
            </div>
          ))}
        </div>

        {/* Docs Sidebar */}
        <DocsSidebar isDocsOpen={isDocsOpen} setIsDocsOpen={setIsDocsOpen} />
      </div>
    </div>
  );
}
