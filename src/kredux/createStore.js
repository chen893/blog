export default function createStore(reducer){
  if(enhancer){
    return enhancer(createStore)(reducer);
  }
  let currentState = null;
  let currentListener = [];
  function getState(){
    return currentState;
  }
  function dispatch(action){
    currentState = reducer(currentState, action);
    currentListener.forEach(listener=> listener())
  }

  // 订阅和取消订阅是一起出现的。
  function subscribe(listener){
    currentListeners.push(listener);

    return ()=>{
      const index = currentListener.indexOf(listener);
      currentListener.splice(index, 1);
    }
  }
  // 手动执行dispatch，加上默认值
  dispatch({type: 'init'})
  return {
    getState,
    dispatch,
    subscribe,
  }
}

function thunk({getState, dispatch}){
  return(next) => (action)=>{
    if(typeof action === 'function'){
      return action(dispatch, getState);
    }
    return next(action);
  }
}
function logger({getState, dispatch}){
  return (next) => (action)=>{
    console.log('prev state', getState());
    console.log(action.type+ '执行啦');
    const returnValue = next(action);
    console.log('next state', getState());
    return returnValue;
  }
}

function promise({getState, dispatch}){
  return (next)=> (action) =>{
      if(action instanceof Promise){
        action.then(dispatch);
      }else{
        next(action);
      }
  }
}