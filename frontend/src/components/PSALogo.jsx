import '../styles/PSALogo.css';

const PSALogo = () => (
  <div className="psa-logo-container">
    <svg 
      width="60" 
      height="60" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        stroke="#A296ca" 
        strokeWidth="3" 
        fill="none"
      />
      <path 
        d="M30 50 Q50 30 70 50 Q50 70 30 50" 
        stroke="#A296ca" 
        strokeWidth="3" 
        fill="none"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="8" 
        fill="#A296ca"
      />
    </svg>
    <span className="psa-logo-text">PSA</span>
  </div>
);

export default PSALogo;
