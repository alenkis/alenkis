import { Monoid, struct, concatAll } from "fp-ts/lib/Monoid"
import { Product } from "./interfaces"

export const MonoidProduct: Monoid<number> = {
  concat: (first, second) => first * second,
  empty: 1,
}

export const MonoidSum: Monoid<number> = {
  concat: (first, second) => first + second,
  empty: 0,
}

export const getMonoidArray = <T>(): Monoid<Array<T>> => ({
  concat: (first, second) => first.concat(second),
  empty: [],
})

// Reimplement example from Semigroup, but now using Monoids

const KeepLongerName: Monoid<string> = {
  concat: (first, second) => (first.length >= second.length ? first : second),
  empty: "",
}

const KeepLowerPrice: Monoid<number> = {
  concat: (first, second) => (first <= second ? first : second),
  empty: Number.POSITIVE_INFINITY,
}

const MergeCategories: Monoid<Array<string>> = {
  concat: (first, second) => [...new Set([...first, ...second])],
  empty: [],
}

// If we know how to concat objects fields, we automatically know how to merge the whole object as well (using `struct`)
const ProductSemigroup: Monoid<Product> = struct({
  name: KeepLongerName,
  price: KeepLowerPrice,
  categories: MergeCategories,
})

const products: Product[] = [
  { name: "Echo Dot", price: 49.99, categories: ["speaker", "home"] },
  { name: "Echo Dot 3rd gen", price: 59.99, categories: ["smart"] },
  { name: "Echo", price: 39.99, categories: [] },
]

export const mergedProducts = concatAll(ProductSemigroup)(products)
/* {
"name": "Echo Dot 3rd gen",
"price": 39.99,
"categories": ["speaker", "home", "smart"]
} */
