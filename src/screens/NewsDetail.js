import React, {Component} from 'react';
import {Alert, ActivityIndicator, ListView, Text, View, Image, TouchableOpacity} from 'react-native';
import Communications from 'react-native-communications';
import Styles from "../util/Styles";

class NewsDetail extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.title,
    });

    constructor(props) {
        super(props);
        this.state = {
            internetConnection: true,
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
        const {params} = this.props.navigation.state;
        fetch(params.REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true,
                });
            }).catch(error => {
            this.setState({internetConnection: false});
        })
    }

    render() {
        if (!this.state.internetConnection) {
            return InternetAlert();
        } else {
            if (!this.state.loaded) {
                return NewsDetail.renderLoadingView();
            }

            return (
                <Image
                    style={{flex: 1, resizeMode: 'stretch', width: '100%'}}
                    source={require('../assets/background.png')}
                >
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderNews}
                        style={Styles.styleNewsDetail.listView}
                    />
                </Image>
            );
        }
    }

    static renderLoadingView() {
        return (
            <Image
                style={{flex: 1, resizeMode: 'stretch', width: '100%'}}
                source={require('../assets/background.png')}
            >
                <View
                    style={{
                        paddingTop: 10,
                        flex: 1,
                        backgroundColor: 'transparent',
                    }}
                >
                    <ActivityIndicator
                        style={[Styles.styleNewsDetail.centering, {height: 80}]}
                        size="large"
                        color='white'/>
                </View>
            </Image>
        );
    }

    renderNews(news) {
        return (
            <TouchableOpacity onPress={() => Communications.web(news.url)}>
                <View style={Styles.styleNewsDetail.container}>
                    <View style={Styles.styleNewsDetail.card}>
                        <Image
                            source={{uri: news.picUrl}}
                            style={Styles.styleNewsDetail.thumbnail}
                        />
                        <Text style={Styles.styleNewsDetail.title}>{news.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default NewsDetail;