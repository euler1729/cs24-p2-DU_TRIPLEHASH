import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PermissionsAndroid } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Colors } from '../../assets/configs.json'
import Card from './components/Card';

/*
1. Timeline - MyPosts  and Notifications

*/
const cardData = [
  {
    id: 1,
    username: 'Arif Billah',
    userAvatar: 'https://scontent.fdac146-1.fna.fbcdn.net/v/t39.30808-1/358094366_1930598593988808_2326347401965450847_n.jpg?stp=dst-jpg_p480x480&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH36WNFrvzZLZP-cYPWoZW4w4h1wEGDLpvDiHXAQYMum0vLVyX7SPLRSJxZ0De_PP3ZrouYwetFTQyeZc1m-5bZ&_nc_ohc=Jh6f73ykQn8Q7kNvgGtCfTX&_nc_ht=scontent.fdac146-1.fna&oh=00_AYCV5AAGSs2RgexArv6P3vkvRJGi8qFUneplaZKDYmjZ-w&oe=6643F135',
    timestamp: '2 hours ago',
    title: 'Beautiful sunset view',
    content: 'Had a great time watching the sunset at the beach today!',
    image: 'https://c8.alamy.com/comp/P8G3H6/dhaka-bangladesh-december-04-2016-a-top-view-of-korail-slum-is-located-beside-the-gulshan-banani-lake-in-dhaka-north-city-corporation-about-400-P8G3H6.jpg',
  },
  {
    id: 2,
    username: 'Alice Smith',
    userAvatar: 'https://via.placeholder.com/50',
    timestamp: '3 hours ago',
    title: 'Delicious homemade dinner',
    content: 'Cooked a special dinner for my family tonight. It turned out amazing!',
    image: 'https://c8.alamy.com/comp/P8WEJ7/a-top-view-of-korail-slum-is-located-beside-the-gulshan-banani-lake-in-dhaka-north-city-corporation-about-40000-people-lived-in-korail-the-biggest-P8WEJ7.jpg',
  },
  {
    id: 3,
    username: 'Bob Johnson',
    userAvatar: 'https://via.placeholder.com/50',
    timestamp: '4 hours ago',
    title: 'Hiking adventure',
    content: 'Went hiking with friends and found some beautiful trails in the mountains.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtrlkEkNTkK9w8zLezojc472spfBfkDMViQg&usqp=CAU',
  },
];

const Forum = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(cardData);

  useEffect(() => {

  }, []);

  const handlePost = () => {
    if (newPost.trim() === '') {
      Alert.alert('Error', 'Please enter a valid post');
      return;
    }
    setPosts([...posts, newPost]);
    setNewPost('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.postsContainer}>
        {cardData.map((post, index) => {
          return (
            <Card key={index} post={post} />
          )
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={newPost}
          onChangeText={setNewPost}
          placeholder="Write your post here..."
          multiline
          style={styles.input}
        />
        <TouchableOpacity onPress={handlePost} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyPosts = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.postsContainer}>
        {cardData.map((post, index) => {
          return (
            <Card key={index} post={post} />
          )
        })}
      </ScrollView>
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

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('Forum');
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      title: 'Community'
    })
  }, [])

  const switchComponent = () => {
    setActiveComponent(activeComponent === 'Forum' ? 'MyPosts' : 'Forum');
  };


  return (
    <View style={styles.pageContainer}>
      <View style={styles.buttonContainer}>
        <SwitchButton onPress={switchComponent} isActive={activeComponent === 'Forum'} title="Forum" />
        <SwitchButton onPress={switchComponent} isActive={activeComponent === 'MyPosts'} title="My Posts" />
      </View>
      {activeComponent === 'Forum' ? <Forum /> : <MyPosts />}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
  postsContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    padding: 10,
  },
  postContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  postContent: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  postButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Dashboard;
