import {
  BookOpen,
  FileText,
  GlobeIcon,
  HelpCircle,
  Map,
  ScrollText,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { LinkItemType } from "@/components/sheard";

export const contentsLinks: LinkItemType[] = [
  {
    label: "Catalog",
    href: "/catalog",
    description: "Browse all available hunts and hidden books",
    icon: BookOpen,
  },
  {
    label: "Hunt Map",
    href: "/map",
    description: "Explore hunts by location",
    icon: Map,
  },
  {
    label: "Current Hunts",
    href: "/hunts",
    description: "See what adventures are live right now",
    icon: ScrollText,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    description: "Top hunters and recent achievements",
    icon: Trophy,
  },
  {
    label: "XP & Ranks",
    href: "/xp",
    description: "Learn how leveling works",
    icon: Star,
  },
];

export const aboutLinks: LinkItemType[] = [
  {
    label: "What Is TVBH?",
    href: "/about",
    description: "How The Veridion Book Hunt works",
    icon: Users,
  },
  {
    label: "Community Hub",
    href: "/community",
    description: "Stories, photos, and updates from hunters",
    icon: Users,
  },
  {
    label: "Nominate a Location",
    href: "/nominate-hunt-stop",
    description: "Suggest a bookstore or library for a future hunt",
    icon: Map,
  },
];

export const aboutLinks2: LinkItemType[] = [
  {
    label: "Join the Hunt",
    href: "/join",
    icon: BookOpen,
  },
  {
    label: "Terms",
    href: "/terms",
    icon: FileText,
  },
  {
    label: "Privacy",
    href: "/privacy",
    icon: GlobeIcon,
  },
  {
    label: "Help & FAQ",
    href: "/help",
    icon: HelpCircle,
  },
];