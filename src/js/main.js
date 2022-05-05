import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { render } from './kreact/react-dom';
// import { render } from './kreact/react-dom'
// import Component from './kreact/Component';
// import { useEffect, useLayoutEffect, useReducer, useState } from './kreact/hook';
// console.log(Component.prototype)
import React from './react/react';
import ReactDOM from './react/react-dom';
// class ClassComponent extends Component {
//   render() {
//     return <>
//       <li>1</li>
//       <li>2</li>
//     </>

//   }
// }
// function FunctionComponent(props) {
//   return <div className='border'>
//     <ClassComponent />
//     <p>{props.name}</p>
//     <h2>jjj</h2>

//   </div>
// }
// // console.log(useState)

// function FunctionHook(props) {
//   const [state, setState] = useState(1);
//   // console.log('state',state)
//   useLayoutEffect(()=> console.log('useLayoutEffect'), [state]);
//   useEffect(()=>{
//   //console.log('useEffect')
//   }, [state])
//   return <div>
//     <h1>{state}</h1>
//     {/* <h1>{name}</h1> */}
//     {/* <h1>state+{state}</h1> */}
//     <button onClick={()=> setState(state+1)}>+</button>
//     <ul>
//       {state%2 ===1? [1,2,3].map(item=> <li key={item}>{item}</li>):[4,3,2,1].map(item=> <li key={item}>{item}</li>)}
//       {/* <li key='0'>0</li>
//       <li key='1'>1</li>
//       {state%2 ? <li key="2">2</li>: null}
//       <li key='3'>3</li>
//       <li key='4'>4</li> */}
//     </ul>
//     {/* {state%2 === 0 ?<div>234</div>: <span>456</span>} */}
//     {/* <button onClick={()=> setName('陈双龙')} >设置姓名</button> */}
//     {/* <button onClick={()=> setName('陈双龙')}>设置姓名</button> */}
//   </div>
// }


// class TextInput extends React.Component{
//   constructor(props) {
//     super(props);
//     this.inputRef = React.createRef();
//   }
//   getFocus = ()=> {
//     this.inputRef.current.focus();
//   }
//   render(){
//     return <input ref={this.inputRef}/>
//   }
// }

// class Form extends React.Component{
//   constructor(props){
//     super(props);
//     this.textInput = React.createRef();
//   }
//   getFormFocus = ()=>{
//     // console.log(this.textInput);
//     this.textInput.current.getFocus();
//   }
//   render(){
//     return <div>
//       <TextInput  ref={this.textInput}/>
//       <button onClick={this.getFormFocus}>提交</button>
//     </div>
//   }
// }
// function Text(){
//   return <>
//   <h1>Text</h1></>
// }
// class Sum extends React.Component{
//   numberA
//   numberB
//   result 
//   constructor(props){
//     super(props)
//     this.numberA = React.createRef();
//     this.numberB = React.createRef();
//     this.result = React.createRef();
//   }
//   handleClick = ()=>{
//     let numberA = this.numberA.current.value;
//     let numberB = this.numberB.current.value;
//     this.result.current.value = parseFloat(numberA) + parseFloat(numberB)
//   }
//   render(){
//     // console.log('first')

//     return (
//       <div>
//         <input ref={this.numberA}/>
//         <input ref={this.numberB}/>
//         <button onClick={this.handleClick}>+</button>
//         <input ref={this.result}/>
//       </div>
//     )
//   }
  
// }



const Container = document.getElementById('root');
// ReactDOM.render(<Text />, Container);
// const element = <div style={{'color': 'red'}}>element</div>
// 
// console.log(element)

class MyComponent extends React.Component{
  static defaultProps = {
    name: "架构"
  }
  constructor(props){
    super(props);
    this.state = {count: 0};
    console.log('Count 1.constructor');
  }
  componentWillMount(){
     
  }
  handleClick = () =>{
    this.setState({count: this.state.count+1});
  }
  addCount =()=>{
    console.log('click')
    // 合成事件，标记isBatchUpdate = true, 然后，click 冒泡，因为是事件委托
    this.setState((state)=> ({count: state.count+1}));
    console.log(this.state.count);
    this.setState((state)=> ({count: state.count+1}));
    console.log(this.state.count);
    setTimeout(()=>{
      this.setState((state)=> ({count: state.count+1}));
      console.log(this.state.count);
      this.setState((state)=> ({count: state.count+1}));
      console.log(this.state.count);
    })
  }
  render(props){
    return <div>
      <h1>{this.state.count}</h1>
      <button onClick={this.addCount}>+</button>
    </div>
  }
}
const Text = function(props){
  return <ul>
    {[1,2,3,4].map(item=> <li key={item}>{item}</li>)}
  </ul>
}

ReactDOM.render(<MyComponent name={'TOM'}/>, Container);



// 5.20 6.20 7.20 8.20


// ReactDOM.render(<Text text="hhhh"/>,document.getElementById('root') )
// ReactDOM.render(element, document.getElementById('root'));
// console.log(React.createElement());
// render(<ClassComponent/>, document.getElementById('root'))
// render(<div><h1>hhh</h1></div>,document.getElementById('root'))
// render(<div><FunctionComponent/></div>, document.getElementById('root'))
// render(<FunctionHook />, document.getElementById('root'))
// render(<FunctionComponent name={'test'} />, document.getElementById('root'))
// render(<div class="body"><span>1</span><span>2</span>3</div>, document.getElementById('root'))
// render(<><h1>hhh</h1><h1>h2</h1></>, document.getElementById('root'))
// ReactDOM.render(
//   <React.StrictMode>
//     <FunctionHook />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
