
import {PROD_Product_Server, PROD_User_Auth_Server } from './environment.const'
 

const  AccountServerUrl: string = PROD_User_Auth_Server; 
const  ProductServerUrl: string = PROD_Product_Server;


export const environment = {
  production: false,
  apiBaseServer: {
    Accounts: AccountServerUrl,
    Products: ProductServerUrl,
  },
  product: {
    TableProduct:"Products",
    TableCategorie:"Categories",
    TableImageUrl:"ImageUrls",
    TableBrand:"Brands",
    
    Tablebasket:"shopingbasket",
    TableCode:"PurchaseCode",
    TableCommune:"Commune",
    TableWilaya:"Wilaya",
  },

  account: {
    TableUsers:"users",

  },
 





  storage:
  {
     DirectoryImage:"Images/Products"
  }

 
};
