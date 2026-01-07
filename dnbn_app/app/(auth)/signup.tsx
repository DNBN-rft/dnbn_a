import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group/lib/RadioGroup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/header';
import { styles } from './signup.styles';

export default function PracticeView() {
  const insets = useSafeAreaInsets();  
  const [selectedId, setSelectedId] = useState('1');

  const radioButtons = [
    {id: '1', label: '남', value: "male"},
    {id: '2', label: '여', value: "female"}
  ]

    const handleBackPress = () => {
      console.log('뒤로가기');
      router.back();
    };

  return (
    <View style={[styles.practiceView, {paddingTop: insets.top}]}>
      <Header onBackPress={handleBackPress} />

      <View style={styles.inputContainer}>
          <View style={styles.viewMargin}>
            <Text style={styles.welcome}>동네방네에 오신 것을 환영합니다.</Text>
            <Text style={styles.header}>회원 기본 정보 입력</Text>
          </View>
        
          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>아이디</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder='아이디 입력'
                placeholderTextColor={"#ccc"}
          ></TextInput>
              <Pressable
                style={styles.pressableStyle}>
                  <Text style={styles.pressableTextStyle}>중복 체크</Text>
              </Pressable>
            </View>
            <Text
              style={styles.descriptionStyle}
            >6자리 이상의 영문 또는 영문, 숫자 혼합</Text>
          </View>
        
          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>비밀번호</Text>

            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder='비밀번호 입력'
                placeholderTextColor={"#ccc"}>
              </TextInput>
            </View>
              <Text
                style={styles.descriptionStyle}
              >8자이상 16자 미만으로 입력</Text>
          </View>
      
          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>비밀번호확인</Text>

            <View style={styles.inputComponent}>
              <TextInput 
                style={styles.inputStyle}
                placeholder='비밀번호 입력'
                placeholderTextColor={"#ccc"}>
              </TextInput>
            </View>
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>이름(닉네임)</Text>
            <View style={styles.inputComponent}>
              <TextInput 
                style={styles.inputStyle}
                placeholder='이름(닉네임) 입력'
                placeholderTextColor={"#ccc"}>
              </TextInput>
            </View>
          </View>
      
          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>전화번호</Text>  
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="전화번호 입력"
                placeholderTextColor={"#ccc"}>
              </TextInput>
              <Pressable
                style={styles.pressableStyle}
                ><Text style={styles.pressableTextStyle}>본인 인증</Text></Pressable>
            </View>
        </View>
        
        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}><Text>성별</Text></Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
            layout='row'
          />
        </View>

        <Pressable style={styles.registButton}>
          <Text style={styles.registButtonText}>회원가입</Text>
        </Pressable>
    </View>
  </View >
  );
}
