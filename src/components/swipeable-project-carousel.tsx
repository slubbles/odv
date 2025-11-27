"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SwipeableProjectCarouselProps {
  projects: any[]
}

export function SwipeableProjectCarousel({ projects }: SwipeableProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <div className="relative md:hidden">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="w-full flex-shrink-0 px-2">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <Button variant="outline" size="icon" onClick={prev} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? "bg-accent w-4" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={next} disabled={currentIndex === projects.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
