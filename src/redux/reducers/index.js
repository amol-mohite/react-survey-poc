import { combineReducers } from 'redux';
import surveyReducer from './surveyReducer';

const rootReducer = combineReducers({
  surveys: surveyReducer,
});

export default rootReducer;
