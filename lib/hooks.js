import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import axios from 'axios';

/**
 * Custom hook for auth state management
 * Replaces repeated onAuthStateChanged listeners
 */
export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { user, isLoading, error, logout };
}

/**
 * Custom hook for making API calls with error handling
 */
export function useApiCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (url, method = 'POST', data = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { call, isLoading, error };
}

/**
 * Custom hook for form validation and management
 */
export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  };
}

/**
 * Custom hook for quiz state management
 */
export function useQuizState(quizId) {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load quiz from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`quiz-${quizId}`);
    if (savedState) {
      try {
        const { currentQuestion: q, answers: a, quizData: qd } = JSON.parse(savedState);
        setCurrentQuestion(q);
        setAnswers(a);
        setQuizData(qd);
      } catch (err) {
        console.error('Failed to restore quiz state:', err);
      }
    }
  }, [quizId]);

  // Save quiz state to localStorage
  const saveState = useCallback(() => {
    if (quizData) {
      localStorage.setItem(
        `quiz-${quizId}`,
        JSON.stringify({
          currentQuestion,
          answers,
          quizData,
        })
      );
    }
  }, [quizId, currentQuestion, answers, quizData]);

  // Save state when it changes
  useEffect(() => {
    saveState();
  }, [currentQuestion, answers, saveState]);

  const selectAnswer = useCallback((answer) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answer;
      return newAnswers;
    });
  }, [currentQuestion]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < (quizData?.questions?.length || 0)) {
      setCurrentQuestion(index);
    }
  }, [quizData?.questions?.length]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < (quizData?.questions?.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, quizData?.questions?.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const clearState = useCallback(() => {
    localStorage.removeItem(`quiz-${quizId}`);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizData(null);
  }, [quizId]);

  return {
    quizData,
    setQuizData,
    currentQuestion,
    answers,
    isLoading,
    error,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    clearState,
    setIsLoading,
    setError,
  };
}

/**
 * Custom hook for local storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
