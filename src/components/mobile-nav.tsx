"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden focus-visible:ring-0 focus-visible:ring-offset-0">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold">OneDollarVentures</span>
          </Link>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explore" className="border-b-0">
              <AccordionTrigger className="hover:no-underline">Explore</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/discover"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Discover
                  </Link>
                  <Link
                    href="/projects"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Browse Projects
                  </Link>
                  <Link
                    href="/creators"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Discover Creators
                  </Link>
                  <Link
                    href="/stats"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Stats
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myspace" className="border-b-0">
              <AccordionTrigger className="hover:no-underline">My Stuff</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/portfolio"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    What I Backed
                  </Link>
                  <Link
                    href="/portfolio/activity"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Activity
                  </Link>
                  <Link
                    href="/portfolio/following"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Following
                  </Link>
                  <Link
                    href="/dashboard/backer"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Backer Dashboard
                  </Link>
                  <Link
                    href="/dashboard/creator"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Creator Dashboard
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account" className="border-b-0">
              <AccordionTrigger className="hover:no-underline">Account</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/wallet"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Wallet & Earnings
                  </Link>
                  <Link
                    href="/notifications"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Notifications
                  </Link>
                  <Link
                    href="/settings"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/profile"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/admin"
                    className="py-2 px-4 hover:bg-accent/10 rounded-md text-accent"
                    onClick={() => setOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link href="/submit" onClick={() => setOpen(false)}>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">I built something</Button>
          </Link>

          <Button className="w-full bg-transparent" variant="outline">
            Connect Wallet
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
