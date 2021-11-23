import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  Alert
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
const appIcon = require("../assets/appicongif.gif");

export default class RideScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bikeId: "",
      userId: "",
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false
    };
  }

  getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      hasCameraPermissions: status === "granted",
      domState: "scanner",
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
      bikeId: data,
      domState: "normal",
      scanned: true
    });
  };

  handleTransaction = () => {
    var { bikeId } = this.state;
    db.collection("bicycles")
      .doc(bikeId)
      .get()
      .then(doc => {
        var bike = doc.data();
        if (bike.is_bike_available) {
          this.assignBike();
        } else {
          this.initiateBookReturn();
        }
      });
  };

  assignBike = () => {
    console.log("The bike is yours for an Hour, Enjoy!");
  };

  returnBike = () => {
    console.log("How was your ride? Make sure to follow our socials for more information");
  };

  render() {
    const { bikeId, userId, domState, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Image source={appIcon} style={styles.appIcon} />
          <Text style={styles.title}>Bike Monitor</Text>
        </View>
        <View style={styles.lowerContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={[styles.textinput, { width: "82%" }]}
              onChangeText={text => this.setState({ userId: text })}
              placeholder={"User Id"}
              placeholderTextColor="white"
              value={userId}
            />
          </View>
          <View style={[styles.textinputContainer, { marginTop: 25 }]}>
            <TextInput
              style={styles.textinput}
              placeholder={"Bicycle Id"}
              placeholderTextColor="white"
              value={bikeId}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.getCameraPermissions()}
            >
              <Text style={styles.scanbuttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, { marginTop: 25 }]}
            onPress={this.handleTransaction}
          >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00ffbf"
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginTop: 1
  },
  title: {
    fontSize: 40,
    fontFamily: "Bubblegum sans",
    paddingTop: 0,
    color: "black"
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "black",
    borderColor: "#4C5D70"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 15,
    borderColor: "#4C5D70",
    borderRadius: 6,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#c94747",
    fontFamily: "Bubblegum-sans",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#d4e665",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#4C5D70",
    fontFamily: "Bubllegum-sans"
  },
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0ce813",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4C5D70"
  },
  buttonText: {
    fontSize: 24,
    color: "#4C5D70",
    fontFamily: "Bubblegum-sans"
  }
});
