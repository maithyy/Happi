import { useState, useEffect } from "react";
import useHealthData from "../hooks/useHealthData";
import useAllData from "../hooks/useAllData";
import { getRecommendation } from "../utils/scoreUtils";

const getScores = () => {
  const { sleep, workouts } = useHealthData();
  const { sleepGoal, exerciseGoal, happinessScore, journalDate } = useAllData();
  const date = new Date();
  const dateString = date.toDateString();

  const [exerciseScore, setExerciseScore] = useState(0);
  const [sleepScore, setSleepScore] = useState(0);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    let newExerciseScore = 0;
    let newSleepScore = 0;
    let newSentimentScore = sentimentScore;
    let newOverallScore = 0;

    if (workouts) {
      const totalExerciseDuration = workouts.data.reduce(
        (total, workout) => total + (workout.duration / 60 / 60), 0
      );

      if (typeof totalExerciseDuration === 'number' && !isNaN(totalExerciseDuration) && exerciseGoal !== 0) {
        newExerciseScore = totalExerciseDuration / exerciseGoal;
      }
    }

    if (typeof sleep.hours === 'number' && !isNaN(sleep.hours) && sleepGoal !== 0) {
      newSleepScore = sleep.hours / sleepGoal;
    }

    if (journalDate === dateString) {
      newSentimentScore = (happinessScore + 1) / 2;
      newOverallScore = (newExerciseScore + newSleepScore + newSentimentScore) / 3;
    } else {
      newOverallScore = (newExerciseScore + newSleepScore) / 2;
    }

    const rec = getRecommendation(newSentimentScore, newSleepScore, newExerciseScore, journalDate);
    
    setExerciseScore(newExerciseScore);
    setSleepScore(newSleepScore);
    setSentimentScore(newSentimentScore);
    setOverallScore(newOverallScore);
    setRecommendation(rec);
  }, [sleep, workouts, sleepGoal, exerciseGoal, happinessScore, journalDate, dateString]);

  return { exerciseScore, sleepScore, sentimentScore, overallScore, recommendation };
};

export default getScores;
