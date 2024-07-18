import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import getScores from "../hooks/calculateScores";
import { styles } from "../styles";
import * as Progress from 'react-native-progress'; // make sure to install this by doing "npm install react-native-progress --save"
import { getOverallGrade } from "../utils/scoreUtils";

export default function Home() {
  const {sleepScore, exerciseScore, sentimentScore, overallScore, recommendation} = getScores();

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Your Overall Score is</Text>
      <Text style={styles.titleCaption}>{getOverallGrade(overallScore)}</Text>

      <View style={{borderBottomWidth: 25, borderBottomColor: '#f2f2f2', width: '100%', marginBottom: 20, marginTop: 20}} />

      <Text style={styles.heading2}>Individual Scores</Text>

      <View>
        <Text style={styles.captionTextHome}>Journal</Text>
        <Progress.Bar progress={sentimentScore} width={400} height={30} color="rgb(255, 250, 160)" borderColor="black" />
      </View>

      <View>
        <Text style={styles.captionTextHome}>Fitness</Text>
        <Progress.Bar progress={exerciseScore} width={400} height={30} color="rgb(193, 225, 193)" borderColor="black" />
      </View>

      <View>
        <Text style={styles.captionTextHome}>Sleep</Text>
        <Progress.Bar progress={sleepScore} width={400} height={30} color="rgb(167, 199, 231)" borderColor="black" />
      </View>

      <View style={{borderBottomWidth: 25, borderBottomColor: '#f2f2f2', width: '100%', marginBottom: 20, marginTop: 20}} />

      <Text style={styles.heading2}>Overall Recommendation:</Text>
      <Text style={styles.regularText}>{recommendation}</Text>
    
      <StatusBar style="auto" />
    </View>
  );
}