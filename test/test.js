var expect = require('chai').expect;
var file = require('../node/addTwoNumbers');
var file2 = require('../node/server');

describe('abc()', function () {
	it('should abc', function () {

	  // 1. ARRANGE
	  var x = "abc";

	  // 2. ACT
	  var sum2 = file2.abc();

	  // 3. ASSERT
	  expect(sum2).to.be.equal(x);
	});
});

describe('addTwoNumbers()', function () {
  it('should + two numbers', function () {

    // 1. ARRANGE
    var x = 5;
    var y = 1;
    var sum1 = x + y;

    // 2. ACT
    var sum2 = file.addTwoNumbers(x, y);

    // 3. ASSERT
    expect(sum2).to.be.equal(sum1);
	});
});

describe('lessTwoNumbers()', function () {
	it('should - two numbers', function () {

	  // 1. ARRANGE
	  var x = 5;
	  var y = 1;
	  var sum1 = x - y;

	  // 2. ACT
	  var sum2 = file.lessTwoNumbers(x, y);

	  // 3. ASSERT
	  expect(sum2).to.be.equal(sum1);

	});

});

describe('lessTwoNumbers()', function () {
	it('should + two numbers', function () {

	  // 1. ARRANGE
	  var x = 5;
	  var y = 1;
	  var sum1 = x + y;

	  // 2. ACT
	  var sum2 = file.add(x, y);

	  // 3. ASSERT
	  expect(sum2).to.be.equal(sum1);

	});

});

file2.Serv.close()