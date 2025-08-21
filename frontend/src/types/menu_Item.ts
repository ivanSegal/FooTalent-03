export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}
