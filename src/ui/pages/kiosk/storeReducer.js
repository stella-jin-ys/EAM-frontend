import { createStore } from "redux";

const initialState = {
  storeValue: "",
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STORE":
      return {
        ...state,
        storeValue: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
