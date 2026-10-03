 🌐 BookSim2-NoC-Implementation
```

---

## 📖 Overview

**BookSim2-NoC-Implementation** is a Network-on-Chip (NoC) implementation, simulation, and analysis project built around **BookSim 2**, a cycle-accurate interconnection-network simulator.

The project focuses on understanding how different NoC architectures, routing algorithms, traffic patterns, and network configurations affect overall network performance.

### Key Areas

- NoC topology exploration
- Routing algorithm implementation
- Virtual-channel configuration
- Traffic-pattern analysis
- Injection-rate sweeps
- Latency measurement
- Throughput measurement
- Saturation analysis
- Hop-count analysis
- Link-utilization analysis
- Congestion-aware routing
- Comparative topology evaluation
- Web-based visualization

---

# 🎯 Project Objectives

The project is organized into three major tasks.

---

## 1. Design-Space Exploration

The first task evaluates different NoC configurations to understand their impact on network performance.

### Topologies

- Mesh
- Torus
- Butterfly
- Fat Tree

### Network Sizes

- 4 × 4
- 6 × 6
- 8 × 8

### Virtual Channels

- 1 VC
- 2 VCs
- 4 VCs
- 8 VCs

### Traffic Patterns

- Uniform
- Transpose
- Bit Complement
- Bit Reverse
- Hotspot

### Performance Metrics

- Average packet latency
- Throughput
- Injection rate
- Saturation throughput
- Average hop count
- Link utilization

### Generated Graphs

- Latency vs. Injection Rate
- Throughput vs. Injection Rate

### Design-Space Exploration Flow

```text
                    ┌─────────────────────┐
                    │   Select Topology   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Select Network Size │
                    │   4×4 / 6×6 / 8×8  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Select Virtual      │
                    │ Channels            │
                    │   1 / 2 / 4 / 8     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Select Traffic      │
                    │ Pattern             │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Sweep Injection     │
                    │ Rate                │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Run BookSim 2       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Collect Simulation  │
                    │ Results             │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Generate Graphs     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Analyze Performance │
                    └─────────────────────┘
````

---

 # 2\. 🎯 Target NoC Topology

 The second task focuses on implementing and evaluating a selected target topology.

 The target topology is compared against an equivalent **Mesh** configuration.

 To maintain a meaningful comparison, the experiments use equivalent parameters wherever applicable:

 - Same node count
- Same packet/flit configuration
- Same virtual-channel configuration
- Same traffic patterns
- Same injection-rate range

 ### Analysis Parameters

 The target topology is analyzed using:

 - Network connectivity
- Average hop count
- Path diversity
- Link utilization
- Packet latency
- Network throughput
- Saturation behavior

 ### Topology Comparison Flow

```
                 ┌────────────────────────┐
                 │    Target Topology     │
                 └────────────┬───────────┘
                              │
                              │
                              ▼
                 ┌────────────────────────┐
                 │ Configure Equivalent   │
                 │ Network Parameters     │
                 └────────────┬───────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │      Run BookSim 2     │
                 └────────────┬───────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │ Collect Performance    │
                 │ Metrics                │
                 └────────────┬───────────┘
                              │
                              │
                              ▼
          ┌───────────────────┴───────────────────┐
          │                                       │
          ▼                                       ▼
┌──────────────────────┐              ┌──────────────────────┐
│ Target Topology      │              │ Equivalent Mesh     │
│ Results              │              │ Results              │
└──────────┬───────────┘              └──────────┬───────────┘
           │                                     │
           └────────────────┬────────────────────┘
                            ▼
                 ┌────────────────────────┐
                 │ Compare Performance    │
                 │                      │
                 │ • Latency             │
                 │ • Throughput           │
                 │ • Hop Count            │
                 │ • Link Utilization     │
                 │ • Saturation           │
                 └────────────────────────┘
```

---

 # 3\. 🧠 CAMAR Routing

 The project implements:

 > **CAMAR — Credit-Aware Minimal Adaptive Routing**

 CAMAR is designed to select valid minimal paths while considering local congestion and credit information.

 Instead of blindly selecting one minimal direction, the routing logic evaluates available minimal candidates and uses local network information to make the routing decision.

 ### CAMAR Routing Concept

```
                         ┌───────────────┐
                         │     Router    │
                         └───────┬───────┘
                                 │
                                 ▼
                  ┌──────────────────────────┐
                  │ Determine Destination    │
                  │ and Current Position     │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ Generate Minimal         │
                  │ Candidate Paths          │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ Check Output Ports       │
                  │ and Credit Availability  │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ Evaluate Local           │
                  │ Congestion               │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ Select Valid Minimal      │
                  │ Candidate                │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ Forward Flit / Packet    │
                  └──────────────────────────┘
```

 ### CAMAR Decision Process

