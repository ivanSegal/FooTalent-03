"use client";
import React from "react";
import { MenuItem } from "@/types/menu_Item";
import { SidebarProps } from "@/types/sidebar_props";
import Image from "next/image";
import logo from "@/assets/images/Logo.png";

const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 
    2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 
    2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 
    2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 
    2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 
    1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 
    00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 
    00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 
    001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const InventoryIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 
    1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 
    21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ConfigIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 
    2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 
    2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 
    1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 
    00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 
    0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 
    4v1m0-10V5m0 14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v1" />
  </svg>
);

// Elementos de menú por defecto 
const defaultMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { id: "users", label: "Usuarios", href: "/users", icon: <UsersIcon /> },
  { id: "maintenance", label: "Mantenimiento", href: "/maintenance", icon: <MaintenanceIcon /> },
  { id: "boats", label: "Embarcaciones", href: "/boats", icon: <InventoryIcon /> },
  { id: "inventory", label: "Inventario", href: "/inventory", icon: <InventoryIcon /> },
  { id: "config", label: "Configuración", href: "/config", icon: <ConfigIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  title = "Dashboard admin",
  menuItems = defaultMenuItems,
  activeItemId,
  onItemClick,
  collapsed = false,
  variant = 'default',
  onLogout 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'dark':
        return {
          container: 'bg-[#1E293B] text-gray-100 border-r border-gray-700',
          title: 'text-gray-100',
          menuItem: 'text-gray-300 hover:bg-gray-700 hover:text-white',
          activeMenuItem: 'bg-gray-700 text-white font-medium border-2 border-[#2551A4]',
          icon: 'text-gray-400',
          logoutButton: 'text-gray-300 hover:bg-gray-700 hover:text-white'
        };
      default:
        return {
          container: 'bg-white text-gray-900 border-r border-gray-200 shadow-sm',
          title: 'text-gray-900',
          menuItem: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
          activeMenuItem: 'bg-blue-50 text-[#3B82F6] font-medium border-2 border-[#2551A4]',
          icon: 'text-gray-500',
          logoutButton: 'text-gray-300 hover:bg-gray-700 hover:text-white'
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} flex flex-col h-full 
    transition-all duration-200 ${classes.container}`}>
      {/* Header */}
      <div className="p-4 border-b border-current/10 min-h-[64px] flex items-center justify-center">
        {collapsed ? (
          <Image src={logo} alt="Logo" width={40} height={40} className="object-cover" />
        ) : (
          <Image src={logo} alt="Logo" width={40} height={40} className="object-cover" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeItemId === item.id || item.active;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick?.(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm 
                    transition-all duration-150 ${
                    isActive ? classes.activeMenuItem : classes.menuItem
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`${classes.icon} ${isActive ? 'text-current' : ''}`}>
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
      <div className="p-4 border-t border-current/10">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
        </div>
        
        {/* Botón de Cerrar Sesión */}
        {!collapsed && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 mt-3 rounded-md 
              text-sm transition-all duration-150 ${classes.logoutButton}`}
          >
            <LogoutIcon />
            <span>Cerrar Sesión</span>
          </button>
        )}
        
        {/* Botón de logout para sidebar colapsado */}
        {collapsed && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center p-2 mt-2 
              rounded-md text-sm transition-all duration-150 ${classes.logoutButton}`}
            title="Cerrar Sesión"
          >
            <LogoutIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ title, description, children, isSelected = false, onClick }) => (
  <div
    className={`flex min-h-[400px] flex-col justify-between rounded-2xl bg-white shadow-sm 
      transition-all cursor-pointer ${
      isSelected ? 'border-2 border-[#2551A4]' : 'border border-gray-200 hover:shadow-md'
    }`}
    style={{ padding: '10px' }}
    onClick={onClick}
  >
    <div className="mb-3">
      <h3 className={`text-sm font-semibold ${isSelected ? 'text-[#3B82F6]' : 'text-[#0E1046]'}`}>
        {title}
      </h3>
      {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

// Modal Component
const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, onClose, children }) => {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-xl 
        border border-white/10 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold text-[#0E1046]">{title}</h3>
          <button
            className="rounded p-1 text-gray-500 transition hover:bg-gray-100
            hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
                1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 
                1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
};

// Main Component
export default function SidebarDemoPage() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("users");
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<string>("default");

  const codeSample = `import Sidebar from "@/components/UI/Sidebar";

const menuItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { id: "maintenance", label: "Mantenimiento", href: "/maintenance", icon: <MaintenanceIcon /> },
  { id: "inventory", label: "Inventario", href: "/inventory", icon: <InventoryIcon /> },
  { id: "users", label: "Usuarios", href: "/users", icon: <UsersIcon /> },
  { id: "config", label: "Configuración", href: "/config", icon: <ConfigIcon /> },
];

