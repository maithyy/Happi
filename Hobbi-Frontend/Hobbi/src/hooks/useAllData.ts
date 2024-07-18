import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAppContext } from "../contexts/AppContext";

const useAllData = () => {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [exerciseGoal, setExerciseGoal] = useState(0);
  const [skill, setSkill] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [sleepGoal, setSleepGoal] = useState(0);
  const [wakeupTime, setWakeupTime] = useState(0);
  const [happinessScore, setHappinessScore] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [journalDate, setJournalDate] = useState('');
  const user = getAuth().currentUser;
  const user_id = user ? user.uid : "";

  const { triggerRefresh } = useAppContext();

  useEffect(() => {
    const data_url = "http://127.0.0.1:5000/data?";

    const data = {user_id: user_id};

    const fetchData = () => {
      fetch(data_url + new URLSearchParams(data))
        .then((res) => res.json())
        .then((response_data) => {
          if (response_data.success) {
            setFirst(response_data.data.first);
            setLast(response_data.data.last);
            setEmail(response_data.data.email);
            setExerciseGoal(response_data.data.exercise_info.exercise_goal);
            setSkill(response_data.data.exercise_info.skill);
            setEquipment(response_data.data.exercise_info.equipment);
            setSleepGoal(response_data.data.sleep_info.sleep_goal);
            setWakeupTime(response_data.data.sleep_info.wakeup_time);
            setHappinessScore(response_data.data.journal_info.happiness_score);
            setJournalEntry(response_data.data.journal_info.journal_entry);
            setJournalDate(response_data.data.journal_info.date);
          }
        })
        .catch((err) => console.log(err));
    };
  
      fetchData();
  }, [user_id, triggerRefresh]); // rerun if user_id changes

  return {first, last, email, exerciseGoal, skill, equipment, sleepGoal, wakeupTime, happinessScore, journalEntry, journalDate};
};

export default useAllData;