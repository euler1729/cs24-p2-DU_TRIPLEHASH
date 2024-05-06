import axios from "axios";
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
    // baseURL: "http://localhost:8000",
    baseURL: 'http://192.168.0.103:8000'
});

const saveKey = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}
const getValueFor = async(key)=> {
    return await SecureStore.getItemAsync(key)
}

export {
    api,
    saveKey,
    getValueFor,
}