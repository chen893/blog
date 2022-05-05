import { compareTwoVdom, findDOM } from "./react-dom";

export let updateQueue = {
  isBatchingUpdate: false, // 通过此变量来控制是否批量更新
  updaters: [],
  batchUpdate(){
    this.updaters.forEach(updater=> updater.forceUpdate())
    this.updaters.length = 0;
    this.isBatchingUpdate = false;
  }
}
class Updater{
  constructor(classInstance){
    this.classInstance = classInstance;
    // console.log(this.classInstance)
    this.pendingStates = []; // 保存将要更新的队列
    this.callback = [];// 保存将要执行的回调函数
  }
  addState(partialState, callback){
    this.pendingStates.push(partialState);
    if(typeof callback === 'function'){
      this.callbacks.push(callback);
    }
    this.emitUpdate(); //触发更新
  }
  // 不管状态和属性的变化，都会让组件刷新，不管状态变化和属性变化都会执行此方法。
  emitUpdate(nextprops){
    // this.nextprops = nextprops
    // 如果当前处于批量更新模式，那么就把此updater实例添加到updateQueue里去。
    if(updateQueue.isBatchingUpdate){
      updateQueue.updaters.push(this);
    }else{
      this.forceUpdate() // 让组件更新
    }
  }
  forceUpdate(){
    let { classInstance, pendingStates, nextprops } = this;
    // console.log(classInstance)
    if(nextprops || pendingStates.length>0){ // 如果有等待的更新的话
      shouldUpdate(classInstance,nextprops, this.getState());
      this.pendingStates = []
      this.pendingStates.length = 0;
    }
  }
  // 根据老状态，和pendingStates这个更新状态，计算新状态
  getState(){
     let { classInstance, pendingStates} = this;
     let {state} = classInstance; // 先获取老的原始的组件状态
     pendingStates.forEach(nextState=>{
       if(typeof nextState === 'function'){
         nextState = nextState(state);
       }
       state = {...state, ...nextState};
     })
    //  console.log('len',pendingStates.length)
     pendingStates.length = 0;  // 清空等待更新的队列
    //  this.callbacks.forEach(callback=> callback())
    //  this.callbacks.length = 0;
     return state; // 返回新状态
  }
}
function shouldUpdate(classInstance,nextProps,nextState ){
    let willUpdate = true;
    if(classInstance.shouldUpdate && !classInstance(nextProps, nextState)){
      willUpdate = false;
    }
    
    if(willUpdate && classInstance.componentWillUpdate){
      classInstance.componentWillUpdate()
    }

    if(nextProps) classInstance.props = nextProps;
    classInstance.state = nextState;  // 真正修改实例的状态了。
    if(willUpdate){classInstance.forceUpdate();}  // 然后调用类组件实例的updateComponent进行更新。
}
export class Component{
  static isReactComponent = true;
  constructor(props){
    this.props = props;
    this.state = {};
    
    // 每一个类组件的实例有一个updater更新器
    this.updater = new Updater(this);
  }
  setState(partialState, callback){
    this.updater.addState(partialState, callback)
  }
  /**
   * 组件更新时
   * 
   * 1.获取老的虚拟DOM React元素
   * 2.根据最新的属性和状态计算新的虚拟DOM
   * 然后进行比较，查找差异，然后把这些差异同步到真实DOM上
   */
  forceUpdate(){
    let oldRenderVdom = this.oldRenderVdom; // 老的虚拟DOM
    
    // 根据老的虚拟DOM查到老的真实DOM。 
    let oldDOM = findDOM(oldRenderVdom);
    let newRenderVdom = this.render(); // 计算新的虚拟DOM 

    compareTwoVdom(oldDOM.parentNode,oldRenderVdom, newRenderVdom); // 比较差异，把更新同步到真实DOM上。
    this.oldRenderVdom = newRenderVdom;

    if(this.componentDidUpdate){
      this.componentDidUpdate(this.props, this.state);
    }
  }
}