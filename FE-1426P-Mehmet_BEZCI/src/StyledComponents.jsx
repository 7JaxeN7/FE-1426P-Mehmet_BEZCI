import Table from 'react-bootstrap/Table';

function ProductTable({ products, shops, categories }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#ID</th>
          <th>Ürün Adı</th>
          <th>Market</th>
          <th>Kategori</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const shopName = shops.find((s) => s.id === product.shopId)?.name || "❓";
          const categoryName = categories.find((c) => c.id === product.categoryId)?.name || "❓";

          return (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{shopName}</td>
              <td>{categoryName}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default ProductTable;
