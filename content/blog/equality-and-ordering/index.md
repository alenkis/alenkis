---
title: Equality and Ordering
date: "2021-07-17T16:00:00.000Z"
description: "Using the Eq and Ord typeclasses to compare and order"
categories: [typescript, fp-ts, algebraic structures]
comments: false
---

This is a series of articles where I'm attempting to describe most common algebraic structures implemented by [fp-ts](https://github.com/gcanti/fp-ts) library:

- [Part 1: Semigroup](/semigroup)
- [Part 2: Monoid](/monoid)
- **Part 3: Equality and Ordering**

---

We can use `Eq` typeclass in order to determine whether two elements of the same type are equal.

```ts
interface Eq<T> {
  readonly equals: (first: T, second: T) => boolean
}
```

The following rules must apply:

1. Reflexivity

```ts
equals(first, first) === true
```

2. Symmetry

```ts
equals(first, second) === equals(second, first)
```

3. Transitivity

```ts
equals(first, second) === true &&
  equals(second, third) === true &&
  // If the two above conditions are true, then the
  // following condition must be true as well
  equals(first, third) === true
```

\
Implementing `Eq` for simple types is trivial, and `fp-ts` already provides implementations for most types (like `string`, `number` and `boolean`).

```ts
import { Eq } from "fp-ts/Eq"
import * as N from "fp-ts/number"
import * as S from "fp-ts/string"
import * as B from "fp-ts/boolean"

// Same as S.Eq
const EqString: Eq<string> = {
  equals: (first, second) => first === second,
}

// Same as N.Eq
const EqNumber: Eq<number> = {
  equals: (first, second) => first === second,
}

// Same as B.Eq
const EqBoolean: Eq<boolean> = {
  equals: (first, second) => first === second,
}
```

Javascript can handle comparing primitive types easily and the implementation above is trivial, since we're using native strict equality operator (`===`). Implementing `Eq` for complex types is where it gets interesting. Javascript can't easily work with equality when considering objects and arrays since it will compare their references and not their actual values.

```js
{ foo: 'bar' } !== { foo: 'bar' }
[1,2,3] !== [1,2,3]
```

\
We can define `Eq` interface for complex types by using `struct` and providing `Eq` instances for the type's individual fields.

```ts
import { Eq, struct } from "fp-ts/Eq"
import * as A from "fp-ts/array"

interface Product {
  name: string
  price: number
  categories: Array<string>
}

const EqProduct: Eq<Product> = struct({
  name: S.Eq,
  price: N.Eq,
  categories: A.getEq(S.Eq),
  // two arrays are equal if all of their elements are equal by
  // using string equality (S.Eq)
})

EqProduct.equals(
  { name: "product", price: 100, categories: ["hello"] },
  { name: "product", price: 100, categories: ["hello"] }
) // true

EqProduct.equals(
  { name: "product", price: 100, categories: ["hello"] },
  { name: "product", price: 100, categories: ["hello", "world"] }
) // false
```

By providing an `Eq` class for `Product` we are saying that two `Product` are the same _if and only if_ all of `Product` fields are equal as well (`name` has to obey string equality, `price` has to obey number equality and `categories` has to obey array equality).

We can also decide that `Product`s are equal if only one of the field is equal, for example if their names are equal (and `price` and `categories` might not be). We can do that easily by providing a struct defining only `name`, _or_ we can use the `contramap` helper.

Given a function that takes a `K` and returns `T` (`K -> T`), if we provide `Eq<K>` we can get `Eq<T>`. In other words, if we have a function with type signature `Product -> string`, and we can provide `Eq` for a string (easy!), we can immediately get `Eq` for `Product`!

`contramap` takes a function like that and then expects an `Eq` instance so it knows how to produce a new `Eq`.

```ts
import { contramap, Eq } from "fp-ts/Eq"
import * as S from "fp-ts/string"

const EqProductByName_: Eq<Product> = contramap(({ name }) => name)(S.Eq)

// or more elegantly using `pipe`
const EqProductByName: Eq<Product> = pipe(
  S.Eq,
  contramap(({ name }) => name)
)

EqProductByName.equals(
  { name: "product", price: 200, categories: ["hello"] },
  { name: "product", price: 100, categories: ["world"] }
) // true

EqProductByName.equals(
  { name: "product", price: 100, categories: ["hello"] },
  { name: "Product", price: 100, categories: ["hello"] }
) // false

const EqProductByPrice: Eq<Product> = pipe(
  N.Eq,
  contramap(({ price }) => price)
)

EqProductByName.equals(
  { name: "product", price: 100, categories: ["hello"] },
  { name: "product", price: 100, categories: ["world"] }
) // true
```
