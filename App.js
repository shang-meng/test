
import React, { Component } from 'react';
 
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
 
import { MapView, MapTypes, Geolocation, Overlay } from 'react-native-baidu-map';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
import { ECharts } from "react-native-echarts-wrapper";

const { Marker, Cluster, InfoWindow  } = Overlay;

const { width,height } = Dimensions.get('window');
 
export default class BaiduMapDemo extends Component {
    constructor() {
        super();
        this.state = {
            zoomControlsVisible: true,
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            mapType: MapTypes.NORMAL,
            zoom: 8,
            center: {
                longitude: 116.403963,
                latitude: 39.915119,
            },
            markers: [
                {
                    longitude: 116.403963,
                    latitude: 39.915119,
                    title: '天安门',
                },
                {
                    longitude: 116.403663,
                    latitude: 39.945119,
                    title: '天安门',
                },
                {
                    longitude: 116.403763,
                    latitude: 39.935119,
                    title: '天安门',
                },
                {
                    longitude: 116.403863,
                    latitude: 39.925119,
                    title: '天安门',
                },
                {
                    longitude: 116.404177,
                    latitude: 39.909652,
                    title: '天安门广场',
                },
            ],
            clickMessage: '',
            poiMessage: '',
            detailMessage:'',
        };
    }
 
    option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
    markers = (data) => {
        console.log("data.title:"+data.title)
        return (
            <>              
                <Marker
                    title={data.title}
                    location={
                        {longitude: data.longitude,
                        latitude: data.latitude,}
                    }
                    icon={data.icon}
                /> 
                <Overlay.Text
                    text={data.title}
                    fontSize={20}
                    location={
                        {longitude: data.longitude,
                        latitude: data.latitude,}
                    }
                />
                
            </>
        )
    }

  render() {
        return (
                <View><View style={styles.container}>
                <MapView 
                    zoomControlsVisible={this.state.zoomControlsVisible} //默认true,是否显示缩放控件,仅支持android
                    trafficEnabled={this.state.trafficEnabled} //默认false,是否显示交通线
                    baiduHeatMapEnabled={this.state.baiduHeatMapEnabled} //默认false,是否显示热力图
                    mapType={this.state.mapType} //地图模式,NORMAL普通 SATELLITE卫星图
                    zoom={this.state.zoom} //缩放等级,默认为10
                    center={this.state.center} // 地图中心位置
                    marker={this.state.markers} //地图多个标记点

                    onMapLoaded={(e) => { //地图加载事件
                        Geolocation.getCurrentPosition()
                            .then(data => {
                                console.log(data)
                                // this.setState({
                                //     center: {
                                //         longitude: data.longitude,
                                //         latitude: data.latitude
                                //     },
                                //     markers: [{
                                //         longitude: data.longitude,
                                //         latitude: data.latitude,
                                //         title: data.district + data.street
                                //     }]
                                // })
                            })
                            .catch(e =>{
                                console.warn(e, 'error');
                            })
                    }}
                    
                    onMarkerClick={(e) => { //标记点点击事件
                        //e:{"position": {"latitude": 39.909652, "longitude": 116.404177}, "title": "天安门广场"}
                        this.setState(
                            {
                                center:{
                                    longitude: e.position.longitude,
                                    latitude: e.position.latitude,
                                    title: e.title,
                                },
                                detailMessage:e.title
                            })
                        console.log(this.state.markers)
                    }}
                    onMapClick={(e) => { //地图空白区域点击事件,返回经纬度
                        // let title = '';
                        // Geolocation.reverseGeoCode(e.latitude,e.longitude)
                        //     .then(res => {
                        //         console.log(res)
                        //         Platform.OS == 'ios' ? 
                        //             title = res.district + res.streetName
                        //         :
                        //             title = res.district + res.street;
                        //         this.setState({
                        //             center: {
                        //                 longitude: e.longitude,
                        //                 latitude: e.latitude,
                        //             },
                        //             markers: [{
                        //                 longitude: e.longitude,
                        //                 latitude: e.latitude,
                        //                 title: title,
                        //             }],
                        //             clickMessage: JSON.stringify(res)
                        //         })
                        //     })
                        //     .catch(err => {
                        //         console.log(err)
                        //     })
                        
                    }}
                    onMapPoiClick={(e) => { //地图已有点点击
                        Geolocation.reverseGeoCode(e.latitude,e.longitude)
                            .then(res => {
                                res = JSON.stringify(res)
                                this.setState({
                                    center: {
                                        longitude: e.longitude,
                                        latitude: e.latitude,
                                    },
                                    markers: [{
                                        longitude: e.longitude,
                                        latitude: e.latitude,
                                        title: e.name,
                                    }],
                                    poiMessage: res
                                })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }}
                    style={styles.map}
                >
                    <Cluster>
                    {this.state.markers.map((item) => this.markers(item))}
                </Cluster>

               

                </MapView>
                <Text>
                    地点信息:{this.state.detailMessage}
                </Text> 
            </View>
            <View style={styles.chartContainer}>
                <ECharts
                key={"2"}
                option={this.option}
                backgroundColor="blue"
                />
            </View></View>
        );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    map: {
        width: width,
        height: height - 500,
        marginBottom: 5,
    },
    list: {
        flexDirection: 'row',
        paddingLeft: 10,
        marginBottom: 5,
    },
    chartContainer: {
        flex: 1
      }
});