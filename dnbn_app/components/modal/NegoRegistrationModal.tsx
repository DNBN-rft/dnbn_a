import Ionicons from "@expo/vector-icons/build/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./NegoRegistrationModal.styles";

interface NegoRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: { startDate: Date }) => void;
}

export default function NegoRegistrationModal({
  visible,
  onClose,
  onConfirm,
}: NegoRegistrationModalProps) {
  const [negoStartDate, setNegoStartDate] = useState(new Date());
  const [showNegoDatePicker, setShowNegoDatePicker] = useState(false);

  // 초기 시간 계산
  const getInitialTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const roundedMinute = currentMinute < 30 ? 30 : 0;
    const roundedHour = currentMinute < 30 ? currentHour : currentHour + 1;
    return `${String(roundedHour % 24).padStart(2, "0")}:${String(roundedMinute).padStart(2, "0")}`;
  };

  const [selectedTime, setSelectedTime] = useState(getInitialTime());

  // 시간 옵션 생성 (30분 단위, 선택된 날짜가 오늘이면 현재 시간 이후만)
  const generateTimeOptions = () => {
    const times = [];
    const now = new Date();
    const isToday = negoStartDate.toDateString() === now.toDateString();

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

        // 오늘 날짜인 경우 현재 시간 이후만 표시
        if (isToday) {
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const currentTotalMinutes = currentHour * 60 + currentMinute;
          const optionTotalMinutes = hour * 60 + minute;

          if (optionTotalMinutes > currentTotalMinutes) {
            times.push({ value: timeString, label: timeString });
          }
        } else {
          times.push({ value: timeString, label: timeString });
        }
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  const negoDurationHours = 24;

  // 날짜 변경 시 선택된 시간이 유효한지 확인
  const handleDateChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setNegoStartDate(selectedDate);

      // 오늘로 변경된 경우, 선택된 시간이 현재 시간 이전이면 초기 시간으로 재설정
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();

      if (isToday) {
        const [hour, minute] = selectedTime.split(":").map(Number);
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const selectedTotalMinutes = hour * 60 + minute;

        if (selectedTotalMinutes <= currentTotalMinutes) {
          setSelectedTime(getInitialTime());
        }
      }
    }
  };

  const handleConfirm = () => {
    // 선택된 날짜에 시간 적용
    const [hour, minute] = selectedTime.split(":").map(Number);
    const startDate = new Date(negoStartDate);
    startDate.setHours(hour, minute, 0, 0);

    onConfirm({
      startDate,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.saleModalWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.saleModalContent}
          >
            <View style={styles.saleModalHeader}>
              <Text style={styles.saleModalTitle}>네고 등록</Text>
            </View>

            <View style={styles.saleInputGroup}>
              <Text style={styles.saleLabel}>네고 시작 시간</Text>
              <View style={styles.saleDateTimeRow}>
                <TouchableOpacity
                  style={styles.saleDateButtonHalf}
                  onPress={() => setShowNegoDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#ef7810" />
                  <Text style={styles.saleDateText}>
                    {negoStartDate.toLocaleDateString("ko-KR")}
                  </Text>
                </TouchableOpacity>
                <View style={styles.salePickerWrapper}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#ef7810"
                    style={styles.salePickerIcon}
                  />
                  <Picker
                    selectedValue={selectedTime}
                    onValueChange={(value) => setSelectedTime(value)}
                    style={styles.salePicker}
                  >
                    {timeOptions.map((option) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {showNegoDatePicker && (
                <DateTimePicker
                  value={negoStartDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onChange={(event, selectedDate?: Date) => {
                    setShowNegoDatePicker(Platform.OS === "ios");
                    handleDateChange(selectedDate);
                  }}
                />
              )}
            </View>

            <View style={styles.saleInputGroup}>
              <Text style={styles.saleLabel}>네고 종료일시</Text>
              <View style={[styles.saleInput, styles.saleInputDisabled]}>
                <Text style={styles.saleInputDisabledText}>
                  {(() => {
                    const [hour, minute] = selectedTime.split(":").map(Number);
                    const startDate = new Date(negoStartDate);
                    startDate.setHours(hour, minute, 0, 0);
                    const endDate = new Date(startDate);
                    endDate.setHours(endDate.getHours() + negoDurationHours);
                    return `${endDate.toLocaleDateString("ko-KR")} ${endDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
                  })()}
                </Text>
              </View>
              <Text style={styles.saleHelpText}>
                시작 시간으로부터 {negoDurationHours}시간 후 자동 종료
              </Text>
            </View>

            <View style={styles.saleModalButtons}>
              <TouchableOpacity
                style={styles.saleConfirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.saleConfirmButtonText}>등록</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saleCancelButton}
                onPress={onClose}
              >
                <Text style={styles.saleCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
