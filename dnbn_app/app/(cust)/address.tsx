import { Text, View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./address.styles";

export default function AddressScreen() {
    const insets = useSafeAreaInsets();

    const addr = [
        { id: '1', label: '집', details: '경기도 수원시 영통구 월드컵로 123', recipient: '홍길동', phone: '010-1234-5678' },
        { id: '2', label: '회사', details: '경기도 성남시 분당구 판교로 456', recipient: '김철수', phone: '010-8765-4321' },
    ];
  return (
    <ScrollView style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF"}} />
      )}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate("/(cust)/tabs/custhome")}>
            <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">내 위치 설정</Text>
        <View style={styles.placeholder} />
      </View>

      <View>
        <FlatList
        data={addr}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
            <View style={{padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.label}</Text>
                <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>{item.details}</Text>
                <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>수령인: {item.recipient} | 연락처: {item.phone}</Text>
            </View>

        )}></FlatList>
      </View>
      <Link href="/(cust)/address-select" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 새 주소 추가</Text>
        </TouchableOpacity>
      </Link>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000"}} />
      )}
    </ScrollView>
  );
}
