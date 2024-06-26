import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { CustomerService } from "../service/CustomerService";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

function DocumentDetails() {
  const [file, setFile] = useState();
  const [documentName, setDocumentName] = useState();
  const [description, setDescription] = useState();
  const [clientName] = useState("shivani");
  const [uploadedBy, setLoginUser] = useState();

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick5 = () => {
    setChangeColor(!changeColor);
  };

  const handleClick2 = () => {
    setChangeColor2(!changeColor2);
  };

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
  }, []);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!documentName) {
      errors.documentName = "This Field is required. ";
      isValid = false;
    }

    if (!description) {
      errors.description = "This Field is required.";
      isValid = false;
    }

    if (!clientName) {
      errors.clientName = "This Field is required.";
      isValid = false;
    }
    if (!file) {
      errors.file = "This Field is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const customerService = new CustomerService();

  function handleChange(event) {
    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const selectedFile = event.target.files[0];

    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert("Only .docx files are allowed.");

      event.target.value = null;
    }
  }

  function document(event) {
    setDocumentName(event.target.value);
  }
  function Description(event) {
    setDescription(event.target.value);
  }

  const isFormIncomplete =
    !file || !documentName || !description || !clientName;

  function handleSubmit(event) {
    console.log(documentName, " ", description, " ", clientName);
    event.preventDefault();
    if (validateForm()) {
      console.log("Valid form submitted:", {
        documentName,
        description,
        clientName,
      });
    }

    try {
      setLoading(true);

      const url = `${process.env.REACT_APP_API_KEY}/document/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentName", documentName);
      formData.append("description", description);
      formData.append("clientName", clientName);
      formData.append("uploadedBy", uploadedBy);
      console.log(formData, "//////////////////////////////");

      axios.post(url, formData).then((res) => {
        console.log(res, ",/////////doc id//////");
        setLoading(false);

        customerService.docId = res.data;
        navigate("/documentReview/" + res.data.docId);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  function Cancel() {
    navigate("/dashboardMain");
  }

  return (
    <div>
      <div style={{ height: "auto",marginTop:'1rem',paddingBottom:'1rem' }}>
        <br />

        <Card
          style={{
            borderLeft: "8px solid #FFB600   ",
            backgroundColor: "#F3F3F3",
            borderRadius: "2px",
            width: "90vm",
            margin: "10px",
            height: "auto",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div class="grid">
              <div class="col-12 md:col-6 lg:col-3">
                <label for="lastname2" style={{ color: "black" }}>
                  Document Name
                </label>

                <br />
                <br />
                <InputText
                  style={{ width: "90%", height: "42px", borderRadius: "2px" }}
                  value={documentName}
                  placeholder="Document Name"
                  onChange={document}
                />

                {errors.documentName && (
                  <div style={{ color: "red" }}>{errors.documentName}</div>
                )}
              </div>
              <div class="col-12 md:col-6 lg:col-4">
                <label for="lastname2" style={{ color: "black" }}>
                  {" "}
                  Document Description
                </label>
                <br />
                <br />
                <InputTextarea
                  style={{ borderRadius: "2px", width: "90%" }}
                  value={description}
                  placeholder="Description"
                  onChange={Description}
                  rows={5}
                  cols={80}
                />
                {errors.description && (
                  <div style={{ color: "red" }}>{errors.description}</div>
                )}
              </div>
              <div class="col-12 md:col-6 lg:col-5">
                <Card
                  style={{
                    backgroundColor: "#FFECBD ",
                    width: "90%",

                    height: "200px",
                  }}
                >
                  <label style={{ color: "black" }}>Upload Document</label>
                  <br />
                  <br />

                  <div
                    style={{
                      border: "1.7px dotted  ",
                      backgroundColor: "#FFECBD ",
                      height: "100px",
                    }}
                  >
                    <input
                      style={{ padding: "2rem", marginLeft: "3%" }}
                      type="file"
                      accept=".doc,.docx,"
                      onChange={handleChange}
                    />

                    {errors.file && (
                      <div style={{ color: "red" }}>{errors.file}</div>
                    )}
                  </div>
                  <br />

                  <h6>Eligible Formats:DOCX Only</h6>
                </Card>
              </div>
              {/* <div class="col-12 md:col-6 lg:col-3">D</div> */}
            </div>

            {/* <div class="formgrid grid"> */}
            {/* <div class="field col-6">
                <label for="lastname2" style={{ color: "black" }}>Document Name</label>

                <br />
                <InputText
                  style={{ width: "70%", height: "40px", borderRadius: "2px" }}
                  value={documentName}
                  placeholder="Document Name"
                  onChange={document}
                />

                {errors.documentName && (
                  <div style={{ color: "red" }}>{errors.documentName}</div>
                )}
              </div> */}

            {/* <div class="field col-6">
                <label style={{ color: "black" }}>Upload Document</label>
                <Card
                  style={{
                    backgroundColor: "#D4EBE9 ",
                    width: "75%",
                    borderRadius: "2px",
                    height: "80%",
                  }}
                >
                  <div
                    style={{
                      border: "1.7px dotted  ",
                      backgroundColor: "#D4EBE9 ",
                      borderRadius: "2px",
                    }}
                  >
                    <input
                      style={{ padding: "1.2rem", marginLeft: "3%" }}
                      type="file"
                      accept=".doc,.docx,.pdf"
                      onChange={handleChange}
                    />



                    {errors.file && (
                      <div style={{ color: "red" }}>{errors.file}</div>
                    )}
                  </div>

                  <h6>Eligible Formats:DOCX Only</h6>

                </Card>
              </div>
 */}

            {/* </div> */}

            {/* <div class="formgrid grid">


              <div class="field col-6">
                <label for="lastname2" style={{ color: "black" }}> Document Description</label>
                <br />
                <InputTextarea
                  style={{ borderRadius: "2px", width: "70%" }}
                  value={description}
                  placeholder="Description"
                  onChange={Description}
                  rows={4}
                  cols={40}
                />
                {errors.description && (
                  <div style={{ color: "red" }}>{errors.description}</div>
                )}
              </div>


            </div> */}
          </form>
        </Card>
        <span>
          {loading ? (
            <span className="loading">
              <ProgressSpinner />
            </span>
          ) : null}

        <br />

          <div style={{ display: "flex",marginBottom:'1rem' }}>
            <Button
              label="Next"
              style={{
                marginLeft: "80%",
                color: "#D04A02",
                borderRadius: "1px",
                width:'auto',
                backgroundColor:'#D04A02',
                color:'white'
              }}
              onMouseDown={handleClick5}
              disabled={isFormIncomplete}
              onClick={handleSubmit}
              className=" p-button-sm p-button-rounded p-button-danger p-button-outlined"
              // className={`text-black p-button-sm  ${changeColor === true ? "#D04A02 text-white" : "bg-white"
              //   }`}
            />
            &nbsp; &nbsp;
            <Button
              label="Cancel"
              style={{
                width:'auto',
                color: "#D04A02",
                borderRadius: "1px",
                marginRight: "2%",
                
              }}
              onMouseDown={handleClick2}
              onClick={Cancel}
              className="p-button-sm p-button-rounded p-button-danger p-button-outlined"

              // className={`text-black p-button-sm  ${changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
              //   }`}
            />
          </div>
        </span>
      </div>
    </div>
  );
}

export default DocumentDetails;
