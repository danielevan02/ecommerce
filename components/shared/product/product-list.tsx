
import { Product } from "@/types"
import ProductCart from "./product-card"

interface ProductListProps {
  data: Product[]
  title?: string
  limit?: number
}

const ProductList: React.FC<ProductListProps> = ({data, title, limit}) => {
  const limitedData = limit ? data.slice(0, limit): data
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product) => (
            <ProductCart product={product} key={product.slug}/>
          ))}
        </div>
      ): (
        <div>
          <p>No Products found</p>
        </div>
      )}
    </div>
  );
}
 
export default ProductList;