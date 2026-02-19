import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "@/app/(store)/editstoreinfo.styles";

interface OperatingInfoSectionProps {
  businessOpenTime: string;
  businessCloseTime: string;
  businessDays: string[];
  dayOrder: string[];
  dayMapping: { [key: string]: string };
  onOpenTimePick: () => void;
  onCloseTimePick: () => void;
  onToggleBusinessDay: (day: string) => void;
}

export default function OperatingInfoSection({
  businessOpenTime,
  businessCloseTime,
  businessDays,
  dayOrder,
  dayMapping,
  onOpenTimePick,
  onCloseTimePick,
  onToggleBusinessDay,
}: OperatingInfoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="time" size={22} color="#EF7810" />
        <Text style={styles.sectionTitle}>운영 정보</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>오픈 시간</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={onOpenTimePick}
        >
          <Text
            style={[
              businessOpenTime
                ? styles.selectableInput
                : styles.selectableInputPlaceholder,
            ]}
          >
            {businessOpenTime}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>마감 시간</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={onCloseTimePick}
        >
          <Text
            style={[
              businessCloseTime
                ? styles.selectableInput
                : styles.selectableInputPlaceholder,
            ]}
          >
            {businessCloseTime}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>영업일</Text>
        <View style={styles.businessDayContainer}>
          {dayOrder.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => onToggleBusinessDay(day)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: businessDays.includes(day)
                  ? "#EF7810"
                  : "#ddd",
                backgroundColor: businessDays.includes(day)
                  ? "#FFF0E0"
                  : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: businessDays.includes(day) ? "600" : "500",
                  color: businessDays.includes(day) ? "#EF7810" : "#666",
                }}
              >
                {dayMapping[day]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
