// app/components/Testimonials.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Student, B.Tech CSE",
    feedback:
      "This platform made learning so much easier! The AI-generated quizzes helped me revise quickly and identify weak areas.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer Intern",
    feedback:
      "I love how simple and intuitive it is. Creating quizzes from my notes saved me hours of preparation time.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Priya Nair",
    role: "MBA Aspirant",
    feedback:
      "The personalized quizzes are amazing! It feels like having a personal tutor available 24/7.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-indigo-500">
          What Our Users Say
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <Card
              key={index}
              className="rounded-2xl shadow-lg border border-indigo-500/50 bg-indigo-100/40 dark:bg-gray-900/20  hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Avatar className="w-16 h-16 mb-4">
                  <AvatarImage src={t.image} alt={t.name} />
                  <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-indigo-500">{t.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.role}</p>
                <p className="text-muted-foreground italic">“{t.feedback}”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
