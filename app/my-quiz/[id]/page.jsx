"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = ({ params }) => {
  const id = params?.id;
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [titles, setTitles] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchCompletedQuizzes = async () => {
      if (!id) return;
      try {
        const response = await axios.post("/api/user/get-all-quiz", { id });
        const data = response?.data?.data || [];
        setCompletedQuizzes(data);
        // Initialize titles with existing quiz titles
        const initialTitles = {};
        data.forEach((quiz, index) => {
          initialTitles[quiz._id] = quiz.title || `Untitled Quiz ${index + 1}`;
        });
        setTitles(initialTitles);
      } catch (error) {
        console.error("Error fetching completed quizzes:", error);
      }
      setLoading(false);
    };

    fetchCompletedQuizzes();
  }, [id]);

  const handleEditClick = (quizId) => {
    setEditingQuizId(quizId);
  };

  const handleTitleChange = (quizId, newTitle) => {
    setTitles((prev) => ({
      ...prev,
      [quizId]: newTitle,
    }));
  };

  const handleUpdate = async () => {
    setButtonLoading(true);
    try {
      const res = await axios.post("/api/quiz/update-title", {
        userId: id,
        quizId: editingQuizId,
        title: titles[editingQuizId],
      });

      if (res?.data?.success) {
        toast.success("Title updated successfully!");
        const updatedQuizzes = completedQuizzes.map((quiz) =>
          quiz._id === editingQuizId
            ? { ...quiz, title: titles[editingQuizId] }
            : quiz
        );
        setCompletedQuizzes(updatedQuizzes);
        setTitles((prev) => ({
          ...prev,
          [editingQuizId]: titles[editingQuizId],
        }));
        setEditingQuizId(null);
      } else {
        toast.error(res?.data?.error || "Failed to update title");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quiz");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-indigo-500 dark:text-indigo-400">
        My Completed Quizzes
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : completedQuizzes.length === 0 ? (
        <p>No completed quizzes found.</p>
      ) : (
        <ul className="space-y-4">
          {completedQuizzes.map((quiz, index) => (
            <li
              key={quiz._id}
              className="border-2 border-indigo-500/40 dark:border-indigo-400/40 p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50 flex items-center justify-between"
            >
              {/* main div */}
              <div className="flex flex-col gap-2 w-full ">
                {/* title */}
                <div className="font-semibold space-y-3 flex items-center gap-4 w-full">
                  {editingQuizId === quiz._id ? (
                    // Input field
                    <div className="flex items-center gap-2 md:gap-5 w-full">
                      <Input
                        value={titles[quiz._id]}
                        onChange={(e) =>
                          handleTitleChange(quiz._id, e.target.value)
                        }
                        className="lg:w-1/2 w-full"
                        type="text"
                      />
                      <Button
                        onClick={handleUpdate}
                        variant={"outline"}
                        className={
                          "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white rounded-sm cursor-pointer dark:hover:bg-indigo-600 dark:bg-indigo-500 py-1 md:py-2 "
                        }
                      >
                        {buttonLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            processing
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>

                  ) : (
                    // Edit button
                    <div>
                      <Link href={`${id}/${quiz?._id}`}>
                        {titles[quiz._id]}
                      </Link>
                      <Button
                        onClick={() => handleEditClick(quiz._id)}
                        className="size-8 cursor-pointer"
                        variant="ghost"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {/* score and date */}
                <div className="flex items-center justify-between">
                <Badge
                  className={`${
                    quiz.averageScore >= 80
                      ? "bg-green-500"
                      : quiz.averageScore >= 60
                      ? "bg-orange-500"
                      : quiz.averageScore >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  } text-white`}
                >
                  Score: {quiz.averageScore}
                </Badge>
                <Badge className={"bg-indigo-500  text-white"}>
                {new Date(quiz?.updatedAt).toLocaleDateString()}
              </Badge>
              </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default page;
