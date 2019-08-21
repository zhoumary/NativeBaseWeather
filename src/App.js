import React, { Component } from "react";
import { Root, Container } from "native-base";
//import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";

import CurrWeather from './screens/weather/currentWeather';


export default class APP extends Component {
    render() {
        return (
            <Container>
                <CurrWeather />
            </Container>
        );
    }
}
