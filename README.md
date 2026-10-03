```markdown
# 🌐 BookSim2-NoC-Implementation

<p align="center">
  <img src="https://img.shields.io/badge/NoC-Network--on--Chip-00D9FF?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/BookSim-2.0-1677FF?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/C%2B%2B-Implementation-00599C?style=for-the-badge&logo=cplusplus&logoColor=white"/>
  <img src="https://img.shields.io/badge/Next.js-Web-000000?style=for-the-badge&logo=next.js"/>
</p>

<h2 align="center">Network-on-Chip Implementation & Simulation using BookSim 2</h2>

<p align="center">
A practical project for exploring NoC topologies, routing algorithms,
traffic patterns, congestion, latency, throughput, and saturation.
</p>

---

## 📌 Overview

This project studies **Network-on-Chip (NoC)** architectures using **BookSim 2**, a cycle-accurate interconnection-network simulator.

The project covers:

- NoC topology exploration
- Routing algorithms
- Virtual channels
- Traffic patterns
- Injection-rate sweeps
- Latency and throughput analysis
- Saturation behavior
- Target topology comparison
- Congestion-aware routing

---

## 🎯 Project Tasks

### Task 1 — Design-Space Exploration

Evaluate:

- **Topologies:** Mesh, Torus, Butterfly, Fat Tree
- **Sizes:** 4×4, 6×6, 8×8
- **VCs:** 1, 2, 4, 8
- **Traffic:** Uniform, Transpose, Bit Complement, Bit Reverse, Hotspot

Measure:

- Average packet latency
- Throughput
- Injection rate
- Saturation throughput

Generate:

- Latency vs Injection Rate
- Throughput vs Injection Rate

### Task 2 — Target NoC Topology

Implement and evaluate a selected target topology and compare it with an equivalent Mesh using the same:

- Node count
- Packet/flit configuration
- VC configuration
- Traffic patterns
- Injection-rate range

Analyze connectivity, hop count, path diversity, and link utilization.

### Task 3 — CAMAR Routing

Implement:

**CAMAR — Credit-Aware Minimal Adaptive Routing**

CAMAR selects valid minimal paths while considering local congestion/credit information.

```text
Router
  ↓
Generate Minimal Candidates
  ↓
Check Credit / Congestion
  ↓
Select Candidate
  ↓
Forward Flit
```

---

## 🛠️ Technology Stack

**Website**
- Next.js
- React
- TypeScript
- Tailwind CSS
- SVG

**Simulation**
- C++
- BookSim 2

**Analysis**
- Python
- Pandas
- Matplotlib

---

## 📂 Repository Structure

```text
BookSim2-NoC-Implementation/
├── app/
├── components/
├── lib/
├── public/
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
```

---

## ⚙️ Run the Website

```bash
git clone https://github.com/Semaphore007/BookSim2-NoC-Implementation.git
cd BookSim2-NoC-Implementation
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔬 Run BookSim 2

Clone the official simulator:

```bash
git clone https://github.com/booksim/booksim2.git
cd booksim2
make
```

Run a configuration:

```bash
./booksim [configfile]
```

Example:

```bash
./booksim examples/torus88
```

Official repository:

https://github.com/booksim/booksim2

---

## ⚙️ Example Configuration

```text
topology = torus;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
traffic = uniform;
injection_rate = 0.15;
```

---

## 📊 Performance Metrics

| Metric | Description |
|---|---|
| Latency | Average packet delivery delay |
| Throughput | Successfully delivered traffic |
| Injection Rate | Offered network load |
| Saturation | Point where additional load provides limited throughput improvement |
| Hop Count | Average number of router hops |
| Link Utilization | Network link usage |

---

## 📈 Experimental Workflow

```text
Configure Network
      ↓
Select Topology
      ↓
Select Traffic Pattern
      ↓
Sweep Injection Rate
      ↓
Run BookSim
      ↓
Collect Results
      ↓
Generate Graphs
      ↓
Analyze Performance
```

---

## ⚠️ Experimental Integrity

All final numerical results should come from **actual BookSim simulations**.

Any demo values used in the website are for visualization only and must not be presented as experimental measurements.

The browser simulation is a visualization tool; native BookSim is used for actual cycle-accurate experiments.

---

## 📖 Documentation

📘 **[Project Manual](https://drive.google.com/file/d/12KcAQ8A6q4ta_Nwh9v-WM4zJueScywSv/view?usp=sharing)**

Useful resources:

- [BookSim 2](https://github.com/booksim/booksim2)
- [BookSim Manual](https://github.com/booksim/booksim2/blob/master/doc/manual.tex)
- [Stanford BookSim](https://nocs.stanford.edu/booksim.html)

---

## 👨‍💻 Author

### Siddharth Gautam

**Computer Science & Engineering**

- GitHub: https://github.com/Semaphore007
- LinkedIn: https://www.linkedin.com/in/siddharth-gautam-883539238/
- Telegram: https://t.me/TheOutlier_2003

---

<p align="center">

### 🌐 Network-on-Chip Project

**Implementation • Simulation • Analysis**

Built for **Multicore Systems Architecture**

</p>
```
