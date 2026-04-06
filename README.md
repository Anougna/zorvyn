# Zorvyn | Architectural Finance Dashboard

## Overview
Zorvyn is a high-end financial dashboard designed with an architectural aesthetic. It provides users with a comprehensive view of their financial health through summary metrics, interactive visualizations, and a detailed transaction ledger.

## Features
- **Portfolio Overview**: Real-time summary of total liquidity, monthly income, and fixed expenses.
- **Visual Analytics**: 
  - **Balance Structural Trend**: Area chart showing balance fluctuations over time.
  - **Asset Cipher**: Pie chart breakdown of spending by category.
- **Sovereign Ledger**: A detailed transaction table with search, filtering (Income/Expense), and sorting capabilities.
- **Role-Based Access Control (RBAC)**:
  - **Viewer**: Read-only access to all data.
  - **Admin**: Full access to add and delete transactions.
- **Strategic Insights**: AI-driven observations on savings velocity, peak resource allocation, and monthly deltas.
- **Customization**:
  - **Dark/Light Mode**: Toggle between architectural dark and clean light themes.
  - **Data Persistence**: All changes are saved to local storage.
  - **Export**: Export the ledger as a JSON file for external auditing.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd zorvyn
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

> [!NOTE]
> The `npm run dev` script is configured to automatically run both the React/Vite development server (port 3000) and the JSON-Server mock backend API (port 5000) simultaneously. Open [http://localhost:3000](http://localhost:3000) to view the application.

5. Use the sidebar to navigate between different views (Portfolio, Ledger, Analytics, Vault, Settings).
6. Use the role toggle in the sidebar to switch between Viewer and Admin modes.
