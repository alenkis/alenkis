import {
  EqNumber,
  EqProduct,
  EqProductByCategory,
  EqProductByPrice,
  EqString,
  OrdProductByName,
  OrdProductByPrice,
  sort,
} from "./equalityAndOrdering"
import * as N from "fp-ts/number"
import * as S from "fp-ts/string"
import { pipe } from "fp-ts/lib/function"
import { Product } from "./interfaces"

describe("Equality and Ordering", () => {
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

  it("Eq instances should correctly compare", () => {
    expect(EqString.equals("hello", "hello")).toBe(true)
    expect(S.Eq.equals("hello", "hello")).toBe(true)
    expect(EqNumber.equals(2, 2)).toBe(true)
    expect(N.Eq.equals(2, 2)).toBe(true)
  })

  it("should correctly compare complex types", () => {
    expect(EqProduct.equals(product1, product2)).toBe(true)
    expect(EqProduct.equals(product1, product3)).toBe(false)
    expect(EqProductByPrice.equals(product1, product4)).toBe(true)
    expect(EqProductByCategory.equals(product4, product5)).toBe(true)
  })

  it("Ord should order by price", () => {
    expect(OrdProductByPrice.compare(product5, product4)).toBe(1)
  })

  it("should sort array", () => {
    expect(pipe([product5, product4], sort(OrdProductByPrice))).toStrictEqual([
      product4,
      product5,
    ])
  })

  it("should sort array 2", () => {
    const product1: Product = {
      name: "product",
      price: 300,
      categories: ["foo"],
    }
    const product2: Product = {
      name: "another",
      price: 100,
      categories: ["bar"],
    }
    const product3: Product = {
      name: "third",
      price: 200,
      categories: ["bar", "baz"],
    }

    const sortedByPrice = pipe(
      [product1, product2, product3],
      sort(OrdProductByPrice)
    )

    const sortedByName = pipe(
      [product1, product2, product3],
      sort(OrdProductByName)
    )

    expect(sortedByPrice).toStrictEqual([product2, product3, product1])
    expect(sortedByName).toStrictEqual([product2, product1, product3])
  })
})
