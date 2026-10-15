
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Lista from './src/componentes/lista';
import Pokemon from './src/componentes/pokemon';
import Capturados from './src/componentes/capturados';
import Favoritos from './src/componentes/favoritos';
import Informativa from './src/componentes/informativa';
import Usuario from './src/componentes/usuario';

import { AppProvider } from './src/context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ListaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lista" component={Lista} />
      <Stack.Screen name="Pokemon" component={Pokemon} />
    </Stack.Navigator>
  );
}

function FavoritosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favoritos" component={Favoritos} />
      <Stack.Screen name="Pokemon" component={Pokemon} />
    </Stack.Navigator>
  );
}

function CapturadosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Capturados" component={Capturados} />
      <Stack.Screen name="Pokemon" component={Pokemon} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Lista"
            component={ListaStack}
          />
          <Tab.Screen
            name="Informativa"
            component={Informativa}
          />
          <Tab.Screen
            name="Capturados"
            component={CapturadosStack}
          />
          <Tab.Screen
            name="Favoritos"
            component={FavoritosStack}
          />
          <Tab.Screen
            name="Usuario"
            component={Usuario}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
