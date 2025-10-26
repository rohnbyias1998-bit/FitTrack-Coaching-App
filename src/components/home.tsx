import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell, Users, LineChart, Calendar, ArrowRight } from "lucide-react";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { Feedback } from "@/types/feedback";

export default function Home() {
  // Mock user data for feedback
  const currentUser = {
    id: 999, // Guest user
    name: "Guest User",
    email: "guest@example.com",
  };

  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  const handleFeedbackSubmit = (feedbackData: Omit<Feedback, "id" | "createdAt" | "updatedAt">) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFeedbackList(prev => [...prev, newFeedback]);

    // In real app, this would be sent to the backend and admin notification system
    console.log("New feedback submitted:", newFeedback);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FitTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium hover:text-primary"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Transform Your Fitness Journey
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Track workouts, monitor progress, and achieve your fitness
                    goals with our comprehensive fitness platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/signup">
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                  alt="Fitness Training"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  width="550"
                  height="310"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to track your fitness journey and achieve
                  your goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card className="bg-background">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Workout Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Log your workouts, track sets, reps, and weights with our
                    intuitive workout tracker.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Progress Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Visualize your progress with detailed charts and analytics
                    to stay motivated.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Workout Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access pre-built workout plans or create your own custom
                    routines.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Connect with other fitness enthusiasts, share progress, and
                    stay motivated together.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Your Fitness Journey?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of users who have transformed their fitness
                  with FitTrack.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    Sign Up Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FitTrack</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your all-in-one fitness tracking solution.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Product</h3>
              <a
                href="#features"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Testimonials
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Company</h3>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Careers
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Contact
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Legal</h3>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-8 border-t pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} FitTrack. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-500 hover:text-primary dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackButton
        userId={currentUser.id}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}