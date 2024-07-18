import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { TextInput, Text, View, Pressable, Modal } from "react-native";
import { styles } from "../styles";
import LoadingScreen from "../components/LoadingScreen";
import { getAuth } from "firebase/auth";
import { useAppContext } from "../contexts/AppContext";
import getScores from "../hooks/calculateScores";
import { getJournalGrade } from "../utils/scoreUtils";


export default function Journal() {
  const backend_url = "http://127.0.0.1:5000/journal?";
  const get_url = "http://127.0.0.1:5000/entry?";

  const date = new Date();

  const user = getAuth().currentUser;
  const user_id = user ? user.uid : "";

  const [isLoading, setIsLoading] = useState(true);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);

  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [value, onChangeText] = useState("");
  const [recommendation, setRecommendation] = useState("No score to base recommendation off of.")
  
  const {exerciseScore, sleepScore} = getScores();

  const { setTriggerRefresh } = useAppContext();

  useEffect(() => {
    getJournalEntry();
  }, [user_id, sleepScore, exerciseScore]);

  const getRecommendation = (sentimentScore: number) => {
    let rec = ""
    if (sentimentScore <= -0.75) {
      rec = "You're experiencing a profound sense of distress. It's important to acknowledge your emotions and reach out for support. Take some time for self-care and consider speaking to a trusted friend or professional.";
    } else if (sentimentScore <= -0.5) {
      rec = "You're feeling quite down today, but remember, tough times don't last forever. Engage in activities that bring you joy or relaxation. A walk in nature or indulging in your favorite hobby might help lift your spirits.";
    } else if (sentimentScore <= -0.25) {
      rec = "You're having a rough day, but there's light ahead. Try to focus on the positives, even if they seem small. Practicing gratitude can shift your perspective and bring about a sense of hope.";
    } else if (sentimentScore <= 0) {
      rec = "You're feeling a bit low, but remember, it's okay not to be okay all the time. Take a moment to reflect on what's bothering you and consider what steps you can take to improve your mood. Small acts of self-care can make a big difference.";
    } else if (sentimentScore <= 0.25) {
      rec = "You're feeling neutral today, which is perfectly fine. Use this time to check in with yourself and your needs. Consider setting small goals or tasks to boost your motivation and sense of accomplishment.";
    } else if (sentimentScore <= 0.5) {
      rec = "You're feeling relatively positive today, keep up the good work! Take this momentum and channel it into something productive or fulfilling. Celebrate your achievements, no matter how small.";
    } else if (sentimentScore <= 0.75) {
      rec = "You're having a good day! Embrace this positivity and spread it to others. Engage in activities that bring you joy and fulfillment. Remember to express gratitude for the blessings in your life.";
    } else {
      rec = "You're radiating happiness today! Keep shining bright and share your positivity with the world. Make the most of this wonderful day and cherish every moment. Remember to pay it forward and spread kindness wherever you go.";
    }
    return rec;
  };

  const getJournalEntry = () => {
    setIsLoading(true);
    const data = { user_id: user_id, date: date.toDateString() };

    fetch(get_url + new URLSearchParams(data))
      .then((res) => res.json())
      .then((response_data) => {
        console.log(response_data);
        if (response_data.success) {
          setJournal(response_data.data);
          setRecommendation(getRecommendation(response_data.data.score));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const submitJournalEntry = () => {
    const data = {
      user_id: user_id,
      entry: value,
      date: date.toDateString(),
    };

    fetch(backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .finally(() => {
        getJournalEntry();
        setShowSubmissionSuccess(true);
        setTriggerRefresh(refresh => !refresh)
      });
  };

  const renderJournalInput = () => (
    <View style={styles.container}>
      <Text style={styles.titleText}>Your Journal for today.</Text>
      <Text style={styles.captionTextJournal}>
        Complete your daily entry below and receive a score determining your
        estimated happiness.
      </Text>
      <TextInput
        style={styles.textInput}
        editable
        multiline
        numberOfLines={10}
        maxLength={200}
        onChangeText={(text) => onChangeText(text)}
        value={value}
      />
      <Pressable onPress={submitJournalEntry} style={styles.button}>
        <Text style={styles.buttonText}>Submit Journal Entry</Text>
      </Pressable>

      <StatusBar style="auto" backgroundColor="" />
    </View>
  );

  const renderJournalDisplay = () => (
    <View style={styles.container}>
      <Text style={styles.titleText}>Your Journal score is:</Text>
      <Text style={styles.titleCaption}>{getJournalGrade(journal!.score)}</Text>

      <View style={{borderBottomWidth: 25, borderBottomColor: '#f2f2f2', width: '100%', marginBottom: 20, marginTop: 20}} />

      <Text style={styles.heading2}>Summary:</Text>
      <Text style={styles.regularText}>{recommendation}</Text>

      <View style={{borderBottomWidth: 25, borderBottomColor: '#f2f2f2', width: '100%', marginBottom: 20, marginTop: 20}} />


      <Modal
        animationType="slide"
        transparent={true}
        visible={showJournalModal}
        onRequestClose={() => {
          setShowJournalModal(!showJournalModal);
        }}
      >
        <View style={styles.centeredContainer}>
          <View style={styles.modalView}>
            <Text style={styles.regularText}>{journal!.entry}</Text>
            <Pressable
              style={styles.button}
              onPress={() => setShowJournalModal(!showJournalModal)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable
        style={styles.button}
        onPress={() => setShowJournalModal(true)}
      >
        <Text style={styles.buttonText}>View your Journal Entry</Text>
      </Pressable>

      <StatusBar style="auto" backgroundColor="" />
    </View>
  );


  const renderSubmissionSuccess = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.titleText}>Journal Entry Submitted!</Text>
      <Text style={styles.captionTextJournal}>
        Your journal entry has been submitted for scoring.
      </Text>
      <Pressable onPress={() => setShowSubmissionSuccess(false)} style={styles.button}>
        <Text style={styles.buttonText}>See Results</Text>
      </Pressable>
      <StatusBar style="auto" backgroundColor="" />
    </View>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }
  else if (showSubmissionSuccess) {
    return renderSubmissionSuccess();
  }

  return journal ? renderJournalDisplay() : renderJournalInput();
}
