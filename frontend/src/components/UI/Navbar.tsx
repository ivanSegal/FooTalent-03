"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/Logo.png";
import { NavbarProps } from "@/types/NavbarProps";

const Navbar: React.FC<NavbarProps> = ({
  userName = "Gary Jimenez",
  avatarSrc,
  avatarAlt = "User Avatar",
  onNotificationClick,
  onSettingsClick,
  notificationCount,
  variant = "default",
  className = "",
}) => {
  const navbarStyles = {
    default: "bg-white shadow-sm border-b border-gray-200",
    dark: "bg-[#1E293B] shadow-sm border-b border-gray-700",
  };

  const textStyles = {
    default: "text-gray-900",
    dark: "text-white",
  };

  const iconStyles = {
    default: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
    dark: "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
  };

  return (
    <nav className={`${navbarStyles[variant]} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-400">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={avatarAlt}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image src={logo} alt="Logo" width={40} height={40} className="object-cover" />
              )}
            </div>
            <h1 className={`${textStyles[variant]} text-lg font-medium`}>{userName}</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notificaciones */}
            <button
              onClick={onNotificationClick}
              className={`relative p-2 ${iconStyles[variant]} rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none`}
              aria-label={`Notificaciones${
                notificationCount ? ` (${notificationCount} sin leer)` : ""
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 
                  0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 
                  1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 min-w-[20px] items-center 
                justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Configuración */}
            <button
              onClick={onSettingsClick}
              className={`p-2 ${iconStyles[variant]} rounded-lg focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 focus:outline-none`}
              aria-label="Configuración"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 
                  1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 
                  1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 
                  2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 
                  0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 
                  00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 
                  001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
