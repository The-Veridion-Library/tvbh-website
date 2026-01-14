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
        <section className="flex min-h-screen items-center justify-center -mt-12 py-10 lg:py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <Badge variant="outline">
                            🔍 The Book Scavenger Hunt
                            <ArrowUpRight />
                        </Badge>

                        <h1 className="font-headingmy-4 text-4xl text-balance md:text-5xl lg:leading-14">
                            The Veridion Book Hunt
                        </h1>

                        <p className="text-muted-foreground mb-8 text-balance lg:text-lg">
                            Embark an a literary adventure! Decipher clues, find hidden books, and get rewards for your discoveries. Connect with fellow book lovers, and help out your local book stores and libraries.
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
                        <div style={{ height: 400, width: "100%" }}>
                            <Map center={[43.6532, -79.3832]}>
                                <MapTileLayer />
                                <MapZoomControl />
                                <MapMarker position={[43.6532, -79.3832]}>
                                    <MapPopup>A map component for shadcn/ui.</MapPopup>
                                </MapMarker>
                            </Map>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}