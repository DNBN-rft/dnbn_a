import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioGroup } from "react-native-radio-buttons-group";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./signup.styles";

export default function PracticeView() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState("1");

  const radioButtons = [
    { id: "1", label: "남", value: "male" },
    { id: "2", label: "여", value: "female" },
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>동네방네에 오신 것을 환영합니다.</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.inputContainer}
      >
        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>아이디 *</Text>
          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="아이디 입력"
              placeholderTextColor={"#ccc"}
            ></TextInput>
            <Pressable style={styles.pressableStyle}>
              <Text style={styles.pressableTextStyle}>중복 체크</Text>
            </Pressable>
          </View>
          <Text style={styles.descriptionStyle}>
            6자리 이상의 영문 또는 영문, 숫자 혼합
          </Text>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>비밀번호 *</Text>

          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="비밀번호 입력"
              placeholderTextColor={"#ccc"}
            ></TextInput>
          </View>
          <Text style={styles.descriptionStyle}>
            8자이상 16자 미만으로 입력
          </Text>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>비밀번호확인 *</Text>

          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="비밀번호 입력"
              placeholderTextColor={"#ccc"}
            ></TextInput>
          </View>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>이름 *</Text>
          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="이름 입력"
              placeholderTextColor={"#ccc"}
            ></TextInput>
          </View>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>주민등록번호 *</Text>
          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="주민등록번호 앞"
              placeholderTextColor={"#ccc"}
            ></TextInput>
            <Text>-</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="주민등록번호 뒤"
              placeholderTextColor={"#ccc"}
            ></TextInput>
          </View>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>닉네임 *</Text>
          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="닉네임 입력"
              placeholderTextColor={"#ccc"}
            ></TextInput>
          </View>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>전화번호 *</Text>
          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="전화번호 입력"
              placeholderTextColor={"#ccc"}
            ></TextInput>
            <Pressable style={styles.pressableStyle}>
              <Text style={styles.pressableTextStyle}>본인 인증</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>
            <Text>성별</Text>
          </Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
            layout="row"
          />
        </View>

        <View style={styles.viewMargin}>
          <Pressable style={styles.registButton}>
            <Text style={styles.registButtonText}>회원가입</Text>
          </Pressable>
        </View>
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
