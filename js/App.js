import { StackNavigator,} from 'react-navigation';
import SearchPage from './SearchPage';
import Main from  './Main';

const App = StackNavigator({
    Main: {
        screen: Main,
        navigationOptions:{
            header: null,
        }},
    SearchPage: {
        screen: SearchPage,
        navigationOptions:{
            title: 'Search City',
            headerTintColor: 'black',
        },
    },
});

export default App;