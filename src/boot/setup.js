import * as Expo from "expo";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { Component } from "react";
import { StyleProvider, Container, Content, Text } from "native-base";
import getTheme from '../../native-base-theme/components';
import material from "../../native-base-theme/variables/material";
import App from "../App";

export default class Setup extends Component {
    constructor() {
        super();
        this.state = {
            isReady: false
        };
    }
    componentWillMount() {
        this.loadFonts();
    }
    async loadFonts() {
        await Font.loadAsync({
            Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
            //Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
            Entypo: require("../../node_modules/native-base/Fonts/Entypo.ttf"),
            Feather: require("../../node_modules/native-base/Fonts/Feather.ttf"),
            FontAwesome: require("../../node_modules/native-base/Fonts/FontAwesome.ttf"),
            // MaterialIcons: require("native-base/Fonts/MaterialIcons.ttf"),
            // MaterialCommunityIcons: require("native-base/Fonts/MaterialCommunityIcons.ttf"),
            Octicons: require("../../node_modules/native-base/Fonts/Octicons.ttf"),
            // Zocial: require("@expo/vector-icons/fonts/Zocial.šttf"),
            // SimpleLineIcons: require("native-base/Fonts/SimpleLineIcons.ttf"),
            // EvilIcons: require("native-base/Fonts/EvilIcons.ttf"),
            // ...Ionicons.font,
        });
        this.setState({ isReady: true });
    }
    render() {
        if (!this.state.isReady) {
            return <Expo.AppLoading />;
        }
        return (
            <StyleProvider style={getTheme(material)}>
                <App />               
            </StyleProvider>
        );
    }
}
