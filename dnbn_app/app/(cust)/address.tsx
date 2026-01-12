import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
        <Text style={styles.title}>내 위치 설정</Text>
        <View style={styles.placeholder} />
      </View>

      <View>
        <FlatList
          data={addr}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <View style={{flex: 1, padding: 15}}>
                <Text style={styles.itemText}>{item.label}</Text>
                <Text style={styles.itemDetailText}>{item.details}</Text>
                <Text style={styles.itemDetailText}>수령인: {item.recipient} | 연락처: {item.phone}</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
        />
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
