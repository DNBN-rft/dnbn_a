import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function StoreDashboardScreen() {
    const insets = useSafeAreaInsets();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.replace("/(auth)/login");
    };

    return (
        <View style={styles.container}>
            {insets.top > 0 && (
                <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
            )}

            {/* 헤더 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>가맹점 관리</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push("/(cust)/tabs/custhome")}
                    >
                        <Ionicons name="home-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <Text style={styles.title}>가맹점 대시보드</Text>
                    <Text style={styles.subtitle}>환영합니다! 📊</Text>
                    
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>오늘 주문</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>진행 중</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>완료</Text>
                        </View>
                    </View>

                    {/* 빠른 메뉴 */}
                    <View style={styles.quickMenu}>
                        <Text style={styles.sectionTitle}>빠른 메뉴</Text>
                        <View style={styles.menuGrid}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/(store)/orders")}
                            >
                                <Ionicons name="list" size={28} color="#FF9500" />
                                <Text style={styles.menuText}>주문관리</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/(store)/products")}
                            >
                                <Ionicons name="cube" size={28} color="#FF9500" />
                                <Text style={styles.menuText}>상품관리</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/(store)/settings")}
                            >
                                <Ionicons name="settings" size={28} color="#FF9500" />
                                <Text style={styles.menuText}>설정</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/(cust)/tabs/custhome")}
                            >
                                <Ionicons name="storefront" size={28} color="#4CAF50" />
                                <Text style={styles.menuText}>고객 화면</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF9500',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    quickMenu: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    menuItem: {
        width: '47%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 8,
    },
});
