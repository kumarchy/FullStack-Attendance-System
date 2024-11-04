import React, { useContext } from 'react'
// import "./Upload.css";
import { StoreContext } from '../../context/StoreContext';

const Upload = () => {
  const {
    selectedFiles,
    setSelectedFiles,
    error,
    acceptedFileTypeString,
    fileInputRef,
    handleFileBtn,
    processFiles,
    handleUpload,
    SaveImageDB,
    showData,
  } = useContext(StoreContext);
  return (
    <div className="card">
    <div
      className="drag-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => processFiles(e)}
    >
      <span className="select">Drag and Drop the files</span>
      <p>or</p>
      <div className="db-btn">
        <button className="upload-btn" onClick={handleFileBtn}>
          Upload Files
        </button>
        <button
          className="upload-btn"
          // name="image"
          onClick={SaveImageDB}
        >
          Save
        </button>
      </div>
      <input
        type="file"
        name="image"
        accept={acceptedFileTypeString}
        id="file"
        ref={fileInputRef}
        onChange={processFiles}
        multiple
        hidden
      />
    </div>
    <div className={`container ${showData ? 'disableContainer' : ''}`}>
      {selectedFiles.length > 0 ? (
        selectedFiles.map((image, index) => (
          <div key={index} className="upload-img">
            <img src={image.url} alt={image.name} />
          </div>
        ))
      ) : (
        <p>No Files Uploaded Yet</p>
      )}
      <span className="delete" onClick={() => setSelectedFiles([])}>
        &times;
      </span>
    </div>

    {error && <p className="upload-error">{error}</p>}

    <button className="attendance-btn" onClick={handleUpload}>
      Take Attendance
    </button>
  </div>
  )
}

export default Upload;