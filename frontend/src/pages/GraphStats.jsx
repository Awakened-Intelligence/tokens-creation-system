// src/components/GraphStats.jsx
import React, { useState, useEffect } from "react";
import { request, gql } from "graphql-request";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function GraphStats({ contractAddress }) {
  const [priceTrends, setPriceTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with your actual subgraph endpoint
  const endpoint = "https://api.thegraph.com/subgraphs/name/example/mytoken";

  // GraphQL query – update field names to match your subgraph schema
  const query = gql`
    query GetPriceTrends($address: String!) {
      priceTrends(where: { token: $address }, orderBy: timestamp, orderDirection: asc) {
        price
        timestamp
      }
    }
  `;

  useEffect(() => {
    async function fetchData() {
      try {
        const variables = { address: contractAddress.toLowerCase() };
        const data = await request(endpoint, query, variables);
        setPriceTrends(data.priceTrends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from subgraph:", error);
        setLoading(false);
      }
    }
    if (contractAddress) {
      fetchData();
    }
  }, [contractAddress]);

  // Prepare chart data – convert Unix timestamps to time strings
  const chartData = {
    labels: priceTrends.map((pt) =>
      new Date(pt.timestamp * 1000).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Token Price ($)",
        data: priceTrends.map((pt) => parseFloat(pt.price)),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Token Price Trend" },
    },
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-white mt-4">
      <h3 className="text-xl font-bold mb-2">Token Price Trend</h3>
      {loading ? (
        <p>Loading price trend...</p>
      ) : priceTrends.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No price data available.</p>
      )}
    </div>
  );
}

export default GraphStats;
