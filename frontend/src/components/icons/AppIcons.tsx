import React from "react";

export const MaintenanceIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0.5}
    aria-hidden
  >
    <g>
      <path
        fillRule="evenodd"
        d="M19.502 4.533l-.007-.007a1.012 1.012 0 0 1 
        .014-1.4L21.528 1.1A3.437 3.437 0 0 0 19.722.057 3.62 3.62 
        0 0 0 18.484.05a5.485 5.485 0 0 0-3.005 1.464 5 5 0 0 0-1.407 
        4.32l-8.259 8.259A4.992 4.992 0 0 0 0 19.014a5.073 5.073 0 0 0 
        1.464 3.543l.007.007a5.073 5.073 0 0 0 3.543 1.464 5.016 5.016 
        0 0 0 3.528-1.464 5.054 5.054 0 0 0 1.393-4.349l8.259-8.259a5 5 0 
        0 0 4.32-1.407 5.484 5.484 0 0 0 1.464-3.005 3.62 3.62 0 0 0-.007-1.237A3.437 
        3.437 0 0 0 22.928 2.5l-2.026 2.019a1.012 1.012 0 0 1-1.4.014zm1.6 2.6a2.994 2.994 
        0 0 1-2.6.841 2 2 0 0 0-1.725.566L8.521 16.8a1.982 1.982 0 0 0-.552 1.782 3.049 
        3.049 0 0 1-.841 2.568 2.933 2.933 0 0 1-2.114.87 3.007 3.007 0 0 1-2.128-.87l-.
        008-.007a3.007 3.007 0 0 1-.87-2.128 2.933 2.933 0 0 1 .87-2.115 3.048 3.048 0 0 
        1 2.567-.841 1.982 1.982 0 0 0 1.783-.552l8.259-8.259a2 2 0 0 0 .566-1.725 2.994 
        2.994 0 0 1 .841-2.6 2.692 2.692 0 0 1 .672-.488 2.947 2.947 0 0 0-.346 1.393 3.029 
        3.029 0 0 0 .863 2.107l.005.012a3.029 3.029 0 0 0 2.107.863 2.947 2.947 0 0 0 1.393-.346 
        2.694 2.694 0 0 1-.488.671z"
      />
      <circle cx="5.028" cy="19" r="1" />
    </g>
  </svg>
);

export const InventoryIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 490.076 490.076"
    aria-hidden
  >
    <g>
      <path
        fill="currentColor"
        d="M489.14,311.5l-45.03-97.583c-0.03-0.065-1.93-4.798-7.617-5.796l-189.762-31.188c-0.172-0.028-1.824-0.291-3.419 0.018 L53.66,208.121c-3.344,0.548-6.195,2.722-7.617,5.796L1.014,311.5c-4.109,9.608,5.339,14.978,9.271,14.485h34.822V448.7 c0,4.999,3.619,9.261,8.554,10.073l189.762,31.188c0.159,0.026,3.147,0.027,3.31,0l189.762-31.188 c4.935-0.813,8.553-5.074,8.553-10.073V325.985h34.822c3.479,0,6.724-1.775,8.598-4.706 C490.341,318.349,490.595,314.66,489.14,311.5z M26.241,305.569l36.073-78.177l103.723-17.05l63.728-10.474l-36.96,105.701H26.241z M234.869,467.865L65.524,440.031V325.985h134.523c4.337,0,8.205-2.742,9.635-6.839l25.187-72.026V467.865z M424.63,440.031 l-169.345,27.834V247.122l25.187,72.024c1.43,4.098,5.298,6.839,9.635,6.839H424.63V440.031z M297.35,305.569l-36.96-105.701 l66.363,10.907l101.087,16.616l36.073,78.177H297.35z"
      />
      <path
        fill="currentColor"
        d="M325.876,83.004h-46.83V0.096h-67.938v82.908h-46.83l80.799,80.331L325.876,83.004z M231.524,103.42V20.512h27.105v82.908 h17.75l-31.303,31.123l-31.303-31.123H231.524z"
      />
    </g>
  </svg>
);

export const ShippingIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="currentColor"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 490 490"
    aria-hidden
  >
    <path
      d="M395.579,264.864V130.878h-63.987V86.044h-41.926V0h-89.332v86.044h
      -41.926v44.835H94.42v133.986L52.54,289.68L114.37,490 L245,432.18L375.63,490l61.83
      -200.32L395.579,264.864z M220.594,20.261h48.811v65.783h-48.811V20.261z M178.668,106.304h21.666 
      h89.332h21.666v24.574H178.668V106.304z M114.681,151.139h260.638v101.72L245,175.64l-130.319,
      77.219V151.139z M362.98,462.25 L245,410.03l-117.98,52.22l-50.4-163.28L245,199.19l168.
      38,99.78L362.98,462.25z"
    />
  </svg>
);

export const ServiceTicketIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <rect x="4" y="7" width="16" height="12" rx="2" ry="2" strokeWidth={2} />
    <path
      d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 11h8M8 14h8M8 17h6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// NUEVOS ICONOS
export const PieChartIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M11 3a9 9 0 109 9h-9V3z" strokeWidth={2} />
    <path d="M21 12A9 9 0 1112 3v9h9z" strokeWidth={2} />
  </svg>
);

export const BarChartIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M3 20h18" strokeWidth={2} strokeLinecap="round" />
    <rect x="6" y="10" width="3" height="8" rx="1" strokeWidth={2} />
    <rect x="11" y="6" width="3" height="12" rx="1" strokeWidth={2} />
    <rect x="16" y="13" width="3" height="5" rx="1" strokeWidth={2} />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <circle cx="12" cy="12" r="9" strokeWidth={2} />
    <path
      d="M8.5 12.5l2.5 2.5 4.5-5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// NUEVOS ICONOS INVENTARIO
export const WarningTriangleIcon: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M12 3L1 21h22L12 3z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9v5" strokeWidth={2} strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <circle cx="12" cy="12" r="9" strokeWidth={2} />
    <path d="M9 9l6 6M15 9l-6 6" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M3 12a9 9 0 109-9" strokeWidth={2} strokeLinecap="round" />
    <path d="M3 5v7h7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7v5l3 2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
