import React, { Component } from "react";
import { Image } from "react-native"
import { Root, Container, Card, CardItem, Text, Content, Header, Left, Right, Body, Button, Icon, Title, List, ListItem } from "native-base";
// import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import Raining from '../../pics/weather-rain-black.png';
import Clouds from '../../pics/weather-clouds-black.png';
import Thunderstorm from '../../pics/weather_sunderain-black.png';
import Clear from '../../pics/clear-black.png';
import Haze from '../../pics/haze-black.png';
import defaultBack from '../../pics/bkg11.jpg';
import SunderRainBack from '../../pics/SunderRainBackground.gif';
import RainBack from '../../pics/RainBackground.gif';


const host = "https://api.openweathermap.org/data/2.5/";
const apiKey = "a81a067d035dd84954e1a0d2c907e813";
let columnCont = 1;
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
            forecasts: null
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
                div.push(<CardItem style={{ paddingTop: 5, paddingBottom: 5 }} key='location'><Body style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold' }}>{location}</Text></Body></CardItem>);

                // for getting overview weather desc
                let weather = jsonResponse.weather;
                let weatDesc;
                if (weather) {
                    let current = weather[0];
                    if (current) {
                        weatDesc = current.main;
                        div.push(<CardItem style={{ paddingTop: 5, paddingBottom: 5 }} key='weather'><Body style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold' }}>{weatDesc}</Text></Body></CardItem>);
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
                        div.push(<CardItem style={{ paddingTop: 5, paddingBottom: 5 }} key='temp'><Body style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold' }}>{temperature}<Text style={{ fontFamily: 'Chalkduster', fontSize: 20, fontWeight: 'bold' }}>&#8451;</Text></Text></Body></CardItem>);
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
                                        forecastData.push(weatDesc);
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


    renderWeather(weather, idx) {
        return (
            <List key={idx} style={{width: listWidth}}>
                <ListItem style={{
                    marginLeft: 5, borderColor: '#fff', paddingTop: 10, paddingBottom: 10, paddingRight: 10, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>{weather[0]}</Text>
                </ListItem>
                    <ListItem style={{
                        marginLeft: 5, borderColor: '#fff', paddingTop: 10, paddingBottom: 10, paddingRight: 10, justifyContent: 'center' }}>
                    <Image style={{ width: 30, height: 30 }} source={weather[1]} />
                </ListItem>
                    <ListItem style={{
                        marginLeft: 5, borderColor: '#fff', paddingTop: 10, paddingBottom: 10, paddingRight: 10, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>{weather[2]}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>&#8451;</Text></Text>
                </ListItem>
            </List>
        );
    }


    render() {
        if (!this.state.location || !this.state.weather || !this.state.temp || !this.state.timeWeather) {
            return <Container />
        }
        
        const timeWeathers = this.state.timeWeather;
        if (columnCont && this.state.timeWeather) {
            listWidth = (100 / columnCont).toFixed(2) + '%';
        }
        return (
            <Container>
                <Header transparent style={{height: 10}}/>
                <Content padder>
                    <Card transparent>
                        {this.state.weatherInfo}
                        <CardItem bordered style={{ paddingLeft: 2, paddingRight: 2  }}>
                            <Left style={{ paddingTop: 5, paddingBottom: 5 }}>
                                <Text style={{ marginLeft: 5, fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>
                                    {this.getWeekDay()}
                                </Text>
                                <Text style={{ marginLeft: 5, fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>
                                    Today
                                </Text>
                            </Left>
                            <Right style={{ paddingTop: 5, paddingBottom: 5, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>
                                    {this.state.highestTemp}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>&#8451;</Text>
                                </Text>
                                <Text style={{ marginLeft: 5, fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>
                                    {this.state.lowestTemp}<Text style={{ fontFamily: 'Chalkduster', fontSize: 15, fontWeight: 'bold' }}>&#8451;</Text>
                                </Text>
                            </Right>
                        </CardItem>
                        <CardItem bordered style={{paddingLeft:5, paddingRight:5}}>
                            <Content contentContainerStyle={{flexDirection: 'row'}}>
                                {
                                    timeWeathers.map((item, idx) => { // This will render a row for each data element.
                                        return this.renderWeather(item, idx);
                                    })
                                }
                            </Content>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}


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
