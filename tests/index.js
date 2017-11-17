'use strict'

const assert = require('assert')
const freezeTypes = require('../')

//=================================================================== API ==========================

assert.doesNotThrow(
	()=>freezeTypes([]),
	'Should not throw when an Array is frozen.'
)

assert.doesNotThrow(
	()=>freezeTypes({}),
	'Should not throw when an Object is frozen.'
)

assert.doesNotThrow(
	()=>freezeTypes(Object.create(null)),
	'Should not throw when an object (no prototype) is frozen.'
)

assert.throws(
	()=>freezeTypes(4),
	'Should throw when a Number (any non-object) is passed to freezeTypes.'
)

assert.throws(
	()=>freezeTypes(null),
	'Should throw when null is passed to freezeTypes.'
)

//=========================================================== Core Type Tests ======================

class User {
	constructor() {
		this.name = 'Jeff'				// String
		this.age = 32					// Number
		this.employee = false			// Boolean
		this.friends = []				// Array
		this.func = ()=>{}				// Function
		this.address = {}				// Object
		this.data = Object.create(null) // object (no prototype)

		// This will be the usual way of freezing class instances.
		freezeTypes(this)
	}
}

const user = new User

assert.throws(
	()=>user.age = '30',
	'Should throw when a Number is overwritten with a String.'
)

assert.doesNotThrow(
	()=>user.age = 33,
	'Should not throw when a Number is overwritten with a Number.'
)

assert.throws(
	()=>user.name = 50,
	'Should throw when a String is overwritten with a Number.'
)

assert.doesNotThrow(
	()=>user.name = 'Joe',
	'Should not throw when a String is overwritten with a String.'
)

assert.throws(
	()=>user.friends = {},
	'Should throw when an Array is overwritten with an Object.'
)

assert.doesNotThrow(
	()=>user.friends = [],
	'Should not throw when an Array is overwritten with an Array.'
)

assert.throws(
	()=>user.func = null,
	'Should throw when a Function is overwritten with null.'
)

assert.doesNotThrow(
	()=>user.func = function(){},
	'Should not throw when a Function is overwritten with a Function.'
)

assert.throws(
	()=>user.data = {},
	'Should throw when Object.create(null) is overwritten with new Object.'
)

assert.doesNotThrow(
	()=>user.data = Object.create(null),
	'Should not throw when an object (no prototype) is overwritten with an object (no prototype).'
)

assert.throws(
	()=>{delete user.name},
	'Should throw when a frozen property is deleted.'
)

//================================================================ Extensions ======================

user.ext = {}

assert.doesNotThrow(
	()=>freezeTypes(user),
	'Should not throw when we re-freeze an already frozen object.'
)

assert.doesNotThrow(
	()=>user.ext = new Object,
	'Should not throw when Object is overwritten with Object (extensions).'
)

assert.throws(
	()=>user.ext = '',
	'Should throw when Object is overwritten with String (extensions).'
)

//====================================================== Superclass/Subclass Relations =============

assert.doesNotThrow(
	()=>user.ext = new User,
	'Should not throw when Object is overwritten with a User (an instance of Object).'
)

user.subUser = new User
freezeTypes(user)

assert.throws(
	()=>user.subUser = {},
	'Should throw when User is overwritten with an Object (not an instance of User).'
)

//==================================================================================================

console.log('\n  Tests completed.\n')