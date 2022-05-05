
import React from './react/react';
import ReactDOM from './react/react-dom';



class Panel extends React.Component{
  show = ()=>{
    let div = document.createElement('div');
    div.innerHTML = '<p id="wenzhang">我是文章</p>';
    document.body.appendChild(div);
  }
  hide = ()=>{
    let div = document.getElementById('wenzhang');
    document.body.removeChild(div);
  }
  render(){
    return <div>
      <button>测试</button>
      <button onClick={this.show}>显示</button>
      <button onClick={this.hide}>隐藏</button>

    </div>
  }
}

const withLoadig = OldComponent  =>{
  return class extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        loading:true
      }
    }
    componentDidMount(){
      setTimeout(()=>{
        this.setState({
          loading:false
        })
      },2000)
    }
    render(){
      return this.state.loading?<div>loading...</div>:<OldComponent {...this.props}/>
    }
  } 
}
class MyComponent extends React.Component{
  static defaultProps = {
    name: "架构"
  }
  constructor(props){
    super(props);
    this.state = {count: 0};
    console.log('Count 1.constructor');
  }
  componentDidMount(){
    console.log('Mount')
  }
  componentDidUpdate(){
    console.log("MyComponent Updated")
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
  componentWillUnMount(){
    console.log('mount')
  }
  render(props){
    return <div>
      <h1>{this.state.count}</h1>
      <button onClick={this.addCount}>+</button>
    </div>
  }
}


class ChildCounter extends React.Component{
  static defaultProps = {
    name: 'ChildCount'
  }
  shouldComponentUpdate(nextProps, nextState){
    return nextProps.count%3 === 0;  // 如果是3的倍数就更新，否则不更新
  }
  componentWillMount(){
    console.log('ChildCounter componentWillMount');
  }
  render(){
    return <div>{this.props.count}</div>
  }
  componentDidMount(){
    console.log('ChildCounter componentDidMount');
  }
  componentWillUnmount(){
      
  }
}

const Container = document.getElementById('root');

ReactDOM.render(<MyComponent name={'TOM'}/>, Container);

