import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput, Button, StyleSheet, Pressable } from "react-native";
// import { styles } from "../styles";
import { useState, useEffect } from "react";
import MultiSelect from 'react-native-multiple-select';
import useAllData from "../hooks/useAllData";
import { logout } from "../services/auth";
import { getAuth } from "firebase/auth";
import { useAppContext } from "../contexts/AppContext";

const skillOptions = [{
  id: '1',
  name: 'Beginner'
}, {
  id: '2',
  name: 'Intermediate'
}, {
  id: '3',
  name: 'Expert'
}];

interface SingleSelectProps {
  items: { id: string; name: string }[];
  selectedItem: string[];
  onSelectedItemsChange: (selectedItems: string[]) => void;
}

const equipmentOptions = [{
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

export default function Profile() {
  const user = getAuth().currentUser;
  const user_id = user ? user.uid : ""; // TODO: Get user id from auth hook
  const backend_url = "http://127.0.0.1:5000/changeData?";

  const {first, last, email, exerciseGoal, skill, equipment, sleepGoal, wakeupTime} = useAllData();

  const [selectedSkill, setSelectedSkill] = useState<string[]>([skill]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(equipment);

  const { setTriggerRefresh } = useAppContext();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<AllData>({
    first: first,
    last: last,
    email: email,
    exerciseGoal: exerciseGoal,
    skill: skill,
    equipment: equipment,
    sleepGoal: sleepGoal,
    wakeupTime: wakeupTime
  });

  useEffect(() => {
    setFormData({
      first: first,
      last: last,
      email: email,
      exerciseGoal: exerciseGoal,
      skill: skill,
      equipment: equipment,
      sleepGoal: sleepGoal,
      wakeupTime: wakeupTime
    });
  }, [first, last, email, exerciseGoal, skill, equipment, sleepGoal, wakeupTime]);

  const data = {user_id: user_id, first_name: formData.first, last_name: formData.last, email, exercise_goal: formData.exerciseGoal, skill: formData.skill, equipment: formData.equipment, sleep_goal: formData.sleepGoal, wakeup_time: formData.wakeupTime};

  const updateData = () => {
    fetch(backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response_data) => {
        setFormData({
          first: response_data.data.first,
          last: response_data.data.last,
          email: response_data.data.email,
          exerciseGoal: response_data.data.exercise_info.exercise_goal,
          skill: response_data.data.exercise_info.skill,
          equipment: response_data.data.exercise_info.equipment,
          sleepGoal: response_data.data.sleep_info.sleep_goal,
          wakeupTime: response_data.data.sleep_info.wakeup_time
        });
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleTextChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
  };

  const handleNumberChange = (field: string, value: string) => {
    if (value.trim() === ""){
      setFormData({...formData, [field]: ""});
    } else{
      setFormData({...formData, [field]: parseInt(value)});
    }
  };

  const handleSkillChange = (selectedItem: string[]) => {
    setSelectedSkill(selectedItem);
    const updatedValue = {
      skill: selectedItem[0]
    };
    setFormData(prevState => ({
      ...prevState,
      ...updatedValue
    }));
  };

  const handleEquipmentChange = (selectedItems: string[]) => {
    setSelectedEquipment(selectedItems);
    const updatedValue = {
      equipment: selectedItems
    };
    setFormData(prevState => ({
      ...prevState,
      ...updatedValue
    }));
  };

  const handleSave = () => {
    setEditing(false);
    updateData();
    setTriggerRefresh(refresh => !refresh);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View>
      <Text style={styles.titleText}>Profile</Text>

      {editing ? (
        <>
          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
      
          <Text style={styles.heading2}>Personal Info</Text>
          <TextInput
            placeholder="Enter new first name"
            style={styles.textInput}
            value={formData.first}
            onChangeText={(text) => handleTextChange('first', text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Enter new last name"
            style={styles.textInput}
            value={formData.last}
            onChangeText={(text) => handleTextChange('last', text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Enter new email"
            style={styles.textInput}
            value={formData.email}
            onChangeText={(text) => handleTextChange('email', text)}
            autoCapitalize="none"
          />

          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
      
          <Text style={styles.heading2}>Exercise Preferences</Text>
          <View style={styles.centeredContainer}>
            <TextInput
              placeholder="Enter new exercise goal"
              style={styles.textInput}
              value={formData.exerciseGoal.toString()}
              onChangeText={(text) => handleNumberChange('exerciseGoal', text)}
              autoCapitalize="none"
            />
            <View style={{'width': "80%"}}>
              <SingleSelectFeature
                items={skillOptions}
                selectedItem={selectedSkill}
                onSelectedItemsChange={handleSkillChange}
              />
            </View>
            <View style={{'width': "80%"}}>
              <MultiSelectFeature
                items={equipmentOptions}
                selectedItem={selectedEquipment}
                onSelectedItemsChange={handleEquipmentChange}
              />
            </View>
          </View>

          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
      
          <Text style={styles.heading2}>Sleep Preferences Info</Text>
          <TextInput
            placeholder="Enter new sleep goal"
            style={styles.textInput}
            value={formData.sleepGoal.toString()}
            onChangeText={(text) => handleNumberChange('sleepGoal', text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Enter new wake-up time"
            style={styles.textInput}
            value={formData.wakeupTime.toString()}
            onChangeText={(text) => handleNumberChange('wakeupTime', text)}
            autoCapitalize="none"
          />

          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
          <Pressable onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
      
          <Text style={styles.heading2}>Personal Info</Text>
          <Text style={styles.titleCaption}>First Name: {formData.first}</Text>
          <Text style={styles.titleCaption}>Last Name: {formData.last}</Text>
          <Text style={styles.titleCaption}>Email: {formData.email}</Text>

          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
      
          <Text style={styles.heading2}>Exercise Preferences</Text>
          <Text style={styles.titleCaption}>Exercise Goal: {formData.exerciseGoal}</Text>
          <Text style={styles.titleCaption}>Skill Level: {formData.skill}</Text>
          <Text style={styles.titleCaption}>Equipment: {formData.equipment.join(', ')}</Text>

          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
      
          <Text style={styles.heading2}>Sleep Preferences</Text>
          <Text style={styles.titleCaption}>Sleep Goal: {formData.sleepGoal}</Text>
          <Text style={styles.titleCaption}>Wake-Up Time: {formData.wakeupTime}</Text>

          <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10, marginBottom: 10}}/>
          <Pressable onPress={handleEdit} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        </>
      )}

      <Pressable onPress={handleLogout} style={{backgroundColor: "#FFFFFF", padding: 10, borderRadius: 5}}>
        <Text style={{fontSize: 15, color: "red", textAlign: "center",}}>Logout</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

function SingleSelectFeature({ items, selectedItem, onSelectedItemsChange }: SingleSelectProps) {
  return (
    <MultiSelect
      items={items}
      uniqueKey="name"
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItem}
      single={true}
      selectText="Select Skill Level"
      searchInputPlaceholderText="Search Items..."
      onChangeInput={(text) => console.log(text)}
      tagRemoveIconColor="#CCC"
      tagBorderColor="#CCC"
      tagTextColor="#CCC"
      selectedItemTextColor="#CCC"
      selectedItemIconColor="#CCC"
      itemTextColor="#000"
      displayKey="name"
      searchInputStyle={{ color: '#CCC' }}
      submitButtonColor="#CCC"
      submitButtonText="Submit"
    />
  );
}

function MultiSelectFeature({ items, selectedItem, onSelectedItemsChange }: SingleSelectProps) {
  return (
    <MultiSelect
      items={items}
      uniqueKey="name"
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItem}
      selectText="Select Equipment"
      searchInputPlaceholderText="Search Items..."
      onChangeInput={(text) => console.log(text)}
      tagRemoveIconColor="#CCC"
      tagBorderColor="#4CA457"
      tagTextColor="#4CA457"
      selectedItemTextColor="#4CA457"
      selectedItemIconColor="#4CA457"
      itemTextColor="#000"
      displayKey="name"
      searchInputStyle={{ color: '#CCC' }}
      submitButtonColor="#4CA457"
      submitButtonText="Submit"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 10,
    color: "#5878A7",
    textAlign: "center",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5878A7",
    textAlign: "center",
  },
  titleCaption: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    textAlign: 'center',
    height: 25,
    width: '80%',
    alignSelf: 'center',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#fcfcfc'
  },
  captionText: {
    fontSize: 25,
    color: "#333333",
    marginBottom: 5,
    textAlign: "center",
  },
  regularText: {
    fontSize: 32,
    color: "#333333",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    color: "blue",
    textAlign: "center",
  },
});