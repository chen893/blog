import { updateQueue } from "./Component";

/**
 * 实现的事件委托，把所有的事件都绑定到document上
 * @param {*} dom 
 * @param {*} eventType 
 * @param {*} handler 
 */
export function addEvent(dom, eventType, handler){
  let store; // 这是一个对象，里面存放此DOM上对应的事件处理寒素
  if(dom.store){
    store = dom.store
  }else{
    dom.store = {};
    store  = dom.store;
  }
  store[eventType] = handler;
  if(!document[eventType]){
    document[eventType] = dispatchEvent;
  }
}
function dispatchEvent(event){
  let {target, type} = event;
  let eventType =   `on${type}`;
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  while(target){
    let {store} = target;
    let handler = store && store[eventType];
    handler&& handler.call(target, syntheticEvent);
    target  = target.parentNode;
  }
  updateQueue.isBatchingUpdate = false;
  // console.log('T')
  // 批量更新指的是一次事件中所有的setState将会进行一次批量更新
  updateQueue.batchUpdate();
}
// 在源码里此处做了一些浏览器兼容性的适配
function createSyntheticEvent(event){
  let syntheticEvent = {};
  for(let key in event){
    syntheticEvent[key] = event[key];
  }
  return syntheticEvent
}