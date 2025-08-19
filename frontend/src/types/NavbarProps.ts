export interface NavbarProps {

  userName?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  notificationCount?: number;
  variant?: 'default' | 'dark';
  className?: string;
}