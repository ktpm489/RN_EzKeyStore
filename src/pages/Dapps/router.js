import { createStackNavigator } from 'react-navigation';
import BrowserDapps from './browserDapps';
import ListDapps from './listDapps';
import SignMessageScreen from './signMessage';
import SignTransaction from './signTransaction';
import { HexToString } from '../../services/wallet.service'
try {
    console.log('aaaa', HexToString(0x1bc16d674ec80000))

} catch (error) {
    console.log(error)
}
export default createStackNavigator({
    BrowserDapps: { screen: BrowserDapps },
    ListDapps: { screen: ListDapps },
    SignMessageScreen: { screen: SignMessageScreen },
    SignTransaction: { screen: SignTransaction }
}, {
        initialRouteName: "ListDapps",
        headerMode: "none"
    })