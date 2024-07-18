import React, { useState } from 'react';
import { View, Text, ScrollView} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { getAuth } from "firebase/auth";
import { styles } from "../styles"; // Import your styles

const items = [{
  id: '1',
  name: 'Abdominals'
}, {
  id: '2',
  name: 'Biceps'
}, {
  id: '3',
  name: 'Chest'
}, {
  id: '4',
  name: 'Quadriceps'
}, {
  id: '5',
  name: 'Shoulders'
}];

interface SingleSelectProps {
  items: { id: string; name: string }[];
  selectedItem: string[];
  onSelectedItemsChange: (selectedItems: string[]) => void;
}

export default function Exercise() {
  const user = getAuth().currentUser;
  const user_id = user ? user.uid : ""; // TODO: Get user id from auth hook
  const backend_url = "http://127.0.0.1:5000/fitness?";

  const [selectedItem, setSelectedItem] = useState<string[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState([]);

  const data = {user_id: user_id, body_part: selectedItem[0]};

  const fetchData = () => {
    fetch(backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response_data) => {
        setRecommendedExercises(response_data.exercises);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectedItemsChange = (selectedItem: string[]) => {
    setSelectedItem(selectedItem);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Discover Exercises</Text>

      <Text style={styles.captionTextExercise}>
        Select an exercise category below to receive recommendations for exercises targeting that area of the body.
      </Text>

      <View>
        <SingleSelect
          items={items}
          selectedItem={selectedItem}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
        <Text style={ [styles.heading2, { marginTop: 20 }] }>Recommended Exercises:</Text>
        <ScrollView>
        {recommendedExercises.map((exercise: Exercise) => (
          <View key={exercise.field1} style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>{exercise.Title}</Text>
            <Text style={styles.exerciseDesc}>{exercise.Desc}</Text>
            <Text style={styles.exerciseDetails}>Equipment: {exercise.Equipment}, Level: {exercise.Level}</Text>
          </View>
        ))}
        </ScrollView>
      </View>
    </View>
  );
}

function SingleSelect({ items, selectedItem, onSelectedItemsChange }: SingleSelectProps) {
  return (
    <MultiSelect
      items={items}
      uniqueKey="name"
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItem}
      single={true}
      selectText="Select Exercise Category"
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
