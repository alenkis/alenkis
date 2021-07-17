import { mergedProducts, mergedProductsCurried } from "./semigroup"

describe("Semigroup", () => {






  it("should correctly merge products", () => {
    expect(mergedProducts).toStrictEqual({
      categories: ["speaker", "home", "smart"],
      name: "Echo Dot 3rd gen",
      price: 39.99,
    })
  })

  it("should correctly merge products with pipe operator", () => {
    expect(mergedProductsCurried).toStrictEqual({
      categories: ["speaker", "home", "smart"],
      name: "Echo Dot 3rd gen",
      price: 39.99,
    })
  })
})
