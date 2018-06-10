import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, AsyncStorage } from 'react-native';
token = "ff6bd257aab3a6d9a4f0b29625dd9d3668276c7d";

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            aqi: 0,
            city: ""
        };
        this._getCity = this._getCity.bind(this);
    }

    componentDidMount() {
        this._getDate()
    }

    async _cityUid() {
        return AsyncStorage.getItem('cityUid')
            .then((value) => {
                return value;
            })
    }

    async _setCityUid(cityUid) {
        return AsyncStorage.setItem('cityUid', JSON.stringify(cityUid));
    }

    async _localData() {
        return AsyncStorage.getItem('localData')
            .then((value) => {
                return JSON.parse(value);
            })
    }

    async _setLocalData(localData) {
        return AsyncStorage.setItem('localData', JSON.stringify(localData));
    }

    _getDate() {
        this._localData().then(data => {
            if (data == null) {
                return;
            }
            this.setState({
                aqi: data['aqi'],
                city: data['city']['name']
            });
        })
        this._cityUid().then(result => {
            let here = result == null ? 'here' : ('@' + result.toString())
            fetch("https://api.waqi.info/feed/" + here + "/?token=" + token)
                .then((response) => response.json())
                .then((responseJson) => {
                    let data = responseJson['data'];
                    if (typeof(data) != 'object') {
                        return;
                    }
                    let result = {
                        aqi: data['aqi'],
                        city: data['city']['name']
                    };
                    this._setLocalData(result)
                    this.setState(result);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, (error => {

        }));

    }

    _getCity(cityUid) {
        this._setCityUid(cityUid)
        this._getDate()
    }

    _getColor(aqi) {
        var color = 'rgb(43, 153, 102)';
        if (aqi > 300) {
            color = 'rgb(126, 2, 35)';
        } else if (aqi > 201) {
            color = 'rgb(102, 0, 153)';
        } else if (aqi > 150) {
            color = 'rgb(203, 5, 50)';
        } else if (aqi > 100) {
            color = 'rgb(248, 153, 52)';
        } else if (aqi > 50) {
            color = 'rgb(251, 222, 50)';
        }
        return color;
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.backgroundView} backgroundColor={this._getColor(this.state.aqi)}>
                <StatusBar
                    barStyle="light-content"
                />
                <Text style={styles.cityText}>{this.state.city}</Text>
                <Text style={styles.aqiText}>{this.state.aqi}</Text>
                <TouchableOpacity style={styles.cityButton} onPress={() =>
                    navigate('SearchPage', { getCity: this._getCity })
                } resizeMode={'contain'}>
                    <Image style={styles.buttonImage} source={require('../images/location.png')} />
                </TouchableOpacity>
            </View>
        )
    }
};

let styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    cityText: {
        fontSize: 30,
        color: 'white',
    },
    aqiText: {
        fontSize: 100,
        fontWeight: 'bold',
        color: 'white',
    },
    cityButton: {
        position: 'absolute',
        bottom: 40,
    },
    buttonImage: {
        width: 33,
        height: 44
    }
});