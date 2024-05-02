import React, { useState, useEffect, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import axios from "axios";
import { Button } from "primereact/button";
import Background from "../Assets/Background.png";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Splitter, SplitterPanel } from "primereact/splitter";
import document from "../Assets/document.png";

const TreeTableDemo = () => {
  const [nodes, setNodes] = useState([]);
  const [docView, setDocViewData] = useState([]);
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);
  const [notes, setNotes] = useState(null);
  const [notesid, SetNotesId] = useState("");
  const [secId, setSecId] = useState("");
  const toast = useRef(null);
  const [position, setPosition] = useState("center");
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [displayBasic4, setDisplayBasic4] = useState(false);
  const [displayBasic5, setDisplayBasic5] = useState(false);
  const [allnotes, setAllNotes] = useState([]);
  const [data, setData] = useState([]);
  const [docName, setDocName] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [createdBy, setLoginUser] = useState();
  const [userName, setUserName] = useState("");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setNotes(null);
    setChangeColor(!changeColor);
  };
  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    setUserName(sessionStorage.getItem("emailId"));

    setLoading(true);
    getAllNotes();
    AllNotes();
  }, []);
  function getAllNotes() {
    fetch(
      `${process.env.REACT_APP_API_KEY}/dam/notes/${sessionStorage.getItem(
        "emailId"
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      console.log("All tree-sections", res);
      res.json().then((resp) => {
        console.warn("resp", resp);
        setNodes(resp, secId);

        // setLoading(false);
      });
    });
  }

  const onRowClick = (event) => {
    console.log(event.node.secId, "jjjjjj");
    setIsClicked(true);

    setSecId(event.node.secId);

    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/getHtmlContains/${event.node.secId}`
      )
      .then((res) => {
        console.log("All tree-sections//", res.data.data);
        setDocViewData(res.data.data);
        setDocName(res.data.docName);
      });
  };

  const isFormIncomplete = !notes;
  function saveUser() {
    setNotes(null);
    let data = { secId, notes, createdBy, userName };
    console.log(data, "all data");
    fetch(`${process.env.REACT_APP_API_KEY}/dam/notes/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }).then(
      (result) => {
        if (result.status === 200) {
          console.warn("result...!!!", result);
          result.json().then((resp) => {
            console.warn("resp", resp);
          });

          AllNotes();
          getAllNotes();
          inputRef.current.value = "";

          toast.current.show({
            severity: "success",
            summary: "Note Added",
            detail: "Note Added Successfully",
            life: 2000,
          });
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Note Not Added",
            detail: "Error while Adding Note",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Note Not Added",
          detail: "Error while Adding Note",
          life: 2000,
        });
      }
    );
  }
  const dialogFuncMap = {
    displayBasic2: setDisplayBasic2,
    displayBasic4: setDisplayBasic4,
    displayBasic5: setDisplayBasic5,
  };

  const onClick = (name, position) => {
    AllNotes(position);
    getAllNotes(position);

    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onDelete = (name, value) => {
    SetNotesId(value.id);

    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onEdit = (name, value1) => {
    SetNotesId(value1.id);
    setNotes(value1.notes);
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    // AllNotes();
    dialogFuncMap[`${name}`](false);
  };

  const filterData = (allData) => {
    console.log(allData, "value");
    const emailId = sessionStorage.getItem("emailId");
    const filteredData = allData.filter((data) => data.createdBy === emailId);
    setAllNotes(filteredData);
  };

  function AllNotes() {
    // console.log(sectionId,"???????????????position")
    fetch(
      `${
        process.env.REACT_APP_API_KEY
      }/dam/notes/${secId}/${sessionStorage.getItem("emailId")}`
    )
      .then((res) => {
        console.log(res, "/////////AlllNotes");
        return res.json();
      })
      .then((resp) => {
        filterData(resp);
        console.log(resp[0].createdBy, "//notesid");

        setData(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function deleteNotes() {
    let item = {
      createdBy,
      userName,
    };
    console.warn("item", item);
    fetch(`${process.env.REACT_APP_API_KEY}/dam/notes/deleteById/${notesid}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(
      (result) => {
        if (result.status === 200) {
          console.warn("result...!!!", result);
          result.json().then((resp) => {
            console.warn("resp", resp);
          });
          AllNotes();
          getAllNotes();
          toast.current.show({
            severity: "success",
            summary: "Note Deleted",
            detail: "Note Deleted Successfully",
            life: 2000,
          });
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Note Not Deleted",
            detail: "Error while Deleting Note",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "warn",
          summary: "Note Not Deleted",
          detail: "Error while Deleting Note",
          life: 2000,
        });
      }
    );
  }

  //DELETE PARTICULAR NOTES

  const Delete = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />
        &nbsp;&nbsp;
        <Button
          label="Yes"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            backgroundColor: "#D04A02",
            borderRadius: "2px",
            color: "#FFF",
          }}
          onMouseDown={() => deleteNotes()}
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  // const Delete = (name) => {
  //   return (
  //     <div>
  //       <Button
  //         label="No"
  //         style={{ borderRadius: "2px", color: "#203570" }}
  //         onClick={() => onHide(name)}
  //         className="p-button-sm p-button-outlined"
  //       />
  //       &nbsp;&nbsp;
  //       <Button
  //         label="Yes"
  //         className="p-button-sm"
  //         style={{ backgroundColor: "#203570", borderRadius: "2px" }}
  //         onMouseDown={() => deleteNotes()}
  //         onClick={() => onHide(name)}
  //         autoFocus
  //       />
  //     </div>
  //   );
  // };

  const headerName = () => {
    return <>{docName}</>;
  };

  function update() {
    let item = {
      notes,
      createdBy,
      userName,
    };

    fetch(`${process.env.REACT_APP_API_KEY}/dam/notes/${notesid}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(
      (result) => {
        if (result.status === 200) {
          console.warn("result...!!!", result);
          result.json().then((resp) => {
            console.warn("resp", resp);
          });

          AllNotes();
          getAllNotes();
          setNotes(null);
          toast.current.show({
            severity: "success",
            summary: "Note Edited",
            detail: "Note Edited Successfully",
            life: 6000,
          });
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Note Not Edited",
            detail: "Error while Editing Note",
            life: 6000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Note Not Edited",
          detail: "Error while Editing Note",
          life: 6000,
        });
      }
    );
  }

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Cancel"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />

        <Button
          style={{
            float: "right",
            backgroundColor: "#D04A02",
            color: "#FFF",
            borderRadius: "2px",
          }}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          // className={`text-black p-button-sm  ${
          //   changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}
          label="Update"
          onMouseDown={() => update()}
          onMouseUp={handleClick1}
          onClick={() => onHide(name)}
          disabled={isFormIncomplete}
          autoFocus
        />
      </div>
    );
  };

  //   const serialNumberTemplate = (rowData) => {
  //     return nodes.indexOf(rowData) + 1;
  // };

  const serialNumberTemplate = (rowData) => {
    console.log(rowData, "?///////rowdata");
    const serialNumber = nodes.indexOf(rowData) + 1;
    return (
      <div>
        <div style={{ display: "flex" }}>
          {serialNumber}
          <div>) {rowData.notes}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Toast ref={toast} />
      {/* {loading ? (
            <span className="loading">
              <ProgressSpinner />
            </span>
          ) : null} */}

      {/* <Button
        style={{ backgroundColor: "white", color: "black", height: "35px" }}
        className="p-button-raised p-button p-button-secondary p-button-text"
        icon="pi pi-book"
      >
        &nbsp;&nbsp; <b>Notes</b>
      </Button>

      <img
        style={{ height: "53px", float: "right" }}
        src={Background}
        alt=" Background "
      />
      <br />
      <br /> */}

      <Card style={{ height: "70vh" }}>
        <div
          style={{ display: "flex" }}
          // className="p-button-text p-button-plain p-button"
        >
          <img
            style={{ width: "16px", marginRight: "10px", height: "20px" }}
            src={document}
            alt="  document  "
          />
          <b style={{ fontSize: "18px", marginTop: "2px" }}>Notes</b>
        </div>
        <br />
        <Splitter style={{ borderRadius: "2px" }}>
          <SplitterPanel size={2}>
            <TreeTable
              scrollable
              scrollHeight="60vh"
              value={nodes}
              onRowClick={(e) => onRowClick(e)}
            >
              <Column
                field="notes"
                // header=" Notes"
                // expander
                style={{
                  maxWidth: "210px",
                  minWidth: "2rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
                body={serialNumberTemplate}
              />
            </TreeTable>
          </SplitterPanel>

          <SplitterPanel style={{ marginLeft: "10px" }}>
            <ScrollPanel style={{ height: "60vh" }}>
              <Dialog
                header={headerName}
                visible={displayBasic2}
                style={{ width: "60vw", backgroundColor: "#F3F3F3" }}
                // footer={Footer('displayBasic2')}
                onHide={() => onHide("displayBasic2")}
              >
                <div class="grid">
                  <div class="col-12">
                    <Dialog
                      header="Delete Note?  "
                      visible={displayBasic4}
                      style={{ width: "27vw" }}
                      footer={Delete("displayBasic4", data)}
                      onHide={() => onHide("displayBasic4")}
                    >
                      <p>Are You Sure You Want to Delete Particular Notes ?</p>
                    </Dialog>

                    <Dialog
                      header="Edit Notes"
                      visible={displayBasic5}
                      style={{ width: "35vw" }}
                      footer={renderFooter("displayBasic5", data)}
                      onHide={() => onHide("displayBasic5")}
                    >
                      <InputTextarea
                        type="text "
                        value={notes !== null ? notes : ""}
                        onChange={(e) => {
                          setNotes(e.target.value);
                        }}
                        rows={8}
                        cols={52}
                      />
                    </Dialog>

                    <ScrollPanel style={{ width: "100%", height: "350px" }}>
                      {data.length > 0 ? (
                        <div value={allnotes}>
                          {allnotes.map((data) => (
                            <div key={data.id}>
                              <br />

                              <Card
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "2px",
                                }}
                              >
                                <div class="grid">
                                  <div class="col-10">
                                    <div style={{ fontSize: "14px" }}>
                                      {new Intl.DateTimeFormat("en-IN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }).format(data.createdOn)}
                                    </div>
                                  </div>
                                  <div class="col-2">
                                    <Button
                                      className=" p-button-text"
                                      style={{
                                        height: "20px",
                                        width: "20px",
                                        marginLeft: "50px",
                                        color: "black",
                                      }}
                                      icon="pi pi-pencil"
                                      onClick={() =>
                                        onEdit("displayBasic5", data)
                                      }
                                    />
                                    &nbsp;&nbsp;
                                    <Button
                                      style={{
                                        height: "20px",
                                        float: "right",
                                        width: "20px",
                                        color: "black",
                                      }}
                                      icon="pi pi-trash"
                                      onClick={() =>
                                        onDelete("displayBasic4", data)
                                      }
                                      className=" p-button-text"
                                    />
                                  </div>

                                  <div class="col-12">
                                    <p style={{ color: "black" }}>
                                      {data.notes}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </ScrollPanel>
                  </div>

                  <div class="col-12">
                    <div>
                      <div style={{ display: "flex" }}>
                        <InputText
                          style={{
                            width: "80%",
                            borderRadius: "2px",
                            border: "1px solid #D04A02",
                          }}
                          ref={inputRef}
                          // value={notes}
                          type="text "
                          placeholder="Add Notes here..."
                          onChange={(e) => {
                            setNotes(e.target.value);
                          }}
                        />

                        <Button
                          style={{
                            
                            backgroundColor: "#D04A02",
                            border: "1px solid #D04A02",
                            marginLeft: "4%",
                          }}
                          label="Add Notes"
                          disabled={isFormIncomplete}
                          onClick={saveUser}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div class="col-12">
                    <div>
                      <div style={{ display: "flex" }}>
                        <InputText
                          style={{
                            width: "100%",
                            borderRadius: "2px",
                            border: "1px solid blue",
                          }}
                          ref={inputRef}
                          // value={notes}
                          type="text "
                          placeholder="Add Notes here..."
                          onChange={(e) => {
                            setNotes(e.target.value);
                          }}
                        />

                        <Button
                          style={{ borderRadius: "2px" }}
                          icon="pi pi-send"
                          disabled={isFormIncomplete}
                          onClick={saveUser}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </Dialog>

              <div>
                {isClicked && (
                  <Button
                    label=" Notes"
                    style={{
                      float: "right",
                      borderRadius: "2px",
                      backgroundColor: "#D04A02",
                      marginTop: "2rem",
                      color: "#fff",
                    }}
                    className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
                    onClick={() => onClick("displayBasic2", secId)}
                  />
                )}
              </div>

              <span
                style={{ whiteSpace: "pre-line", marginLeft: "5rem" }}
                className="tocview"
                dangerouslySetInnerHTML={{ __html: docView }}
              />
            </ScrollPanel>
          </SplitterPanel>
        </Splitter>
      </Card>
    </div>
  );
};

export default TreeTableDemo;
