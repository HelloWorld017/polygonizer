function EdgeArray(){
	const arr = [];
	arr.push.apply(arr, arguments);
	arr.__proto__ = EdgeArray.prototype;

	return arr;
}

EdgeArray.prototype = new Array;

EdgeArray.prototype.contains = function(v1){
	return this.some(v => v[0].equals(v1[0]) && v[1].equals(v1[1]));
};

EdgeArray.prototype.push = function(...args){
	args.forEach((v) => {
		if(!this.contains(v)) Array.prototype.push.call(this, v);
	});
};

EdgeArray.prototype.pushCondition = function(check, ...args){
	args.forEach((v) => check(v) ? this.push(v) : null);
};

export default EdgeArray;
