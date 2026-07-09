import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import qrcode from "qrcode";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Ensure DB directory exists if we decide to move it, using workspace root for now
const db = new Database("quazar.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    event TEXT,
    status TEXT DEFAULT 'pendiente', 
    email_sent BOOLEAN DEFAULT 0,
    validated BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    validated_at DATETIME
  )
`);

const JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret";

// Auth Middleware
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // 1. Create Ticket (Public)
  app.post("/api/tickets", (req, res) => {
    const { name, phone, email, event } = req.body;
    if (!name || !phone || !email || !event) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const id = uuidv4();
    try {
      const stmt = db.prepare("INSERT INTO tickets (id, name, phone, email, event) VALUES (?, ?, ?, ?, ?)");
      stmt.run(id, name, phone, email, event);
      res.json({ success: true, id, status: "pendiente" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear la entrada" });
    }
  });

  // 2. Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@quazar.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  });

  // 3. Get Tickets (Admin)
  app.get("/api/admin/tickets", authenticateAdmin, (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM tickets ORDER BY created_at DESC");
      const tickets = stmt.all();
      res.json({ tickets });
    } catch (err) {
      res.status(500).json({ error: "Error al obtener tickets" });
    }
  });

  // 4. Confirm Payment & Send Email (Admin)
  app.post("/api/admin/tickets/:id/confirm", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
      const ticket: any = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
      if (!ticket) return res.status(404).json({ error: "Entrada no encontrada" });
      if (ticket.status === 'pagado') return res.status(400).json({ error: "La entrada ya está pagada" });

      // Generate Signed Token for QR
      const ticketToken = jwt.sign({ ticketId: ticket.id, event: ticket.event }, JWT_SECRET);
      
      // Generate QR Code Image (Data URI)
      const qrDataUri = await qrcode.toDataURL(ticketToken, {
        color: { dark: '#000000', light: '#ffffff' },
        width: 400
      });

      // Send Email
      let emailSent = false;
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"QUAZAR" <tickets@quazar.com>',
          to: ticket.email,
          subject: `Tu Entrada para QUAZAR: ${ticket.event}`,
          html: `
            <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center;">
              <h1 style="color: #a855f7; letter-spacing: 4px;">QUAZAR</h1>
              <h2>A JOURNEY THROUGH SOUND</h2>
              <p>Hola <strong>${ticket.name}</strong>,</p>
              <p>Tu pago ha sido confirmado. Aquí tienes tu entrada oficial para <strong>${ticket.event}</strong>.</p>
              <p>Presenta este código QR en la puerta desde tu celular.</p>
              <div style="margin: 30px 0;">
                <img src="${qrDataUri}" alt="Ticket QR" style="border-radius: 10px; border: 4px solid #a855f7; width: 300px; max-width: 100%;" />
              </div>
              <p style="color: #666; font-size: 12px;">ID de entrada: ${ticket.id}</p>
            </div>
          `
        });
        emailSent = true;
      } else {
        console.warn("SMTP credentials not provided. Email skipped. Generated QR Token:", ticketToken);
      }

      // Update DB
      const stmt = db.prepare("UPDATE tickets SET status = 'pagado', email_sent = ? WHERE id = ?");
      stmt.run(emailSent ? 1 : 0, id);

      res.json({ success: true, message: "Pago confirmado y entrada generada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al confirmar el pago" });
    }
  });

  // 5. Validate Ticket via Scanner (Admin)
  app.post("/api/admin/scan", authenticateAdmin, (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Falta el token del QR" });

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const ticketId = decoded.ticketId;

      const ticket: any = db.prepare("SELECT * FROM tickets WHERE id = ?").get(ticketId);
      
      if (!ticket) {
        return res.json({ valid: false, message: "ENTRADA INVÁLIDA: No existe en la base de datos." });
      }
      
      if (ticket.status !== 'pagado') {
        return res.json({ valid: false, message: "ENTRADA INVÁLIDA: El pago no ha sido confirmado." });
      }

      if (ticket.validated) {
        return res.json({ 
          valid: false, 
          message: `ENTRADA YA UTILIZADA. Ingreso registrado el ${new Date(ticket.validated_at).toLocaleString()}.` 
        });
      }

      // Mark as validated
      const now = new Date().toISOString();
      db.prepare("UPDATE tickets SET validated = 1, validated_at = ? WHERE id = ?").run(now, ticketId);

      res.json({ 
        valid: true, 
        message: "ENTRADA VÁLIDA", 
        ticket: { name: ticket.name, event: ticket.event } 
      });

    } catch (err) {
      return res.json({ valid: false, message: "ENTRADA INVÁLIDA: QR corrupto o falsificado." });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
