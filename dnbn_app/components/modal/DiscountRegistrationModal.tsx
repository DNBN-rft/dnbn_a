import Ionicons from "@expo/vector-icons/build/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "./DiscountRegistrationModal.styles";

interface DiscountRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: {
    discountType: "rate" | "price";
    discountValue: string;
    startDate: Date;
  }) => void;
  productPrice?: number;
}

export default function DiscountRegistrationModal({
  visible,
  onClose,
  onConfirm,
  productPrice = 10000,
}: DiscountRegistrationModalProps) {
  const [discountType, setDiscountType] = useState<"rate" | "price">("rate");
  const [discountValue, setDiscountValue] = useState("");
  const [saleStartDate, setSaleStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    const isToday = saleStartDate.toDateString() === now.toDateString();

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
  const discountDurationHours = 24;

  // 날짜 변경 시 선택된 시간이 유효한지 확인
  const handleDateChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setSaleStartDate(selectedDate);

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
    const startDate = new Date(saleStartDate);
    startDate.setHours(hour, minute, 0, 0);

    onConfirm({
      discountType,
      discountValue,
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
              <Text style={styles.saleModalTitle}>할인 등록</Text>
            </View>

            <View style={styles.saleOptionGroup}>
              <Text style={styles.saleLabel}>할인 방식 선택</Text>
              <View style={styles.saleRadioGroup}>
                <TouchableOpacity
                  style={styles.saleRadioOption}
                  onPress={() => {
                    setDiscountType("rate");
                    setDiscountValue("");
                  }}
                >
                  <View style={styles.saleRadioCircle}>
                    {discountType === "rate" && (
                      <View style={styles.saleRadioCircleSelected} />
                    )}
                  </View>
                  <Text style={styles.saleRadioText}>할인률 (%)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saleRadioOption}
                  onPress={() => {
                    setDiscountType("price");
                    setDiscountValue("");
                  }}
                >
                  <View style={styles.saleRadioCircle}>
                    {discountType === "price" && (
                      <View style={styles.saleRadioCircleSelected} />
                    )}
                  </View>
                  <Text style={styles.saleRadioText}>할인가 (원)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.saleInputGroup}>
              <Text style={styles.saleLabel}>할인 값</Text>
              <TextInput
                style={styles.saleInput}
                placeholder="숫자를 입력하세요"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={discountValue}
                onChangeText={(text) => {
                  const numValue = parseInt(text) || 0;
                  if (discountType === "rate") {
                    if (text === "") {
                      setDiscountValue("");
                    } else if (numValue > 100) {
                      setDiscountValue("100");
                    } else if (numValue >= 1) {
                      setDiscountValue(text);
                    }
                  } else {
                    if (text === "") {
                      setDiscountValue("");
                    } else if (numValue > productPrice) {
                      setDiscountValue(productPrice.toString());
                    } else if (numValue >= 1) {
                      setDiscountValue(text);
                    }
                  }
                }}
              />
            </View>

            <View style={styles.saleInputGroup}>
              <Text style={styles.saleLabel}>할인 시작 시간</Text>
              <View style={styles.saleDateTimeRow}>
                <TouchableOpacity
                  style={styles.saleDateButtonHalf}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#ef7810" />
                  <Text style={styles.saleDateText}>
                    {saleStartDate.toLocaleDateString("ko-KR")}
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

              {showDatePicker && (
                <DateTimePicker
                  value={saleStartDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onChange={(event, selectedDate?: Date) => {
                    setShowDatePicker(Platform.OS === "ios");
                    handleDateChange(selectedDate);
                  }}
                />
              )}
            </View>

            <View style={styles.saleInputGroup}>
              <Text style={styles.saleLabel}>할인 종료일시</Text>
              <View style={[styles.saleInput, styles.saleInputDisabled]}>
                <Text style={styles.saleInputDisabledText}>
                  {(() => {
                    const [hour, minute] = selectedTime.split(":").map(Number);
                    const startDate = new Date(saleStartDate);
                    startDate.setHours(hour, minute, 0, 0);
                    const endDate = new Date(startDate);
                    endDate.setHours(
                      endDate.getHours() + discountDurationHours,
                    );
                    return `${endDate.toLocaleDateString("ko-KR")} ${endDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
                  })()}
                </Text>
              </View>
              <Text style={styles.saleHelpText}>
                시작 시간으로부터 {discountDurationHours}시간 후 자동 종료
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
