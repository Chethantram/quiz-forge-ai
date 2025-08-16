// app/components/HowItWorks.tsx
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: FileText,
    title: "1. Add Your Content",
    description:
      "Upload your notes, paste text, or select a topic you want to practice.",
  },
  {
    icon: Sparkles,
    title: "2. Generate Quizzes",
    description:
      "Our AI instantly creates personalized quizzes based on your material.",
  },
  {
    icon: CheckCircle2,
    title: "3. Learn & Improve",
    description:
      "Take the quiz, review answers, and track your progress effortlessly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-indigo-600/80">
          How It Works
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="rounded-2xl shadow-lg border-2 border-emerald-500/50 hover:shadow-xl transition-shadow bg-transparent"
            >
              <CardContent className="p-8 flex flex-col  items-center text-center">
                <step.icon className="w-14 h-14 mb-6 text-emerald-500" />
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
