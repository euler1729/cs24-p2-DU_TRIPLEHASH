import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/configs.json';
import EventCard from './components/EventCard';

const events = [
  {
    id: 1,
    title: 'Community Cleanup Day',
    image: 'https://placehold.co/600x400',
    date: '2024-05-15',
  },
  {
    id: 2,
    title: 'Recycling Workshop',
    image: 'https://placehold.co/600x400',
    date: '2024-05-20',
  },
  {
    id: 3,
    title: 'Tree Planting Event',
    image: 'https://placehold.co/600x400',
    date: '2024-05-25',
  },
];


const Events = ({ events }) => {
  // Sort events by date
  const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ScrollView style={styles.container}>
      {/* Render sorted events */}
      {sortedEvents.map(event => (
        <View key={event.id} style={styles.eventItem}>
          <EventCard event={event} />
        </View>
      ))}
    </ScrollView>
  );
};

const MyEvents = ({ events }) => {
  // Sort events by date
  const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <View style={styles.container}>
      {/* Render sorted events */}
      {sortedEvents.map(event => (
        <View key={event.id} style={styles.eventItem}>
          <Text>{event.title}</Text>
          <Text>Date: {event.date}</Text>
        </View>
      ))}
    </View>
  );
};

const SwitchButton = ({ onPress, isActive, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, isActive ? styles.activeButton : null]}>
      <Text style={[styles.buttonText, isActive ? styles.activeButtonText : null]}>{title}</Text>
    </TouchableOpacity>
  );
};

const SwitchablePage = () => {
  const [activeComponent, setActiveComponent] = React.useState('Events');
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Volunteering',
    });
  }, []);

  const switchComponent = () => {
    setActiveComponent(activeComponent === 'Events' ? 'MyEvents' : 'Events');
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.buttonContainer}>
        <SwitchButton onPress={switchComponent} isActive={activeComponent === 'Events'} title="Events" />
        <SwitchButton onPress={switchComponent} isActive={activeComponent === 'MyEvents'} title="My Events" />
      </View>
      {activeComponent === 'Events' ? <Events events={events} /> : <MyEvents events={events} />}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.greenTea,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: 150
    // marginRight: 10,
  },
  activeButton: {
    backgroundColor: Colors.greenTea,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: 'white',
  },
  eventItem: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default SwitchablePage;
