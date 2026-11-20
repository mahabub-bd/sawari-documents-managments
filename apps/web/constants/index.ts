const backendUrl = process.env.NEXT_PUBLIC_API_URL;

import { AdminSidebarMenuItem, Brand, MenuItem } from "@/types";
import { Activity, FileText, Home, Users } from "lucide-react";

const adminSidebarMenu: AdminSidebarMenuItem[] = [
  {
    id: 1,
    title: "Home",
    href: "/dashboard",
    icon: Home,
    tone: "sky",
    isAdminMenu: false,
  },

  {
    id: 2,
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    tone: "emerald",
    isAdminMenu: false,
  },

  {
    id: 3,
    title: "User List",
    href: "/dashboard/users",
    icon: Users,
    tone: "violet",
    isAdminMenu: true,
  },
  {
    id: 4,
    title: "User Activity",
    href: "/dashboard/user-activity",
    icon: Activity,
    tone: "amber",
    isAdminMenu: true, // Restricted to admin
  },
];

const menuItems: MenuItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Skill", href: "/skill" },
  { title: "Documents", href: "/blog" },
  { title: "Service", href: "/service" },
  { title: "Contact", href: "/contact" },
];

const brands: Brand[] = [
  { id: "honda", name: "Honda", logo: "https://www.google.com/s2/favicons?domain=honda.com&sz=64" },
  { id: "yamaha", name: "Yamaha", logo: "https://www.google.com/s2/favicons?domain=global.yamaha-motor.com&sz=64" },
  { id: "suzuki", name: "Suzuki", logo: "https://www.google.com/s2/favicons?domain=globalsuzuki.com&sz=64" },
  { id: "tvs", name: "TVS", logo: "https://www.google.com/s2/favicons?domain=tvsmotor.com&sz=64" },
  { id: "bazaz", name: "Bazaz" },
  { id: "lifan", name: "Lifan", logo: "https://www.google.com/s2/favicons?domain=lifan.com&sz=64" },
  { id: "bajaj", name: "Bajaj", logo: "https://www.google.com/s2/favicons?domain=bajajauto.com&sz=64" },
  { id: "royal-enfield", name: "Royal Enfield", logo: "https://www.google.com/s2/favicons?domain=royalenfield.com&sz=64" },
  { id: "hero", name: "Hero", logo: "https://www.google.com/s2/favicons?domain=heromotocorp.com&sz=64" },
  { id: "zontes", name: "Zontes", logo: "https://www.google.com/s2/favicons?domain=zontes.com&sz=64" },
  { id: "haojue", name: "Haojue", logo: "https://www.google.com/s2/favicons?domain=haojue.com&sz=64" },
  { id: "runner", name: "Runner", logo: "https://www.google.com/s2/favicons?domain=runnerbd.com&sz=64" },
  { id: "ktm", name: "KTM", logo: "https://www.google.com/s2/favicons?domain=ktm.com&sz=64" },
  { id: "aprilia", name: "Aprilia", logo: "https://www.google.com/s2/favicons?domain=aprilia.com&sz=64" },
  { id: "kawasaki", name: "Kawasaki", logo: "https://www.google.com/s2/favicons?domain=kawasaki.com&sz=64" },
  { id: "benelli", name: "Benelli", logo: "https://www.google.com/s2/favicons?domain=benelli.com&sz=64" },
  { id: "keeway", name: "Keeway", logo: "https://www.google.com/s2/favicons?domain=keeway.com&sz=64" },
  { id: "taro", name: "Taro" },
  { id: "vespa", name: "Vespa", logo: "https://www.google.com/s2/favicons?domain=vespa.com&sz=64" },
  { id: "roadmaster", name: "Roadmaster" },
  { id: "h-power", name: "H Power" },
  { id: "speeder", name: "Speeder" },
  { id: "fkm", name: "FKM" },
  { id: "gpx", name: "GPX" },
  { id: "zenin", name: "Zenin" },
  { id: "php", name: "PHP" },
  { id: "cfmoto", name: "CFMoto", logo: "https://www.google.com/s2/favicons?domain=cfmoto.com&sz=64" },
  { id: "bmw", name: "BMW", logo: "https://www.google.com/s2/favicons?domain=bmw.com&sz=64" },
];

export { adminSidebarMenu, backendUrl, brands, menuItems };
