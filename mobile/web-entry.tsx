import { AppRegistry } from 'react-native';
import App from './App';
import name from './app.json';

// Register the app
AppRegistry.registerComponent(name.name, () => App);

// Run the app on web
AppRegistry.runApplication(name.name, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
