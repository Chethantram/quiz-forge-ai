"use client";

import { auth } from "@/app/firebase/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { EditProfile } from "./_components/EditProfile";
import NavigationLoader from "@/components/navigation-loader";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = React.useState({
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
    difficulty: "Not set",
    role: "Student",
    quizCompleted: [],
    averageScore: 0,
  });
  const [userEmail, setUserEmail] = React.useState("");

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/get", { email: userEmail });
      if (res.data.success) {
        setUser({
          name: res?.data?.data?.name,
          email: res?.data?.data?.email,
          avatarUrl: res?.data?.data?.avatarUrl || "",
          difficulty: res?.data?.data?.difficulty || "Not set",
          role: res?.data?.data?.role || "User",
          averageScore: res?.data?.data?.averageScore || 0,
          quizCompleted: res?.data?.data?.quizCompleted || [],
        });
      
      } else {
        toast.error(res.data.error || "Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error in getUser:", error);
      toast.error("Failed to fetch user data");
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    const currentUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/sign-in");
      }
    });
    return () => currentUser();
  }, []);

  useEffect(() => {
    if (userEmail) {
      getUser();
    }
  }, [userEmail]);

  if (loading) {
    return <NavigationLoader/>
  }

  return (
    <div className="md:mt-16 lg:mt-10 w-full mx-auto">
      <div className=" py-8">
        <div className="max-w-3xl mx-auto border border-indigo-500 bg-gray-100 dark:bg-gray-900/80 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl md:text-2xl font-bold text-indigo-500">Profile Information</h1>
            <EditProfile user={user}  >Edit</EditProfile>
          </div>

          <div className="space-y-4 text-gray-800 dark:text-gray-100">
            {/* <label className="text-sm text-gray-600">Avatar URL</label> */}
            <div className="mx-auto flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center justify-center">
                <Avatar className={"w-32 h-32"}>
                  <AvatarImage
                    src={user.avatarUrl || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>
                    <Image
                      src={"/default-avatar.webp"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover mx-auto rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
                
                <p className="font-medium mt-2">Profile Picture</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3  bg-gray-50 dark:bg-gray-900 rounded-2xl border">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Name</label>
                <p className="font-semibold">{user.name.charAt(0).toUpperCase()+ user.name.slice(1).toLowerCase() || "Not set"}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <div className="flex items-center gap-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Role :</label>
                  <p className="font-semibold">{user.role.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Email</label>
                <p className="font-semibold">{user.email || "Not set"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Difficulty Level
                </label>
                <p className="font-semibold">{user?.difficulty?.charAt(0).toUpperCase() + user?.difficulty?.slice(1) || "Not set"}</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Preferred Language
                </label>
                <p className="font-semibold">{user.language || "English"}</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Quizzes Taken</label>
                <p className="font-semibold">{user?.quizCompleted?.length || "0"}</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Average Score</label>
                <p className="font-semibold">{user.averageScore || "0"}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
