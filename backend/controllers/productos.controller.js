import fs from "fs";
import path from "path";

export const getProductos = (req, res) => {
  const filePath = path.resolve("data/productos.json");
  const productos = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(productos);
};
