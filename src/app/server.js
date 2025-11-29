import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Configuração inicial do servidor
const app = express();
app.use(express.json()); // API aceita JSON

// Configuração do cors
app.use(cors({
    origin: 'http://localhost:4200', // URL do Angular
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false
}));

// Conectar no MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { dbName: 'Aula' })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro na conexão:', err.message));

// Modelo movimentação
const movimentacaoSchema = new mongoose.Schema({
    descricao: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    tipo: { type: String, required: true, enum: ["entrada", "saida"] },
    valor: { type: Number, required: true, min: 0.01 },
    data: { type: Date, required: true }
}, { collection: 'Movimentacoes', timestamps: true });

const Movimentacao = mongoose.model('Movimentacao', movimentacaoSchema, 'Movimentacoes');

// Rota inicial
app.get('/', (req, res) => res.json({ msg: 'API rodando' }));

// Criar movimentação
app.post('/movimentacoes', async (req, res) => {
    const mov = await Movimentacao.create(req.body);
    res.status(201).json(mov);
});

// Listar todas
app.get('/movimentacoes', async (req, res) => {
    const movs = await Movimentacao.find();
    res.json(movs);
});

// Iniciar servidor
app.listen(process.env.PORT, () => 
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);

app.put('/movimentacoes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const mov = await Movimentacao.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true, overwrite: true }
        );

        if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });

        res.json(mov);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/movimentacoes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const mov = await Movimentacao.findByIdAndDelete(req.params.id);

        if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/movimentacoes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const mov = await Movimentacao.findById(req.params.id);

        if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });

        res.json(mov);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
