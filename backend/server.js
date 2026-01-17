import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import twilio from "twilio";
import productosRoutes from "./routes/productos.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/productos", productosRoutes);

// TWILIO
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// CHECKOUT
app.post("/api/checkout", async (req, res) => {
  try {
    const pedido = req.body;

    console.log("📦 Pedido recibido:", pedido);

    const subtotal = pedido.carrito.reduce(
      (acc, p) => acc + p.price * p.cantidad,
      0
    );

    const total = subtotal + pedido.envio;

    // 📧 EMAIL AL CLIENTE
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resumen = pedido.carrito
      .map(p => `${p.name} x${p.cantidad} - $${p.price * p.cantidad}`)
      .join("\n");

    await transporter.sendMail({
      from: `"BatteryShop" <${process.env.EMAIL_USER}>`,
      to: pedido.cliente.email,
      subject: "Confirmación de compra 🛒",
      text: `
Gracias por tu compra ${pedido.cliente.nombre}

Productos:
${resumen}

Envío: $${pedido.envio}
Total: $${total}
      `
    });

    console.log("✅ Email enviado");

    // 📲 WHATSAPP PARA TI
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
      body: `
🛒 NUEVA VENTA
Cliente: ${pedido.cliente.nombre}
Tel: ${pedido.cliente.telefono}
Total: $${total}
      `
    });

    console.log("📲 WhatsApp enviado");

    res.json({ ok: true });

  } catch (error) {
    console.error("🔥 ERROR CHECKOUT REAL:", error);
    res.status(500).json({ error: "Error procesando pedido" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor BatteryShop funcionando 🚀");
});


app.listen(4000, () => {
  console.log("Servidor en http://localhost:4000");
});
