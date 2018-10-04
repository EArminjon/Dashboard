function addTwoNumbers(x, y) {
	return x + y;
}

function lessTwoNumbers(x, y) {
	return x - y;
}

function add(x, y) {
	return addTwoNumbers(x, y);
}

module.exports = {
	addTwoNumbers: addTwoNumbers,
	lessTwoNumbers: lessTwoNumbers,
	add: add
};