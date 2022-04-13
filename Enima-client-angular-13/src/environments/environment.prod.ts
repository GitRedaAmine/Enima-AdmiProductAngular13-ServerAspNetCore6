
import {PROD_Product_Server, PROD_User_Auth_Server } from './environment.const'
 

const  AccountServerUrl: string = PROD_User_Auth_Server; 
const  ProductServerUrl: string = PROD_Product_Server;


export const environment = {
  firebase: {
    projectId: 'rtdb-5ec40',
    appId: '1:815638552059:web:c49ad0b1bdf40f833ebf5e',
    storageBucket: 'rtdb-5ec40.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyA6jjvX7A6IBO2SV88I8lyG8490HUnztw0',
    authDomain: 'rtdb-5ec40.firebaseapp.com',
    messagingSenderId: '815638552059',
  },
  production: true,
  api: {
      BaseUrlAccounts: AccountServerUrl,
      BaseUrlProducts: ProductServerUrl,
  }
};

 