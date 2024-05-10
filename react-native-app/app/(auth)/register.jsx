import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

import { images } from '../../constants';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import { api } from '../../constants/utils';

const Resigter = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    ward_number: 1,
    user_name: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false)

  const submitForm = () => {
    setIsLoading(true)
    api.post('/auth/register', form)
      .then((response) => {
        setIsLoading(false)
        if(response.status === 201) {
          alert('Registration successful. Please login to continue.')
          router.replace('/login')
        }else {
          alert('An error occurred. Please try again.')
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
  }


  return (
    <SafeAreaView
      className={`
      bg-greenWhite
        h-full
      `}
    >
      <ScrollView>
        <View
          className={`
            justify-center
            min-h-[86vh]
            w-full
            px-8
            my-0
          `}
        >
          {/*Brand Logo*/}
          <Image
            source={images.brandLogoGifTransparent}
            resizeMode='contain'
            className='w-40 h-40 mx-auto'
          />
          {/*Title*/}
          <Text
            className={`
              text-center
              text-greenTea
              text-2xl
              font-psemibold
              mt-1
            `}
          >
            Register to EcoSync
          </Text>

          {/*Form*/}
          <View
            className={`
              border-2
              p-4
              rounded-2xl
              border-greenTea
            `}
          >
            <FormField
              title='Full Name'
              value={form.name}
              handleChangeText={(value) => setForm({ ...form, name: value })}
              placeholder='Enter your full name'
              keyboardType='default'
            />
            <FormField
              title='Email'
              value={form.email}
              handleChangeText={(value) => setForm({ ...form, email: value })}
              placeholder='Enter your email'
              otherStyles='mt-3'
              keyboardType='email-address'
            />
            <FormField
              title='Ward Number'
              value={String(form.ward_number)}
              handleChangeText={(value) => setForm({ ...form, ward_number: value })}
              placeholder='Enter your ward number'
              otherStyles='mt-3'
              keyboardType='numeric'
            />
            <FormField
              title='Username'
              value={form.user_name}
              handleChangeText={(value) => setForm({ ...form, user_name: value })}
              placeholder='Enter a username'
              otherStyles='mt-3'
              keyboardType='default'
            />
            <FormField
              title='Password'
              value={form.password}
              handleChangeText={(value) => setForm({ ...form, password: value })}
              placeholder='Enter at least 8 characters'
              otherStyles='mt-3'
            />
            <CustomButton
              title='Sign Up'
              handlePress={submitForm}
              containerStyle='bg-greenTea mt-4'
              textStyle='px-4 py-2'
              isLoading={isLoading}
            />

            <View>
              <Text
                className={`
                  text-center
                  text-greenAsh
                  font-pmedium
                  mt-4
                `}
              >
                Already have an account?
                <Link
                  href='/login'
                  className={`
                    text-greenTea
                    font-psemibold
                    underline
                  `}
                >
                  {' '}Sign In
                </Link>
              </Text>
              <Text
                className={`
                  text-center
                  text-greenAsh
                  font-pmedium
                  mt-0
                `}
              >
                Forgot your password?
                <Link
                  href='/reset-password'
                  className={`
                    text-greenTea
                    font-psemibold
                    underline
                  `}
                >
                  {' '}Reset Password
                </Link>
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Resigter