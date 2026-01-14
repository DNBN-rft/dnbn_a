import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  faqInnerContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },
  faqHeaderContainer: {
    alignItems: "center",
  },
  faqSearchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#ffffffff",
  },
  faqSearchPlaceholderText: {
    flex: 1,
    color: "#CCCCCC",
    fontSize: 18,
  },
  faqSubjectContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    gap: 10,
    margin: 10,
  },
  faqSubjectButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  faqSubjectButtonSelected: {
    backgroundColor: "#EF7810",
  },
  faqSubjectButtonUnselected: {
    borderColor: "#EF7810",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  faqSubjectButtonText: {
    fontSize: 18,
  },
  faqSubjectButtonTextSelected: {
    color: "#FFFFFF",
  },
  faqSubjectButtonTextUnselected: {
    color: "#EF7810",
  },
  faqListContainer: {
    marginTop: 20,
  },
  faqSubjectTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  faqItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  faqItemQuestionText: {
    fontSize: 18,
    color: "#333333",
  },
  questionReqContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  questionReqText: {
    fontSize: 20,
    color: "#666666",
    marginBottom: 20,
  },
  questionReqButton: {
    backgroundColor: "#ffffffff",
    borderWidth: 1,
    borderColor: "#EF7810",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  questionReqButtonText: {
    color: "#EF7810",
    fontSize: 18,
  },
  questionBtnContainer: {
    flexDirection: "row",
    gap: 10,
  },
  questionListViewButton: {
    backgroundColor: "#ffffffff",
    borderWidth: 1,
    borderColor: "#EF7810",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  questionListViewText: {
    color: "#EF7810",
    fontSize: 18,
  },
});
