"use client";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { ModeToggle } from "../theme-toggle";

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<a className="rounded-md px-3 py-2.5 hover:bg-accent" href="#">
					</a>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<ModeToggle />
					<Button variant="outline">Sign In</Button>
					<Button>Get Started</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
