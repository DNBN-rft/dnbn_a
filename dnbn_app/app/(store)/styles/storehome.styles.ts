import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  salesInfo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF9500",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
  },
  quickMenu: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  menuItem: {
    width: "48%",
    height: 150,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
});