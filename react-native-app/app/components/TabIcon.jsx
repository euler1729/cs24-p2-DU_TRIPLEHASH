import { Text, Image, View } from "react-native";
import {Colors} from '../../assets/configs.json';
const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className='items-center justify-center'>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className={`w-6 h-6 ${focused ? 'tint-primary' : 'tint-secondary'}`}
            />
            <Text
                className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
                style={{ color: focused ? Colors.greenLight : Colors.greenAshLight }}
            >
                {name}
            </Text>
        </View>
    )
}
export default TabIcon;