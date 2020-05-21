import {createStore} from 'redux';
import regionReducer from './regionReducer';

const store = createStore(regionReducer);

export default store;