import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Link, Stack, router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Constants UI Elements
import CustomButton from '../components/CustomButton';
import { icons, images } from '../../constants';
import { api, getValueFor, saveKey } from '../../constants/utils';

const Profile = () => {
  const [isLogoutLoading, setIsLogoutLoading] = React.useState(false);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
        <View>
            <Text>Profile</Text>
            <CustomButton
              title='Logout'
              handlePress={async () => {
                setIsLogoutLoading(true);
                await saveKey('access_token', '');
                await saveKey('user', '');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'index' }],
                });
              }}
              containerStyle='mt-4 bg-red-500 w-1/2 mx-auto'
              textStyle='text-white'
              isLoading={isLogoutLoading}
            />
        </View>
    </SafeAreaView>
  )
}

export default Profile