```
              Generate Minimal Routes
                       │
                       ▼
              ┌─────────────────┐
              │ Valid Candidate?│
              └───────┬─────────┘
                      │
             ┌────────┴────────┐
             │                 │
            NO                YES
             │                 │
             ▼                 ▼
      Remove Candidate    Check Credits
                               │
                               ▼
                      Check Congestion
                               │
                               ▼
                     Select Candidate
                               │
                               ▼
                        Forward Flit
```

 The primary objective is to maintain **minimal routing** while using local network-state information to improve routing decisions under congestion.

---

 # 🏗️ System Architecture

 The project consists of multiple layers that work together to provide simulation, visualization, and analysis.

```
┌────────────────────────────────────────────────────────┐
│                    WEB APPLICATION                     │
│                                                        │
│             Next.js + React + TypeScript               │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Topology     │  │ Simulation   │  │ Results     │ │
│  │ Visualization│  │ Interface    │  │ Dashboard   │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 VISUALIZATION LAYER                    │
│                                                        │
│        Charts • Graphs • Topology • Metrics            │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    BOOKSIM 2                            │
│                                                        │
│               Cycle-Accurate Simulation                │
│                                                        │
│   ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│   │Topology  │  │ Routing  │  │ Traffic Pattern    │  │
│   └──────────┘  └──────────┘  └────────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 EXPERIMENTAL RESULTS                   │
│                                                        │
│  Latency • Throughput • Saturation • Hop Count         │
│  Link Utilization • Injection Rate                     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    DATA ANALYSIS                        │
│                                                        │
│                Python + Pandas + Matplotlib            │
└────────────────────────────────────────────────────────┘
```

---

 # 🛠️ Technology Stack

 ## Web Application

 - Next.js
- React
- TypeScript
- Tailwind CSS
- SVG

 ## Network Simulation

 - C++
- BookSim 2

 ## Data Analysis

 - Python
- Pandas
- Matplotlib

---

 # 📂 Repository Structure

```
BookSim2-NoC-Implementation/
│
├── app/
│   └── Next.js application routes
│
├── components/
│   └── Reusable React components
│
├── lib/
│   └── Utilities and application logic
│
├── public/
│   └── Static assets
│
├── package.json
│   └── Node.js dependencies and scripts
│
├── next.config.mjs
│   └── Next.js configuration
│
├── tsconfig.json
│   └── TypeScript configuration
│
└── README.md
    └── Project documentation
```

 > BookSim 2 is maintained separately from the web application and should be cloned independently for native cycle-accurate experiments.

---

 # 🚀 Getting Started

 ## Prerequisites

 Make sure the following tools are installed:

 - Node.js
- npm
- C++ compiler
- GNU Make
- Python 3.x
- Git

---

 # 💻 Run the Web Application

 Clone the repository:

```
git clone https://github.com/Semaphore007/BookSim2-NoC-Implementation.git
```

 Navigate into the project:

```
cd BookSim2-NoC-Implementation
```

 Install dependencies:

```
npm install
```

 Start the development server:

```
npm run dev
```

 Open the application:

```
http://localhost:3000
```

---

 # 🔬 BookSim 2 Setup

 Clone the BookSim 2 repository:

```
git clone https://github.com/booksim/booksim2.git
```

 Navigate into the BookSim directory:

```
cd booksim2
```

 Build BookSim:

```
make
```

 Run a configuration:

```
./booksim [configfile]
```

 For example:

```
./booksim examples/torus88
```

---

 # ⚙️ Example BookSim Configuration

 A basic Torus configuration can be represented as:

```
topology = torus;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
traffic = uniform;
injection_rate = 0.15;
```

 The configuration should be adjusted according to:

 - Selected topology
- Network size
- Routing algorithm
- Number of virtual channels
- Traffic pattern
- Injection rate
- Experiment requirements

---

 # 🧪 Experimental Workflow

 All experiments follow a structured process.

```
                    ┌──────────────────────┐
                    │  Configure Network   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Select Topology     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Select Routing      │
                    │  Algorithm           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Select Traffic      │
                    │  Pattern             │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Set Virtual         │
                    │  Channels            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Sweep Injection Rate │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Run BookSim 2      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Collect Results      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Process Data         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Generate Graphs      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Analyze Performance  │
                    └──────────────────────┘
```

---

 # 🔄 Complete Experiment Pipeline

 The complete project workflow can be summarized as:

