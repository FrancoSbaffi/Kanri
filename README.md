# ⛩️ Kanri — University OS

> **Academic Operating System & High-Performance Study Hub**  
> Diseñado para estudiantes universitarios (UCABA - 2° Cuatrimestre 2026). Integra gestión curricular, resúmenes exhaustivos por clase, repasos espaciados con algoritmo SuperMemo (SM-2), y simuladores de examen alineados con las rúbricas y programas de cada cátedra.

---

## ✨ Características Principales

- 🏛️ **Gestión de Materias & Cátedras**:
  - *Administración de Negocios Digitales*
  - *Gestión del Talento Humano en la Industria Digital*
  - *Sistemas Digitales*
  - *Taller: Emprendedurismo en Innovación Digital*
- 📝 **Clases & Resúmenes Académicos**:
  - Resúmenes detallados de cada clase basados fielmente en el material y bibliografía de la cátedra.
  - Formato Markdown enriquecido, tablas comparativas, diagramas Mermaid y alertas conceptuales.
- 🧠 **Repasos Espaciados (Algoritmo SM-2)**:
  - Sistema de flashcards con curva de olvido adaptativa.
  - Calificación de retención (Fácil, Medio, Difícil / Fallo) con cálculo dinámico de factor de facilidad (EF) e intervalos.
- 🎯 **Simuladores de Examen & Banco de Preguntas**:
  - Pruebas diagnósticas y simulacros de examen (opción múltiple, desarrollo, rúbricas de cátedra) para cada materia y unidad.
- 📅 **Calendario Académico & Modo Presencial/Virtual**:
  - Detección y alertas automáticas de semanas con clases presenciales vs. virtuales.
- 🎨 **Diseño Moderno macOS / Linear**:
  - Interfaz minimalista oscura con paleta arquitectónica, micro-animaciones, tipografía Geist y soporte completo de atajos de teclado (`Cmd+K`).

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Base de Datos & ORM**: [Prisma](https://www.prisma.io/) con SQLite local (migrable a PostgreSQL / Supabase)
- **Componentes & UI**: Lucide Icons, Canvas Confetti, React Markdown, Remark GFM

---

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio
```bash
git clone https://github.com/FrancoSbaffi/Kanri.git
cd Kanri
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

### 4. Inicializar Base de Datos y Seed
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📂 Estructura del Proyecto

```
Kanri/
├── app/                  # Rutas y páginas de Next.js (App Router)
│   ├── calendar/         # Vista de calendario académico
│   ├── classes/          # Explorador de clases y resúmenes
│   ├── dashboard/        # Panel principal con métricas y accesos rápidos
│   ├── exams/            # Gestión de exámenes y fechas
│   ├── reviews/          # Repasos espaciados (SM-2 Active Recall)
│   ├── study/            # Centro de estudio y simulacros de examen
│   └── subjects/         # Detalle y unidades de cada materia
├── components/           # Componentes de UI reutilizables
├── lib/                  # Lógica de negocio, Prisma client y helpers
├── prisma/               # Esquema Prisma, base de datos SQLite y seeders
├── scripts/              # Pipelines de ingesta y sincronización de rúbricas
└── uploads/              # Materiales y bibliografía académica
```

---

## 📄 Licencia

MIT © 2026 Franco Sbaffi