export default function Example() {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const handleItemClick = (item) => {
    setActiveItem(item.id);
  };

  const handleLogout = () => {
    // Lógica de logout aquí
    console.log('Cerrando sesión...');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar blanco (default) */}
      <Sidebar
        menuItems={menuItems}
        activeItemId={activeItem}
        onItemClick={handleItemClick}
        onLogout={handleLogout}
        variant="default"
      />
      
      {/* Sidebar oscuro (#1E293B) */}
      <Sidebar
        menuItems={menuItems}
        activeItemId={activeItem}
        onItemClick={handleItemClick}
        onLogout={handleLogout}
        variant="dark"
      />
      
      <main className="flex-1 p-6">
        {/* Tu contenido aquí */}
      </main>
    </div>
  );
};`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSample);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleItemClick = (item: MenuItem) => {
    console.log("Item clickeado:", item.label);
    setActiveItem(item.id);
  };

  const handleLogout = () => {
    console.log("Cerrar sesión clickeado");
    // Aquí iría la lógica de logout
  };

  const cardData = [
    {
      id: "default",
      title: "Variante Default (Blanco) - Con Logo",
      description: "Sidebar blanco con espacio para logo y logout en área de usuario",
      content: (
        <Sidebar
          activeItemId={activeItem}
          onItemClick={handleItemClick}
          onLogout={handleLogout}
          variant="default"
        />
      )
    },
    {
      id: "dark",
      title: "Variante Dark (#1E293B) - Con Logo",
      description: "Sidebar oscuro con espacio para logo y logout en área de usuario",
      content: (
        <Sidebar
          activeItemId={activeItem}
          onItemClick={handleItemClick}
          onLogout={handleLogout}
          variant="dark"
        />
      )
    },
    {
      id: "collapsed-default",
      title: "Sidebar Blanco Colapsado",
      description: "Versión compacta con icono de logo y logout",
      content: (
        <Sidebar
          activeItemId={activeItem}
          onItemClick={handleItemClick}
          onLogout={handleLogout}
          collapsed={true}
          variant="default"
        />
      )
    },
    {
      id: "collapsed-dark",
      title: "Sidebar Dark Colapsado",
      description: "Versión compacta oscura con icono de logo y logout",
      content: (
        <Sidebar
          activeItemId={activeItem}
          onItemClick={handleItemClick}
          onLogout={handleLogout}
          collapsed={true}
          variant="dark"
        />
      )
    },
    {
      id: "interactive",
      title: "Estados Interactivos",
      description: "Demo con navegación funcional y logout",
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded bg-blue-500 px-2 py-1 text-xs text-white 
              transition-colors hover:bg-blue-600"
            >
              {collapsed ? "Expandir" : "Colapsar"}
            </button>
            <span className="text-xs text-gray-600">
              Activo: {defaultMenuItems.find((item) => item.id === activeItem)?.label}
            </span>
          </div>
          <Sidebar
            activeItemId={activeItem}
            onItemClick={handleItemClick}
            onLogout={handleLogout}
            collapsed={collapsed}
            variant="default"
          />
        </div>
      )
    },
    {
      id: "custom",
      title: "Menú Personalizado",
      description: "Sidebar con elementos diferentes y logout funcional",
      content: (
        <Sidebar
          menuItems={[
            { id: "home", label: "Inicio", href: "/home", icon: <DashboardIcon /> },
            { id: "projects", label: "Proyectos", href: "/projects", icon: <InventoryIcon /> },
            { id: "team", label: "Equipo", href: "/team", icon: <UsersIcon /> },
            { id: "settings", label: "Ajustes", href: "/settings", icon: <ConfigIcon /> },
          ]}
          activeItemId="projects"
          onItemClick={handleItemClick}
          onLogout={handleLogout}
          variant="dark"
        />
      )
    }
  ];

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-gray-50 px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Sidebar Demo - Modificado</h1>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-2 
            text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setOpen(true)}
          >
            Guía de uso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" style={{ gap: '20px' }}>
        {cardData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            isSelected={selectedCard === card.id}
            onClick={() => setSelectedCard(card.id)}
          >
            {card.content}
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Cómo usar el Sidebar Modificado">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Sidebar modificado sin título, con espacio para logo y logout en el área de usuario.
          </p>
          <button
            onClick={handleCopy}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 
            text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        
        <pre className="rounded-lg border bg-gray-50 p-3 text-[11px] leading-5 
        whitespace-pre-wrap text-gray-900">
          {codeSample}
        </pre>
      </Modal>
    </main>
  );
}