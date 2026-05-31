import {
  Activity,
  Bell,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Clapperboard,
  Code2,
  Gem,
  Globe2,
  Handshake,
  Home,
  MessageCircle,
  Scale,
  Settings
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Command Center", href: "/hermes", icon: MessageCircle },
  { label: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "Browser", href: "/browser", icon: Globe2 },
  { label: "Memory", href: "/memory", icon: BrainCircuit },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Codex", href: "/codex", icon: Code2 },
  { label: "Automations", href: "/automations", icon: Scale },
  { label: "Content Studio", href: "/content", icon: Clapperboard },
  { label: "GoHighLevel", href: "/gohighlevel", icon: Handshake },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings }
];

export const statusNavigationIcon = Bell;
export const brandIcon = Gem;
