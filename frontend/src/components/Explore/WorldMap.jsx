// Visual map where each continent represent 1 division/department 
// ============================================

import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const WorldMap = ({ 
  departments, 
  currentDepartment, 
  onSelectDivision,
  selectedDivision 
}) => {
  const [hoveredContinent, setHoveredContinent] = useState(null);

  // Define continent shapes 
  const continentPaths = {
    it: "M 150,350 C 180,320 220,310 270,320 C 310,315 350,325 380,350 C 390,380 385,420 360,450 C 330,470 290,475 250,465 C 210,455 180,430 160,400 C 145,380 140,365 150,350 Z",
    
    operations: "M 520,280 C 570,265 620,260 670,275 C 710,290 735,320 740,360 C 738,400 720,430 685,445 C 640,455 590,450 550,425 C 520,405 510,370 515,330 C 518,305 520,290 520,280 Z",
    
    engineering: "M 100,520 C 130,495 170,485 215,495 C 255,505 285,525 295,560 C 300,595 285,625 255,645 C 220,660 175,665 140,650 C 110,635 95,605 95,570 C 95,545 98,530 100,520 Z",
    
    finance: "M 380,490 C 420,475 465,475 500,490 C 525,505 535,530 530,560 C 520,585 495,600 465,605 C 430,608 395,600 375,575 C 360,555 365,525 375,505 C 378,498 380,493 380,490 Z",
    
    hr: "M 140,680 C 175,665 215,663 250,675 C 280,688 295,715 290,745 C 283,770 260,785 230,788 C 195,790 160,780 140,755 C 125,735 128,705 135,690 C 137,685 139,682 140,680 Z",
    
    data: "M 580,620 C 630,605 680,608 720,630 C 750,648 765,678 758,710 C 748,740 720,760 685,768 C 645,775 605,765 575,740 C 555,720 550,690 558,660 C 565,640 575,628 580,620 Z"
  };

  // Landmarks (roles) for each continent
  const landmarks = {
    it: [
      { x: 250, y: 380 },
      { x: 290, y: 390 },
      { x: 320, y: 370 },
      { x: 220, y: 410 }
    ],
    operations: [
      { x: 620, y: 350 },
      { x: 660, y: 360 },
      { x: 680, y: 330 }
    ],
    engineering: [
      { x: 200, y: 570 },
      { x: 230, y: 580 },
      { x: 180, y: 600 }
    ],
    finance: [
      { x: 450, y: 530 },
      { x: 480, y: 545 }
    ],
    hr: [
      { x: 210, y: 720 },
      { x: 240, y: 735 }
    ],
    data: [
      { x: 660, y: 680 },
      { x: 690, y: 690 },
      { x: 640, y: 710 }
    ]
  };

  const isCurrentDepartment = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name === currentDepartment;
  };

  const getContinentColor = (deptId) => {
    if (isCurrentDepartment(deptId)) return '#A296ca'; // Your location - lavender
    if (selectedDivision === deptId) return '#4c1c46'; // Selected - plum
    return '#2b1d5a'; // Default - deep purple
  };

  const getContinentStroke = (deptId) => {
    if (isCurrentDepartment(deptId)) return '#fff';
    if (selectedDivision === deptId) return '#A296ca';
    if (hoveredContinent === deptId) return '#A296ca';
    return '#A296ca';
  };

  const getContinentOpacity = (deptId) => {
    if (isCurrentDepartment(deptId)) return 0.95;
    if (selectedDivision === deptId) return 0.85;
    if (hoveredContinent === deptId) return 0.75;
    return 0.6;
  };

  return (
    <div style={{
      background: '#2b1d5a',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '2px solid #A296ca'
    }}>
      {/* Map Title */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#A296ca',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Navigation size={24} />
          PSA Career World
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
          Navigate through career continents - click to explore opportunities
        </p>
      </div>

      {/* SVG Map */}
      <svg 
        viewBox="0 0 900 850" 
        style={{ 
          width: '100%', 
          height: 'auto',
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
          borderRadius: '8px'
        }}
      >
        <defs>
          {/* Glow filter for selected continent */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pulsing animation for your ship */}
          <radialGradient id="shipGlow">
            <stop offset="0%" stopColor="#A296ca" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#A296ca" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Ocean wave patterns */}
        <path d="M 0 300 Q 200 290, 400 300 T 800 300" 
          stroke="rgba(162, 150, 202, 0.05)" 
          strokeWidth="1" 
          fill="none"/>
        <path d="M 0 450 Q 250 440, 500 450 T 900 450" 
          stroke="rgba(162, 150, 202, 0.05)" 
          strokeWidth="1" 
          fill="none"/>
        <path d="M 0 600 Q 300 590, 600 600 T 900 600" 
          stroke="rgba(162, 150, 202, 0.05)" 
          strokeWidth="1" 
          fill="none"/>

        {/* Trade routes (career pathways) - only show from your current continent */}
        {currentDepartment && departments.map(dept => {
        if (isCurrentDepartment(dept.id)) return null;
        const currentDept = departments.find(d => d.name === currentDepartment);
        if (!currentDept) return null;

        const paths = {
            it: { x: 280, y: 380 },
            operations: { x: 620, y: 340 },
            engineering: { x: 200, y: 570 },
            finance: { x: 450, y: 530 },
            hr: { x: 210, y: 720 },
            data: { x: 660, y: 680 }
        };

        const start = paths[currentDept.id];
        const end = paths[dept.id];

        if (!start || !end) return null;

        return (
            <g key={`route-${dept.id}`}>
            {/* Shadow/glow effect for depth */}
            <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#A296ca"
                strokeWidth="4"
                strokeDasharray="8,6"
                opacity="0.2"
                filter="blur(2px)"
            />
            {/* Main route line - MUCH MORE VISIBLE */}
            <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#E8B4F9"
                strokeWidth="3"
                strokeDasharray="8,6"
                opacity="0.7"
            >
                <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="14"
                dur="1s"
                repeatCount="indefinite"
                />
            </line>
            </g>
        );
        })}

        {/* Render all continents */}
        {departments.map(dept => (
          <g key={dept.id}>
            {/* Continent shape */}
            <path
              d={continentPaths[dept.id]}
              fill={getContinentColor(dept.id)}
              stroke={getContinentStroke(dept.id)}
              strokeWidth={isCurrentDepartment(dept.id) ? 3 : 2}
              opacity={getContinentOpacity(dept.id)}
              filter={isCurrentDepartment(dept.id) || selectedDivision === dept.id ? 'url(#glow)' : 'none'}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={() => setHoveredContinent(dept.id)}
              onMouseLeave={() => setHoveredContinent(null)}
              onClick={() => onSelectDivision(dept.id)}
            />

            {/* Landmarks (cities/roles) */}
            {landmarks[dept.id]?.map((landmark, idx) => (
              <circle
                key={`landmark-${dept.id}-${idx}`}
                cx={landmark.x}
                cy={landmark.y}
                r={isCurrentDepartment(dept.id) ? 3 : 2}
                fill="#fff"
                opacity={isCurrentDepartment(dept.id) ? 0.8 : 0.4}
              />
            ))}

            {/* Continent label */}
            <text
              x={landmarks[dept.id]?.[0]?.x || 0}
              y={(landmarks[dept.id]?.[0]?.y || 0) - 10}
              fontFamily="Arial"
              fontSize="16"
              fontWeight="bold"
              fill={isCurrentDepartment(dept.id) ? '#1d161e' : '#A296ca'}
              textAnchor="middle"
              pointerEvents="none"
            >
              {dept.icon} {dept.name.split(' ')[0]}
            </text>
          </g>
        ))}

        {/* Your ship (current location marker) */}
        {currentDepartment && (() => {
        const currentDept = departments.find(d => d.name === currentDepartment);
        if (!currentDept) return null;
        const position = landmarks[currentDept.id]?.[0];
        if (!position) return null;

        // MOVE SHIP ABOVE THE CONTINENT
        const offsetX = position.x;
        const offsetY = position.y - 60; // Position ship 60px above continent

        return (
            <g>
            {/* Pulsing circle animation */}
            <circle
                cx={offsetX}
                cy={offsetY}
                r="30"
                fill="url(#shipGlow)"
                opacity="0.3"
            >
                <animate
                attributeName="r"
                from="25"
                to="45"
                dur="2s"
                repeatCount="indefinite"
                />
                <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur="2s"
                repeatCount="indefinite"
                />
            </circle>

            {/* Ship icon */}
            <circle 
                cx={offsetX} 
                cy={offsetY} 
                r="22" 
                fill="#A296ca" 
                stroke="#fff" 
                strokeWidth="2"
            />
            <text
                x={offsetX}
                y={offsetY + 7}
                fontFamily="Arial"
                fontSize="24"
                textAnchor="middle"
            >
                🚢
            </text>

            {/* "You are here" label */}
            <rect
                x={offsetX - 50}
                y={offsetY - 55}
                width="100"
                height="25"
                rx="12"
                fill="#A296ca"
                opacity="0.95"
            />
            <text
                x={offsetX}
                y={offsetY - 38}
                fontFamily="Arial"
                fontSize="11"
                fontWeight="700"
                fill="#1d161e"
                textAnchor="middle"
            >
                YOU ARE HERE
            </text>
            </g>
        );
        })()}

        {/* Compass Rose */}
        <g transform="translate(820, 780)">
          <circle cx="0" cy="0" r="35" fill="none" stroke="#A296ca" strokeWidth="2"/>
          <line x1="0" y1="-30" x2="0" y2="30" stroke="#A296ca" strokeWidth="2"/>
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#A296ca" strokeWidth="2"/>
          <text x="-5" y="-40" fontFamily="Arial" fontSize="14" fill="#A296ca" fontWeight="bold">N</text>
          <text x="-5" y="50" fontFamily="Arial" fontSize="11" fill="#A296ca">S</text>
          <text x="38" y="5" fontFamily="Arial" fontSize="11" fill="#A296ca">E</text>
          <text x="-45" y="5" fontFamily="Arial" fontSize="11" fill="#A296ca">W</text>
        </g>
      </svg>

      {/* Legend */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(162, 150, 202, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#A296ca',
            borderRadius: '4px',
            border: '2px solid #fff'
          }} />
          <span style={{ fontSize: '0.9rem', color: '#fff' }}>Your Current Division</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#4c1c46',
            borderRadius: '4px',
            border: '2px solid #A296ca'
          }} />
          <span style={{ fontSize: '0.9rem', color: '#fff' }}>Selected Division</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#2b1d5a',
            borderRadius: '4px',
            border: '2px solid #A296ca'
          }} />
          <span style={{ fontSize: '0.9rem', color: '#fff' }}>Other Divisions</span>
        </div>
      </div>

      {/* Navigation Tip */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#282b75',
        borderRadius: '8px',
        borderLeft: '4px solid #A296ca'
      }}>
        <strong style={{ color: '#A296ca' }}>💡 Navigation Tip:</strong>
        <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#fff' }}>
          Click on any continent to explore career opportunities. Your ship 🚢 marks your current position. 
          Dotted lines show possible career pathways from where you are.
        </span>
      </div>
    </div>
  );
};

export default WorldMap;