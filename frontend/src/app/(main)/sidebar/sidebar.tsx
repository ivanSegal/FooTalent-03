"use client";

import React, { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu_Item";
import { SidebarProps } from "@/types/sidebar_props";
import Image from "next/image";
import logo from "@/assets/images/Logo.png";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { showAutoAlert, showConfirmAlert } from "@/utils/showAlert";
import {
  DashboardOutlined,
  ToolOutlined,
  InboxOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShopOutlined,
  FileTextOutlined,
  MenuOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

interface ExtendedSidebarProps extends SidebarProps {
  onToggleCollapse?: () => void;
}

// Elementos de menú por defecto con iconos de Ant Design
const defaultMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <DashboardOutlined /> },
  { id: "users", label: "Usuarios", href: "/users", icon: <UserOutlined /> },
  { id: "maintenance", label: "Mantenimiento", href: "/maintenance", icon: <ToolOutlined /> },
  { id: "vassels", label: "Embarcaciones", href: "/vassels", icon: <ShopOutlined /> },
  { id: "inventory", label: "Inventario", href: "/inventory", icon: <InboxOutlined /> },
  {
    id: "service-ticket",
    label: "Boleta de servicio",
    href: "/boleta-servicio",
    icon: <FileTextOutlined />,
  },
  { id: "config", label: "Configuración", href: "/config", icon: <SettingOutlined /> },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Detectar si es mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cerrar menú mobile al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && mobileMenuOpen) {
        const sidebar = document.getElementById('mobile-sidebar');
        const hamburger = document.getElementById('hamburger-button');
        if (sidebar && !sidebar.contains(event.target as Node) && 
            hamburger && !hamburger.contains(event.target as Node)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, mobileMenuOpen]);

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
          title: "text-white",
          menuItem: "text-white hover:bg-gray-700 hover:text-white",
          activeMenuItem: "bg-gray-700 text-white font-medium border-2 border-[#2551A4]",
          logoutButton: "text-white hover:bg-gray-700 hover:text-white",
          collapseButton: "text-white hover:bg-gray-700 hover:text-white",
          hamburger: "bg-[#1E293B] text-white hover:bg-gray-700",
          overlay: "bg-black/50",
        };
      default:
        return {
          container: "bg-white text-gray-900 border-r border-gray-200 shadow-sm",
          title: "text-white",
          menuItem: "text-white hover:bg-gray-50 hover:text-gray-900",
          activeMenuItem: "bg-blue-50 text-[#3B82F6] font-medium border-2 border-[#2551A4]",
          icon: "text-gray-500",
          logoutButton: "text-white hover:bg-gray-50 hover:text-gray-900",
          collapseButton: "text-white hover:bg-gray-50 hover:text-gray-900",
          hamburger: "bg-white text-white hover:bg-gray-50 border border-gray-200",
          overlay: "bg-black/50",
        };
    }
  };

  const classes = getVariantClasses();

  const handleItemClick = (item: MenuItem) => {
    onItemClick?.(item);
    if (item.href) router.push(item.href);
    // Cerrar menú mobile después de navegar
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const onLogoutClick = async () => {
    const confirmed = await showConfirmAlert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar la sesión?",
      "Sí, salir",
      "Cancelar",
    );
    if (!confirmed) return;
    
    // Cerrar menú mobile
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    
    if (onLogout) {
      await Promise.resolve(onLogout());
    } else {
      handleLogout();
    }
  };

  // Componente del contenido del sidebar
  const SidebarContent = ({ isMobileVersion = false }: { isMobileVersion?: boolean }) => (
    <>
      {/* Header */}
      <div className="flex min-h-[64px] items-center justify-center border-b border-current/10 p-4">
        {isMobileVersion && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-md transition-colors z-10"
          >
            <CloseOutlined className="text-lg" />
          </button>
        )}
        
        {collapsed && !isMobileVersion ? (
          <div className="relative">
            <Image src={logo} alt="Logo" width={85} height={40} className="object-cover" />
            <button
              onClick={() => setCollapsed(false)}
              className={`absolute -right-3 top-1/2 -translate-y-1/2 z-50 rounded-full p-1 shadow-md ${classes.collapseButton}`}
              title="Expandir sidebar"
            >
              <RightOutlined className="text-xs" />
            </button>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <Image src={logo} alt="Logo" width={85} height={40} className="object-cover" />
            {!collapsed && !isMobileVersion && (
              <button
                onClick={() => setCollapsed(true)}
                className={`ml-auto rounded-md p-1.5 transition-all duration-150 ${classes.collapseButton}`}
                title="Colapsar sidebar"
              >
                <LeftOutlined />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 p-2 ${isMobileVersion ? 'overflow-y-auto' : ''}`}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.href
              ? pathname === item.href || pathname.startsWith(item.href + "/")
              : activeItemId === item.id || item.active;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-150 ${
                    isActive ? classes.activeMenuItem : classes.menuItem
                  }`}
                  title={collapsed && !isMobileVersion ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={`text-base ${classes.icon} ${isActive ? "text-current" : ""}`}>
                    {item.icon}
                  </span>
                  {(!collapsed || isMobileVersion) && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className={`border-t border-current/10 p-4 ${isMobileVersion ? 'mt-auto' : ''}`}>
        {(!collapsed || isMobileVersion) ? (
          <button
            onClick={onLogoutClick}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150 ${classes.logoutButton}`}
          >
            <LogoutOutlined className="text-base" />
            <span>Cerrar Sesión</span>
          </button>
        ) : (
          <button
            onClick={onLogoutClick}
            className={`flex w-full items-center justify-center rounded-md p-2 text-sm transition-all duration-150 ${classes.logoutButton}`}
            title="Cerrar Sesión"
          >
            <LogoutOutlined className="text-base" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex ${collapsed ? "w-16" : "w-64"} text-white fixed flex-col h-screen transition-all duration-200 ${classes.container} z-30`}>
        <SidebarContent />
      </div>

      {/* Mobile Hamburger Button */}
      <button
  id="hamburger-button"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="md:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-200 bg-[#496490] hover:bg-[#3d5578]"
>
        {mobileMenuOpen ? <CloseOutlined className="text-xl "style={{ color: 'white' }} /> : <MenuOutlined className="text-xl" style={{ color: 'white' }} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-40  ${classes.overlay}`} />
      )}

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`md:hidden fixed bottom-0 left-0 right-0 h-[85vh] max-h-[700px] transform transition-transform duration-300 z-50 ${
          mobileMenuOpen ? "translate-y-0" : "translate-y-full"
        } ${classes.container} rounded-t-2xl flex flex-col`}
      >
        <SidebarContent isMobileVersion={true} />
      </div>
    </>
  );
};

export default Sidebar;