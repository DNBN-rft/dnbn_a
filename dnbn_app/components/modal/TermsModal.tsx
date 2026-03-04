import { TERMS_HTML } from "@/assets/assignment/termsContent";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  htmlPath: string;
}

export default function TermsModal({
  visible,
  onClose,
  title,
  htmlPath,
}: TermsModalProps) {
  const insets = useSafeAreaInsets();

  // HTML 내용을 가져오기
  const getHtmlSource = () => {
    const htmlContent = TERMS_HTML[htmlPath];
    if (htmlContent) {
      return { html: htmlContent };
    }
    return {
      html: "<html><body><p>약관을 찾을 수 없습니다.</p></body></html>",
    };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftSection} />
          <View style={styles.centerSection}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <WebView
        source={getHtmlSource()}
        style={styles.webview}
        originWhitelist={["*"]}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
