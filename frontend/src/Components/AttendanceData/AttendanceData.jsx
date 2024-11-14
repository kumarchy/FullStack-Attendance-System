import React, { useContext } from "react";
import "./AttendanceData.css";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { StoreContext } from "../../context/StoreContext";

const AttendanceData = () => {
  const { data } = useContext(StoreContext);

  // Function to export data to Excel
  const exportToExcel = () => {
    const filteredData = data.map(({ _id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredData); 
    const currentDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    const workbook = { Sheets: { [`Attendance Data_${currentDate}`]: worksheet }, SheetNames: [`Attendance Data_${currentDate}`] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Create Blob for file download
    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, `Attendance_Data_${currentDate}${fileExtension}`);

  };

  return (
    <div className="attendance-data-container">
      <div className="table-container">
        <thead className="table-heading">
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="table-data">
          {data.map((student, index) => (
            <tr key={index} className="table-row-data">
              <td>{student.name}</td>
              <td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </div>
      <div className="download-btn">
      <button onClick={exportToExcel}>
        Download
      </button>
      </div>
    </div>
  );
};

export default AttendanceData;
