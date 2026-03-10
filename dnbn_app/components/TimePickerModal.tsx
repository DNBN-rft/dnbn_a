/**
 * Time Picker Modal Component
 * 시간 선택을 위한 모달 컴포넌트 (ScrollView 기반)
 */
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TimePickerModalProps {
  visible: boolean;
  type: "open" | "close" | null;
  currentTime: string;
  businessOpenTime: string;
  onConfirm: (time: string) => void;
  onClose: () => void;
}

export default function TimePickerModal({
  visible,
  type,
  currentTime,
  businessOpenTime,
  onConfirm,
  onClose,
}: TimePickerModalProps) {
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  useEffect(() => {
    if (currentTime) {
      const [hour, minute] = currentTime.split(":");
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [currentTime]);

  const handleConfirm = () => {
    if (type === "close") {
      const [openHour, openMinute] = businessOpenTime.split(":").map(Number);
      const closeHourNum = parseInt(selectedHour);
      const closeMinuteNum = parseInt(selectedMinute);

      if (
        closeHourNum < openHour ||
        (closeHourNum === openHour && closeMinuteNum < openMinute)
      ) {
        Alert.alert("알림", "종료 시간은 시작 시간 이후로 설정해주세요.");
        return;
      }
    }
    onConfirm(`${selectedHour}:${selectedMinute}`);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === "open" ? "영업 시작 시간" : "영업 종료 시간"}
            </Text>
            <Text style={styles.timeDisplay}>
              {selectedHour}:{selectedMinute}
            </Text>
          </View>

          <View style={styles.pickerContainer}>
            {/* Hour Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.columnLabel}>시</Text>
              <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
                {Array.from({ length: 24 }, (_, i) =>
                  String(i).padStart(2, "0"),
                ).map((hour) => {
                  const isDisabled =
                    type === "close" &&
                    parseInt(hour) < parseInt(businessOpenTime.split(":")[0]);
                  return (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => !isDisabled && setSelectedHour(hour)}
                      disabled={isDisabled}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.pickerItemSelected,
                        isDisabled && styles.pickerItemDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedHour === hour &&
                            styles.pickerItemTextSelected,
                          isDisabled && styles.pickerItemTextDisabled,
                        ]}
                      >
                        {hour}시
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Minute Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.columnLabel}>분</Text>
              <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
                {["00", "30"].map((minute) => {
                  const openHour = parseInt(businessOpenTime.split(":")[0]);
                  const openMinute = parseInt(businessOpenTime.split(":")[1]);
                  const isDisabled =
                    type === "close" &&
                    parseInt(selectedHour) === openHour &&
                    parseInt(minute) < openMinute;
                  return (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => !isDisabled && setSelectedMinute(minute)}
                      disabled={isDisabled}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.pickerItemSelected,
                        isDisabled && styles.pickerItemDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMinute === minute &&
                            styles.pickerItemTextSelected,
                          isDisabled && styles.pickerItemTextDisabled,
                        ]}
                      >
                        {minute}분
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  timeDisplay: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6F2B",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  scrollView: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerItemSelected: {
    backgroundColor: "#FFF0E0",
  },
  pickerItemDisabled: {
    opacity: 0.3,
  },
  pickerItemText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  pickerItemTextSelected: {
    fontWeight: "600",
    color: "#FF6F2B",
  },
  pickerItemTextDisabled: {
    color: "#ccc",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#FF6F2B",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
