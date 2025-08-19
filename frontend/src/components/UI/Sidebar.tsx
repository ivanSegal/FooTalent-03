"use client";

import React from "react";
import { MenuItem } from "@/types/menu_Item";
import { SidebarProps } from "@/types/sidebar_props";

// Iconos por defecto
const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 
      012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 
      2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 
      1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 
      1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 
      1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 
      00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 
      0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const InventoryIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 
      0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 
      00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
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

// Elementos de menú por defecto
const defaultMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { id: "maintenance", label: "Mantenimiento", href: "/maintenance", icon: <MaintenanceIcon /> },
  { id: "inventory", label: "Inventario", href: "/inventory", icon: <InventoryIcon /> },
  { id: "users", label: "Usuarios", href: "/users", icon: <UsersIcon /> },
  { id: "config", label: "Configuración", href: "/config", icon: <ConfigIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  title,
  activeItemId,
  onItemClick,
  collapsed = false,
  variant = "default",
  menuItems = defaultMenuItems,
}) => {
  
  const handleItemClick = (item: MenuItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      console.log('Item clicked:', item.label);
    }
  };
  
  // Clases según la variante
  const getVariantClasses = () => {
    switch (variant) {
      case "dark":
        return {
          container: "bg-gray-900 text-gray-200 border-r border-gray-800",
          title: "text-gray-100 font-semibold",
          item: "text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200",
          activeItem: "bg-gray-800 text-white font-medium shadow-md border-r-2 border-blue-500",
          icon: "text-gray-400",
          activeIcon: "text-blue-400",
        };
      default:
        return {
          container: "bg-[#1E293B] text-gray-200 border-r border-slate-700",
          title: "text-gray-100 font-semibold",
          item: "text-gray-300 hover:bg-slate-700 hover:text-white transition-all duration-200",
          activeItem: "bg-slate-700 text-white font-medium shadow-md border-r-2 border-blue-500",
          icon: "text-gray-400",
          activeIcon: "text-blue-400",
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <nav
      className={`flex h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } ${classes.container}`}
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      <div className={`flex items-center px-4 py-6 ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && (
          <h2 className={`text-lg ${classes.title} truncate`}>
            {title}
          </h2>
        )}
      </div>

      {/* Navigation items */}
      <ul className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className={`group flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                  isActive ? classes.activeItem : classes.item
                }`}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={`flex-shrink-0 ${
                    isActive ? classes.activeIcon : classes.icon
                  } group-hover:scale-110 transition-transform duration-200`}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="ml-3 truncate font-medium">{item.label}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-slate-700/50 px-4 py-3">
          <div className="text-xs text-gray-400">
            © 2025 Dashboard
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;