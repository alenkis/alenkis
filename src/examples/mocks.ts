import { Product } from "./interfaces"

export const getProduct = (overrides?: Partial<Product>): Product => ({
  name: "product",
  price: 100,
  categories: [],
  ...overrides,
})
