import { MenuItem } from "@/types/menu_Item";

export interface SidebarProps {
  title?: string; 
  activeItemId?: string;
  onItemClick?: (item: MenuItem) => void;
  onLogout?: () => void; 
  collapsed?: boolean;
  variant?: "default" | "dark";
  menuItems?: MenuItem[];
}