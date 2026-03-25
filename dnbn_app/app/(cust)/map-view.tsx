import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustMapScreen from "./tabs/map";

export default function MapViewWithInsets() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <CustMapScreen />
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
