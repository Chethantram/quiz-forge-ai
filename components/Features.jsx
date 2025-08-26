// app/components/Features.tsx
import { Brain, BarChart3, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Quizzes",
    description:
      "Automatically generate quizzes from text, notes, or topics in seconds — no manual effort needed.",
  },
  {
    icon: BarChart3,
    title: "Smart Insights",
    description:
      "Track performance with detailed reports and get AI-driven suggestions to improve weak areas.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Create and share quizzes with classmates, students, or friends instantly accessible anywhere.",
  },
];

export default function Features() {
  return (
    <section id="features" className="md:py-28 py-20 w-full">
      <div className="md:max-w-7xl w-full mx-auto md:px-6 text-start md:text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-indigo-500">
          Powerful Features
        </h2>

        <div className="grid gap-8 md:space-x-5 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-2xl  border-2 bg-indigo-100/40 dark:bg-gray-900/20 border-indigo-500/50 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6 md:p-6 lg:p-6 flex flex-col items-center text-center">
                <feature.icon className="w-12 h-12 mb-4 text-indigo-500" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
