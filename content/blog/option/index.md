---
title: Option
date: "2021-07-18T15:00:00.000Z"
description: "Using the Option typeclass to model missing values"
categories: [typescript, fp-ts, algebraic structures]
comments: false
---

---

This is a series of articles where I'm attempting to describe most common algebraic structures implemented by [fp-ts](https://github.com/gcanti/fp-ts) library:

- [Part 1: Semigroup](/semigroup)
- [Part 2: Monoid](/monoid)
- [Part 3: Equality and Ordering](/equality-and-ordering)
- **Part 4: Option**

---

## Option

An `Option` represents a container for a value which might be missing. It's a sum type of two possible types: `None | Some<T>`

![Option typeclass](/images/option.png)

When talking about missing values, Javascript models this natively with `null` or `undefined` values. This comes with its own problems and 8 out of 10 most common Javascript errors[^1] are in some way related to `null` or `undefined`. The creator of `NULL` (and Quicksort), Tony Hoare, also calls it "the billion dollar mistake"[^2]. So, in order to avoid dealing with `null` and `undefined` and all the safety checks we must do when working with them, we can work with `Option`.

Since the `Option` is a wrapper around a value, the only way to access it is to handle both success and failure cases.

```ts
import * as O from "fp-ts/Option"

const getMaybeNumber = (): O.Option<number> => {
  const randomNumber = Math.random()
  return randomNumber > 0.5 ? O.some(randomNumber) : O.none
}

const value: number = pipe(
  /* get Option<number> */
  getMaybeNumber(),
  /* pattern match on the value */
  O.match(
    () => 0, // handle None case
    success => success // handle Some<number> case
  )
)
```

\
Since getting the value _or_ some default is a very common pattern, there's an even simpler way to achieve that:

```ts
const _value = O.getOrElse(() => 0)(getMaybeNumber())

// or more elegantly
const value = pipe(
  getMaybeNumber(),
  O.getOrElse(() => 0)
)
```

There are a couple of ways we can build an `Option`:

```ts
// using constructor
const valueNone = O.none
const valueSome = O.some("hello")

// from a value
const valueNone2 = O.fromNullable(null) // O.None
const valueSome2 = O.fromNullable("hello") // O.Some("hello")

// from a predicate function
const isHigherThanTwo = (n: number) => n > 2
const valueNone3 = O.fromPredicate(isHigherThanTwo)(1) // O.None
const valueSome3 = O.fromPredicate(isHigherThanTwo)(3) // O.Some(3)
```

If we need to get out of the functional word and again deal with Javascript values, we can easilly convert `Option` to `null` or `undefined`:

```ts
const valueNone = O.none
const valueSome = O.some("hello")

O.toUndefined(valueNone) // undefined
O.toUndefined(valueSome) // "hello"
O.toNullable(valueNone) // null
O.toNullable(valueSome) // "hello"
```

We can combine what we learned about `Eq` in the [previous article](/equality-and-ordering) and derive an `Eq` for an optional value and use it to compare optional `Product`.

```ts
import { Eq } from "fp-ts/lib/Eq"
import * as O from "fp-ts/Option"

// Implemented for demonstration, but available as O.getEq
const getEq = <T>(E: Eq<T>): Eq<O.Option<T>> => ({
  equals: (first, second) => {
    if (O.isNone(first) && O.isNone(second)) {
      // both are none, so they are equal
      return true
    }
    if (O.isSome(first) && O.isSome(second)) {
      // both are some, so compare equality
      return E.equals(first.value, second.value)
    }

    return false
  },
})

// defined in previous article
export const EqProduct: Eq<Product> = struct({
  name: S.Eq,
  price: N.Eq,
  categories: A.getEq(S.Eq),
})

const EqOptionalProduct = getEq(EqProduct)

const product1 = {
  name: "product",
  price: 100,
  categories: [],
}
const product2 = {
  name: "p",
  price: 200,
  categories: [],
}
const product3 = {
  name: "product",
  price: 100,
  categories: [],
}

EqOptionalProduct.equals(O.none, O.none) // true
EqOptionalProduct.equals(O.none, O.some(product1)) // false
EqOptionalProduct.equals(O.some(product1), O.none) // false
EqOptionalProduct.equals(O.some(product1), O.some(product2)) // false
EqOptionalProduct.equals(O.some(product1), O.some(product3)) // true
```

Similar to how we've been able to get `Eq<Option<T>>` just by having `Eq<T>` (by using `getEq` in the above snippet), we can also obtain `Semigroup<Option<T>>` if we have `Semigroup<T>`. This kind of composability is very useful and it's usually called "lifting" or "applying". Extending the code we've written in the first article about [Semigroups](/semigroup), we can create a merging strategy that can deal with _optional_ `Product` values:

```ts
import { struct, Semigroup } from "fp-ts/Semigroup"
import { getApplySemigroup } from "fp-ts/lib/Apply"
import * as O from "fp-ts/Option"

// Defined in the first article
const ProductSemigroup: Semigroup<Product> = struct({
  name: KeepLongerName,
  price: KeepLowerPrice,
  categories: MergeCategories,
})

// Use Option's apply to lift Semigroup<Product> to Semigroup<Option<Product>>
const ProductOptionalSemigroup = getApplySemigroup(O.Apply)(ProductSemigroup)

const mergeProducts = concatAll(ProductOptionalSemigroup)(
  O.some(defaultProduct)
)
const product1 = { name: "product", price: 50, categories: ["hello"] }
const product2 = { name: "product longer", price: 100, categories: [] }

mergeProducts([O.none, O.none]) // O.none
mergeProducts([O.none, O.some(product1)]) // O.none
mergeProducts([O.some(product1), O.some(product2)])
// O.some({ name: 'product longer', price: 50, categories: ['hello'] })
```

[^1]: https://rollbar.com/blog/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them
[^2]: https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/
