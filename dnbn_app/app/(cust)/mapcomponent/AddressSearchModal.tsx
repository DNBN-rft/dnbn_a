import Postcode from "@actbase/react-daum-postcode";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { styles } from "../styles/map.styles";

interface AddressSearchModalProps {
  visible: boolean;
  insets: EdgeInsets;
  onClose: () => void;
  onAddressSelected: (address: string) => void;
}

export default function AddressSearchModal({
  visible,
  insets,
  onClose,
  onAddressSelected,
}: AddressSearchModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {insets.top > 0 && (
        <View style={{ backgroundColor: "#fff", height: insets.top }} />
      )}
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>주소 검색</Text>
          <View style={styles.modalEmptyView} />
        </View>
        <Postcode
          style={styles.postcodeStyle}
          onSelected={(data: any) => {
            const address = data.roadAddress || data.address;
            onClose();
            
            // 주소 검색 후 지도 이동 및 가맹점 조회
            setTimeout(() => {
              onAddressSelected(address);
            }, 300);
          }}
          onError={(error: any) => {
            Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.");
          }}
        />
      </View>
    </Modal>
  );
}
