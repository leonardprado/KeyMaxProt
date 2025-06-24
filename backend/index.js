const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN_MERCADOPAGO", // Reemplaza por tu token real
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  try {
    const { items } = req.body;
    const preference = {
      items,
      back_urls: {
        success: "http://localhost:5173/carrito?status=success",
        failure: "http://localhost:5173/carrito?status=failure",
        pending: "http://localhost:5173/carrito?status=pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

app.listen(3001, () => {
  console.log("Servidor backend escuchando en http://localhost:3001");
});
