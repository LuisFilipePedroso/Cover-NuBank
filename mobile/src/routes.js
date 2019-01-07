import { createStackNavigator } from "react-navigation";

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import New from './pages/New';
import Panel from './pages/Panel';

const Routes = createStackNavigator({
    Login,
    Panel,
    Timeline,
    New,
});

export default Routes;