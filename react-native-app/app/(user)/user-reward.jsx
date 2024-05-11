import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Colors } from '../../assets/configs.json';

const SwitchButton = ({ onPress, isActive, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, isActive ? styles.activeButton : null]}>
      <Text style={[styles.buttonText, isActive ? styles.activeButtonText : null]}>{title}</Text>
    </TouchableOpacity>
  );
};

const Reward = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: 'Rewards',
    });
  }, []);

  // Sample user data (replace with actual data)
  const userData = {
    profilePic: 'https://scontent.fdac146-1.fna.fbcdn.net/v/t39.30808-1/358094366_1930598593988808_2326347401965450847_n.jpg?stp=dst-jpg_p480x480&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH36WNFrvzZLZP-cYPWoZW4w4h1wEGDLpvDiHXAQYMum0vLVyX7SPLRSJxZ0De_PP3ZrouYwetFTQyeZc1m-5bZ&_nc_ohc=Jh6f73ykQn8Q7kNvgGtCfTX&_nc_ht=scontent.fdac146-1.fna&oh=00_AYCV5AAGSs2RgexArv6P3vkvRJGi8qFUneplaZKDYmjZ-w&oe=6643F135',
    name: 'Arif Billah',
    status: 'Gold Member',
    credit: 1000,
  };

  // Sample list of rewards (replace with actual data)
  const [rewards, setRewards] = useState([
    { id: '1', type: 'Gold', description: 'Reached Gold level', date: '2022-05-01' },
    { id: '2', type: 'Silver', description: 'Achieved Silver status', date: '2022-04-15' },
    { id: '3', type: 'Bronze', description: 'Attained Bronze membership', date: '2022-03-20' },
  ]);
  const [achievements, setAchievements] = useState([
    { id: '1', type: 'Bronze', description: 'Mayor Award', date: '2022-05-01' },
    { id: '2', type: 'Silver', description: '5% on Buffet Pradize', date: '2022-04-15' },
    { id: '3', type: 'Gold', description: '10% Discount on Arong', date: '2022-03-20' },
  ]);

  // Render individual reward item
  const renderItem = ({ item, index }) => {
    if (index === 0 && item.type === 'Gold') {
      // Render the top card for gold customers with special styles
      return (
        <View style={styles.goldCard}>
          <Text style={styles.rewardType}>{item.type} Customer</Text>
          <Text style={styles.rewardDescription}>{item.description}</Text>
          <Text style={styles.rewardDate}>{item.date}</Text>
        </View>
      );
    } else {
      // Render other cards with regular styles
      return (
        <View style={styles.card}>
          <Text style={styles.rewardType}>{item.type} Customer</Text>
          <Text style={styles.rewardDescription}>{item.description}</Text>
          <Text style={styles.rewardDate}>{item.date}</Text>
        </View>
      );
    }
  };

  const [activeComponent, setActiveComponent] = useState('achievements');

  const handleSwitch = () => {
    setActiveComponent(activeComponent === 'achievements' ? 'rewards' : 'achievements');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.status}>{userData.status}</Text>
          </View>
        </View>
        <Text style={styles.credit}>Credit: {userData.credit}</Text>
      </View>
      <View style={styles.pageContainer}>
        <View style={styles.buttonContainer}>
          <SwitchButton onPress={handleSwitch} isActive={activeComponent === 'achievements'} title="Achievements" />
          <SwitchButton onPress={handleSwitch} isActive={activeComponent === 'rewards'} title="Rewards" />
        </View>
        {
          activeComponent === 'achievements' ? (
            <FlatList
              data={rewards}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.rewardList}
            />
          ) : (
            <FlatList
              data={achievements}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.rewardList}
            />
          )
        }

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  pageContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userCard: {
    backgroundColor: '#ffd700',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goldCard: {
    backgroundColor: '#ffd700',
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    color: '#555',
  },
  credit: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  rewardList: {
    flexGrow: 1,
  },
  rewardType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  rewardDate: {
    fontSize: 14,
    color: '#888',
  },
});

export default Reward;
