/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

const linkingOptions = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Primary: 'primary',
      Secondary: "secondary",
      Tertiary: "tertiary",
      TabNavigator: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
              TabOneSubScreen: 'one-sub',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
          TabThree: {
            screens: {
              TabThreeScreen: 'three',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};

export default linkingOptions;
