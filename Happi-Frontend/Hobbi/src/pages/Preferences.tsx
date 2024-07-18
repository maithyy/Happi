import { useState } from "react";
import { Text, View, Button, TextInput, Pressable, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../App";
import { styles } from "../styles";
import { getAuth } from "firebase/auth";
import { savePreferenceData } from "../services/firebaseDatabase";
import MultiSelect from 'react-native-multiple-select';
import DateTimePicker, {type DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { useAppContext } from "../contexts/AppContext";

const levels = [{
  id: '1',
  name: 'Beginner'
}, {
  id: '2',
  name: 'Intermediate'
}, {
  id: '3',
  name: 'Expert'
}];

const equipments = [{
  id: '1',
  name: 'Body Only'
}, {
  id: '2',
  name: 'Dumbbell'
}, {
  id: '3',
  name: 'Barbell'
}, {
  id: '4',
  name: 'Cable'
}, {
  id: '5',
  name: 'Other'
}];

const Preferences = () => {
  const { navigate } = useNavigation<StackNavigation>();

  const user = getAuth().currentUser;
  const id = user ? user.uid : "";

  const [exerciseGoal, setExerciseGoal] = useState(0);
  const [skill, setSkill] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [sleep_goal, setSleepGoal] = useState(0);
  const [wakeup_time, setWakeupTime] = useState(0);
  const [showNextPage, setShowNextPage] = useState(false);
  const [ date, setDate ] = useState(new Date());

  const { setTriggerRefresh } = useAppContext();

  const handleSkillChange = (selectedItems: string[]) => {
    setSkill(selectedItems[0]);
  };

  const handleExerciseGoal = (text: string) => {
    setExerciseGoal(parseInt(text));
  }

  const handleSleepGoal = (text: string) => {
    setSleepGoal(parseInt(text))
  }

  const handleWakeUpTime = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate
    if (currentDate) {
      setDate(currentDate)
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const militaryTime = hours + (minutes / 60);
      setWakeupTime(militaryTime);
      console.log(militaryTime)
    }
  }

  const handleGoBack = () => {
    setShowNextPage(false);
  };

  const handleSetPreferences = async () => {
    try {
      await savePreferenceData(
        id,
        exerciseGoal,
        skill,
        equipment,
        sleep_goal,
        wakeup_time
      );
      setTriggerRefresh(refresh => !refresh);
      navigate("Main");
    } catch (error) {
      console.log(error);
    }
  };

  const renderGymGoals = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.loginTitle}>Exercise Preferences</Text>

      <Text style={styles.preferencesText}>Daily Exercise Goal (hours)</Text>
      <TextInput
        key={"exercise"}
        placeholder=""
        style={styles.signUpTextInput}
        onChangeText={(text) => handleExerciseGoal(text)}
        keyboardType="decimal-pad"
      />
      
      <Text style={[styles.preferencesText]}>Skill Level</Text>
      <View style={{'width': "80%"}}>
        <MultiSelect
          items={levels}
          uniqueKey="name"
          selectedItems={[skill]}
          onSelectedItemsChange={handleSkillChange}
          single={true} // single select
          selectText="Select Skill Level"
          textInputProps={{ editable: false, autoFocus: false }}
          searchInputPlaceholderText=""
          searchIcon={false}
          tagRemoveIconColor="#CCC"
          tagBorderColor="rgb(99,162,95)"
          tagTextColor="rgb(99,162,95)"
          selectedItemTextColor="rgb(99,162,95)"
          selectedItemIconColor="rgb(99,162,95)"
          itemTextColor="#000"
          displayKey="name"
          submitButtonColor="rgb(99,162,95)"
          submitButtonText="Submit"
        />
      </View>

      <Text style={styles.preferencesText}>Equipment</Text>
      <View  style={{'width': "80%"}}>
        <MultiSelect
          items={equipments}
          uniqueKey="name"
          selectedItems={equipment}
          onSelectedItemsChange={setEquipment}
          single={false} // multi select
          selectText="Select Equipment"
          textInputProps={{ editable: false, autoFocus: false }}
          searchInputPlaceholderText=""
          searchIcon={false}
          tagRemoveIconColor="#CCC"
          tagBorderColor="rgb(99,162,95)"
          tagTextColor="rgb(99,162,95)"
          selectedItemTextColor="rgb(99,162,95)"
          selectedItemIconColor="rgb(99,162,95)"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="rgb(99,162,95)"
          submitButtonText="Submit"
        />
      </View>
      
      <Pressable onPress={() => setShowNextPage(true)} style={styles.preferencesButton}>
          <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );

  const renderSleepGoals = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.loginTitle}>Sleep Preferences</Text>
      <Text style={styles.preferencesText}>Daily Sleep Goal (hours)</Text>
      <TextInput
        key={"sleep"}
        placeholder=""
        style={styles.signUpTextInput}
        onChangeText={(text) => handleSleepGoal(text)}
        keyboardType="decimal-pad"
      />
      <Text style={styles.preferencesText}>Daily Wake-Up Time</Text>
        <DateTimePicker
          style={{alignSelf: 'flex-start', marginLeft: 33, marginBottom: 20}}
          testID="dateTimePicker"
          value={date}
          mode={"time"}
          is24Hour={true}
          onChange={handleWakeUpTime}
        />
      
      <Pressable onPress={() => handleSetPreferences()} style={styles.preferencesButton}>
          <Text style={styles.buttonText}>Finish</Text>
      </Pressable>
      <TouchableOpacity onPress={() => handleGoBack()}>
          <Text style={styles.signUpSmallText}><Text style={{textDecorationLine: 'underline'}}>Back</Text></Text>
      </TouchableOpacity>
    </View>
  );

  return showNextPage ? renderSleepGoals() : renderGymGoals();
};

export default Preferences;
