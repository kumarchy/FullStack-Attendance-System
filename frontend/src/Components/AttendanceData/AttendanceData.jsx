import React, { useContext} from "react";
import "./AttendanceData.css";

import { StoreContext } from "../../context/StoreContext";

const AttendanceData = () => {
  const {data}= useContext(StoreContext);

  return (
    <div className="attendance-data-container">
      <div className="table-container">
        <thead className="table-heading">
          <tr>
            <th>Name</th>
            {/* <th>Roll Number</th> */}
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="table-data">
          {data.map((student, index)=>(
            <tr key={index} className="table-row-data">
            <td>{student.name}</td>
            {/* <td>{student.roll_number}</td> */}
            <td>{student.status}</td>
          </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
};

export default AttendanceData;
