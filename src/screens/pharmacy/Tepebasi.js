import React, {Component} from 'react';
import {TouchableOpacity, ActivityIndicator, StyleSheet, ListView, Text, View} from 'react-native';
import Communications from 'react-native-communications';

const REQUEST_URL = 'https://eskisehir-nobetci-eczaneler.herokuapp.com/nobetcitepebasi';

const tepebasiStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    listView: {
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 20,
        marginRight: 20,
        marginLeft: 30,
        fontWeight: 'bold',
    },

    text: {
        marginRight: 20,
        marginLeft: 30,
    }
});

class Tepebasi extends Component {
    static navigationOptions = {
        title: 'Tepebaşı Nöbetçi Eczaneler',
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2, row3) => row1 !== row2 !== row3,
            }),
            loaded: false,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true,
                });
            })
            .done();
    }

    render() {
        if (!this.state.loaded) {
            return Tepebasi.renderLoadingView();
        }

        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderPharmancy}
                style={tepebasiStyle.listView}
            />
        );
    }

    static renderLoadingView() {
        return (
            <View
                style={{
                    paddingTop: 10,
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >
                <ActivityIndicator/>
            </View>
        );
    }

    renderPharmancy(pharmancy) {
        return (
            <View style={tepebasiStyle.container}>
                <TouchableOpacity onPress={() => Communications.web('https://www.google.com.tr/maps/place/' + pharmancy.address)}>
                    <Text style={tepebasiStyle.title}>{pharmancy.name}</Text>
                    <Text style={tepebasiStyle.text}>{pharmancy.address}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Communications.phonecall(pharmancy.telephone, true)}>
                    <Text style={tepebasiStyle.text}>{pharmancy.telephone}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Tepebasi;