import { contramap, Eq, struct } from "fp-ts/Eq"
import * as N from "fp-ts/number"
import * as S from "fp-ts/string"
import * as A from "fp-ts/array"
import * as B from "fp-ts/boolean"
import { pipe } from "fp-ts/lib/function"

export const EqString: Eq<string> = {
  equals: (first, second) => first === second,
}

export const EqNumber: Eq<number> = {
  equals: (first, second) => first === second,
}

export interface Product {
  name: string
  price: number
  categories: Array<string>
}

export const EqProduct: Eq<Product> = struct({
  name: S.Eq,
  price: N.Eq,
  /*
   * Derives an Eq over the Array of a given element type
   * from the Eq of that type. The derived Eq defines two
   * arrays as equal if all elements of both arrays are
   * compared equal pairwise with the given E. In case of
   * arrays of different lengths, the result is non equality
   */
  categories: A.getEq(S.Eq),
})

export const EqProductByPrice: Eq<Product> = pipe(
  N.Eq,
  contramap(({ price }) => price)
)

export const EqProductByCategory: Eq<Product> = pipe(
  A.getEq(S.Eq),
  contramap(({ categories }) => categories)
)

const compareByName = contramap<string, Product>(({ name }) => name)
