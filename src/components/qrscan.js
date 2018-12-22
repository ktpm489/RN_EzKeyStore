import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Platform, Animated, BackHandler } from 'react-native';
import Camera from 'react-native-camera'
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from 'native-base'
import Language from '../i18n/i18n';
import GLOBALS from '../helper/variables'

export default class CameraScreen extends React.Component<any, any> {
    static navigationOptions = () => ({
        title: Language.t('QRScan.Title'),
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    });

    // static navigationOptions = ({ navigation }) => {
    //     const { params = {} } = navigation.state;
    //     return {
    //         headerLeft:
    //             <Button
    //                 style={{ paddingLeft: 10, paddingRight: 10 }}
    //                 transparent
    //                 onPress={() => {
    //                     navigation.goBack();
    //                     navigation.state.params.onSelect({ result: 'cancelScan' });
    //                 }} >
    //                 <Icon name="angle-left" color='#fff' size={30} style={{ marginTop: Platform.OS == 'android' ? Dimensions.get('window').height / 50 : 0 }}></Icon>
    //                 <Text
    //                     style={{ color: '#fff', fontSize: 15, marginTop: Platform.OS == 'android' ? Dimensions.get('window').height / 50 : 0, marginRight: Platform.OS == 'android' ? Dimensions.get('window').width / 10 : 0 }}
    //                 >
    //                     Cancel
    //                     </Text>
    //             </Button>
    //     };
    // };

    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = 'Please scan the barcode.';
        this.state = {
            MargintopLine: new Animated.Value(0),
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.cameraRoll,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
                barcodeFinderVisible: true
            },
            ResultScan: ''
        };
    }
    componentDidMount() {
        this.AnimatedMargin()
        // Animated.loop(
        //     Animated.timing(
        //         this.state.MargintopLine,
        //         {
        //             toValue: 265,
        //             duration: 3000
        //         }
        //     )
        // ).start()
        BackHandler.addEventListener('BackHandler', () => {
            this.props.navigation.state.params.onSelect({ result: 'cancelScan' })
        })
    }

    AnimatedMargin() {
        Animated.sequence(
            [
                Animated.timing(
                    this.state.MargintopLine,
                    {
                        toValue: 265,
                        duration: 3000
                    }
                ),
                Animated.timing(
                    this.state.MargintopLine,
                    {
                        toValue: 0,
                        duration: 3000
                    }
                )
            ]
        ).start(() => {
            this.AnimatedMargin()
        })
    }
    i = 0;
    onBarCodeRead = (scanResult) => {
        console.log('aaa')
        if (this.i == 0) {
            if (scanResult.data != null) {
                this.setState({ ResultScan: scanResult.data })
                this.props.navigation.state.params.onSelect({ result: scanResult.data });
                this.props.navigation.goBack();
            }
        }
        this.i++
        return;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('BackHandler');
        if (this.state.ResultScan == '') {
            this.props.navigation.state.params.onSelect({ result: 'cancelScan' })
        }
    }

    defaultStyles() {
        return {
            preview: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center'
            },
            // overlay: {
            //     position: 'absolute',
            //     padding: 16,
            //     right: 0,
            //     left: 0,
            //     alignItems: 'center'
            // },
            // topOverlay: {
            //     top: 0,
            //     flex: 1,
            //     flexDirection: 'row',
            //     justifyContent: 'space-between',
            //     alignItems: 'center'
            // },
            // scanScreenMessage: {
            //     fontSize: 14,
            //     color: 'white',
            //     textAlign: 'center',
            //     alignItems: 'center',
            //     justifyContent: 'center'
            // },
            container: {
                flex: 1,
            },
            cameraView: {
                flex: 1,
                justifyContent: 'flex-start',
            },
            maskOutter: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-around',
            },
            maskInner: {
                width: 300,
                backgroundColor: 'transparent',
                borderColor: '#32CD32',
                borderWidth: 3,
            },
            maskFrame: {
                backgroundColor: 'rgba(1,1,1,0.6)',
                // backgroundColor: 'blue',
            },
            maskRow: {
                width: '100%',
            },
            maskCenter: { flexDirection: 'row' },
        };
    }

    render() {

        const styles = this.defaultStyles();
        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 300) / 20);
        const maskColWidth = (width - 300) / 2;

        return (
            <View style={styles.container}>
                <Camera
                    ref={cam => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={this.state.camera.aspect}
                    captureTarget={this.state.camera.captureTarget}
                    type={this.state.camera.type}
                    flashMode={this.state.camera.flashMode}
                    barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
                    onBarCodeRead={(scanresult) => this.onBarCodeRead(scanresult)}
                >
                    <View style={styles.maskOutter}>
                        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                        <View style={[{ flex: 30 }, styles.maskCenter]}>
                            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                            <View style={styles.maskInner} >
                                <View style={{ height: 300, width: 300 }}>
                                    <Animated.View style={{ backgroundColor: '#32CD32', width: 294, height: 3, marginTop: this.state.MargintopLine }} />
                                </View>
                            </View>
                            {/* <BarcodeFinder width={300} height={274} borderColor="red" borderWidth={3} /> */}

                            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                        </View>
                        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                    </View>
                    {/* <View style={[styles.overlay, styles.topOverlay]}>
                        <Text style={styles.scanScreenMessage}>sao no meo doi</Text>
                    </View> */}
                </Camera>
            </View >
        );
    }
}

export class BarcodeFinder extends Component {
    constructor(props) {
        super(props);
    }

    getSizeStyles() {
        return {
            width: this.props.width,
            height: this.props.height
        };
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.finder, this.getSizeStyles()]}>
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            styles.topLeftEdge,
                            {
                                borderLeftWidth: this.props.borderWidth,
                                borderTopWidth: this.props.borderWidth
                            }
                        ]}
                    />
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            styles.topRightEdge,
                            {
                                borderRightWidth: this.props.borderWidth,
                                borderTopWidth: this.props.borderWidth
                            }
                        ]}
                    />
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            styles.bottomLeftEdge,
                            {
                                borderLeftWidth: this.props.borderWidth,
                                borderBottomWidth: this.props.borderWidth
                            }
                        ]}
                    />
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            styles.bottomRightEdge,
                            {
                                borderRightWidth: this.props.borderWidth,
                                borderBottomWidth: this.props.borderWidth
                            }
                        ]}
                    />
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        // position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    finder: {
        alignItems: "center",
        justifyContent: "center"
    },
    topLeftEdge: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 40,
        height: 40
    },
    topRightEdge: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 40,
        height: 40
    },
    bottomLeftEdge: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 40,
        height: 40
    },
    bottomRightEdge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 40,
        height: 40
    }
});
