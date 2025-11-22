import { QueueList } from "@/components/queue/queue-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function QueuePage() {
    return (
        <div className="container py-12 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Upcoming Projects</h1>
                    <p className="text-muted-foreground">
                        See what's next in the spotlight. Join the queue to get featured.
                    </p>
                </div>
                <Link href="/submit">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Project
                    </Button>
                </Link>
            </div>

            <QueueList />
        </div>
    );
}
