import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { styles } from "@/app/(store)/editstoreinfo.styles";

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
        Alert.alert("알림", "마감 시간은 오픈 시간 이후로 설정해주세요.");
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
      <View style={styles.timePickerModalOverlay}>
        <View style={styles.timePickerModalContent}>
          <View style={styles.timePickerModalHeader}>
            <Text style={styles.timePickerModalTitle}>
              {type === "open" ? "오픈 시간" : "마감 시간"}을 선택하세요
            </Text>
            <Text
              style={{ fontSize: 32, fontWeight: "bold", color: "#EF7810" }}
            >
              {selectedHour}:{selectedMinute}
            </Text>
          </View>

          <View style={styles.timePickerContainer}>
            {/* Hour Picker */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 10,
                  color: "#666",
                }}
              >
                시간
              </Text>
              <ScrollView
                style={{
                  maxHeight: 200,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 8,
                }}
                scrollEventThrottle={16}
              >
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
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor:
                          selectedHour === hour ? "#FFF0E0" : "#fff",
                        borderBottomWidth: 1,
                        borderBottomColor: "#f0f0f0",
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          fontWeight: selectedHour === hour ? "600" : "400",
                          color:
                            selectedHour === hour
                              ? "#EF7810"
                              : isDisabled
                                ? "#ccc"
                                : "#000",
                        }}
                      >
                        {hour}:00
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Minute Picker */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 10,
                  color: "#666",
                }}
              >
                분
              </Text>
              <ScrollView
                style={{
                  maxHeight: 200,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 8,
                }}
                scrollEventThrottle={16}
              >
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
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor:
                          selectedMinute === minute ? "#FFF0E0" : "#fff",
                        borderBottomWidth: 1,
                        borderBottomColor: "#f0f0f0",
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          fontWeight:
                            selectedMinute === minute ? "600" : "400",
                          color:
                            selectedMinute === minute
                              ? "#EF7810"
                              : isDisabled
                                ? "#ccc"
                                : "#000",
                        }}
                      >
                        :{minute}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.timePickerButtonGroup}>
            <TouchableOpacity
              style={[styles.modalCancelButton, { flex: 1 }]}
              onPress={onClose}
            >
              <Text style={styles.modalCancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSingleButton, { flex: 1 }]}
              onPress={handleConfirm}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
