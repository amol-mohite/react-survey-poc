import { createStore, applyMiddleware,combineReducers} from 'redux';
import { thunk } from 'redux-thunk';
import surveyReducer from './reducers/surveyReducers';

const rootReducer = combineReducers({ surveys: surveyReducer  });
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
