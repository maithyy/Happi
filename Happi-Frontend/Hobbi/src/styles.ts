import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 10,
    color: "#5878A7",
    textAlign: "center",
  },
  heading2: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleCaption: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    height: 390,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fcfcfc'
  },
  captionTextExercise: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333333",
    textAlign: "center",
    width: "80%",
  },
  captionTextJournal: {
    fontSize: 25,
    color: "#333333",
    marginBottom: 5,
    textAlign: "center",
    width: "90%",
  },
  captionTextHome: {
    fontSize: 17.5,
    color: "#333333",
    marginTop: 20,
    textAlign: "center",
    width: "90%",
  },
  captionTextSleep: {
    fontSize: 17.5,
    color: "#333333",
    marginTop: 10,
    textAlign: "center",
    width: "80%",
  },
  listText: {
    fontSize: 17.5,
    color: "#333333",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  regularText: {
    fontSize: 17.5,
    color: "#333333",
    marginTop: 10,
    textAlign: "center",
    width: "80%",
  },
  button: {
    backgroundColor: "rgb(99,162,95)",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  exerciseContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    marginTop: 10,
    width: '90%'
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseDesc: {
    fontSize: 14,
    marginTop: 5,
  },
  exerciseDetails: {
    fontSize: 12,
    marginTop: 5,
    color: '#666',
  },
  loginTitle: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    color: "#5878A7",
    textAlign: "center",
    fontFamily: 'Noteworthy',
  },
  loginButton: {
    backgroundColor: "rgb(99,162,95)",
    padding: 10,
    borderRadius: 20,
    marginTop: 50,
    marginBottom: 50,
    paddingVertical: 10, // Adjust the padding to extend the pressable area vertically
    paddingHorizontal: 70,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(227,241,224)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: "80%",
    marginTop: 30,
  },
  icon: {
    marginRight: 10, // Spacing between icon and TextInput
  },
  loginTextInput: {
    flex: 1, // Take remaining space
  },
  signUpSmallText: {
    marginBottom: 35,
  },
  signUpTextInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "80%",
    padding: 10,
    backgroundColor: 'rgb(227,241,224)'
  },
  preferencesText: {
    alignSelf: "flex-start",
    fontSize: 17.5,
    color: "#333333",
    width: "80%",
    paddingLeft: 43,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 5
  },
  preferencesButton: {
    backgroundColor: "rgb(99,162,95)",
    padding: 10,
    borderRadius: 20,
    marginTop: 50,
    marginBottom: 20,
    paddingVertical: 10, // Adjust the padding to extend the pressable area vertically
    paddingHorizontal: 70,
  },
});
