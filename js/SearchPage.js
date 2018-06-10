import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, StatusBar, TouchableOpacity } from 'react-native';
token = "ff6bd257aab3a6d9a4f0b29625dd9d3668276c7d";

export default class SearchPage extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
        this._textChanged = this._textChanged.bind(this);
    }

    _textChanged(text) {
        fetch("https://api.waqi.info/search/?token=" + token + "&keyword=" + text)
            .then((response) => response.json())
            .then((responseJson) => {
                let data = responseJson['data'];
                this.setState({
                    data: data
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _onPress = (item) => {
        let getParam = this.props.navigation.getParam('getCity');
        getParam(item['uid']);
        this.props.navigation.goBack()
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <TextInput
                    autoFocus={true}
                    style={styles.textInput}
                    placeholder="Place insert yout city"
                    onChangeText={this._textChanged}
                />
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item['uid'].toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress= {(props) =>
                            this._onPress(item)
                        }>
                            <Text style={styles.Cell}>{item['station']['name']}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
};

let styles = StyleSheet.create({
    textInput: {
        height: 40,
        padding: 10,
        backgroundColor: '#F8F8F8',
    },
    Cell: {
        backgroundColor: 'white',
        fontSize: 14,
        padding: 15
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    buttonImage: {
        width: 33,
        height: 44
    }
});