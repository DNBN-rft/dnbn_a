import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./CategorySelectModal.styles";

interface Category {
  categoryIdx: number;
  categoryNm: string;
  fileMasterResponse?: {
    files: Array<{ fileUrl: string; originalName: string; order: number }>;
  };
}

interface CategorySelectModalProps {
  visible: boolean;
  categories: Category[];
  selectedCategory: Category | null;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

export default function CategorySelectModal({
  visible,
  categories,
  selectedCategory,
  onSelect,
  onClose,
}: CategorySelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>카테고리 선택</Text>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.categoryIdx}
              style={[
                styles.modalOption,
                selectedCategory?.categoryIdx === cat.categoryIdx && styles.modalOptionSelected,
              ]}
              onPress={() => {
                onSelect(cat);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  selectedCategory?.categoryIdx === cat.categoryIdx &&
                    styles.modalOptionTextSelected,
                ]}
              >
                {cat.categoryNm}
              </Text>
              {selectedCategory?.categoryIdx === cat.categoryIdx && (
                <Ionicons name="checkmark" size={20} color="#000" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
