import { REACT_TEXT } from "./constants";
export  function wrapToVdom(element){
  // console.log(element)
  if(typeof element === 'string' || typeof element === 'number'){
    return {type: REACT_TEXT, props: {content: element}};
  }
  return element
}