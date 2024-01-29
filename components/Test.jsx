  import React, { useState, useEffect } from "react";
  import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "./Firebase";

  const Test = () => {
    const [formData, setFormData] = useState({
      name: "",
      number: "",
      email: "",
      password: "",
    });

    const [formErrors, setFormErrors] = useState({
      name: "",
      number: "",
      email: "",
      password: "",
    });

    const [tableData, setTableData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const dataCollectionRef = collection(db, "users");

    useEffect(() => {
      // Load data from Firestore when the component mounts
      fetchData();
    }, []);

    const fetchData = async () => {
      const querySnapshot = await getDocs(dataCollectionRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setTableData(data);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    };

    const handleEdit = (index) => {
      setEditIndex(index);
      const { name, number, email, password } = tableData[index];
      setFormData({ name, number, email, password });
    };

    const handleRemove = async (id, index) => {
      await deleteDoc(doc(db, "users", id));
      const newData = [...tableData];
      newData.splice(index, 1);
      setTableData(newData);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const numberRegex = /^\d+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!numberRegex.test(formData.number)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          number: "Please enter a valid number.",
        }));
        return;
      }

      if (!emailRegex.test(formData.email)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
        return;
      }

      if (editIndex !== null) {
        // If editing, update the existing document in Firestore
        await updateDoc(doc(db, "users", tableData[editIndex].id), formData);
        const newData = [...tableData];
        newData[editIndex] = formData;
        setTableData(newData);
        setEditIndex(null);
      } else {
        // If not editing, add a new document to Firestore
        const docRef = await addDoc(dataCollectionRef, formData);
        setTableData((prevData) => [...prevData, { id: docRef.id, ...formData }]);
      }

      setFormData({
        name: "",
        number: "",
        email: "",
        password: "",
      });

      setFormErrors({
        name: "",
        number: "",
        email: "",
        password: "",
      });

      setEditIndex(null);
    };

    return (
      <div className="flex min-h-screen flex-col justify-center items-center">
        <form
          className="bg-green-400 p-3 w-[500px] flex flex-col gap-4 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <input
              className="outline-none p-2 rounded-lg"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <span className="text-red-500">{formErrors.name}</span>
          </div>
          <div className="flex flex-col">
            <input
              className="outline-none p-2 rounded-lg"
              type="text"
              name="number"
              placeholder="Number"
              value={formData.number}
              onChange={handleInputChange}
            />
            <span className="text-red-500">{formErrors.number}</span>
          </div>
          <div className="flex flex-col">
            <input
              className="outline-none p-2 rounded-lg"
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <span className="text-red-500">{formErrors.email}</span>
          </div>
          <div className="flex flex-col">
            <input
              className="outline-none p-2 rounded-lg"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <span className="text-red-500">{formErrors.password}</span>
          </div>
          <button
            className="bg-red-400 p-2 rounded-lg text-white font-semibold"
            type="submit"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </form>

        <table className="mt-4 max-w-2xl">
          <thead>
            <tr className=" py-3 px-3">
              <th>Name</th>
              <th>Number</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr
                key={data.id}
                className={`border  border-black ${
                  index % 2 === 0 ? "bg-gray-200" : "bg-white"
                }`}
              >
                <td>{data.name}</td>
                <td>{data.number}</td>
                <td>{data.email}</td>
                <td>{data.password}</td>
                <td>
                  <div className="flex gap-2 py-1">
                    <button
                      className="bg-yellow-400 p-2 rounded-lg text-white font-semibold"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-400 p-2 rounded-lg text-white font-semibold"
                      onClick={() => handleRemove(data.id, index)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default Test;
