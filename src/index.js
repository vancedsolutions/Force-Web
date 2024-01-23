import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import Store from "./app/store";

import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.css";
import {LicenseManager} from "ag-grid-enterprise";
LicenseManager.setLicenseKey('CompanyName=Nineyard,LicensedApplication=Nineyard,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-013615,ExpiryDate=15_February_2022_[v2]_MTY0NDg4MzIwMDAwMA==01a8bcb72ddb10589e7cd0257c59b9d2');

ReactDOM.render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
