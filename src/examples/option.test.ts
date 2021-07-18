import { concatAll } from "fp-ts/lib/Semigroup"
import * as O from "fp-ts/Option"
import { EqProduct } from "./equalityAndOrdering"
import { getProduct } from "./mocks"
import { ProductOptionalSemigroup } from "./option"
import { defaultProduct } from "./semigroup"

describe("Option", () => {
  it("getEq", () => {
    const EqOptionalProduct = O.getEq(EqProduct)
    const product1 = getProduct()
    const product2 = getProduct({ name: "product2" })
    const product3 = getProduct()

    expect(EqOptionalProduct.equals(O.none, O.none)).toBe(true)
    expect(EqOptionalProduct.equals(O.none, O.some(product1))).toBe(false)
    expect(EqOptionalProduct.equals(O.some(product1), O.none)).toBe(false)
    expect(EqOptionalProduct.equals(O.some(product1), O.some(product2))).toBe(
      false
    )
    expect(EqOptionalProduct.equals(O.some(product1), O.some(product3))).toBe(
      true
    )
  })

  it("should correctly merge optional product", () => {
    const mergeProducts = concatAll(ProductOptionalSemigroup)(
      O.some(defaultProduct)
    )

    expect(mergeProducts([O.none, O.some(getProduct())])).toBe(O.none)
    expect(mergeProducts([O.none, O.none])).toBe(O.none)
    expect(
      mergeProducts([
        O.some(getProduct({ name: "the longer name", price: 10 })),
        O.some(getProduct()),
      ])
    ).toStrictEqual(O.some(getProduct({ name: "the longer name", price: 10 })))
  })
})
