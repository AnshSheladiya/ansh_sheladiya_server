import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles

const PRIORITIES = [
  { value: 1, label: "High", color: "bg-red-500" },
  { value: 2, label: "Medium", color: "bg-yellow-500" },
  { value: 3, label: "Low", color: "bg-green-500" },
];

export default function ProjectIdeas() {
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({
    appName: "",
    topic: "",
    priority: 1,
    deadline: new Date(), // Initialize deadline with today's date
  });

  useEffect(() => {
    async function fetchProjectIdeas() {
      try {
        const response = await axios.get("/api/projectIdeas");
        setProjectIdeas(response.data.data);
      } catch (error) {
        console.error("Error fetching project ideas:", error);
      }
    }
    fetchProjectIdeas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIdea((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePriorityChange = async (ideaId, priority) => {
    try {
      await axios.patch(`/api/project/${ideaId}`, { priority });
      const updatedIdeas = projectIdeas.map((idea) =>
        idea._id === ideaId ? { ...idea, priority } : idea
      );
      setProjectIdeas(updatedIdeas);
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/project", newIdea);
      setNewIdea({ appName: "", topic: "", priority: 1, deadline: new Date() });
      window.location.reload(); // Refresh the page to reflect the newly added idea
    } catch (error) {
      console.error("Error adding project idea:", error);
    }
  };
  const handleRemove = async (ideaId) => {
    try {
      await axios.delete(`/api/project/${ideaId}`);
      const updatedIdeas = projectIdeas.filter((idea) => idea._id !== ideaId);
      setProjectIdeas(updatedIdeas);
    } catch (error) {
      console.error("Error removing project idea:", error);
    }
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Project Ideas</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="appName"
          value={newIdea.appName}
          onChange={handleInputChange}
          placeholder="App Name"
          required
          className="input-field"
        />
        <input
          type="text"
          name="topic"
          value={newIdea.topic}
          onChange={handleInputChange}
          placeholder="Topic"
          required
          className="input-field"
        />
        {/* <select
          name="priority"
          value={newIdea.priority}
          onChange={handleInputChange}
          className="input-field"
        >
          {PRIORITIES.map((priority) => (
            <option
              key={priority.value}
              value={priority.value}
              className={priority.color}
            >
              {priority.label}
            </option>
          ))}
        </select> */}
        {/* <DatePicker // Add date picker for selecting deadline
          selected={newIdea.deadline}
          onChange={(date) =>
            setNewIdea((prevState) => ({ ...prevState, date: date }))
          }
          className="input-field"
        /> */}
        <button type="submit" className="btn-add-idea">
          Add Idea
        </button>
      </form>
      <ul className="grid grid-cols-3 gap-4">
  {projectIdeas.map((idea, index) => (
    <li key={index} className="p-4 border rounded-lg">
      <div className="space-y-2">
        <p className="text-lg font-bold text-gray-900">
          App Name: {idea.appName}
        </p>
        <p className="text-gray-600">Topic: {idea.topic}</p>
        {/* {idea.priority && (
          <p
            className={`text-sm ${
              PRIORITIES.find((p) => p.value === idea.priority)?.color ||
              "text-gray-500"
            } inline-block px-2 py-1 rounded-md`}
          >
            Priority:{" "}
            {PRIORITIES.find((p) => p.value === idea.priority)?.label ||
              "Unknown"}
          </p>
        )}
        <p className="text-gray-600">
          Deadline: {new Date(idea.date).toLocaleDateString()}
        </p> */}
        <button
          onClick={() => handleRemove(idea._id)} // Call handleRemove function on click
          className="btn-remove-idea bg-red-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-red-600 focus:outline-none focus:bg-red-600"
        >
          Remove
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
