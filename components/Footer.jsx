import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-muted text-gray-800 py-10 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">QuizForge AI</h2>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
            Supercharge your learning with AI-powered quizzes and insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Links</h3>
          <ul className="space-y-2 dark:text-gray-100">
            <li>
              <Link href="/" className="hover:text-emerald-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-500">
                About
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-emerald-500">
                Features
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Follow Us</h3>
          <div className="flex space-x-4 dark:text-gray-100">
            <Link href="https://github.com" target="_blank">
              <Github className="w-6 h-6 hover:text-emerald-400" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-6 h-6 hover:text-emerald-400" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin className="w-6 h-6 hover:text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} QuizForge AI. All rights reserved.
      </div>
    </footer>
  );
}
