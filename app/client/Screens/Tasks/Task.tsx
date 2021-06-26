import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ImageBackground,
  Button,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { FAB } from 'react-native-paper';
import { Switch } from 'react-native-switch';
import { useUserContext } from '../../Contexts/userContext';
import Slider from '@react-native-community/slider';
import TaskSummary from './TaskSummary';
import DateTimePicker from '@react-native-community/datetimepicker';


const Task = () => {
  const bgImage = require('../../../assets/blue-gradient.png');
  const [showForm, setShowForm] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  //for tasks, to create tasks
  const [description, setDescription] = useState('');
  // const [date, setDate] = useState('');
  const [timeToComplete, setTimeToComplete] = useState(0);
  const [isImportant, setIsImportant] = useState(false);
  const { user, setUser } = useUserContext();

  //for date selector
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
console.log(timeToComplete);
  const toggleSwitch = () => setIsImportant((previousState) => !previousState);

  const handleSubmit = async () => {
    console.log(timeToComplete, 'timeToComplete')
    const { data: task } = await axios.post(
      'http://localhost:3000/api/tasks/',
      {
        user_id: user.id,
        description,
        due_date: date,
        minutes_to_complete: timeToComplete,
        is_important: isImportant,
      }
    );
    setUser({ ...user, tasks: [...user.tasks, task] });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };



  return (
    <ImageBackground style={styles.backgroundImage} source={bgImage}>
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.header}>Tasks</Text>
          <FAB
            style={styles.fab}
            small
            icon="plus"
            onPress={() => setShowForm(true)}
          />
        </View>
        {showForm ? (
          <View style={styles.view}>
            <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.subheader}>Add Task</Text>
            <Button title="Cancel" onPress={() => setShowForm(false)} />
            </View>
              <TextInput
                style={styles.input}
                onChangeText={setDescription}
                value={description}
                placeholder="Enter Task Description"
                autoCapitalize="none"
              />
               <View>
      <View>
        <Button onPress={showDatepicker} title="Due Date" />
      </View>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
    </View>
            </View>
            <View>
              <Text style={styles.prompt}>
                How long will it take to complete this task?
              </Text>
              <Text style={styles.text}>{timeToComplete} minutes</Text>
              <Slider
                step={5}
                minimumValue={0}
                maximumValue={60}
                value={timeToComplete}
                onValueChange={setTimeToComplete}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#fafafa"
                thumbTintColor="#b9e4c9"
              />
            </View>
            <View style={styles.important}>
              <Text style={{ fontSize: 18, color: '#1D426D', paddingRight: 15, paddingTop: 2}}>Mark task as important?</Text>
              <Switch
                circleActiveColor={'#fafafa'}
                circleInActiveColor={'#b9e4c9'}
                backgroundActive={'#1D426D'}
                backgroundInactive={'#1D426D'}
                switchLeftPx={5}
                switchRightPx={5}
                onValueChange={toggleSwitch}
                value={isImportant}
              />
            </View>
            <Button title="Submit" onPress={() => handleSubmit()} />
          </View>
        ) : null}
        <TaskSummary />
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 65,
  },
  fab: {
    backgroundColor: '#1D426D',
    height: 40,
    marginRight: 20
  },
  header: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20
  },
  important: {
    flexDirection: 'row',
    color: '#1D426D',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 10
  },
  prompt: {
    alignSelf: 'flex-start',
    color: '#1D426D',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18
  },
  subheader: {
    color: '#1D426D',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5
  },
  submitButton: {
    marginTop: 20,
  },
  text: {
    color: '#1D426D',
    marginBottom: 10,
    fontSize: 16
  },
  textArea: {
    height: 200,
    width: 100,
    justifyContent: 'flex-start',
  },
  view: {
    backgroundColor: '#8ebac6',
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    marginRight: 20,
    marginLeft: 20,
  }
});
export default Task;