```
                         START
                           │
                           ▼
              ┌────────────────────────┐
              │ Define Experiment      │
              │ Parameters             │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Select NoC Topology    │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Configure Network Size │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Configure VCs          │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Select Traffic Pattern │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Select Routing         │
              │ Algorithm              │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Sweep Injection Rate   │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Run BookSim Simulation │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Collect Metrics        │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Analyze Results        │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Generate Visualizations│
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Compare Configurations │
              └───────────┬────────────┘
                          │
                          ▼
                         END
```

---

 # 📊 Performance Metrics

 | Metric | Description |
| --- | --- |
| **Latency** | Average delay experienced by packets in the network |
| **Throughput** | Amount of traffic successfully delivered by the network |
| **Injection Rate** | Offered traffic load injected into the network |
| **Saturation** | Region where increasing offered load produces limited additional throughput |
| **Hop Count** | Average number of router-to-router hops taken by packets |
| **Link Utilization** | Degree to which network links are being used |

---

 # 📈 Performance Analysis

 The experiments investigate how network performance changes with:

 - Different topologies
- Different network sizes
- Different virtual-channel counts
- Different traffic distributions
- Increasing injection rates
- Different routing algorithms
- Increasing network congestion

 The general relationship between offered traffic and network performance can be represented as:

```
                  Injection Rate
                        │
                        ▼
                  Network Load
                        │
                        ▼
                    Congestion
                        │
                        ▼
                  Queue Growth
                        │
                        ▼
                 Latency Increase
                        │
                        ▼
                    Saturation
                        │
                        ▼
              Limited Throughput Gain
```

---

 # 📉 Latency Analysis

 Latency is evaluated as a function of injection rate.

```
Latency
  │
  │                         /
  │                       /
  │                    __/
  │                 __/
  │              __/
  │           __/
  │__________/
  │
  └──────────────────────────────►
             Injection Rate
```

 At low injection rates, packets generally experience lower congestion.

 As injection rate increases, network contention can increase, resulting in higher packet latency.

 > The graph above is a conceptual illustration only and does not represent measured experimental data.

---

 # 📈 Throughput Analysis

 Throughput is evaluated as the amount of traffic successfully delivered as the injection rate increases.

```
Throughput
  │
  │                 ─────────────
  │             ___/
  │          __/
  │       __/
  │    __/
  │___/
  │
  └──────────────────────────────►
             Injection Rate
```

 The point at which additional offered traffic produces limited throughput improvement is associated with network saturation.

 > The graph above is a conceptual illustration only and does not represent measured experimental data.

---

 # 🔍 Topology Analysis

 Different topologies provide different network characteristics.

 The analysis considers:

```
                 ┌─────────────────┐
                 │    Topology     │
                 └────────┬────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
     Connectivity      Hop Count     Path Diversity
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                  Link Utilization
                          │
                          ▼
                     Congestion
                          │
                          ▼
                    Performance
```

---

 # 🧩 Traffic Pattern Analysis

 The project evaluates multiple traffic patterns:

```
Traffic Patterns
       │
       ├── Uniform
       │
       ├── Transpose
       │
       ├── Bit Complement
       │
       ├── Bit Reverse
       │
       └── Hotspot
```

 Each traffic pattern creates a different distribution of network traffic and can therefore expose different congestion and routing behaviors.

---

 # 🧠 Routing Comparison

 Routing algorithms can be evaluated using:

```
                   Routing Algorithm
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       Deterministic                 Adaptive
          Routing                     Routing
             │                           │
             │                           ▼
             │                  Congestion Information
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    Network Behavior
                           │
                           ▼
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Latency      Throughput    Saturation
```

---

 # ⚠️ Experimental Integrity

 All final numerical results presented as experimental findings should come from **actual BookSim 2 simulations**.

 Demo or illustrative values used by the web interface are intended only for visualization and must **not** be presented as measured experimental results.

 The browser-based simulation and visualization components are intended for interaction and demonstration.

 **Native BookSim 2 is used for actual cycle-accurate experiments.**

---

 # 📚 Documentation & References

 ## Project Documentation

 **Project Manual**

 https://drive.google.com/file/d/12KcAQ8A6q4ta\_Nwh9v-WM4zJueScywSv/view?usp=sharing

 ## BookSim Resources

 ### BookSim 2 Repository

 https://github.com/booksim/booksim2

 ### BookSim 2 Manual

 https://github.com/booksim/booksim2/blob/master/doc/manual.tex

 ### Stanford BookSim

 https://nocs.stanford.edu/booksim.html

---

 # 👨‍💻 Author

 ## Siddharth Gautam

 **Computer Science & Engineering**

 - GitHub: https://github.com/Semaphore007
- LinkedIn: https://www.linkedin.com/in/siddharth-gautam-883539238/
- Telegram: https://t.me/TheOutlier\_2003

---
