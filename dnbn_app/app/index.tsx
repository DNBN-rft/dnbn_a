import { useEffect, useState } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // 2초 후 비회원 홈 화면으로 이동
        const timer = setTimeout(() => {
            router.replace('/(guest)/tabs/guesthome');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

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