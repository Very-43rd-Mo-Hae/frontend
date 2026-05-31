import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = "app_device_id";

export async function getOrCreateDeviceId() {
    const savedDeviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

    if(savedDeviceId) {
        return savedDeviceId;
    }

    const newDeviceId = uuidv4();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, newDeviceId);

    return newDeviceId;
}

export function getDeviceName() {
    return (
        Device.deviceName ||
        Device.modelName ||
        `${Device.brand ?? 'Unknown'} ${Device.modelName ?? 'Device'}`
    );
}