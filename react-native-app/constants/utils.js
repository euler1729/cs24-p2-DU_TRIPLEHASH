import axios from "axios";
import * as SecureStore from 'expo-secure-store'
import { router } from "expo-router";
import { useState } from "react";

const api = axios.create({
    // baseURL: "http://localhost:8000",
    baseURL: 'http://192.168.0.108:8000'
});

const saveKey = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}
const getValueFor = async (key) => {
    return await SecureStore.getItemAsync(key)
}
const role = {
    1: 'admin',
    2: 'sts',
    3: 'landfill',
    4: 'unassigned',
    5: 'user',
    6: 'worker'
}

// Check if user is logged in
const checkUser = async () => {
    const access_token = await getValueFor('access_token');
    if (access_token) {
        const userInfo = await getValueFor('user');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            await changeRoute(user.role_id);
            return user;
        }
    }
}

// Change route based on role_id
async function changeRoute(role_id) {
    console.log('role_id, role: ', role_id, role[role_id]);
    switch (role[role_id]) {
        case 'admin':
            router.replace('/admin-dashboard');
            break;
        case 'sts':
            router.replace('/sts-dashboard');
            break;
        case 'landfill':
            router.replace('/landfill-dashboard');
            break;
        case 'unassigned':
            router.replace('/');
            break;
        case 'user':
            router.replace('/user-dashboard');
            break;
        case 'worker':
            router.replace('/worker-dashboard');
            break;
        default:
            break;
    }
}
export {
    api,
    role,
    saveKey,
    getValueFor,
    checkUser,
    changeRoute
}