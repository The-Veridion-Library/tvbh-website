import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from "@/components/ui/map"

export default function HeroSection() {
    return (
        <section className="flex min-h-screen items-center justify-center -mt-12 py-10 lg:py-16 text-neutral-900 transition-colors duration-200 dark:text-neutral-100">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <Badge variant="outline">
                            🔍 The Book Scavenger Hunt
                            <ArrowUpRight />
                        </Badge>

                        <h1 className="font-headingmy-4 text-4xl text-balance md:text-5xl lg:leading-14 dark:text-neutral-100">
                            The Veridion Book Hunt
                        </h1>

                        <p className="text-muted-foreground mb-8 text-balance lg:text-lg dark:text-muted-foreground/80">
                            TVBH is a community-powered book scavenger hunt. We team up with local and national bookstores and libraries to create incredible hiding spots for real books. Crack clues, uncover hidden reads, and share your discoveries with fellow book lovers along the way. It’s part mystery, part adventure, and 100% about the joy of books. 📚✨
                        </p>

                        <div className="flex justify-center gap-2 lg:justify-start">
                            <Button asChild>
                                <Link href="/catalog">Explore the Catalog</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                    </header>

                    <div className="flex items-center justify-center">
                        <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" style={{ height: 400 }}>
                            <Map center={[44.4759, -73.2121]} zoom={13}>
                                <MapTileLayer />
                                <MapZoomControl />

                                {/* Downtown / Church Street */}
                                <MapMarker position={[44.4765, -73.2127]}>
                                    <MapPopup>Hidden near Church Street Marketplace</MapPopup>
                                </MapMarker>

                                {/* Waterfront / Bike Path */}
                                <MapMarker position={[44.4809, -73.2216]}>
                                    <MapPopup>Hidden along the Waterfront</MapPopup>
                                </MapMarker>

                                {/* University of Vermont */}
                                <MapMarker position={[44.4689, -73.1967]}>
                                    <MapPopup>Hidden near UVM Green</MapPopup>
                                </MapMarker>

                                {/* Old North End */}
                                <MapMarker position={[44.4882, -73.2073]}>
                                    <MapPopup>Hidden in the Old North End</MapPopup>
                                </MapMarker>

                                {/* South End / Arts District */}
                                <MapMarker position={[44.4526, -73.2144]}>
                                    <MapPopup>Hidden in the South End Arts District</MapPopup>
                                </MapMarker>

                                {/* Winooski (just outside Burlington) */}
                                <MapMarker position={[44.4914, -73.1856]}>
                                    <MapPopup>Hidden near Winooski Circle</MapPopup>
                                </MapMarker>
                            </Map>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}