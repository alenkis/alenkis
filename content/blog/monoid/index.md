---
title: Monoid
date: "2021-07-11T15:00:00.000Z"
description: "Using the Monoid typeclass to compose with indentity"
categories: [typescript, fp-ts, algebraic structures]
comments: false
---

This is a series of articles where I'm attempting to describe most common algebraic structures implemented by [fp-ts](https://github.com/gcanti/fp-ts) library:

- [Part 1: Semigroup](/semigroup)
- **Part 2: Monoid**
- [Part 3: Equality and Ordering](/equality-and-ordering)
- [Part 4: Option](/option)

---

In the [previous article](/semigroup) we've learned about Semigroups and how they abstract the operation of merging data types through the use of a `concat` operator. A `Monoid` _is_ a `Semigroup`, but it also has defined an `empty` element (sometimes called the `identity` element), which if concatenated with type `a`, gives back the same `a` (neutral operation)

```ts
interface Monoid<T> extends Semigroup<T> {
  readonly empty: T
}
```

More formally, all Monoids are Semigroups _if and only if_ they obey the following associativity rules:

> - Right identity => `concat`(t, empty) == t
> - Left identity &nbsp; => `concat`(empty, t) == t

The empty element provides a way to merge two monoids without specifying the default value like we had to do with Semigroups. Let's see a couple of examples for basic types like numbers, strings and arrays:

```ts
export const MonoidProduct: Monoid<number> = {
  concat: (first, second) => first * second,
  empty: 1, // <-- identity element
}

export const MonoidSum: Monoid<number> = {
  concat: (first, second) => first + second,
  empty: 0, // <-- identity element
}

export const getMonoidArray = <T>(): Monoid<Array<T>> => ({
  concat: (first, second) => first.concat(second),
  empty: [], // <-- identity element
})
const MonoidArrayNumber = getMonoidArray<number>()
const MonoidArrayString = getMonoidArray<string>()

// Number products
concatAll(MonoidProduct)([1, 2, 3, 4, 5]) // 120
concatAll(MonoidProduct)([]) // 1

// Number sums
concatAll(MonoidSum)([1, 2, 3, 4, 5]) // 15
concatAll(MonoidSum)([]) // 0

// Array of numbers joins
concatAll(MonoidArrayNumber)([1, 2, 3], [4, 5], [6]) // [1, 2, 3, 4, 5, 6]
concatAll(MonoidArrayNumber)([]) // []

// Array of strings joins
concatAll(MonoidArrayString)([["hello"], ["world"]]) // ["hello", "world"]
concatAll(MonoidArrayString)([]) // []
```

\
We can reimplement our example from [previous article](/semigroup) with `Product` using Monoids instead of Semigroups to avoid defining a default value for the `Product`. Since every specific Monoid (`KeepLongerName`, `KeepLowerPrice` and `MergeCategories`) defines an empty value, we no longer have to worry about the default value for the `Product`; the responsability has shifted to the individual Monoids.

```diff
- import { struct } from "fp-ts/Semigroup"
+ import { struct } from "fp-ts/Monoid"

// Always keep the longer name
- const KeepLongerName: Semigroup<string> = {
+ const KeepLongerName: Monoid<string> = {
    concat: (first, second) => (first.length >= second.length ? first : second),
+   empty: "",
  }

// Keep the product with the lower price
- const KeepLowerPrice: Semigroup<number> = {
+ const KeepLowerPrice: Monoid<number> = {
    concat: (first, second) => (first <= second ? first : second),
+   empty: Number.POSITIVE_INFINITY,
  }

// Combine unique categories
- const MergeCategories: Semigroup<Array<string>> = {
+ const MergeCategories: Monoid<Array<string>> = {
    concat: (first, second) => [...new Set([...first, ...second])],
+   empty: [],
  }

// If we know how to concat objects fields, we automatically know how to merge the whole object as well (using `struct`)
- const ProductSemigroup: Semigroup<Product> = struct({
+ const ProductMonoid: Monoid<Product> = struct({
    name: KeepLongerName,
    price: KeepLowerPrice,
    categories: MergeCategories,
  })

const products: Product[] = [
  { name: "Echo Dot", price: 49.99, categories: ["speaker", "home"] },
  { name: "Echo Dot 3rd gen", price: 59.99, categories: ["smart"] },
  { name: "Echo", price: 39.99, categories: [] },
]

- // Semigroup needs default value to start with
- const defaultProduct: Product = {
-   name: "",
-   price: Number.POSITIVE_INFINITY,
-   categories: [],
- }
-
- export const mergedProducts = concatAll(ProductSemigroup)(defaultProduct)(
-   products
- )
+ export const mergedProducts = concatAll(ProductMonoid)(products)
/* {
"name": "Echo Dot 3rd gen",
"price": 39.99,
"categories": ["speaker", "home", "smart"]
} */
```

\
In conclusion, `Monoid` extends `Semigroup` and the only major difference between them is that `Monoid` requires an empty element for the type that it is defined for, which removes the need for explicit default value when concatenating types.
