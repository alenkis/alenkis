import { ap } from "fp-ts/lib/Identity"
import { pipe } from "fp-ts/lib/function"
import { Semigroup, concatAll, struct } from "fp-ts/Semigroup"


const numbers: Array<number> = [1, 2, 3].concat(4, 5).concat(6) // [1,2,3,4,5,6]
const strings: Array<string> = ["hello"].concat("world").concat("!") // ["hello", "world", "!"]

interface Product {
  name: string
  price: number
  categories: Array<string>
}

const SemigroupString: Semigroup<string> = {
  concat: (first, second) => first + second,
}

const concatStrings = concatAll(SemigroupString)

const combinedString = concatStrings("")(["Hello", " ", "world", "!"]) // "Hello world!"
const concatenatedString = concatStrings("foo")(["bar"]) // "foobar"

const getArraySemigroup = <T>(): Semigroup<Array<T>> => ({
  concat: (first, second) => first.concat(second),
})
const numberArraySemigroup = getArraySemigroup<number>()
const stringArraySemigroup = getArraySemigroup<string>()

const numbers2 = concatAll(numberArraySemigroup)([1, 2, 3])([[4, 5], [6]]) // [1,2,3,4,5,6]
const strings2 = concatAll(stringArraySemigroup)(["hello"])([["world"], ["!"]]) // ["hello", "world"]

const KeepLongerName: Semigroup<string> = {
  concat: (first, second) => (first.length >= second.length ? first : second),
}

const KeepLowerPrice: Semigroup<number> = {
  concat: (first, second) => (first <= second ? first : second),
}

const MergeCategories: Semigroup<Array<string>> = {
  concat: (first, second) => [...new Set([...first, ...second])],
}

const ProductSemigroup: Semigroup<Product> = struct({
  name: KeepLongerName,
  price: KeepLowerPrice,
  categories: MergeCategories,
})

const products: Product[] = [
  { name: "Echo Dot", price: 49.99, categories: ["speaker", "home"] },
  { name: "Echo Dot 3rd gen", price: 59.99, categories: ["smart"] },
  { name: "Echo", price: 39.99, categories: [] },
]
const defaultProduct: Product = {
  name: "",
  price: Number.POSITIVE_INFINITY,
  categories: [],
}

export const mergedProducts = concatAll(ProductSemigroup)(defaultProduct)(
  products
)

export const mergedProductsCurried = pipe(
  ProductSemigroup,
  concatAll,
  ap(defaultProduct),
  ap(products)
)
