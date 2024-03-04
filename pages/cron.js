import React, { useState,useEffect } from "react";
import axios from "axios";

const CronLogsPage = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("/api/cron-logs");
      setLogs(response.data.cronlogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const triggerCron = async () => {
    try {
      await axios.get("/api/cron");
      console.log("Cron job triggered successfully.");
    } catch (error) {
      console.error("Error triggering cron job:", error);
    }
  };
  useEffect(() => {
    fetchLogs(); // Fetch logs initially
    const intervalId = setInterval(fetchLogs, 2000); // Fetch logs every 2 seconds

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures useEffect runs only once


  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Cron Logs</h1>
      <div className="flex mb-4">
        <button
          className="px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={fetchLogs}
        >
          Fetch Logs
        </button>
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={triggerCron}
        >
          Trigger Cron Job
        </button>
      </div>
      <ul>
        {logs.map((log, index) => (
          <li
            key={index}
            className="p-2 mb-2 border border-gray-300 rounded-md"
          >
            {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CronLogsPage;
