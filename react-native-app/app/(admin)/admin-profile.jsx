import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, TextInput, View } from 'react-native'; // Add TextInput import

import { router, useNavigation } from 'expo-router';
import CustomButton from '../components/CustomButton';
import { icons, images } from '../../constants';
import { api, getValueFor, saveKey } from '../../constants/utils';

const Profile = () => {
  const navigation = useNavigation();

  const [isLogoutLoading, setIsLogoutLoading] = React.useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Profile',
    })
    if(!user){
      getUserInfo();
    }
  }, [user, navigation]);

  const getUserInfo = async () => {
    getValueFor('user').then((user) => {
      setUser(JSON.parse(user))
    });
  }

  const handleChange = (e) => {
    // console.log(e.target.name, e.target.value); 
    // setUser({ ...user, [e.target.name]: e.target.value });
    console.log(e);
  }

  return (
    <SafeAreaView>
        <View style={{ padding: 20 }}>
            <Text>
              Profile
            </Text>
            {/* <Image source={icons.profile} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }} /> Add Avatar */}
            <TextInput
              name="name"
              value={user?.name}
              onChangeText={(e) => setUser({ ...user, name: e })}
              placeholder="Name"
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <TextInput
              name="email"
              value={user?.email}
              onChangeText={(e) => setUser({ ...user, email: e })}
              placeholder="Email"
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <TextInput
              value={user?.bio}
              onChangeText={(text) => setBio(text)}
              placeholder="Bio"
              multiline={true}
              numberOfLines={4}
              style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <CustomButton
              title='Save'
              handlePress={async () => {
                // Save changes to backend
              }}
              containerStyle={`bg-greenTea mt-4`}
              textStyle={{ color: 'white' }}
              isLoading={isLogoutLoading}
            />
            <CustomButton
              title='Logout'
              handlePress={async () => {
                setIsLogoutLoading(true);
                await saveKey('access_token', '');
                await saveKey('user', '');
                router.replace('/');
              }}
              containerStyle={`bg-red-600 mt-4`}
              textStyle={{ color: 'white' }}
              isLoading={isLogoutLoading}
            />
        </View>
    </SafeAreaView>
  )
}

export default Profile;
