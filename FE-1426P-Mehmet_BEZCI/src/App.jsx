import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { FaTrash } from "react-icons/fa";
import Confetti from "react-confetti";
import Fuse from "fuse.js";
import "./App.css";

function IconButton({ onClick }) {
  return (
    <button
      className="btn btn-danger"
      style={{
        width: "40px",
        height: "40px",
        padding: 0,
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    >
      <FaTrash />
    </button>
  );
}

const shops = [
  { id: 1, name: "Migros" },
  { id: 2, name: "Teknosa" },
  { id: 3, name: "BİM" },
];

const categories = [
  { id: 1, name: "Elektronik" },
  { id: 2, name: "Şarküteri" },
  { id: 3, name: "Oyuncak" },
  { id: 4, name: "Bakliyat" },
  { id: 5, name: "Fırın" },
];

const generateRandomId = () => Math.floor(Math.random() * 1000000);

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [productName, setProductName] = useState("");

  const [filteredShopId, setFilteredShopId] = useState("all");
  const [filteredCategoryId, setFilteredCategoryId] = useState("all");
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [filteredName, setFilteredName] = useState("");

  const [confetti, setConfetti] = useState(false);

  const fuse = new Fuse(products, {
    keys: ["name"],
    threshold: 0.3,
  });

  const filteredProducts = products
    .filter((p) => {
      if (filteredShopId === "all") return true;
      return p.shopId === parseInt(filteredShopId);
    })
    .filter((p) => {
      if (filteredCategoryId === "all") return true;
      return p.categoryId === parseInt(filteredCategoryId);
    })
    .filter((p) => {
      if (filteredStatus === "all") return true;
      if (filteredStatus === "bought") return p.isBought;
      if (filteredStatus === "notBought") return !p.isBought;
    })
    .filter((p) => {
      if (!filteredName.trim()) return true;
      return fuse.search(filteredName).map((res) => res.item).includes(p);
    });

  const handleAdd = () => {
    if (selectedShopId && selectedCategoryId && productName.trim() !== "") {
      const newProduct = {
        id: generateRandomId(),
        name: productName,
        shopId: parseInt(selectedShopId),
        categoryId: parseInt(selectedCategoryId),
        isBought: false,
      };

      setProducts((prev) => [...prev, newProduct]);
      setProductName("");
    }
  };

  const toggleBought = (id) => {
    setProducts((prevProducts) => {
      const updated = prevProducts.map((product) =>
        product.id === id
          ? { ...product, isBought: !product.isBought }
          : product
      );

      const wasNotComplete = prevProducts.some((p) => !p.isBought);
      const isNowComplete =
        updated.length > 0 && updated.every((p) => p.isBought);

      if (wasNotComplete && isNowComplete) {
        alert("Alışveriş Tamamlandı !");
        setConfetti(true);
        setProducts([]);
      }

      return updated;
    });
  };

  const handleDelete = (id) => {
    setProducts((prevProducts) => {
      const updated = prevProducts.filter((p) => p.id !== id);

      const isNowComplete =
        updated.length > 0 && updated.every((p) => p.isBought);

      if (isNowComplete) {
        alert("Alışveriş Tamamlandı !");
        setConfetti(true);
        setProducts([]);
      }

      return updated;
    });
  };

  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => setConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [confetti]);

  return (
    <div className="container mt-4">
      {confetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <h1>🛒 Ürün Ekle</h1>
      <div className="mb-3">
        <label className="form-label">Market</label>
        <select
          className="form-select"
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Kategori</label>
        <select
          className="form-select"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Ürün Adı</label>
        <input
          type="text"
          className="form-control"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mb-4" onClick={handleAdd}>
        Ürün Ekle
      </button>

      <h4>🔍 Filtrele</h4>
      <div className="row mb-4">
        <div className="col-md-3">
          <label>Market</label>
          <select
            className="form-select"
            value={filteredShopId}
            onChange={(e) => setFilteredShopId(e.target.value)}
          >
            <option value="all">Tümü</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Kategori</label>
          <select
            className="form-select"
            value={filteredCategoryId}
            onChange={(e) => setFilteredCategoryId(e.target.value)}
          >
            <option value="all">Tümü</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Durum</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              value="all"
              checked={filteredStatus === "all"}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <label className="form-check-label">Tümü</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              value="bought"
              checked={filteredStatus === "bought"}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <label className="form-check-label">Satın Alınanlar</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              value="notBought"
              checked={filteredStatus === "notBought"}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <label className="form-check-label">Satın Alınmayanlar</label>
          </div>
        </div>

        <div className="col-md-3">
          <label>Ürün Adı</label>
          <input
            type="text"
            className="form-control"
            value={filteredName}
            onChange={(e) => setFilteredName(e.target.value)}
          />
        </div>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Market</th>
            <th>Kategori</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{shops.find((shop) => shop.id === product.shopId)?.name}</td>
              <td>
                {categories.find((cat) => cat.id === product.categoryId)?.name}
              </td>
              <td>
                <button
                  className={`btn btn-${product.isBought ? "success" : "warning"}`}
                  onClick={() => toggleBought(product.id)}
                >
                  {product.isBought ? "Satın Alındı" : "Satın Al"}
                </button>
              </td>
              <td>
                <IconButton onClick={() => handleDelete(product.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
