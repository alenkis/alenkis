---
title: Semigroups
date: "2021-07-04T15:00:00.000Z"
description: "Using the Semigroup typeclass to compose complex entities"
categories: [typescript, fp-ts, algebraic structures]
comments: false
---

Composability is arguably one of the stronger features of the functional programming paradigm because it allows us to write modular code and achieve complex behavior by composing the smaller pieces together (think LEGO!). _But, what does it really mean to combine things together?_

We already know how to combine strings:
```ts
const combinedString = "Hello " + "world!" // "Hello world!"
const concatenatedString = "foo".concat("bar") // "foobar"
```
\
And we also know how to combine arrays of things:
```ts
const numbers: Array<number> = [1,2,3].concat(4,5).concat(6) // [1,2,3,4,5,6]
const strings: Array<string> = ["hello"].concat("world").concat("!") // ["hello", "world", "!"]

```
\
How do we combine something more complex like a `Product` for example?
```ts
interface Product {
  name: string;
  price: number;
  categories: Array<string>;
}
```
\
This is where a `Semigroup`[^1] concept comes in. `Semigroup` is a _typeclass_[^2], but instead of going deeper into what that means, let's explain _what it does_. In order for something to _behave_ like a Semigroup, it needs to have a `concat` method defined for it's type. In other words, we need to know how to combine elements of type `T`

```ts
interface Semigroup<T> {
  concat: (first: T, second: T) => T
}
```
\
Let's see how we can implement examples we've already seen using this `Semigroup` interface:

```ts
import { Semigroup, concatAll } from 'fp-ts/Semigroup'
// Semigroup and other helper functions are already defined in 'fp-ts' library

const SemigroupString: Semigroup<string> = {
  concat: (first, second) => first + second
}

// We're providing a merging strategy to `concatAll` method, which returns a function expecting an initial value, 
// which in turn returns a function that's ready to accept array of strings.
const concatStrings = concatAll(SemigroupString)

const combinedString = concatStrings('')(["Hello"," ", "world", "!"]) // "Hello world!" 
const concatenatedString = concatString('foo')(["bar"]) // "foobar"

const getArraySemigroup = <T>(): Semigroup<Array<T>> => ({
  concat: (first, second) => first.concat(second)
})

const numbers = concatAll(getArraySemigroup<number>())([1,2,3])([[4, 5], [6]]) // [1,2,3,4,5,6]
const strings = concatAll(getArraySemigroup<string>())(["hello"])([["world"], ["!"]]) // ["hello", "world"]

```
\
So far we've seen how to re-implement what we already can do, in a somewhat more contrived way, along with some Typescript generic gymnastics with `getArraySemigroup` (so we can use it for both `Array<number>` and `Array<string>`).

Let's extend this to work with our example of a `Product`.
```ts
interface Product {
  name: string;
  price: number;
  categories: Array<string>;
}
```

For some reason, we may have duplicate or stale versions of the same `Product`, and we want to merge them together.
Let's say we have a couple of rules on how we need to combine products:
 
1) Always keep the longer name
2) Keep the product with the lower price
3) Combine unique categories

One nice approach we can take here is to come up with merge strategies for these individual concerns, and then combine them all when constructing a merge strategy for whole products:

```ts
import { struct } from 'fp-ts/Semigroup';

const keepLongerName: Semigroup<string> = {
  concat: (first, second) => first.length >= second.length ? first : second
}

const keepLowerPrice: Semigroup<number> = {
  concat: (first, second) => first <= second ? first : second
}

const mergeCategories: Semigroup<Array<string>> = {
  concat: (first, second) => [...new Set([...first, ...second])]
}

// If we know how to concat objects fields, we automatically know how to merge the whole object as well (using `struct`)
const mergeProducts: Semigroup<Product> = struct({
  name: keepLongerName,
  price: keepLowerPrice,
  categories: mergeCategories
})

const products: Product[] = [
  {name: 'Echo Dot', price: 49.99, categories: ['speaker', 'home']}, 
  {name: 'Echo Dot 3rd gen', price: 59.99, categories: ['smart']},
  {name: 'Echo', price: 39.99, categories: []}
]
const defaultProduct: Product = { name: '', price: Number.POSITIVE_INFINITY, categories: [] }

export const mergedProducts = concatAll(mergeProducts)(defaultProduct)(products)
/* {
"name": "Echo Dot 3rd gen", 
"price": 39.99,
"categories": ["speaker", "home", "smart"]
} */

```

\
In conclusion, `Semigroup` gives us a way to combine or merge entities of the same type, whatever that type may be, as long as we provide a default (initial) value.

[^1]: [Semigroup](https://en.wikipedia.org/wiki/Semigroup) is an algebraic structure consisting of a set together with an associative binary operation.\
[^2]: [Typeclass](https://en.wikipedia.org/wiki/Type_class) is a way to achieve polymorphism. [Great resource on typescript typeclasses](https://paulgray.net/typeclasses-in-typescript/)