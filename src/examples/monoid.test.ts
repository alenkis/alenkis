import { concatAll } from "fp-ts/lib/Monoid"
import { getApplyMonoid, none, some } from "fp-ts/lib/Option"
import {
  getMonoidArray,
  mergedProducts,
  MonoidProduct,
  MonoidSum,
} from "./monoid"

describe("Monoids", () => {
  it("Should correctly multiply numbers", () => {
    const numbers = [1, 2, 3, 4, 5]

    const result = concatAll(MonoidProduct)(numbers)
    const withEmpty = concatAll(MonoidProduct)([])

    expect(result).toBe(120)
    expect(withEmpty).toBe(1)
  })
  it("Should correctly sum numbers", () => {
    const numbers = [1, 2, 3, 4, 5]

    const result = concatAll(MonoidSum)(numbers)
    const withEmpty = concatAll(MonoidSum)([])

    expect(result).toBe(15)
    expect(withEmpty).toBe(0)
  })
  it("Should correctly merge array of numbers", () => {
    const numbers = [[1, 2, 3], [4, 5], [6]]
    const MonoidNumberArray = getMonoidArray<number>()

    const result = concatAll(MonoidNumberArray)(numbers)
    const withEmpty = concatAll(MonoidNumberArray)([])

    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6])
    expect(withEmpty).toStrictEqual([])
  })
  it("Should correctly merge array of strings", () => {
    const input = [["hello"], ["world"]]
    const MonoidStringArray = getMonoidArray<string>()

    const result = concatAll(MonoidStringArray)(input)
    const withEmpty = concatAll(MonoidStringArray)([])

    expect(result).toStrictEqual(["hello", "world"])
    expect(withEmpty).toStrictEqual([])
  })

  it("should correctly merge array of products", () => {
    expect(mergedProducts).toStrictEqual({
      name: "Echo Dot 3rd gen",
      price: 39.99,
      categories: ["speaker", "home", "smart"],
    })
  })
})
