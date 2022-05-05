export function applyMiddleware(...middlewares){
    return (createStore) => (reducer) =>{
      const store = createStore(reducer);
      let dispatch = store.dispatch;

      const midApi = {
        getState: store.getState,
        dispatch: (action, ...args)=> dispatch(action, ...args  ), 
      };
      const middlewaresChian =  middlewares.map(middleware =>{
        middleware(midApi);
      })
      dispatch =  compose(...middlewaresChian)(store.dispatch);
      return {...store, dispatch}
    }
}

function compose(...funcs) {
  if(funcs.length === 0){
    return (arg) => arg;
  } 
  if(funcs.length === 1){
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}