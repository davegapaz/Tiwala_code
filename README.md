# 🌱 Tiwala Hackathon Project  

Tiwala is a **Community Trust Scoring App** that combines a **Next.js frontend** and an **ML-powered Python backend**.  
It leverages **Neo4j graph data** to model trust and referrals within a community.  

This repository contains:  
- **`my-app/`** — Next.js frontend for the Tiwala Community Trust App  
- **`ml-api/`** — Python backend for ML-powered Tiwala scoring  

---

## 🚀 1. Frontend (`my-app/` — Next.js)  

### Setup  
1. Install dependencies:  
   ```sh
   npm install
   ```  
2. Start the development server:  
   ```sh
   npm run dev
   ```  
3. Open the app at **http://localhost:3000**  

### 🔗 Neo4j Connection  
- The frontend connects to a Neo4j database for community graph data.  
- To update the Neo4j **password**, edit:  
  - `src/app/api/neo4j/route.js`  
  - Look for the `neo4j-driver` usage:  
    ```js
    const driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'YOUR_PASSWORD')
    );
    ```  
  - Replace `'YOUR_PASSWORD'` with your actual password.  

---

## 🤖 2. Backend (`ml-api/` — Python ML API)  

### Setup  
1. Install Python dependencies:  
   ```sh
   pip install -r requirements.txt
   ```  
2. Run the API server:  
   ```sh
   python api.py
   ```  
   or  
   ```sh
   py api.py
   ```  

### 🔗 Neo4j Connection  
- If the ML API connects to Neo4j, update the password in `tiwala_model.py` or `api.py`:  
  ```python
  driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "YOUR_PASSWORD"))
  ```  
- Replace `'YOUR_PASSWORD'` with your actual Neo4j password.  

---

## 📊 3. Dataset  

- The dataset file **`sample_dataSet.txt`** is included in the repository root.  
- It is used for both **training** and **testing**.  

---

## 🗄 4. Setting up Neo4j  

1. [Download Neo4j Community Edition](https://neo4j.com/download/)  
2. Install and run Neo4j Desktop or start the server:  
   ```sh
   neo4j start
   ```  
3. Access Neo4j Browser at **http://localhost:7474**  
4. Change the default password on first login.  
5. Import your dataset using the Neo4j Browser or Cypher scripts.  

---

## 📝 5. Notes  

- Always **secure your Neo4j password** and keep it updated in all relevant files.  
- For troubleshooting, check logs in both `my-app/` and `ml-api/`.  

---

## 📂 6. Folder Structure  

```
Tiwala_code/
├── my-app/              # Next.js frontend
├── ml-api/              # Python ML backend
└── sample_dataSet.txt   # Main dataset file
```  

---

## 📬 7. Contact  

For questions, reach out to the project owner or check code comments for guidance.  
