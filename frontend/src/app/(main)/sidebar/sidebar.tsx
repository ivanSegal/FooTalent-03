"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types/menu_Item";
import { SidebarProps } from "@/types/sidebar_props";
import Image from "next/image";
import logo from "@/assets/images/Logo.png";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { showAutoAlert, showConfirmAlert } from "@/utils/showAlert";

const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const MaintenanceIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0.5}
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

const InventoryIcon = () => (
  <svg
    className="h-5 w-5"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 490.076 490.076"
  >
    <g>
      <path
        fill="#FFFFFF"
        d="M489.14,311.5l-45.03-97.583c-0.03-0.065-1.93-4.798-7.617-5.796l-189.762-31.188c-0.172-0.028-1.824-0.291-3.419,0.018 L53.66,208.121c-3.344,0.548-6.195,2.722-7.617,5.796L1.014,311.5c-4.109,9.608,5.339,14.978,9.271,14.485h34.822V448.7 c0,4.999,3.619,9.261,8.554,10.073l189.762,31.188c0.159,0.026,3.147,0.027,3.31,0l189.762-31.188 c4.935-0.813,8.553-5.074,8.553-10.073V325.985h34.822c3.479,0,6.724-1.775,8.598-4.706 C490.341,318.349,490.595,314.66,489.14,311.5z M26.241,305.569l36.073-78.177l103.723-17.05l63.728-10.474l-36.96,105.701H26.241z M234.869,467.865L65.524,440.031V325.985h134.523c4.337,0,8.205-2.742,9.635-6.839l25.187-72.026V467.865z M424.63,440.031 l-169.345,27.834V247.122l25.187,72.024c1.43,4.098,5.298,6.839,9.635,6.839H424.63V440.031z M297.35,305.569l-36.96-105.701 l66.363,10.907l101.087,16.616l36.073,78.177H297.35z"
      />
      <path
        fill="#FFFFFF"
        d="M325.876,83.004h-46.83V0.096h-67.938v82.908h-46.83l80.799,80.331L325.876,83.004z M231.524,103.42V20.512h27.105v82.908 h17.75l-31.303,31.123l-31.303-31.123H231.524z"
      />
    </g>
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const ConfigIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v1"
    />
  </svg>
);

const ShippingIcon = () => (
  <svg
    className="h-5 w-5"
    fill="currentColor"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 490 490"
    xmlSpace="preserve"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>{" "}
    <g id="SVGRepo_iconCarrier">
      <path
        d="M395.579,264.864V130.878h-63.987V86.044h-41.926V0h-89.332v86.044h
      -41.926v44.835H94.42v133.986L52.54,289.68L114.37,490 L245,432.18L375.63,490l61.83
      -200.32L395.579,264.864z M220.594,20.261h48.811v65.783h-48.811V20.261z M178.668,106.304h21.666 
      h89.332h21.666v24.574H178.668V106.304z M114.681,151.139h260.638v101.72L245,175.64l-130.319,
      77.219V151.139z M362.98,462.25 L245,410.03l-117.98,52.22l-50.4-163.28L245,199.19l168.
      38,99.78L362.98,462.25z"
      ></path>
    </g>
  </svg>
);

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    className="h-4 w-4 transition-transform duration-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  </svg>
);

interface ExtendedSidebarProps extends SidebarProps {
  onToggleCollapse?: () => void;
}

// Elementos de menú por defecto
const defaultMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { id: "users", label: "Usuarios", href: "/users", icon: <UsersIcon /> },
  { id: "maintenance", label: "Mantenimiento", href: "/maintenance", icon: <MaintenanceIcon /> },
  { id: "vassels", label: "Embarcaciones", href: "/vassels", icon: <ShippingIcon /> },
  { id: "inventory", label: "Inventario", href: "/inventory", icon: <InventoryIcon /> },

  {
    id: "service-ticket",
    label: "Boleta de servicio",
    href: "/boleta-servicio",
    icon: <InventoryIcon />,
  },

  { id: "config", label: "Configuración", href: "/config", icon: <ConfigIcon /> },
];

