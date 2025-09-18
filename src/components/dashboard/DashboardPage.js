import React, { useMemo, useState, useRef, useEffect,forwardRef  } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { filtersInitial,workOrders } from "./filtersData";
import DocsSidebar from "./DocsSidebars";
import BottomLeftCounter from "./BottomLeftCounters";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";  // icon import 
import "react-datepicker/dist/react-datepicker.css";



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

    //left side work order nav button
    
  const [contractors, setContractors] = useState([]);
const [plants, setPlants] = useState([]);

useEffect(() => {
  // Unique contractors
  const uniqueContractors = [...new Set(workOrders.map(wo => wo.contractor))];
  setContractors(uniqueContractors);

  
  // Unique plants
  const uniquePlants = [...new Set(workOrders.map(wo => wo.project))]; // ya wo.plant agar field available ho
  setPlants(uniquePlants);
}, []);

  const handleFilterClick = (key) => {
  setActiveKeys((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(key)) {
      //agar pehle se open hai to remove kardo (CLOSE)
      newSet.delete(key);
    } else {
      //otherwise open karo
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

//toggle button nav side work load serach button used 
  const [showFilters, setShowFilters] = useState(true);

// date funtlity click date
 const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2022-10-24"));
  const [endDate, setEndDate] = useState(new Date("2025-07-20"));

  const handleApply = () => {
     console.log("Start:", startDate, "End:", endDate);
    setShowDatePicker(false); // close date picker after OK
  };

  //  Custom Input for DatePicker date nav
const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="custom-date-input" onClick={onClick} ref={ref}>
     <span>{value}</span>
    <FaCalendarAlt style={{ marginRight: "6px", cursor: "pointer" }} />
   
  </div>
));

//work type click nav 
const [isOpen, setIsOpen] = useState(false);
const [selectedTypes, setSelectedTypes] = useState({
  all: true,
  bt: true,
  rmc: true,
  both: true,
});
    
//nav zone work 

const [selectedZones, setSelectedZones] = useState({
  all: false,
  pmc: false,
  zone4: false,
  zone3: false,
  zone2: false,
  zone1: false,
  pune: false,
});

const handleCheckboxChange = (zone) => {
  if (zone === "all") {
    const shouldSelectAll = !selectedZones.all;
    const newState = {};
    Object.keys(selectedZones).forEach(key => {
      newState[key] = shouldSelectAll;
    });
    setSelectedZones(newState);
  } else {
    setSelectedZones(prev => ({
      ...prev,
      [zone]: !prev[zone],
      all: false,
    }));
  }
};

const [showZoneCard, setShowZoneCard] = useState(false);

const handleZoneClick = () => {
  setShowZoneCard(prev => !prev);
  setIsOpen(false);           // close Work Type
  setShowDatePicker(false);   // close Date Picker

  // Auto-select all checkboxes when Zone card opens
  const newState = {};
  Object.keys(selectedZones).forEach(key => {
    newState[key] = true;
  });
  setSelectedZones(newState);
};


const handleZoneOk = () => {
  console.log("Selected Zones:", selectedZones); // log or send to backend
  setShowZoneCard(false); // close the Zone card
};

//nav bar work order 769 left side icon click open list
const [showWorkOrderList, setShowWorkOrderList] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [activeCard, setActiveCard] = useState(null); // track active card




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
  <>
    {showFilters && (
        <div className={`filters-content ${activeKeys.size > 0 ? "active" : ""}`}>
          {/* Summary cards on left side - always visible */}
          <div className="filters-container">
            <div className="filters-layout">
              {/* LEFT SIDE: Summary counts */}
      <div className="filters-summary">
  {/* Wrapper for hover logic */}
  <div
    className="card-wrapper"
    onMouseEnter={() => setActiveCard("wo")}
    onMouseLeave={() => setActiveCard(null)}
  >
    {/* Work Order Card */}
    <div className="summary-card">
      <div className="summary-count">{workOrders.length}</div>
      <div className="summary-label">Work Order</div>
    </div>

    {/* Card render */}
    {activeCard === "wo" && (
      <div className="right-side-card">
        <input
          type="text"
          placeholder="Search Work Orders by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <p className="workorder-desc">
          <div className="desc-line">Testing purpose for vasundhara Company</div>
          <div className="desc-line">B G Shirke Company Samorial 24 M DP Rasta Concrete Karane</div>
          <div className="desc-line">Prabhag Kra 7 Madhye Gokhalenagar Parisratil Ghar Kra 507 Te Ghar Kra 545 Yethil Drainage Line Durusati Vishyak Karne.</div>
          <div className="desc-line">Ganeshkhind Rasta Rundikarnat Yenarya Surymukhi Datt Mandir Satlantrachya Anushagane Chittaranjan Vatika Udhyanatil Milakittila Mandirasathi Vividh Kame Karne.</div>
          <div className="desc-line">Mudhwa Sa. Na 58/7 Jadhav Vasti Paper Mil Yethye Rasta Vikasit Karne.</div>
        </p>

        <ul className="workorder-list">
          {workOrders
            .filter((order) =>
              order.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((order, i) => (
              <li key={i} className="workorder-item">
                <p className="workorder-title">{order.name}</p>
                <p className="workorder-desc">
                  Dummy description for <strong>{order.name}</strong>.
                </p>
              </li>
            ))}
        </ul>
      </div>
)}


    {/* WorkOrder list panel (toggle) */}
  {showWorkOrderList && (
  <div className={`workorder-panel ${showWorkOrderList ? "show" : ""}`}>
    <input
      type="text"
      placeholder="Search Work Orders by Name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-bar"
    />

    <div className="workorder-list">
      {workOrders
        .filter((order) =>
          order.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((order, index) => (
          <div key={index} className="workorder-item">
            {order.name}
          </div>
        ))}
    </div>
  </div>
)}

  </div>

  {/* Contractor card */}
  <div
    className="summary-card"
    onClick={() => {
      setActiveKeys(new Set(["contractor"]));
      setShowFilters(true);
    }}
  >
    <div className="summary-count">{contractors.length}</div>
    <div className="summary-label">Contractor</div>
  </div>

  {/* Plant card */}
  <div
    className="summary-card"
    onClick={() => {
      setActiveKeys(new Set(["plant"]));
      setShowFilters(true);
    }}
  >
    <div className="summary-count">{plants.length}</div>
    <div className="summary-label">Plant</div>
  </div>
</div>

              {/* RIGHT SIDE: Search + Filters */}
              <div className="filters-right">
                {/* Search box with Close */}
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search.."
                    className="search-input"
                  />
                  <button className="clear-btn" onClick={() => setShowFilters(false)}>
                    ✕
                  </button>
                </div>

                {/* Filters row */}
                <div className="filters-row">
      <div className="date-filter">
        {/* Filter chip */}
       <div
  className="filter-chip"
  onClick={() => {
    setShowDatePicker(!showDatePicker); // toggle Date Picker
    setIsOpen(false);                   // close Work Type card
      setShowZoneCard(false);             // close Zone card
  }}
>
  {startDate.toLocaleDateString("en-US")} to{" "}
  {endDate.toLocaleDateString("en-US")}
</div>


        {/* Popup Date Picker */}
        {showDatePicker && (
          <div className="date-picker-popup">

            
            {/* Datepicket componets show the date format dd/mm/year prop used */}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              customInput={<CustomDateInput />}
            />
            <span style={{ margin: "0 8px" }}>To</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MM/dd/yyyy"
              customInput={<CustomDateInput />}
            />
            <button className="ok-btn" onClick={handleApply}>
              OK
            </button>
          </div>
        )}
      </div>

      <div>
   <div
  className="filter-chip"
  onClick={() => {
    setIsOpen(!isOpen);         // toggle Work Type card
    setShowDatePicker(false);   // close Date Picker card
      setShowZoneCard(false);     // close Zone card
  }}
>
  Work Type
</div>


{isOpen && (
  <div className="filter-card">
    <div className="checkbox-grid">
      <label>
        <input
          type="checkbox"
          checked={selectedTypes.all}
          onChange={() =>
            setSelectedTypes(prev => ({
              ...prev,
              all: !prev.all,
              bt: !prev.all,
              rmc: !prev.all,
              both: !prev.all,
            }))
          }
        />
         <span>
        All<br />
         <span className="count-text">679</span>
        </span>
      </label>
<label className="two-line-label">
  <input
    type="checkbox"
    checked={selectedTypes.bt}
    onChange={() =>
      setSelectedTypes(prev => ({ ...prev, bt: !prev.bt }))
    }
  />
  <span>
    BT<br />
    <span className="count-text">259</span>
  </span>
</label>


      <label>
        <input
          type="checkbox"
          checked={selectedTypes.rmc}
          onChange={() =>
            setSelectedTypes(prev => ({ ...prev, rmc: !prev.rmc }))
          }
        /> <span>
        RMC <br />
         <span className="count-text">361</span>
        </span>
      </label>
    </div>

    <div className="checkbox-row-single">
      <label>
        <input
          type="checkbox"
          checked={selectedTypes.both}
          onChange={() =>
            setSelectedTypes(prev => ({ ...prev, both: !prev.both }))
          }
        />
        <span>
      Both (BT & <br/> 
      RMC) <br/>
                 <span className="count-text">59</span>

        </span>
      </label>
    </div>

    <button onClick={() => setIsOpen(false)}>OK</button>
  </div>
)}

  </div>
<div className="filter-chip" onClick={handleZoneClick}

>Zone</div>
 

    </div>
 {showZoneCard && (
  <div className="filter-card zone-card">
    <div className="filter-card-header"></div>
    <div className="filter-grid">
      <div className="filter-item">
        <label htmlFor="all">
          All
          <div className="count small">679</div>
        </label>
        <input
          type="checkbox"
          id="all"
          checked={selectedZones.all}
          onChange={() => handleCheckboxChange("all")}
        />
      </div>
      <div className="filter-item">
        <label htmlFor="pmc">
          PMC
          <div className="count small">665</div>
        </label>
        <input
          type="checkbox"
          id="pmc"
          checked={selectedZones.pmc}
          onChange={() => handleCheckboxChange("pmc")}
        />
      </div>
      <div className="filter-item">
        <label htmlFor="zone4">
          Zone-4
          <div className="count small" style={{ marginLeft: "-40px" }}>7</div>
        </label>
        <input
          type="checkbox"
          id="zone4"
          checked={selectedZones.zone4}
          onChange={() => handleCheckboxChange("zone4")}
        />
      </div>
      <div className="filter-item">
        <label htmlFor="zone3">
          Zone-3
          <div className="count small" style={{ marginLeft: "-33px" }}>0</div>
        </label>
        <input
          type="checkbox"
          id="zone3"
          checked={selectedZones.zone3}
          onChange={() => handleCheckboxChange("zone3")}
        />
      </div>
      <div className="filter-item">
        <label htmlFor="zone2">
          Zone-2
          <div className="count small" style={{ marginLeft: "-33px" }}>0</div>
        </label>
        <input
          type="checkbox"
          id="zone2"
          checked={selectedZones.zone2}
          onChange={() => handleCheckboxChange("zone2")}
        />
      </div>
      <div className="filter-item">
        <label htmlFor="zone1">
          Zone-1
          <div className="count small" style={{ marginLeft: "-33px" }}>3</div>
        </label>
        <input
          type="checkbox"
          id="zone1"
          checked={selectedZones.zone1}
          onChange={() => handleCheckboxChange("zone1")}
        />
      </div>
      <div className="filter-item">
        <label htmlFor="pune">
          Pune
          <div className="count small" style={{ marginLeft: "-24px" }}>4</div>
        </label>
        <input
          type="checkbox"
          id="pune"
          checked={selectedZones.pune}
          onChange={() => handleCheckboxChange("pune")}
        />
      </div>
    </div>
   <button className="filter-ok-btn1" onClick={handleZoneOk}>OK</button>

  </div>
)}
              </div>
            </div>
          </div>

          {/* Work order cards */}
          {activeKeys.has("wo") && (
            <div className="card-list">
              {workOrders.map((wo) => (
                <div key={wo.id} className="card-item">
                  <div className="card-top">
                    <span className="status-dot" />
                    <span className="wo-id">{wo.id}</span>
                    <span className="wo-time">{wo.time}</span>
                  </div>  

                  <div className="wo-title">{wo.title}</div>

                  <div className="wo-info">
                      <m>{wo.contractor}</m>
                    <p>{wo.zone}</p>
                    <p>{wo.project}</p>
                    <p>{wo.age}</p>
                  </div>

                  <div className="wo-icons-container">
                    <div className="track-container">
                      <div className="track"></div>
                      <div className="moving-icon roller">
                        <img src="/rollers.jpg" alt="Roller" />
                        <span className="icon-count">0</span>
                      </div>
                      <div className="moving-icon paver">
                        <img src="/river.jpg" alt="Paver" />
                        <span className="icon-count">0</span>
                      </div>
                      <div className="moving-icon tipper">
                        <img src="/dumpers.jpg" alt="Tipper" />
                        <span className="icon-count">0</span>
                      </div>
                      <div className="moving-icon mixer">
                        <img src="/mixers.jpg" alt="Mixer" />
                        <span className="icon-count">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeKeys.has("plant") && (
            <div className="card-list">
              <h3>Plants</h3>
            </div>
          )}

          {activeKeys.has("contractor") && (
            <div className="card-list">
              <h3>Contractors</h3>
            </div>
          )}
        </div>
      )}
    </>
  
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
