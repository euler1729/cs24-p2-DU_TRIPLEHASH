import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../../constants';

const FormField = ({
    title,
    value,
    handleChangeText,
    placeholder,
    otherStyles,
    ...props
}) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <View
            className={`
                space-y-0
                ${otherStyles}
            `}
        >
            <Text
                className={`
                    text-base
                    text-greenAsh
                    font-pmedium
                `}
            >
                {title}
            </Text>
        
            <View
                className={`
                    border-2
                    border-greenAsh
                    w-full
                    rounded-2xl
                    h-10
                    px-4
                    bg-white
                    items-center
                    flex-row
                `}
            >
                <TextInput
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    className={`
                        w-full
                        flex-1
                        text-base
                        font-psemibold
                    `}
                    secureTextEntry={title === 'Password' && !showPassword}
                    {...props}
                />
                {
                    title === 'Password' && (
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Image
                                source={showPassword ? icons.eye : icons.eyeHide}
                                resizeMode='contain'
                                className='w-6 h-6'
                            />
                        </TouchableOpacity>
                    )
                }
            </View>

        </View>
    )
}

export default FormField