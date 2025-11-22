import { SubmissionForm } from "@/components/submit/submission-form";

export default function SubmitPage() {
    return (
        <div className="container py-12">
            <div className="max-w-2xl mx-auto mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Your Project</h1>
                <p className="text-muted-foreground">
                    Pitch your idea to the community. If selected, you'll get 24 hours in the spotlight.
                </p>
            </div>
            <SubmissionForm />
        </div>
    );
}
