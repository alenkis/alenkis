import React from "react"

const Pills = ({ categories = [] }) =>
  categories.map(category => (
    <span
      key={category}
      className="flex-shrink-0 inline-block px-2 py-0.5 mx-1 text-green-800 text-xs font-medium bg-green-100 rounded-full"
    >
      {category}
    </span>
  ))

export default Pills
