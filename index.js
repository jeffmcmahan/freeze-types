'use strict'

/**
 Prints a string representing the value.
 - param value: *  
 - returns: String
 */
function printValueType(value) {
	if (value === null) return 'null'
	if (typeof value === 'undefined') return 'undefined'
	if (typeof value === 'number' && isNaN(value)) return 'NaN'
	if (value.toString && '' + value === '[object Arguments]') return 'arguments'
	if (value.constructor) return value.constructor.name

	// objects created with Object.create(null)
	if (typeof value === 'object' && !value.constructor) return 'object (no prototype)'

	// Should never happen, but just in case...
	return typeof value
}

/*
Throws an informative error, with irrelevant lines removed.
- param key: String
- param oldValue: Any
- param newValue: Any
*/
function throwError(key, oldValue, newValue) {
	const err = new TypeError('')
	const msg = (
		`Cannot set type-frozen ${key} property from type ${printValueType(oldValue)} to type `+
		`${printValueType(newValue)}.`
	)
	const stack = err.stack.toString().split('\n').slice(1).filter(l => !l.includes('freeze-types'))
	err.stack = ''
	err.message = msg + '\n\n' + stack.join('\n')
	throw err
}

/*
Determines whether the types of two values match.
- param oldValue: Any
- param newValue: Any
- returns: Boolean
*/
function sameType(oldValue, newValue) {
	if (oldValue === null) return newValue === null
	if (newValue === null) return oldValue === null
	if (oldValue === undefined) return newValue === undefined
	if (newValue === undefined) return oldValue === undefined
	if (typeof oldValue === 'object' && !oldValue.constructor) {
		return typeof newValue === 'object' && !newValue.constructor
	}
	return newValue.constructor === oldValue.constructor || newValue instanceof oldValue.constructor
}

/*
Freezes the types of an object's existing properties permanently.
- param obj: Object
- returns: Object
- note: The Proxy API is slow, so we use the  Object.defineProperty() getter/setter API.
*/
module.exports = function freezeTypes(obj) {
	if (!obj || typeof obj !== 'object') throw new Error('freezeTypes accepts only objects/arrays.')
	Object.keys(obj).forEach(key => {
		if (!(Object.getOwnPropertyDescriptor(obj, key) || {}).writable) return
		let value = obj[key]
		Object.defineProperty(obj, key, {
			configurable: false,
			enumerable: true,
			get: function () {return value},
			set: function (newValue) {
				if (!sameType(value, newValue)) throwError(key, value, newValue)
				value = newValue
			}
		})
	})
	return obj
}