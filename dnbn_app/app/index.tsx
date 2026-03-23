import { getStorageItem } from "@/utils/storageUtil";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const accessToken = await getStorageItem('accessToken');
                const storedUserType = await getStorageItem('userType');
                if (accessToken && storedUserType === 'cust') {
                    router.replace('/(cust)/tabs/custhome');
                } else if (accessToken && storedUserType === 'store') {
                    router.replace('/(store)/tabs/storehome');
                } else {
                    router.replace('/(guest)/tabs/guesthome');
                }
            } catch {
                router.replace('/(guest)/tabs/guesthome');
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            {insets.top > 0 && (
                <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
            )}
            <Image
                style={styles.imagebox}
                source={require('@/assets/images/logo.png')}
                onLoad={() => setImageLoaded(true)}
            />
            {imageLoaded && (
                <ActivityIndicator
                    size="large"
                    color="#EF7810"
                    style={styles.loader}
                />
            )}
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    imagebox: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    loader: {
        marginTop: 20,
    },
});