# FreezeTypes
Take any object value and lock down the types of its writable properties.

```js
const obj = freezeTypes({
	name: 'John Smith'
})

obj.name = 'Jimmy'
obj.name = 4 // throws
```

```
TypeError: Cannot set type-frozen property name from type String to type Number.

	.../.../your-js-file.js:75:54
	...
```

## ES5/6 Class Support
```js
class User {
	constructor(name, age) {
		this.name = name
		this.age = age
		freezeTypes(this)
	}
}

const user = new User
user.name = 35 		// throws
user.age = 'Jimmy' 	// throws
```

## Extend and re-freeze.
Type-frozen objects are not meant to behave as if they were *statically* typed. Instead, they are freely extendable, and after any extension, an object can be re-frozen, as follows:

```js
const obj = {name: 'John Smith'}
freezeTypes(obj)

obj.age = 24 		// Extend the object with an age property.
freezeTypes(obj) 	// Re-freeze types to capture the extension.

obj.age = false 	// throws
```

However, once frozen, an object cannot be un-frozen (except by painful, fussy effort).
