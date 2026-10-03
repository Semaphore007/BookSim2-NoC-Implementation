🌐 BookSim2-NoC-Implementation
<h2 align="center">Network-on-Chip Implementation & Simulation using BookSim 2</h2> <p align="center"> A practical implementation and analysis project for exploring NoC topologies, routing algorithms, traffic patterns, congestion, latency, throughput, and saturation behavior. </p>
📖 Overview

BookSim2-NoC-Implementation is a Network-on-Chip (NoC) research and experimentation project built around BookSim 2, a cycle-accurate interconnection-network simulator.

The project combines:

NoC topology exploration

Routing algorithm implementation

Virtual-channel configuration

Traffic-pattern analysis

Injection-rate sweeps

Latency and throughput measurement

Saturation analysis

Congestion-aware routing

Comparative topology evaluation

Web-based visualization

The primary objective is to understand how different network architectures and routing strategies affect NoC performance under varying traffic conditions.

🎯 Project Objectives

The project is divided into three major tasks.

1. Design-Space Exploration

Evaluate the performance impact of different network configurations.

Topologies

Mesh

Torus

Butterfly

Fat Tree

Network Sizes

4 × 4

6 × 6

8 × 8

Virtual Channels

1 VC

2 VCs

4 VCs

8 VCs

Traffic Patterns

Uniform

Transpose

Bit Complement

Bit Reverse

Hotspot

Metrics

The experiments measure:

Average packet latency

Throughput

Injection rate

Saturation throughput

Hop count

Link utilization

Generated Plots

Latency vs. Injection Rate

Throughput vs. Injection Rate

2. Target NoC Topology

A selected target topology is implemented and evaluated against an equivalent Mesh configuration.

The comparison maintains equivalent experimental parameters wherever applicable:

Same node count

Same packet/flit configuration

Same number of virtual channels

Same traffic patterns

Same injection-rate range

The analysis focuses on:

Network connectivity

Average hop count

Path diversity

Link utilization

Latency

Throughput

Saturation behavior

3. CAMAR Routing

The project implements:

CAMAR — Credit-Aware Minimal Adaptive Routing

CAMAR selects among valid minimal paths while considering local congestion and credit availability.

The routing process can be summarized as:

                 ┌─────────────────────┐
                 │       Router        │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Generate Minimal    │
                 │ Candidate Paths     │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Check Credits /     │
                 │ Congestion          │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Select Candidate    │
                 │ Output Port         │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Forward Flit        │
                 └─────────────────────┘


The objective is to retain minimal routing while using local network-state information to make more adaptive routing decisions.

🏗️ System Architecture

The project consists of three primary layers:

┌───────────────────────────────────────────────┐
│                  Web Interface                │
│             Next.js + React + TS              │
└───────────────────────┬───────────────────────┘
                        │
                        ↓
┌───────────────────────────────────────────────┐
│              Visualization Layer              │
│       Charts • Topologies • Simulations       │
└───────────────────────┬───────────────────────┘
                        │
                        ↓
┌───────────────────────────────────────────────┐
│             BookSim 2 Simulation              │
│        C++ • Routing • Traffic • NoC          │
└───────────────────────┬───────────────────────┘
                        │
                        ↓
┌───────────────────────────────────────────────┐
│              Experimental Results             │
│       Latency • Throughput • Saturation       │
└───────────────────────────────────────────────┘

🛠️ Technology Stack
Web Application

Next.js

React

TypeScript

Tailwind CSS

SVG

Network Simulation

C++

BookSim 2

Data Analysis

Python

Pandas

Matplotlib

📂 Repository Structure
BookSim2-NoC-Implementation/
│
├── app/                    # Next.js application routes
├── components/             # Reusable React components
├── lib/                    # Utilities and application logic
├── public/                 # Static assets
│
├── package.json            # Node.js dependencies and scripts
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
│
└── README.md               # Project documentation


BookSim 2 is maintained separately from the web application and should be cloned independently for native cycle-accurate experiments.

🚀 Getting Started
Prerequisites

Make sure the following are installed:

Node.js

npm

C++ compiler

GNU Make

Python 3.x

Git

💻 Run the Web Application

Clone the repository:

git clone https://github.com/Semaphore007/BookSim2-NoC-Implementation.git
cd BookSim2-NoC-Implementation


Install dependencies:

npm install


Start the development server:

npm run dev


Open the application at:

http://localhost:3000

🔬 BookSim 2 Setup

Clone the BookSim 2 repository:

git clone https://github.com/booksim/booksim2.git
cd booksim2


Build BookSim:

make


Run a configuration:

./booksim [configfile]


For example:

./booksim examples/torus88

Official BookSim 2 Repository

https://github.com/booksim/booksim2

⚙️ Example BookSim Configuration

A basic Torus configuration can be represented as:

topology = torus;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
traffic = uniform;
injection_rate = 0.15;


The exact configuration should be adjusted according to the topology, routing algorithm, traffic pattern, and experiment being evaluated.

🧪 Experimental Methodology

Experiments follow a consistent workflow to ensure meaningful comparisons.

┌──────────────────────┐
│ Configure Network    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Select Topology      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Select Routing       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Select Traffic       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Sweep Injection Rate │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Run BookSim 2        │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Collect Results      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Generate Plots       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Analyze Performance  │
└──────────────────────┘

📊 Performance Metrics
Metric	Description
Latency	Average delay experienced by packets in the network
Throughput	Amount of traffic successfully delivered by the network
Injection Rate	Offered traffic load injected into the network
Saturation	Region where increasing offered load produces limited additional throughput
Hop Count	Average number of router-to-router hops taken by packets
Link Utilization	Degree to which network links are being used
📈 Expected Analysis

The experiments investigate how network performance changes with:

Different topologies

Increasing network size

Different virtual-channel counts

Different traffic distributions

Increasing injection rates

Different routing algorithms

Network congestion

The relationship between network load and performance is analyzed through:

Injection Rate
       ↓
Network Load
       ↓
Congestion
       ↓
Latency Increase
       ↓
Saturation

⚠️ Experimental Integrity

All final numerical results presented as experimental findings should be generated from actual BookSim 2 simulations.

Demo or illustrative values used by the web interface are intended only for visualization and must not be presented as measured experimental results.

The browser-based simulation and visualization components are designed for interaction and demonstration, while native BookSim 2 is used for cycle-accurate experimental evaluation.

📚 Documentation & References
Project Documentation

Project Manual

https://drive.google.com/file/d/12KcAQ8A6q4ta_Nwh9v-WM4zJueScywSv/view?usp=sharing

BookSim Resources

BookSim 2 Repository
https://github.com/booksim/booksim2

BookSim 2 Manual
https://github.com/booksim/booksim2/blob/master/doc/manual.tex

Stanford BookSim
https://nocs.stanford.edu/booksim.html

👨‍💻 Author
Siddharth Gautam

Computer Science & Engineering

GitHub: https://github.com/Semaphore007

LinkedIn: https://www.linkedin.com/in/siddharth-gautam-883539238/

Telegram: https://t.me/TheOutlier_2003

<p align="center">
🌐 Network-on-Chip Project

Implementation • Simulation • Analysis

Built for Multicore Systems Architecture

</p>
