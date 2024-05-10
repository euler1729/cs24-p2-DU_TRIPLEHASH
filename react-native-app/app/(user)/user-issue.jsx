import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PermissionsAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Make sure to import Picker
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { Colors } from '../../assets/configs.json'
import FormField from '../components/FormField';

const ReportIssue = () => {
    const navigation = useNavigation();
    const [location, setLocation] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Report Issue',
        });
    }, []);

    const grantGalleryPermission = async () => {
        if (Platform.OS === 'ios') return true;
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    const pickImage = async () => {
        try {
            if (Platform.OS === 'android') {
                const hasPermission = await grantGalleryPermission();
                if (!hasPermission) {
                    console.log('Permission denied');
                    return;
                }
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
            });
            if (!result.cancelled && result.assets[0].uri) {
                setPhoto(result.assets[0].uri);
            } else {
                console.log("Image picker was cancelled or returned null URI");
            }
        } catch (error) {
            console.error("Error picking image:", error);
        }
    };

    const submitReport = () => {
        // Handle submitting report
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Report Waste Management Issue</Text>
                <FormField
                    title='Location'
                    value={location}
                    handleChangeText={setLocation}
                    placeholder='Enter the location of the issue'
                    otherStyles='mb-4'
                />
                <Text
                    className={`
                    text-base
                    text-greenAsh
                    font-pmedium
                `}
                >
                    Problem Type
                </Text>
                <View className='radius-2xl border-2 border-greenAsh font-pmedium'>
                    <Picker
                        selectedValue={issueType}
                        onValueChange={(itemValue, itemIndex) => setIssueType(itemValue)}
                    >
                        <Picker.Item label="Select Type of Issue" value=""/>
                        <Picker.Item label="Overflowing Bins" value="Overflowing Bins" />
                        <Picker.Item label="Littering" value="Littering" />
                        <Picker.Item label="Illegal Dumping" value="Illegal Dumping" />
                        <Picker.Item label="Damaged Infrastructure" value="Damaged Infrastructure" />
                    </Picker>
                </View>
                <Text
                    className={`
                    text-base
                    text-greenAsh
                    font-pmedium
                `}
                >
                    Problem Description
                </Text>
                <TextInput
                    className='w-full radius-2xl border-2 font-psemibold text-base bg-white px-4 h-40 mb-4 border-greenAsh'
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                />
                <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
                    <Text style={{ color: Colors.greenTea, fontWeight: 'bold' }}>Attach Photo</Text>
                </TouchableOpacity>
                {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
                <CustomButton
                    title='Submit Report'
                    handlePress={submitReport}
                    containerStyle='bg-greenTea'
                    textStyle='px-4 py-2'
                    isLoading={isLoading}
                />
                <TouchableOpacity
                    onPress={() => {

                    }}
                    style={{ marginTop: 10, alignItems: 'center' }}>
                    <Text
                        style={{ color: Colors.greenTea, fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }}
                    >
                        Report Anonymously
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ReportIssue;
