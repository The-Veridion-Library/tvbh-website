import {
  BookOpen,
  FileText,
  GlobeIcon,
  HelpCircle,
  History,
  Leaf,
  Mail,
  Puzzle,
  ScrollText,
  Star,
  Users,
} from "lucide-react";
import type { LinkItemType } from "@/components/sheard";

export const contentsLinks: LinkItemType[] = [
  {
    label: "Latest Edition",
    href: "/",
    description: "Read the most recent issue of the Chronicle",
    icon: BookOpen,
  },
  {
    label: "Archive",
    href: "/archive",
    description: "Browse past editions and features",
    icon: ScrollText,
  },
  {
    label: "Weekly Picks",
    href: "/weekly-picks",
    description: "Word, animal, and location picks for the week",
    icon: Star,
  },
  {
    label: "Games & Puzzles",
    href: "/games",
    description: "Crosswords, sudoku, and riddles",
    icon: Puzzle,
  },
  {
    label: "Recipes",
    href: "/recipes",
    description: "Curated recipes featured in the Chronicle",
    icon: Leaf,
  },
  {
    label: "This Edition in History",
    href: "/history",
    description: "A look back at notable moments in time",
    icon: History,
  },
];

export const aboutLinks: LinkItemType[] = [
  {
    label: "About the Chronicle",
    href: "/about",
    description: "What The Veridion Chronicle is and why it exists",
    icon: Users,
  },
  {
    label: "Our Editors’ Picks",
    href: "/editors-picks",
    description: "Highlighted features and favorites",
    icon: Star,
  },
  {
    label: "Community Submissions",
    href: "/submissions",
    description: "Suggest a word, recipe, or riddle",
    icon: Mail,
  },
];

export const aboutLinks2: LinkItemType[] = [
  {
    label: "Subscribe",
    href: "/subscribe",
    icon: Mail,
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