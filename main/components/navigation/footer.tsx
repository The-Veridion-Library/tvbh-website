"use client";

import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "lucide-react";

const footerLinks = [
  {
    title: "The Hunt",
    links: [
      { href: "/about", label: "What Is TVBH?" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/catalog", label: "Browse the Book Catalog" },
      { href: "/map", label: "Hunt Map" },
    ],
  },
  {
    title: "Players",
    links: [
      { href: "/join", label: "Join the Hunt" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/xp", label: "XP & Ranks" },
      { href: "/logbook", label: "Your Logbook" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Community Hub" },
      { href: "/nominate-hunt-stop", label: "Nominate a Location" },
      { href: "/partners", label: "Partner Locations" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

const socialLinks = [
  { icon: TwitterIcon, href: "#" },
  { icon: InstagramIcon, href: "#" },
  { icon: FacebookIcon, href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Links */}
        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          {footerLinks.map((item) => (
            <div key={item.title}>
              <h3 className="mb-4 text-xs">{item.title}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {item.links.map((link) => (
                  <li key={link.label}>
                    <a className="hover:text-foreground" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Social + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, href }, index) => (
              <Button
                asChild
                key={`social-${index}`}
                size="icon-sm"
                variant="outline"
              >
                <a href={href}>
                  <Icon />
                </a>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <a href="/join">Join the Hunt</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/catalog">Browse Catalog</a>
            </Button>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="py-4 text-center text-muted-foreground text-xs">
          <p>
            &copy; {new Date().getFullYear()} Veridion Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}