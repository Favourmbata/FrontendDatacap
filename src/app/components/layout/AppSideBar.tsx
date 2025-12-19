"use client";

import {
  
  CreditCard,
  Home,
  Medal,
  Pen,
  Settings,
  Shield,
  User,
  Users,
  FileText,
} from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/sidebar";

export type NavItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: NavItem[]; 
};

// Define navigation items for different user roles
const userNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: <Home />,
  },
];

const adminNavItems: NavItem[] = [
  ...userNavItems,
  {
    name: "Users",
    href: "/admin/user-management",
    icon: <Users />,
    subItems: [
      {
        name: "Landing Page",
        href: "/#",
        subItems: [
          {
            name: "Create Content",
            href: "admin/user-management/landing-page/create-content",
            icon: <Users />,
          },
          { name: "View Content", href: "/users/landing-page/view-content" },
        ],
      },
      {
        name: "Class Schedule",
        href: "/users/class-schedule",
      },
      {
        name: "Recordings",
        href: "/users/recordings",
      },
      {
        name: "Learning Calendars",
        href: "/users/learning-calendars",
      },
    ],
  },
  { name: "Assessment", href: "/", icon: <Pen /> },
  { name: "Certificates", href: "/", icon: <Medal /> },
  { name: "Payments", href: "/", icon: <CreditCard /> },
];

const superAdminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/super-admin",
    icon: <Home />,
  },
  {
    name: "Role Management",
    href: "/super-admin/role-management",
    icon: <Shield />,
  },
  {
    name: "User Management",
    href: "/super-admin/users",
    icon: <Users />,
  },
  {
    name: "Organisation",
    href: "/super-admin/organisation",
    icon: <FileText />,
  },
  { name: "Assessment", href: "/super-admin/assessment", icon: <Pen /> },
  { name: "Certificates", href: "/super-admin/certificates", icon: <Medal /> },
  { name: "Payments", href: "/super-admin/payments", icon: <CreditCard /> },
];

// const superAdminNavItems: NavItem[] = [...adminNavItems];

const navFooterItems: NavItem[] = [
  {
    name: "Settings",
    href: "/",
    icon: <Settings />,
  },
  { name: "Profile", href: "/", icon: <User /> },
];

const AppSidebar = () => {
  // For now, we'll use adminNavItems as default
  // In a real app, this would be determined by user role
  const navItems = adminNavItems;
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row">
        <Image src={"/images/logo.png"} width={24} height={24} alt="" />
        {open && <span className="font-bold text-lg">Gamai</span>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((navItem) => (
            <SidebarMenuItem
              key={navItem.name}
              name={navItem.name}
              href={navItem.href}
              icon={navItem.icon}
              subItems={navItem.subItems}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {navFooterItems.map((footerItem) => (
            <SidebarMenuItem
              key={footerItem.name}
              name={footerItem.name}
              href={footerItem.href}
              icon={footerItem.icon}
            />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
