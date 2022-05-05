function Test(){
  console.log('first')
}

let val = Symbol('test');
let val2 = Symbol(val)
console.log((val.toString(), val2));