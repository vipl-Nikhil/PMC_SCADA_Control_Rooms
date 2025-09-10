import React, { useState } from "react";

/** =========================
 *  Circle Progress Component
 *  ========================= */
const CircleProgress = ({ liters, kg, wc }) => {
  const maxLiters = 100;
  const maxKg = 50;
  const maxWc = 1.2;

  const litersProgress = liters / maxLiters;
  const kgProgress = kg / maxKg;
  const wcProgress = wc / maxWc;

  const progress = (litersProgress + kgProgress + wcProgress) / 3;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div className="circle-progress">
      <svg className="progress-ring" width="100" height="100">
        <circle
          className="progress-ring__bg"
          stroke="#ddd"
          strokeWidth="10"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className="progress-ring__value"
          stroke="#007bff"
          strokeWidth="10"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="circle-text">
        <div>{liters} L</div>
        <div>{kg} kg</div>
        <div>W/C: {wc}</div>
      </div>
    </div>
  );
};

/** =========================
 *  Docs Sidebar Component
 *  ========================= */
const DocsSidebar = ({ isDocsOpen, setIsDocsOpen }) => {
  const [activeTab, setActiveTab] = useState("live");

  // Sample data
  const barValues = { T: 0, E: 100, M: 20 };
  const maxValue = Math.max(...Object.values(barValues));

  const liters = 30;
  const kg = 25;
  const wc = 0.45;

  if (!isDocsOpen) return null;

  return (
    <div className="docs-panel">
      <div className="docs-header">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "live" ? "active" : ""}`}
            onClick={() => setActiveTab("live")}
          >
            Live Data
          </button>
          <button
            className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab ${activeTab === "date" ? "active" : ""}`}
            onClick={() => setActiveTab("date")}
          >
            12/05/2025
          </button>
        </div>
        <button className="close-btn" onClick={() => setIsDocsOpen(false)}>
          ✖
        </button>
      </div>

      <div className="docs-list">
        {activeTab === "live" && (
          <>
            <div className="doc-item">
              <span className="dot green"></span>
              <div className="doc-info">
                <div className="title">PMC/ROAD/2022/31</div>
                <div className="sub">N/A | 0.76</div>
                <div className="time">11:44:44</div>
              </div>
              <CircleProgress liters={liters} kg={kg} wc={wc} />
            </div>

            <div className="doc-item">
              <span className="dot green"></span>
              <div className="doc-info">
                <div className="title">121235</div>
                <div className="sub">DRY | N/A</div>
                <div className="time">19:30:35</div>
              </div>
              <div className="doc-icons">
                {Object.keys(barValues).map((ch) => {
                  const value = barValues[ch];
                  const proportion = maxValue > 0 ? value / maxValue : 0;
                  return (
                    <div className="icon-col" key={ch}>
                      <div className="icon-cap">{ch}</div>
                      <div className="bar-container">
                        <div
                          className={`bar-fill ${
                            value === 0 ? "empty" : "filled"
                          }`}
                          style={{ height: `${proportion * 100}%` }}
                        />
                      </div>
                      <div className="icon-val">{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === "upcoming" && (
          <div className="doc-item">
            <span className="dot gray"></span>
            <div className="doc-info">
              <div className="title">Upcoming Work</div>
              <div className="sub">BC | Planned</div>
              <div className="time">Scheduled Soon</div>
            </div>
          </div>
        )}

        {activeTab === "date" && (
          <div className="doc-item">
            <span className="dot green"></span>
            <div className="doc-info">
              <div className="title">Data for 12/05/2025</div>
              <div className="sub">Work in Progress</div>
              <div className="time">10:00 AM</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsSidebar;
