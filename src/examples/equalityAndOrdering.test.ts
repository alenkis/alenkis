import {
  EqNumber,
  EqProduct,
  EqProductByCategory,
  EqProductByPrice,
  EqString,
  Product,
} from "./equalityAndOrdering"
import * as N from "fp-ts/number"
import * as S from "fp-ts/string"

describe("Equality and Ordering", () => {
  it("Eq instances should correctly compare", () => {
    expect(EqString.equals("hello", "hello")).toBe(true)
    expect(S.Eq.equals("hello", "hello")).toBe(true)
    expect(EqNumber.equals(2, 2)).toBe(true)
    expect(N.Eq.equals(2, 2)).toBe(true)
  })

  it("should correctly compare complex types", () => {
    const product1: Product = {
      name: "foo",
      price: 100,
      categories: ["hello", "world"],
    }

    const product2: Product = {
      name: "foo",
      price: 100,
      categories: ["hello", "world"],
    }
    const product3: Product = {
      name: "foo",
      price: 100,
      categories: [],
    }
    const product4: Product = { name: "bar", price: 100, categories: ["h"] }
    const product5: Product = { name: "", price: 200, categories: ["h"] }

    expect(EqProduct.equals(product1, product2)).toBe(true)
    expect(EqProduct.equals(product1, product3)).toBe(false)
    expect(EqProductByPrice.equals(product1, product4)).toBe(true)
    expect(EqProductByCategory.equals(product4, product5)).toBe(true)
  })
})
