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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <WebView
          source={getHtmlSource()}
          style={styles.webview}
          originWhitelist={["*"]}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
