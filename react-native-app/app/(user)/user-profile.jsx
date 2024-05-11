import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// Constants UI Elements
import CustomButton from '../components/CustomButton';
import { icons, images } from '../../constants';
import { api, getValueFor, saveKey } from '../../constants/utils';
const dp = "https://scontent.fdac146-1.fna.fbcdn.net/v/t39.30808-1/358094366_1930598593988808_2326347401965450847_n.jpg?stp=dst-jpg_p480x480&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH36WNFrvzZLZP-cYPWoZW4w4h1wEGDLpvDiHXAQYMum0vLVyX7SPLRSJxZ0De_PP3ZrouYwetFTQyeZc1m-5bZ&_nc_ohc=Jh6f73ykQn8Q7kNvgGtCfTX&_nc_ht=scontent.fdac146-1.fna&oh=00_AYCV5AAGSs2RgexArv6P3vkvRJGi8qFUneplaZKDYmjZ-w&oe=6643F135";
const Profile = () => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    navigation.setOptions({
      title: 'Profile',
    });
    if (user === null) {
      const fetchUser = async () => {
        const user = await getValueFor('user');
        setUser(JSON.parse(user));
      }
      fetchUser();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.profileContainer}>
        <Image source={{ uri: dp }} style={styles.profileImage} />
        <Text style={styles.username}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <CustomButton
          title='Logout'
          handlePress={async () => {
            setIsLogoutLoading(true);
            await saveKey('access_token', '');
            await saveKey('user', '');
            await saveKey('issues', {});
            navigation.reset({
              index: 0,
              routes: [{ name: 'index' }],
            });
          }}
          containerStyle='bg-red-500 mt-30'
          isLoading={isLogoutLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;
