import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

app.get("/", (req, res) => {
    res.send("Backend da loja funcionando!");
});

// Endpoint para criar preferência de pagamento
app.post("/create-preference", async (req, res) => {
    try {
        const { items, external_reference } = req.body;

        console.log("Recebendo body:", req.body);

        const preference = await new Preference(client).create({
            body: {
                items: items,
                external_reference: external_reference,
                back_urls: {
                    success: "http://localhost:5173/success",
                    failure: "http://localhost:5173/failure",
                    pending: "http://localhost:5173/pending",
                },
            },
        });

        console.log("Preference criada:", preference);

        res.json({
            id: preference.id,
            init_point: preference.init_point,
        });
    } catch (error) {
        console.error("Erro detalhado:", error);
        res.status(500).json({ error: "Erro ao criar preferência de pagamento", details: error.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});