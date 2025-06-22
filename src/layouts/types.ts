/**
 * Layout component types
 * Common type definitions for layout components
 */

import { ReactNode } from "react";

// Base layout props
export interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

// Sidebar navigation item
export interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  isActive?: boolean;
  children?: NavItem[];
}

// Header props
export interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

// Sidebar props
export interface SidebarProps {
  items: NavItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}
