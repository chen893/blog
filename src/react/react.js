// import {}

import { wrapToVdom } from "./utils";
import {Component } from './Component';
function createElement(type,config, children ){
  // console.log(type, children)
  // console.log('test')
  let ref; // 是用来获取虚拟DOM实例的
  let key; // 用来区分同一个父亲的不同儿子的 
  if(config){
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;

    key = config.key;
    delete config.key ;
  }
  let props = {...config};
  if(arguments.length>3){
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
    props.children = children;
  }else if(children!==undefined) props.children= wrapToVdom(children);
  // console.log()
  return {
    type,
    props,
    ref, 
    key
  }
}



// function Component(props){
//   this.props = props;
// } 
// Component.prototype.isReactComponent = {};

function createRef(){
  return {current: null};
}
function forwardRef(render){
    
}
function createContext(){
   
  function Provider({value,children}){
    Provider._value = value;
    return children
  }
  function Consumer(){

  }
}
const React = {
  createRef
}
React.createElement = createElement;
React.Component = Component;
export default React;