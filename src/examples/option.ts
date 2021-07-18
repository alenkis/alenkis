import { getApplySemigroup } from "fp-ts/lib/Apply"
import { Eq } from "fp-ts/lib/Eq"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import { getProduct } from "./mocks"
import { ProductSemigroup } from "./semigroup"

export const getMaybeNumber = (): O.Option<number> => {
  const randomNumber = Math.random()
  return randomNumber > 0.5 ? O.some(randomNumber) : O.none
}

export const handleMaybeNumber = pipe(
  getMaybeNumber(),
  O.match(
    () => 0,
    success => success
  )
)

export const getEq_ = <T>(E: Eq<T>): Eq<O.Option<T>> => ({
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

export const getEq = <T>(E: Eq<T>): Eq<O.Option<T>> => ({
  equals: (first, second) =>
    first === second ||
    (O.isNone(first)
      ? O.isNone(second)
      : O.isNone(second)
      ? false
      : E.equals(first.value, second.value)),
})

export const ProductOptionalSemigroup = getApplySemigroup(O.Apply)(
  ProductSemigroup
)
