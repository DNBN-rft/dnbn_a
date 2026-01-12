import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./CategorySelectModal.styles";

interface Category {
  id: number;
  name: string;
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
              key={cat.id}
              style={[
                styles.modalOption,
                selectedCategory?.id === cat.id && styles.modalOptionSelected,
              ]}
              onPress={() => {
                onSelect(cat);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  selectedCategory?.id === cat.id &&
                    styles.modalOptionTextSelected,
                ]}
              >
                {cat.name}
              </Text>
              {selectedCategory?.id === cat.id && (
                <Ionicons name="checkmark" size={20} color="#000" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