const Sidebar: React.FC<ExtendedSidebarProps> = ({
  title = "Dashboard admin",
  menuItems = defaultMenuItems,
  activeItemId = "dashboard",
  onItemClick,
  collapsed: collapsedProp = false,
  variant = "dark",
  onLogout,
  onToggleCollapse,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // current route
  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    showAutoAlert("Sesión cerrada", "Has salido del sistema correctamente", "success", 2000);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };
  const getVariantClasses = () => {
    switch (variant) {
      case "dark":
        return {
          container: "bg-[#1E293B] text-gray-100 border-r border-gray-700",
          title: "text-gray-100",
          menuItem: "text-gray-300 hover:bg-gray-700 hover:text-white",
          activeMenuItem: "bg-gray-700 text-white font-medium border-2 border-[#2551A4]",
          logoutButton: "text-gray-300 hover:bg-gray-700 hover:text-white",
          collapseButton: "text-gray-300 hover:bg-gray-700 hover:text-white",
        };
      default:
        return {
          container: "bg-white text-gray-900 border-r border-gray-200 shadow-sm",
          title: "text-gray-900",
          menuItem: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
          activeMenuItem: "bg-blue-50 text-[#3B82F6] font-medium border-2 border-[#2551A4]",
          icon: "text-gray-500",
          logoutButton: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
          collapseButton: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        };
    }
  };

  const classes = getVariantClasses();

  const handleItemClick = (item: MenuItem) => {
    onItemClick?.(item);
    if (item.href) router.push(item.href);
  };

  const onLogoutClick = async () => {
    const confirmed = await showConfirmAlert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar la sesión?",
      "Sí, salir",
      "Cancelar",
    );
    if (!confirmed) return;
    if (onLogout) {
      await Promise.resolve(onLogout());
    } else {
      handleLogout();
    }
  };

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"} fixed  flex h-screen flex-col transition-all duration-200 ${classes.container}`}
    >
      {/* Header */}
      <div className="flex min-h-[64px] items-center justify-center border-b border-current/10 p-4">
        {collapsed ? (
          <Image src={logo} alt="Logo" width={85} height={40} className="object-cover" />
        ) : (
          <>
            <Image src={logo} alt="Logo" width={85} height={40} className="object-cover" />
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className={`ml-2 rounded-md p-1.5 transition-all duration-150 ${classes.collapseButton}`}
                title="Colapsar sidebar"
              >
                <CollapseIcon collapsed={collapsed} />
              </button>
            )}
          </>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className={`right- absolute top-1/2 z-50 -translate-y-1/2 rounded-l-md p-2 text-white shadow-md`}
            title="Expandir sidebar"
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        )}
      </div>

      {/* Navigation  */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.href
              ? pathname === item.href || pathname.startsWith(item.href + "/")
              : activeItemId === item.id || item.active; // derive active by URL
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-150 ${
                    isActive ? classes.activeMenuItem : classes.menuItem
                  }`}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={`${classes.icon} ${isActive ? "text-current" : ""}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Usuario y Logout */}
      <div className="border-t border-current/10 p-4">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}></div>

        {/* Botón de Cerrar Sesión */}
        {!collapsed && (
          <button
            onClick={onLogoutClick}
            className={`mt-3 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150 ${classes.logoutButton}`}
          >
            <LogoutIcon />
            <span>Cerrar Sesión</span>
          </button>
        )}

        {/* Botón de logout para sidebar colapsado */}
        {collapsed && (
          <button
            onClick={onLogoutClick}
            className={`mt-2 flex w-full items-center justify-center rounded-md p-2 text-sm transition-all duration-150 ${classes.logoutButton}`}
            title="Cerrar Sesión"
          >
            <LogoutIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
