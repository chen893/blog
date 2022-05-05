// import { createElement } from "react";
import { REACT_TEXT } from "./constants";
import { addEvent } from "./event";
import { REACT_FORWARD_REF_TYPE } from "./constants";
const ReactDOM = {};
export default ReactDOM;

ReactDOM.render = render;
function render(vdom, container){
  // console.log('test')
  let dom = createDOM(vdom);
  // console.log(dom, container)
  container.appendChild(dom);
  if(dom.componentDidMount)  dom.componentDidMount();
}
function createDOM(vdom){


  let {type, props, ref, key} = vdom;
  // console.log('ref', ref)
  // console.log(type)
  let dom; // 获取 真实DOM元素
  // console.log( type.prototype.isReactComponent, props)
  if(type&& type.$$typeof === REACT_FORWARD_REF_TYPE){
    return mountForwardComponent(vdom)
  }
  else if(type === REACT_TEXT){
    dom = document.createTextNode(props.content);
  }else if(typeof  type === 'string'){
    dom = document.createElement(type); // 原生DOM类型
  }else if(typeof type === 'function' && type.isReactComponent === undefined){
    return mountFunctionComponent(vdom);
  }else if(typeof type === 'function' && type.isReactComponent){
    return mountClassComponent(vdom);
  }
  // console.log(dom)
  if(props){
    updateProps(dom, {}, props);
    if(typeof props.children === 'object' && props.children.type){
      // 这边说明子节点是单个元素，走这条。
      // console.log(props.children) 
      render(props.children, dom);
    }else if(Array.isArray(props.children)){
      reconcileChildren(props.children, dom);
    }
  }
  vdom.dom = dom;
  if(ref) ref.current = dom;
  return dom;
}
function mountForwardComponent(vdom){
  let {type, props, ref} = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(vdom);
}

function reconcileChildren(childrenVdom, parentDOM){
  // console.log('parentDom', parentDOM)
  for(let item of childrenVdom){
    render(item, parentDOM);
  }
}

function mountFunctionComponent(vdom){
  const {type, props} = vdom;
  vdom = type(props);
  return createDOM(vdom);
}
function mountClassComponent(vdom){
  let  {type, props, ref} = vdom;
  let defaultProps = type.defaultProps || {};
  let classInStance = new type({...defaultProps,...props});
  vdom.classInStance = classInStance;
  let renderVdom = classInStance.render();
  
  classInStance.oldRenderVdom = renderVdom;
  
  if(ref) ref.current = classInStance;
  // console.log('renderVdom',renderVdom) 
  let dom = createDOM(renderVdom);
  if(classInStance.componentDidMount){
    dom.componentDidMount = classInStance.componentDidMount.bind(classInStance);
  }
  return dom;
}

function updateProps(dom, oldProps, newProps){
  // console.log(first)
  for(let key in newProps){
    // console.log(key)
    if(key === 'children') continue;
    if(key === 'style'){
      let styleObj = newProps[key];
      dom.style = styleObj;
      for(let attr in styleObj){
        dom.style[attr] =  styleObj[attr];
      }
    }else if(key.startsWith('on')){
      // onClick => dom.onclick
      // console.log(key)
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
      // dom[key.toLocaleLowerCase()] = newProps[key];
    }
    else{
      dom[key] = newProps[key]
    }
  }
}

export  function findDOM(vdom){
  let {type } = vdom;
  let dom;
  if(typeof type === 'function'){ // 虚拟DOM组件的类型的话
    dom = findDOM(vdom.oldRenderVdom);
  }else{
    dom = vdom.dom;
  }

  return vdom.dom; 
}

/**
 * 
 * 比较新旧的虚拟DOM，找出差异，更新到真实DOM上。
 * @param {*} parentDOM 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM){
  // console.log(oldVdom, newVdom)
  if(!oldVdom && !newVdom){
  }else if(oldVdom&&(!newVdom)){
    let currentDOM = findDOM(oldVdom);
    currentDOM.parentDOM.removeChild(currentDOM);
    if(oldVdom.classInStance.componentWillUnmount){
      oldVdom.classInStance.componentWillUnmount();
    }

  }else if(!oldVdom &&(newVdom)){
    let newDOM = createDOM(newVdom);
    if(nextDOM){
      parentDOM.insertBefore(newDOM, nextDOM);
    }else{
      parentDOM.appendChild(newDOM); 
    }
    // TODO 此处可能是插入到当前位置，insertBefore?
    if(newDOM.componentDidMount) newDOM.componentDidMount();
  }else if(oldVdom && newVdom &&(oldVdom.type !== newVdom.type)){
     let oldDOM = findDOM(oldVdom)
     let newDOM = createDOM(newVdom)
     oldDOM.parentNode.replaceChild(newDOM, oldDOM);
     if(oldDOM.classInStance && oldVdom.classInStance.componentWillUnmount){
       oldVdom.classInStance.componentWillUnmount();
     }
  }else{ // 老的有，新的也有，类型也一样，需要复用老节点，进行深度的递归dom diff 了
    updateElement(oldVdom, newVdom);
  } 

}
function updateElement(oldVdom, newVdom){
  // 文本节点的更新
  if(typeof oldVdom.type === 'string'){
    // 让虚拟DOM的真实DOM属性等于老的虚拟DOM对应的那个真实DOM
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children) 
  }else if( oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT){
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    if(oldVdom.props.content!== newVdom.props.content){
      currentDOM.textContent = newVdom.props.content;
    }
  }else if(typeof oldVdom.type === 'function'){
    if(oldVdom.type.isReactComponent){
      updateClassComponent(oldVdom, newVdom);
    }else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}
function updateFunctionComponent(oldVdom, newVdom){
  let parentDOM = findDOM(oldVdom).parentNode;
  let {type, props} = newVdom;
  let renderVdom = type(props);
  newVdom.oldRenderVdom = renderVdom;
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
}
function updateClassComponent(oldVdom, newVdom){
  let classInstance = newVdom.classInStance = oldVdom.classInStance;
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  if(classInstance.componentWillReceiveProps){
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props)
}
function updateChildren(parentDOM, oldVChildren, newVChildren){
  // if()
  oldVChildren = Array.isArray(oldVChildren)? oldVChildren: [oldVChildren];
  newVChildren = Array.isArray(newVChildren)? newVChildren: [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  
  for(let i = 0; i< maxLength; i++){
    // 找当前的虚拟DOM节点这后的最近一个真实DOM节点。
    let nextVNode = oldVChildren.find((item, index)=> index>i && item &&findDOM(item));
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVNode && findDOM(nextVNode));
  }
}