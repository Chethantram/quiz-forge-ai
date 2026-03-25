export default function sitemap() {
  return [
    {
      url: "https://quizforge.jo3.org",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://quizforge.jo3.org/about",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://quizforge.jo3.org/generate-quiz",
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: "https://quizforge.jo3.org/sign-in",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: "https://quizforge.jo3.org/sign-up",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: "https://quizforge.jo3.org/forgot-password",  
      lastModified: new Date(),
      priority: 0.4,
    },
    {
      url: "https://quizforge.jo3.org/change-password",  
      lastModified: new Date(),
      priority: 0.3,
    },
  ]
}