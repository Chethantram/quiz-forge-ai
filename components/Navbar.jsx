"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../app/firebase/config";
import {onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./dark-mode";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Menu, User } from "lucide-react";
import NavigationLoader from "./navigation-loader";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState("Home");
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const currentUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUser({
          id: user.uid,
          name: user.displayName || "User",
          email: user.email,
        });
      } else {
        router.push("/sign-in");
      }
    });
    return () => currentUser();
  }, [router]);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
      toast.success("Logout Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const currentUser = onAuthStateChanged(auth, (user) => {
      // setLoading(true);
      try {
        if (user) {
          setUserEmail(user.email);
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    });
    return () => currentUser();
  }, [auth]);

  const getUserId = async () => {
    setLoading(true);
    try {
      if (!userEmail) toast.error("User is not found");
      const res = await axios.post("/api/user/get", { email: userEmail });
      if (res?.data?.success) {
        setUserId(res?.data?.data?._id);
      } else {
        toast.error(res.data.error || "Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error in getUser:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (name) => {
    setMenu(name);
    setOpen(false); // close sheet after click
  };


  useEffect(() => {
    if (userEmail) {
      getUserId();
    }
  }, [userId, userEmail]);


  useEffect(() => {
  if (pathname === "/") setMenu("Home");
  else if (pathname === "/generate-quiz") setMenu("Generate");
  else if (pathname.startsWith("/my-quiz")) setMenu("Quiz");
  else if (pathname === "/about") setMenu("About");
  setLoading(false);
}, [pathname]);
  

if(loading)
{
  return <NavigationLoader/>
}

  return (
    <nav className="flex justify-between items-center py-3">
      <div className="flex items-center">
        <Image
          src={"/logo.png"}
          width={40}
          height={40}
          alt="logo"
          className="mr-2 w-10 h-14"
        />
        <Link
          href={"/"}
          className="text-lg md:text-2xl lg:text-xl font-semibold pt-1 text-gray-800 dark:text-gray-200"
        >
          QuizForge{" "}
          <span className="text-[#4F46E5] dark:text-indigo-500">AI</span>
        </Link>
      </div>
      <div className="hidden lg:block">
        <ul className="md:space-x-10 ">
          <Link
            onClick={() => setMenu("Home")}
            href={"/"}
            className={`${
              menu === "Home"
                ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80  dark:bg-gray-900/60 p-2 px-4 rounded-md"
                : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
            } font-mono  `}
          >
            Home
          </Link>
          <Link
            onClick={() => setMenu("Generate")}
            href={"/generate-quiz"}
            className={`${
              menu === "Generate"
                ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80 dark:bg-gray-900/60 p-2 px-4 rounded-md"
                : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
            } font-mono  `}
          >
            GenerateQuiz
          </Link>
          <Link
            onClick={() => setMenu("Quiz")}
            href={`/my-quiz/${userId}`}
            className={`${
              menu === "Quiz"
                ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80 dark:bg-gray-900/60 p-2 px-4 rounded-md"
                : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
            } font-mono  `}
          >
            MyQuiz
          </Link>
          <Link
            onClick={() => setMenu("About")}
            href={"/about"}
            className={`${
              menu === "About"
                ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80 dark:bg-gray-900/60 p-2 px-4 rounded-md"
                : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
            } font-mono  `}
          >
            About
          </Link>
        </ul>
      </div>

      <div className="flex items-center gap-3 md:gap-4 ">
        {userEmail ? (
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer w-9 h-9 md:w-10 md:h-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40">
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            className="border-2 border-indigo-600/30 px-6 py-2 rounded-full bg-transparent text-gray-800 dark:text-gray-100 hover:bg-indigo-50"
            onClick={() => router.push("/sign-in")}
          >
            Login
          </Button>
        )}
        <ModeToggle />

        {/* Mobile navbar */}
        <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2 rounded-md border-2 border-gray-400/40 dark:border-gray-100/20 hover:bg-gray-100 dark:hover:bg-gray-900">
          <Menu className="size-4 text-gray-800 dark:text-gray-100" />
        </SheetTrigger>
        <SheetContent className="p-2">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Choose what you want and close it.</SheetDescription>
          </SheetHeader>
          <div>
            <ul className="md:space-x-10 flex flex-col font-medium text-gray-800 dark:text-gray-100">
              <Link
                href="/"
                onClick={() => handleNavClick("Home")}
                className={`${
                  menu === "Home"
                    ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80  dark:bg-gray-900/60 p-2 px-4 rounded-md"
                    : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
                } font-mono`}
              >
                Home
              </Link>
              <Link
                href="/generate-quiz"
                onClick={() => handleNavClick("Generate")}
                className={`${
                  menu === "Generate"
                    ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80 dark:bg-gray-900/60 p-2 px-4 rounded-md"
                    : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
                } font-mono`}
              >
                GenerateQuiz
              </Link>
              <Link
                href={`/my-quiz/${userId}`}
                onClick={() => handleNavClick("Quiz")}
                className={`${
                  menu === "Quiz"
                    ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80 dark:bg-gray-900/60 p-2 px-4 rounded-md"
                    : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
                } font-mono`}
              >
                MyQuiz
              </Link>
              <Link
                href="/about"
                onClick={() => handleNavClick("About")}
                className={`${
                  menu === "About"
                    ? "bg-indigo-100/80 text-indigo-600 dark:text-indigo-400/80 dark:bg-gray-900/60 p-2 px-4 rounded-md"
                    : "hover:bg-indigo-100/60 p-2 px-4 rounded-md dark:hover:bg-gray-900/40"
                } font-mono`}
              >
                About
              </Link>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
      </div>
    </nav>
  );
};

export default Navbar;
