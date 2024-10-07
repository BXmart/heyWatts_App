import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import useAuthStore from "@/stores/useAuthStore";
import { Link, router } from "expo-router";

export default function ModalScreen() {
  const { logout } = useAuthStore();
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {!isPresented && <Link href="/">Dismiss modal</Link>}
      <Link href="/">Dismiss modal</Link>
      <Pressable onPress={logout}>
        <Text>Logout</Text>
      </Pressable>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
