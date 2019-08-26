import React, { Component } from "react";
import { Image, StyleSheet, ImageBackground, Modal, View, TouchableHighlight } from "react-native";
// import Modal from "react-native-modal";
import { Root, Container, Card, CardItem, Text, Content, Header, Footer, Left, Right, Body, Button, Icon, Title, List, ListItem, Toast } from "native-base";
// import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import Raining from '../../pics/weather-rain.png';
import Clouds from '../../pics/weather-clouds.png';
import Thunderstorm from '../../pics/weather_sunderain.png';
import Clear from '../../pics/clear.png';
import Haze from '../../pics/haze.png';
import defaultBack from '../../pics/bkg11.jpg';
import SunderRainBack from '../../pics/SunderRainBackground.gif';
import RainBack from '../../pics/RainBackground.gif';


const host = "https://api.openweathermap.org/data/2.5/";
const apiKey = "a81a067d035dd84954e1a0d2c907e813";
let columnCont = 1;
let forecastWidth;
let listWidth;
export default class CurrWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherInfo: null,
            location: null,
            weather: null,
            temp: null,
            currentTemp: null,
            currentWeather: null,
            highestTemp: null,
            lowestTemp: null,
            timeWeather: null,
            forecasts: null,
            showToast: false
        };
    }    

    componentDidMount() {
        let cityID = "1815286";

        /*
            get current location's weather information  
        */
        let queryParam = "weather?id=" + cityID + "&APPID=" + apiKey;
        let url = host + queryParam;
        if (url) {
            fetch(url).then(
                response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Request failed');
                }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                let div = [];

                // for getting location
                let location = jsonResponse.name;
                div.push(<CardItem style={{ paddingTop: 5, paddingBottom: 5, backgroundColor: 'transparent', shadowOpacity: 0 }} key='location'><Body style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold', color: 'white' }}>{location}</Text></Body></CardItem>);

                // for getting overview weather desc
                let weather = jsonResponse.weather;
                let weatDesc;
                if (weather) {
                    let current = weather[0];
                    if (current) {
                        weatDesc = current.main;
                        div.push(<CardItem style={{ paddingTop: 5, paddingBottom: 5, backgroundColor: 'transparent', shadowOpacity: 0 }} key='weather'><Body style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold', color: 'white' }}>{weatDesc}</Text></Body></CardItem>);
                    }
                }

                // for geeting temperature
                let main = jsonResponse.main;
                let temp_min;
                let temp_max;
                let temperature;
                if (main) {
                    if (main.temp) {
                        temperature = tempConversion(main.temp);
                        div.push(<CardItem style={{ paddingTop: 5, paddingBottom: 5, backgroundColor: 'transparent', shadowOpacity: 0 }} key='temp'><Body style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold', color: 'white' }}>{temperature}<Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold', color: 'white' }}>&#8451;</Text></Text></Body></CardItem>);
                    }
                    if (main.temp_min) {
                        temp_min = tempConversion(main.temp_min);
                    }
                    if (main.temp_max) {
                        temp_max = tempConversion(main.temp_max);
                    }
                }

                this.setState({
                    weatherInfo: div,
                    location: location,
                    weather: weatDesc,
                    temp: temperature,
                    currentWeather: weatDesc,
                    currentTemp: temperature,
                    highestTemp: temp_max,
                    lowestTemp: temp_min
                });
            });
        }

        

        /*
            get the current day's time weather within three hours 
        */

        queryParam = "forecast?id=" + cityID + "&APPID=" + apiKey;
        url = host + queryParam;
        if (url) {
            fetch(url).then(
                response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Request failed');
                }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                let tableBody = [];
                let weatherImage;
                let weatDescrip;
                if (this.state.currentWeather) {
                    weatDescrip = this.state.currentWeather;
                    weatherImage = weatherConversion(weatDescrip);
                }

                const todayoverview = [];
                todayoverview.push('Now');
                todayoverview.push(weatherImage);
                todayoverview.push(this.state.currentTemp);
                tableBody.push(todayoverview);

                let forecasts = jsonResponse.list;
                let temperature;
                let isCrossDay = false;
                let currDate = new Date();
                let date = currDate.getDate();

                if (forecasts) {
                    for (let index = 0; index < forecasts.length; index++) {
                        let todayfuture = [];
                        let forecast = forecasts[index];
                        // get hour
                        let time = forecast.dt;
                        let dateTime;
                        let timeHour;
                        let hour;
                        let hourTime;
                        const delta = 12;
                        let tempDate;
                        if (time) {
                            dateTime = new Date(time * 1000);
                            tempDate = dateTime.getDate();
                            if (date !== tempDate) {
                                break;
                            }
                            columnCont = columnCont + 1;
                            timeHour = dateTime.getHours();

                            if (timeHour > 12) {
                                hour = (timeHour - delta).toFixed();
                                if (hour === 12) {
                                    hourTime = hour.toString() + "PM";
                                }
                                hourTime = hour.toString() + "PM";
                            } else if (timeHour === 12) {
                                hourTime = timeHour.toString() + "PM";
                            } else {
                                hourTime = timeHour.toString() + "AM";
                            }

                        }

                        // get weather desc
                        let weather = forecast.weather;
                        let weatDesc;
                        let weatImage;
                        if (weather) {
                            weatDesc = weather[0].main;
                            if (weatDesc) {
                                weatImage = weatherConversion(weatDesc);
                            }
                        }

                        // get time temperature
                        let main = forecast.main;
                        let weatTemp;
                        if (main) {
                            weatTemp = tempConversion(main.temp);
                        }

                        todayfuture.push(hourTime);
                        todayfuture.push(weatImage);
                        todayfuture.push(weatTemp);
                        tableBody.push(todayfuture);


                    }

                }

                this.setState({
                    timeWeather: tableBody
                });


            });
        }

        /*
            get next five days weather
        */
        let forecastParam = "forecast?id=" + cityID + "&APPID=" + apiKey;
        let forecastURL = host + forecastParam;
        if (forecastURL) {
            fetch(forecastURL).then(
                response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Request failed');
                }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                /*
                    get all forecast data, and filter weathdaer not today
                */
                // get today date
                let currDate = new Date();
                let currDay = currDate.getDate();
                let currMonth = currDate.getMonth() + 1;

                let forecastDays = jsonResponse.list;

                if (forecastDays) {
                    /*get forecast days' weather */
                    let forecasts = [];
                    for (let index = 1; index < 6; index++) {
                        let forecastData = [];
                        let nextDayForecast = forecastDays.filter((forecastDay) => {
                            let time = forecastDay.dt;
                            let dateTime = new Date(time * 1000);
                            let tempDate = dateTime.getDate();
                            let tempMonth = dateTime.getMonth() + 1;

                            if (currMonth === tempMonth && (currDay + index) === tempDate) {
                                return forecastDay;
                            } else if (tempMonth > currMonth && currDay > tempDate) {
                                return forecastDay;
                            }
                        });

                        if (nextDayForecast) {
                            // get highest and lowest temperature
                            let highestTemp = Math.max.apply(Math, nextDayForecast.map((next) => { return next.main.temp; }));
                            if (highestTemp) {
                                highestTemp = tempConversion(highestTemp);
                            }
                            let lowestTemp = Math.min.apply(Math, nextDayForecast.map((next) => { return next.main.temp; }));
                            if (lowestTemp) {
                                lowestTemp = tempConversion(lowestTemp);
                            }


                            // get weather description
                            let nextWeather = nextDayForecast[0];
                            if (nextWeather) {
                                let weather = nextWeather.weather[0];
                                if (weather) {
                                    let weatDesc = weather.main;
                                    let weatImage;
                                    if (weatDesc) {
                                        weatImage = weatherConversion(weatDesc);
                                        forecastData.push(weatImage);
                                        // forecastData.push(weatImage);
                                        forecastData.push(highestTemp);
                                        forecastData.push(lowestTemp);
                                        forecasts.push(forecastData);
                                    }
                                }
                            }
                        }
                    }
                    this.setState({
                        forecasts: forecasts
                    });
                }
            });
        }
    }
    
    
    getWeekDay() {
        const day = new Date();
        const weeklyNum = day.getDay();
        var weekday = new Array(7);
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        weekday[0] = "Sunday";
        return weekday[weeklyNum];
    }


    getNextWeekDay(i) {
        const day = new Date();
        const weeklyNum = day.getDay();
        var weekday = new Array(7);
        weekday[1] = "Mon.";
        weekday[2] = "Tue.";
        weekday[3] = "Wed.";
        weekday[4] = "Thur.";
        weekday[5] = "Fri.";
        weekday[6] = "Sat.";
        weekday[0] = "Sun.";
        let x = weeklyNum + i + 1;
        if (x > 6) {
            x = x % 7;
        }
        return weekday[x];
    }


    renderWeather(weather, idx) {
        return (
            <List key={idx} style={{width: listWidth}}>
                <ListItem style={{
                    marginLeft: 5, borderColor: 'transparent', paddingTop: 10, paddingBottom: 10, paddingRight: 10, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>{weather[0]}</Text>
                </ListItem>
                    <ListItem style={{
                    marginLeft: 5, borderColor: 'transparent', paddingTop: 10, paddingBottom: 10, paddingRight: 10, justifyContent: 'center' }}>
                    <Image style={{ width: 30, height: 30 }} source={weather[1]} />
                </ListItem>
                    <ListItem style={{
                    marginLeft: 5, borderColor: 'transparent', paddingTop: 10, paddingBottom: 10, paddingRight: 10, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Chalkduster', fontSize: 12, fontWeight: 'bold', color: 'white' }}>{weather[2]}<Text style={{ fontFamily: 'Chalkduster', fontSize: 10, fontWeight: 'bold', color: 'white' }}>&#8451;</Text></Text>
                </ListItem>
            </List>
        );
    }


    renderForecasts(forecast, idx) {
        return (
            <CardItem key={idx} style={{ backgroundColor: 'transparent', shadowOpacity: 0 }}>
                <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', width: forecastWidth, color: 'white' }}>{forecast[0]}</Text>
                <Text style={{ width: forecastWidth }}><Image style={{ width: 30, height: 30 }} source={forecast[1]} /></Text>
                <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', width: forecastWidth, color: 'white' }}>{forecast[2]}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>&#8451;</Text></Text>
                <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', width: forecastWidth, color: 'white' }}>{forecast[3]}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>&#8451;</Text></Text>
            </CardItem>
        );
    }


    render() {
        if (!this.state.location || !this.state.weather || !this.state.temp || !this.state.timeWeather || !this.state.forecasts) {
            return <Container />
        }
        
        const timeWeathers = this.state.timeWeather;
        let forecasts = this.state.forecasts;
        if (forecasts) {
            forecasts.map((forecast, x) => {
                forecast.unshift(this.getNextWeekDay(x));
                }
            );
        }
        if (this.state.forecasts) {
            forecastWidth = (100 / 4).toFixed(2) + '%';
        }
        if (columnCont && this.state.timeWeather) {
            listWidth = (100 / columnCont).toFixed(2) + '%';
        }


        let currBackImage;
        if (this.state.currentWeather) {
            let currWeatDesc = this.state.currentWeather;
            let weatConvred = currWeatConversion(currWeatDesc);
            if (weatConvred) {
                //currBackImage = `url(${weatConvred})`;
                currBackImage = weatConvred;
            }
        } else {
            //currBackImage = `url(${defaultBack})`;
            currBackImage = defaultBack;
        }

        


        return (
            <Root style={{ flexDirection: 'cloumn' }}>
                <Container style={{ flexDirection: 'cloumn' }}>
                    <ImageBackground source={currBackImage} style={styles.backgroundImage}>
                        <Content>
                            <Header transparent style={{ height: 10 }} />
                            <Card style={{ backgroundColor: 'transparent', shadowOpacity: 0, borderColor: 'transparent', shadowOpacity: 0 }}>
                                {this.state.weatherInfo}
                                <CardItem bordered style={{ paddingLeft: 2, paddingRight: 2, backgroundColor: 'transparent', shadowOpacity: 0 }}>
                                    <Left style={{ paddingTop: 5, paddingBottom: 5 }}>
                                        <Text style={{ marginLeft: 5, fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                                            {this.getWeekDay()}
                                        </Text>
                                        <Text style={{ marginLeft: 5, fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                                            Today
                                        </Text>
                                    </Left>
                                    <Right style={{ paddingTop: 5, paddingBottom: 5, flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                                            {this.state.highestTemp}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>&#8451;</Text>
                                        </Text>
                                        <Text style={{ marginLeft: 5, fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                                            {this.state.lowestTemp}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold', color: 'white' }}>&#8451;</Text>
                                        </Text>
                                    </Right>
                                </CardItem>
                                <CardItem bordered style={{ paddingLeft: 5, paddingRight: 5, backgroundColor: 'transparent', shadowOpacity: 0 }}>
                                    <Content contentContainerStyle={{ flexDirection: 'row' }}>
                                        {
                                            timeWeathers.map((item, idx) => { // This will render a row for each data element.
                                                return this.renderWeather(item, idx);
                                            })
                                        }
                                    </Content>
                                </CardItem>
                                {
                                    forecasts.map((item, idx) => { // This will render a row for each data element.
                                        return this.renderForecasts(item, idx);
                                    })
                                }
                            </Card>

                            <Footer style={{ paddingLeft: 5, paddingRight: 5, backgroundColor: 'transparent', shadowOpacity: 0 }}>
                                <Right>
                                    <Button transparent onPress={() => {
                                        return (
                                            <View style={{ marginTop: 22 }}>
                                                <Modal
                                                    animationType="slide"
                                                    transparent={false}
                                                    visible={this.state.modalVisible}
                                                    onRequestClose={() => {
                                                        Alert.alert('Modal has been closed.');
                                                    }}>
                                                    <View style={{ marginTop: 22 }}>
                                                        <View>
                                                            <Text>Hello World!</Text>

                                                            <TouchableHighlight
                                                                onPress={() => {
                                                                    this.setModalVisible(!this.state.modalVisible);
                                                                }}>
                                                                <Text>Hide Modal</Text>
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </Modal>

                                                <TouchableHighlight
                                                    onPress={() => {
                                                        this.setModalVisible(true);
                                                    }}>
                                                    <Text>Show Modal</Text>
                                                </TouchableHighlight>
                                            </View>
                                        );
                                    }}>
                                        <Icon name='list' ios="ios-list" style={{ color: '#fff' }} />
                                    </Button>
                                </Right>
                            </Footer>

                        </Content>
                    </ImageBackground>
                </Container>                
            </Root>

        );
    }
}


let styles = StyleSheet.create({
    backgroundImage: {
        // flex: 1,
        resizeMode: 'cover', // or 'stretch'
        width: '100%', height: '100%'
    }
});


function tempConversion(kTemp) {
    let cTemp;
    if (kTemp) {
        cTemp = (kTemp - 273.15).toFixed(2);
    }

    return cTemp;
}

function weatherConversion(weatherDesc) {
    let srcImage;
    switch (weatherDesc) {
        case 'Clouds':
            srcImage = Clouds;
            return srcImage;
        case 'Rain':
            srcImage = Raining;
            return srcImage;
        case 'Thunderstorm':
            srcImage = Thunderstorm;
            return srcImage;
        case 'Clear':
            srcImage = Clear;
            return srcImage;
        case 'Haze':
            srcImage = Haze;
            return srcImage;

        default:
            return null;
    }
}

function currWeatConversion(currWeather) {
    let backImage;
    switch (currWeather) {
        case 'Clouds':
            backImage = defaultBack;
            return backImage;
        case 'Rain':
            backImage = RainBack;
            return backImage;
        case 'Thunderstorm':
            backImage = SunderRainBack;
            return backImage;

        default:
            backImage = defaultBack;
            return backImage;
    }
}