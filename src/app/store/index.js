import { createStore, applyMiddleware, compose } from 'redux';
import Reducers from "./reducers";
import thunk from "redux-thunk";
import logger from "redux-logger";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const Store = createStore(Reducers, composeEnhancers(applyMiddleware(thunk)));
export default Store
