import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import { Toast } from "primereact/toast";
import User from "../Assets/User.png";
import Background from "../Assets/Background.png";
import { NavLink } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { Ripple } from "primereact/ripple";

function Product() {
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [empId, setEmpId] = useState("");
  const [errors, setErrors] = useState({});
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);
  const cities = [{ name: "Admin" }, { name: "Viewer" }, { name: "Reviewer" }];
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayBasic3, setDisplayBasic3] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [status, setStatus] = useState("");
  const [isLocked, setisLocked] = useState("");

  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [displayBasic4, setDisplayBasic4] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState();
  const [locked, setLocked] = useState();
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState([]);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [createdBy, setLoginUser] = useState();
  const [userLoginName, setLoginName] = useState();
  const [trigger, setTrigger] = useState(Boolean);
  const [data, setData] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState(0);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [rows1, setRows1] = useState(6);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );
  const [encryptedItem, setEncryptedObjectItem] = useState({
    userLoginName: "",
  });

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    setLoginName(sessionStorage.getItem("emailId"));

    if (sessionStorage.getItem("trigger")) {
      setTrigger(true);
    } else {
      setTrigger(false);
    }
  }, []);

  const DOC_FILE_URL = `${process.env.REACT_APP_API_KEY}/dam/user/userTemplate `;

  const handleClick = () => {
    setChangeColor(!changeColor);
  };
  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };

  const IsValidate = () => {
    let isProceed = true;
    let errors = {};

    if (!userName) {
      errors.userName = "Please enter the userName";
      isProceed = false;
    } else if (!/^[a-zA-Z ]+$/.test(userName)) {
      errors.userName = "Please enter a valid Alphabet for userName";
      isProceed = false;
    }

    if (!status) {
      errors.status = "Please select the status";
      isProceed = false;
    }

    if (!emailId) {
      errors.emailId = "Please enter the emailId";
      isProceed = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$/.test(
        emailId
      )
    ) {
      errors.emailId = "Please enter a valid email";
      isProceed = false;
    }

    if (!userRole) {
      errors.userRole = "Please select the userRole";
      isProceed = false;
    }

    setFormErrors(errors);

    if (!isProceed) {
      toast.warning("Please fill in all the required fields.");
    }

    return isProceed;
  };

  const isFormIncomplete = !userName || !emailId || !status || !userRole;

  const onSubmit = (e) => {
    e.preventDefault();

    if (e.isValidEmail) {
    } else if (e.isValid) {
      console.log("Invalid form input");
    } else if (e.isValidUser) {
    }
  };

  function saveUser() {
    if (IsValidate()) {
      let item = {
        userName,
        emailId,
        empId,
        status,
        userRole,
        createdBy,
        locked,
        userLoginName,
      };
      console.warn("item", item);

      //id encrypt
      const cIter = 1000;
      const kSize = 128;
      const kSeparator = "::";
      const val1 = "abcd65443A";
      const val2 = "AbCd124_09876";
      const val3 = "sa2@3456s";

      const jsonString2 = JSON.stringify(id);
      console.log(jsonString2, "jsonString");
      const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
        CryptoJS.enc.Hex
      );
      const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
        CryptoJS.enc.Hex
      );
      const passPhrase = "anemoi";
      const key = CryptoJS.PBKDF2(
        `${val1}${val2}${val3}`,
        CryptoJS.enc.Hex.parse(salt),
        { keySize: kSize / 32, iterations: cIter }
      );

      console.log("key", key);
      let cText = CryptoJS.AES.encrypt(jsonString2, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      let aesText =
        iv +
        kSeparator +
        salt +
        kSeparator +
        cText.ciphertext.toString(CryptoJS.enc.Base64);
      let aesFinalTextputId = btoa(aesText);
      console.log("aesFinalText2   put id", aesFinalTextputId);

      //item encrypt
      const jsonString1 = JSON.stringify(item);
      console.log('jsonString1 put ',jsonString1);
      let cText1 = CryptoJS.AES.encrypt(jsonString1, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      let aesText1 =
        iv +
        kSeparator +
        salt +
        kSeparator +
        cText1.ciphertext.toString(CryptoJS.enc.Base64);
      let aesFinalTextItemput = btoa(aesText1);

      // setEncryptedObjectItem({userLoginName:aesFinalTextItem});
      console.log("aesFinalText put Item", aesFinalTextItemput);

      fetch(`${process.env.REACT_APP_API_KEY}/dam/user/${aesFinalTextputId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aesFinalTextItemput),
      }).then(
        (result) => {
          if (result.status === 200) {
            //  onHide(name);
            console.warn("result...!!!", result);
            result.json().then((resp) => {
              console.warn("resp", resp);
            });
            getAllUserList();
            toast.current.show({
              severity: "success",
              summary: "User Edited",
              detail: "User Edited Successfully",
              life: 2000,
            });
            onHide("displayBasic");
          } else {
            toast.current.show({
              severity: "warn",
              summary: "User Not Edited",
              detail: "Error while Editing User",
              life: 2000,
            });
          }
        },
        (error) => {
          toast.current.show({
            severity: "error",
            summary: "User Not Edited",
            detail: "Error while Editing User",
            life: 2000,
          });
        }
      );
    }
    setShowOtpVerification(true);
  }

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    userRole: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    emailId: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    createdBy: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },

    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const statuses = ["Active", "Inactive"];

  useEffect(() => {
    getAllUserList();
  }, []);
  const getAllUserList = () => {
    axios.get(`${process.env.REACT_APP_API_KEY}/dam/user/list`).then((res) => {
      // setUsers(res.data.reverse());

      setData(res.data.reverse());
      setLoading(false);
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const defaultRow = ["UserName", "EmaiId", "Role", "Status"];
      // "User Id",

      // Select specific fields from selectedProducts
      const selectedFields = selectedProducts.map((product) => {
        return {
          // "User Id":product.userId,
          UserName: product.userName,
          EmailId: product.emailId,
          Role: product.userRole,
          Status: product.status,
        };
      });

      const rows = [defaultRow, ...selectedFields.map(Object.values)];

      // Create a new worksheet
      const worksheet = xlsx.utils.aoa_to_sheet(rows);

      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "SelectedUser");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  function deleteUser() {
    let item = {
      userLoginName,
    };

    //id encrypted

    const cIter = 1000;
    const kSize = 128;
    const kSeparator = "::";
    const val1 = "abcd65443A";
    const val2 = "AbCd124_09876";
    const val3 = "sa2@3456s";

    const jsonString6 = JSON.stringify(deleteId);
    console.log(jsonString6, "jsonString");
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const passPhrase = "anemoi";
    const key = CryptoJS.PBKDF2(
      `${val1}${val2}${val3}`,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: kSize / 32, iterations: cIter }
    );

    console.log("key", key);
    let cText7 = CryptoJS.AES.encrypt(jsonString6, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    let aesText4 =
      iv +
      kSeparator +
      salt +
      kSeparator +
      cText7.ciphertext.toString(CryptoJS.enc.Base64);
    let aesFinalTextId = btoa(aesText4);
    console.log("aesFinalText delete", aesFinalTextId);
    // console.log('aesFinalText...deleteid',deleteId);

    //encrypted item data

    const jsonString11 = JSON.stringify(item);
    console.log('item delete',jsonString11);
    let cText12 = CryptoJS.AES.encrypt(jsonString11, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let aesText3 =
      iv +
      kSeparator +
      salt +
      kSeparator +
      cText12.ciphertext.toString(CryptoJS.enc.Base64);
    let aesFinalTextItem = btoa(aesText3);

    // setEncryptedObjectItem({userLoginName:aesFinalTextItem});
    console.log("aesFinalText delete Item", aesFinalTextItem);
    // encryptItemData(encryptedItem)

    // const base64EncodedData = aesFinalTextItem;
    // const decodedData = atob(base64EncodedData);
    // let toArray = decodedData.split(kSeparator);
    // const key5 = CryptoJS.PBKDF2(
    //   `${val1}${val2}${val3}`,
    //   CryptoJS.enc.Hex.parse(toArray[1]),
    //   {
    //     keySize: kSize / 32,
    //     iterations: cIter
    //   }
    //   );
    //   let cipherParams = CryptoJS.lib.CipherParams.create({
    //     ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
    //   });
    //   console.log('cipherParams',cipherParams);
    //   const _iv = toArray[0]
    //   let cText1 = CryptoJS.AES.decrypt(
    //     cipherParams,
    //     key5,
    //     {
    //       iv: CryptoJS.enc.Hex.parse(_iv),
    //       mode: CryptoJS.mode.CBC,
    //       padding: CryptoJS.pad.Pkcs7
    //     }
    //   );
    //   console.log('cText1',cText1);
    //   const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
    //   console.log('decryptedString.......',decryptedString);


    //  function encryptItemData(encryptedItem){

    fetch(
      `${process.env.REACT_APP_API_KEY}/dam/user/delete/${aesFinalTextId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aesFinalTextItem),
      }
    ).then(
      (result) => {
        if (result.status === 200) {
          console.warn("result...!!!", result);
          result.json().then((resp) => {
            console.warn("resp", resp);
          });
          getAllUserList();

          toast.current.show({
            severity: "success",
            summary: "User Deleted",
            detail: "User Deleted Successfully",
            life: 2000,
          });
          // setTimeout(() => {
          //   window.location.reload(false);
          // }, 1300);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "User Not Deleted",
            detail: "Error while Deleting User",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "User Not Deleted",
          detail: "Error while Deleting User",
          life: 2000,
        });
      }
    );
  }
  // }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // DOCUMENT DOWNLOAD
  const downloadFileAtURL = (url) => {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  function validateForm1() {
    let isValid = true;
    const allowedExtensions = ["xls", "xlsx"];

    if (!file) {
      isValid = false;
      errors.file = "Please select a file.";
    } else {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        isValid = false;
        errors.file = "Only Excel files are allowed.";
      }
    }

    return isValid;
  }

  function UplodedUser(event) {
    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]; // Allow only Excel files
    const selectedFile = event.target.files[0];

    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert("Only .xlsx files are allowed.");
      event.target.value = null;
      return; // Add this return statement to prevent further execution
    }

    // setFile(event.target.files[0]);
  }

  const isVersioncomplete = !file;
  //internal user upload

  function userUpload(event) {
    event.preventDefault();

    const isValid = validateForm1();

    if (isValid) {
      console.log("Valid form submitted:", { file });

      const url = `${process.env.REACT_APP_API_KEY}/dam/user/bulkupload`;
      const formData = new FormData();

      formData.append("file", file);
      formData.append("userName", sessionStorage.getItem("userName"));
      formData.append("createdBy", sessionStorage.getItem("emailId"));

      axios
        .post(url, formData)
        .then((response) => {
          getAllUserList();
          if (response.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "User Added",
              detail: "User Added successfully.",
            });
          } else {
            toast.current.show({
              severity: "warn",
              summary: "User Not Added ",
              detail: "Error while Adding User.",
            });
          }
        })
        .catch((error) => {
          toast.current.show({
            severity: "warn",
            summary: "Duplicates found",
            detail: "Duplicate users found. Please check the list",
          });
        });
    } else {
      setErrors(errors);
    }
  }

  //User Update

  function userUpdate(event) {
    event.preventDefault();

    const isValid = validateForm1();

    if (isValid) {
      console.log("Valid form submitted:", { file });

      const url = `${process.env.REACT_APP_API_KEY}/dam/user/bulkupdate`;
      const formData = new FormData();

      formData.append("file", file);
      formData.append("editedBy", sessionStorage.getItem("emailId"));

      axios
        .post(url, formData)
        .then((response) => {
          getAllUserList();
          if (response.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "User Added",
              detail: "User Added successfully.",
            });
            setSelectedProducts(null);
          } else {
            toast.current.show({
              severity: "warn",
              summary: "User Not Added ",
              detail: "Error while Adding User.",
            });
          }
        })
        .catch((error) => {
          toast.current.show({
            severity: "warn",
            summary: "Duplicates found",
            detail: "Duplicate users found. Please check the list",
          });
        });
    } else {
      setErrors(errors);
    }
  }

  // const reload = () => {
  //   window.location.reload(false);
  // };

  function lockedStatus(rowData, e) {
    console.log(e, "eventfor lock");
    // setisLocked(e.target.value);

    

    //encrypt rowData.userId

    const cIter = 1000;
    const kSize = 128;
    const kSeparator = "::";
    const val1 = "abcd65443A";
    const val2 = "AbCd124_09876";
    const val3 = "sa2@3456s";

    // const jsonString = JSON.stringify(rowData.userId);
    // console.log(jsonString, "jsonString");
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const passPhrase = "anemoi";
    const key = CryptoJS.PBKDF2(
      `${val1}${val2}${val3}`,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: kSize / 32, iterations: cIter }
    );

    console.log("key", key);
    let cText = CryptoJS.AES.encrypt(rowData.userId, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    let aesText =
      iv +
      kSeparator +
      salt +
      kSeparator +
      cText.ciphertext.toString(CryptoJS.enc.Base64);
    let aesFinalTextputrowDatauserId = btoa(aesText);
    // console.log("aesFinalText rowData.userId", aesFinalTextputrowDatauserId);

    





    //********************************encrypt isLocked***************************

    console.log('e.target.value',e.target.value);
    const jsonString1 = JSON.stringify(e.target.value);
    let cTextLocked = CryptoJS.AES.encrypt(jsonString1, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let aesText11 =
      iv +
      kSeparator +
      salt +
      kSeparator +
      cTextLocked.ciphertext.toString(CryptoJS.enc.Base64);
    let isLockStatus = btoa(aesText11);
    console.log("aesFinalText isLockStatus", isLockStatus);

    const base64EncodedData = isLockStatus;
    const decodedData = atob(base64EncodedData);
    let toArray = decodedData.split(kSeparator);
    const key5 = CryptoJS.PBKDF2(
      `${val1}${val2}${val3}`,
      CryptoJS.enc.Hex.parse(toArray[1]),
      {
        keySize: kSize / 32,
        iterations: cIter
      }
      );
      let cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
      });
      console.log('cipherParams',cipherParams);
      const _iv = toArray[0]
      let cText1 = CryptoJS.AES.decrypt(
        cipherParams,
        key5,
        {
          iv: CryptoJS.enc.Hex.parse(_iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      console.log('cText1',cText1);
      const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
      console.log('decryptedString.......',decryptedString);


    

//************************ decrypt created by************************************** */
console.log('createdBy',createdBy);
    // const jsonString2 = JSON.stringify(createdBy);
    let cTextcreatedBy2 = CryptoJS.AES.encrypt(createdBy, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let aesText2 =
      iv +
      kSeparator +
      salt +
      kSeparator +
      cTextcreatedBy2.ciphertext.toString(CryptoJS.enc.Base64);
    let isLockCreatedBy = btoa(aesText2);
    console.log("aesFinalText isLockCreatedBy", isLockCreatedBy);


    

 
    let data = {
       isLockStatus,
      isLockCreatedBy
    };
    fetch(
      `${process.env.REACT_APP_API_KEY}/dam/user/lockUser/${aesFinalTextputrowDatauserId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    getAllUserList();
    // .then
    // (result) => {
    //   if (result.status === 200) {
    //     console.warn("result...!!!", result);
    //     result.json().then((resp) => {
    //       console.warn("resp", resp);
    //     });

    //     toast.current.show({
    //       severity: "success",
    //       summary: "User Unlock",
    //       detail: "User Unlock Successfully",
    //       life: 2000,
    //     });
    //   } else {
    //     toast.current.show({
    //       severity: "warn",
    //       summary: "status unlock Failed",
    //       detail: "Error while Unlock User",
    //       life: 2000,
    //     });
    //   }
    // },
    // (error) => {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "status unlock Failed",
    //     detail: "Error while Unlock User",
    //     life: 2000,
    //   });
    // }
    // ();

    setTimeout(() => {
      window.location.reload(false);
    }, 1300);
  }
  //documnet Upload

  const UserUpload = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-text p-button-sm"
        />
        <Button
          label="Yes"
          className="p-button-sm"
          style={{
            borderRadius: "2px",
            backgroundColor: "#D04A02",
            color: "#FFF",
          }}
          onClick={() => onHide(name)}
          onMouseDown={userUpload}
          disabled={isVersioncomplete}
          autoFocus
        />
      </div>
    );
  };

  //userUpdate

  const UserUpdate = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />

        <Button
          label="Yes"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            borderRadius: "2px",
            backgroundColor: "#D04A02",
            color: "#FFF",
          }}
          onClick={() => onHide(name)}
          onMouseDown={userUpdate}
          disabled={isVersioncomplete}
          autoFocus
        />
      </div>
    );
  };

  const renderHeader = () => {
    const downlaod = () => {
      toast.current.show({
        severity: "success",
        summary: "Template download",
        detail: "Template download Successfully",
        life: 2000,
      });
    };
    return (
      <div>
        {/* <div></div> */}
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
            className="p-inputtext-sm"
          />
        </span>

        {/* <Button label="Download Selected" onClick={downloadSelectedColumns} /> */}
        {/* className="flex justify-content-between align-items-center"> */}
        <span style={{ float: "right" }}>
          {trigger && selectedProducts.length > 0 && (
            <div>
              <Button
                style={{
                  backgroundColor: "white",
                  height: "28px",
                  width: "28px",
                  color: "#D04A02",
                }}
                icon="pi pi-upload"
                tooltip="Update"
                className=" p-button-raised p-button-text"
                tooltipOptions={{
                  className: "teal-tooltip",
                  position: "top",
                }}
                onClick={() => onClick("displayBasic3")}
              />
              &nbsp;&nbsp;
              <Dialog
                header="Update User"
                visible={displayBasic3}
                style={{ width: "35vw" }}
                footer={UserUpdate("displayBasic3")}
                onHide={() => onHide("displayBasic3")}
              >
                <form onSubmit={userUpdate}>
                  <input
                    style={{
                      marginTop: "15px",
                      marginLeft: "15px",
                    }}
                    type="file"
                    onChange={UplodedUser}
                  />
                  {errors.file && (
                    <div style={{ color: "red" }}>{errors.file}</div>
                  )}
                </form>
              </Dialog>
              <Button
                style={{
                  backgroundColor: "white",
                  height: "28px",
                  width: "28px",
                  marginRight: "2rem",
                  color: "#D04A02",
                }}
                icon="pi pi-download"
                onClick={exportExcel}
                // onClick={downloadFile}
                onMouseDown={downlaod}
                tooltip="Download"
                tooltipOptions={{
                  className: "teal-tooltip",
                  position: "top",
                }}
                className="p-button-raised p-button-text"
              />{" "}
            </div>
          )}
        </span>

        {!trigger && (
          <div style={{ display: "flex", float: "right" }}>
            <Button
              style={{
                backgroundColor: "white",
                height: "28px",
                width: "28px",
                color: "#F84141",
              }}
              icon="pi pi-upload"
              tooltip="Upload "
              className=" p-button-raised p-button-text"
              tooltipOptions={{
                className: "teal-tooltip",
                position: "bottom",
              }}
              onClick={() => onClick("displayBasic2")}
            />
            &nbsp;&nbsp;
            <Button
              style={{
                backgroundColor: "white",
                height: "28px",
                width: "28px",
                color: "#F84141",
              }}
              icon="pi pi-download"
              onClick={() => {
                downloadFileAtURL(DOC_FILE_URL);
              }}
              onMouseDown={downlaod}
              tooltip="Template Download "
              tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
              className="p-button-raised p-button-text"
            />{" "}
            <Dialog
              header="Upload User"
              visible={displayBasic2}
              style={{ width: "35vw" }}
              footer={UserUpload("displayBasic2")}
              onHide={() => onHide("displayBasic2")}
            >
              <form onSubmit={userUpload}>
                <input
                  style={{
                    marginTop: "15px",
                    marginLeft: "15px",
                  }}
                  type="file"
                  onChange={UplodedUser}
                />
                {errors.file && (
                  <div style={{ color: "red" }}>{errors.file}</div>
                )}
              </form>
            </Dialog>
            &nbsp;&nbsp;
            <NavLink to="/UserDetails" className="link1">
              <Button
                label="Add New User"
                className="p-button-danger p-button-sm"
                style={{ backgroundColor: "#D04A02", borderRadius: "2px" }}
              />
            </NavLink>
            &nbsp;
          </div>
        )}
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.userName}</span>
      </React.Fragment>
    );
  };

  const countryTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.emailId}</span>
      </React.Fragment>
    );
  };

  const createdByTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.createdBy}</span>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.status}`}>
        {rowData.status}
      </span>
    );
  };
  const lockedBodyTemplate = (rowData) => {
    return (
      <>
        <InputSwitch
          style={{ height: "21px", width: "40px" }}
          checked={rowData.locked}
          onChange={(e) => lockedStatus(rowData, e)}
        />
      </>
    );
  };
  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const dateBodyTemplate = (createdOn) => {
    return (
      <div>
        {new Intl.DateTimeFormat("en-IN", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(createdOn.createdOn)}
      </div>
    );
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const header = renderHeader();

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          className="p-button-rounded p-button-text"
          style={{ height: "25px", width: "30px", color: "#D04A02" }}
          icon="pi pi-user-edit"
          onMouseDown={() => userData(rowData)}
          onClick={() => onClick("displayBasic")}
        />
      </React.Fragment>
    );
  };

  //Update Use Dialog

  const dialogFuncMap = {
    displayBasic: setDisplayBasic,
    displayBasic2: setDisplayBasic2,
    displayBasic3: setDisplayBasic3,
    displayBasic4: setDisplayBasic4,
  };

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const onDelete = (name, value) => {
    console.log(value.userId, "delete id");
    setDeleteId(value.userId);
    dialogFuncMap[`${name}`](true);
  };

  const renderFooter1 = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          onClick={() => onHide(name)}
        />
        <Button
          label="Yes"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            backgroundColor: "#D04A02",
            color: "#FFF",
            borderRadius: "2px",
          }}
          onClick={() => onHide(name)}
          onMouseDown={() => deleteUser()}
          autoFocus
        />
      </div>
    );
  };

  const DeleteUserTemplate = (rowData) => {
    return (
      <div>
        <Button
          style={{ height: "20px", width: "50px", color: "#D04A02" }}
          icon="pi pi-trash"
          className="p-button-rounded p-button-text"
          onClick={() => onDelete("displayBasic4", rowData)}
        />
      </div>
    );
  };

  const renderFooter = (name) => {
    return (
      <span style={{ float: "right" }}>
        <Button
          label="Cancel"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onMouseDown={handleClick}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          // className={`text-black p-button-sm  ${
          //   changeColor === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}
          onClick={() => onHide(name)}
        />

        <Button
          style={{
            color: "#D04A02",

            borderRadius: "2px",
          }}
          label="Submit"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          // onMouseUp={handleClick1}
          // className={`text-black p-button-sm  ${
          //   changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}

          disabled={isFormIncomplete}
          onClick={saveUser}
        />
      </span>
    );
  };

  //UPDATE USER
  function userData(rowdata) {
    setUserName(rowdata.userName);
    setEmailId(rowdata.emailId);
    setEmpId(rowdata.empId);
    setStatus(rowdata.status);
    setUserRole(rowdata.userRole);
    setLocked(rowdata.locked);
    setId(rowdata.userId);
  }

  // const dateBodyTemplate = (bookmarkBy) => {

  //   return (

  //     <div>
  //       {new Intl.DateTimeFormat("en-IN", {
  //         year: "numeric",
  //         month: "2-digit",
  //         day: "2-digit" ,
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }).format(bookmarkBy.bookmarkBy)}
  //     </div>
  //   );
  // }

  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;

        setFirst1(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };

  const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
  };

  const onCustomPage1 = (event) => {
    console.log(event, "event");
    setFirst1(event.first);
    setRows1(event.rows);

    setCurrentPage(event.page + 1);
  };

  const template1 = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="pi pi-chevron-left"></span>
          <Ripple />
        </button>
      );
    },

    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="pi pi-chevron-right"></span>
          <Ripple />
        </button>
      );
    },

    CurrentPageReport: (options) => {
      console.log(options, "options");
      return (
        <div>
          <span
            className="mx-3"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            <InputText
              size="1"
              style={{ textAlign: "center" }}
              className="ml-1"
              value={currentPage}
              tooltip={pageInputTooltip}
              onKeyDown={(e) => onPageInputKeyDown(e, options)}
              onChange={onPageInputChange}
            />
          </span>

          <span
            style={{
              color: "var(--text-color)",
              userSelect: "none",
              width: "120px",
              textAlign: "center",
            }}
          >
            of {options.totalPages}
          </span>
        </div>
      );
    },
  };

  return (
    <div>
      <Toast ref={toast} />

      <div>
        <img
          style={{ height: "76px", width: "6s%", float: "right" }}
          src={Background}
          alt=" Background "
        />

        <br />
        <br />
      </div>

      <b className="headerName">User Management</b>
      <br />
      <br />

      <Dialog
        header="Delete User"
        style={{ width: "30vw", height: "30vh" }}
        visible={displayBasic4}
        footer={renderFooter1("displayBasic4")}
        onHide={() => onHide("displayBasic4")}
      >
        <span icon="pi pi-exclamation-triangle">
          Are you sure you want to delete this User?
        </span>
      </Dialog>

      <div className="datatable-doc-demo">
        {/* <Button
          style={{ backgroundColor: "white", color: "black", height: "35px" }}
          className="p-button-raised p-button p-button-secondary p-button-text"
        >
          <img
            style={{ width: "17px", marginRight: "10px", height: "15px" }}
            src={User}
            alt="User"
          />
          <b>User Management</b>
        </Button>
        <img
          style={{ height: "53px", float: "right" }}
          src={Background}
          alt=" Background "
        />
        <br />
        <br /> */}
        <Card style={{ height: "auto", marginBottom: "1rem" }}>
          <div className="card">
            <DataTable
              value={data}
              rowHover
              style={{ borderRadius: "10px", border: "1px solid #FFB601" }}
              // editMode="row"
              // dataKey="id"
              showGridlines
              stripedRows
              onRowEditComplete={saveUser}
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e.value)}
              loading={loading}
              className="p-datatable-customers"
              header={header}
              rows={rows1}
              paginator
              paginatorTemplate={template1}
              first={first1}
              onPage={onCustomPage1}
              // rows={8}
              // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "userName",
                "userRole",
                "createdBy",
                "emailId",
                "createdBy",

                "balance",
                "status",
              ]}
              emptyMessage="No Users added."
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
                exportable={false}
              ></Column>
              <Column
                field="userName"
                header="Name"
                sortable
                filter
                filterPlaceholder="Search by Name"
                style={{ minWidth: "10rem" }}
                filterField="userName"
                body={countryBodyTemplate}
              />

              <Column
                field="userRole"
                header="Role"
                sortable
                filter
                filterField="userRole"
                filterPlaceholder="Search by Role"
                style={{ minWidth: "10rem" }}
              />

              <Column
                field="emailId"
                header="Email Id"
                sortable
                style={{ minWidth: "10rem" }}
                body={countryTemplate}
                filter
                filterPlaceholder="Search by Email Id"
              />

              <Column
                field="createdBy"
                header="Created By"
                sortable
                filter
                body={createdByTemplate}
                filterField="createdBy"
                filterPlaceholder="Search by Creater"
                style={{ minWidth: "10rem" }}
              />

              <Column
                field="status"
                header="Status"
                sortable
                filterMenuStyle={{ width: "14rem" }}
                style={{ minWidth: "10rem" }}
                body={statusBodyTemplate}
                filter
                filterPlaceholder="Search by Status"
                filterElement={statusFilterTemplate}
              />

              <Column
                field="createdOn"
                header="Last Edited"
                sortable
                dataType="date"
                body={dateBodyTemplate}
                style={{ minWidth: "8rem" }}
              />

              <Column
                field="locked"
                header="Locked Status"
                body={lockedBodyTemplate}
              />

              <Column
                header="Edit"
                headerStyle={{ width: "2rem" }}
                body={(e) => actionBodyTemplate(e)}
              ></Column>

              <Column
                header="Delete"
                headerStyle={{ width: "2rem" }}
                body={DeleteUserTemplate}
              />
            </DataTable>
          </div>
        </Card>
      </div>

      {/* Update */}
      <div>
        <Toast ref={toast} />

        <Dialog
          header="Edit User"
          visible={displayBasic}
          footer={renderFooter("displayBasic")}
          style={{ width: "80vw" }}
          onHide={() => onHide("displayBasic")}
        >
          <Card
            style={{
              borderLeft: "9px solid #FFB600",
              backgroundColor: "#F3F3F3",
              borderRadius: "1px",
              width: "75vw",
              height: "35vh",
            }}
          >
            <form onSubmit={onSubmit}>
              <div class="formgrid grid">
                <div class="field col-4">
                  <label for="lastname2" style={{ color: "black" }}>
                    {" "}
                    Name
                  </label>
                  <br />

                  <InputText
                    style={{
                      height: "40px",
                      width: "90%",
                      borderRadius: "2px",
                    }}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  ></InputText>
                  {formErrors.userName && (
                    <div className="invalid-feedback error-message">
                      {formErrors.userName}
                    </div>
                  )}
                </div>

                <div class="field col-4">
                  <label for="lastname2" style={{ color: "black" }}>
                    Email ID
                  </label>

                  <br />

                  <InputText
                    style={{
                      height: "40px",
                      width: "90%",
                      borderRadius: "2px",
                    }}
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                  ></InputText>
                  {formErrors.emailId && (
                    <div className="invalid-feedback error-message">
                      {formErrors.emailId}
                    </div>
                  )}
                </div>

                <div class="field col-4">
                  <label for="lastname2" style={{ color: "black" }}>
                    EMP ID
                  </label>

                  <br />

                  <InputText
                    style={{
                      height: "40px",
                      width: "90%",
                      borderRadius: "2px",
                    }}
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                  ></InputText>
                  {formErrors.empId && (
                    <div className="invalid-feedback error-message">
                      {formErrors.empId}
                    </div>
                  )}
                </div>
              </div>

              <div class="formgrid grid">
                <div class="field col-4">
                  <label for="lastname2" style={{ color: "black" }}>
                    {" "}
                    User Role
                  </label>
                  <br />
                  <Dropdown
                    style={{
                      width: "90%",
                      borderRadius: "3px",
                      height: "40px",
                    }}
                    value={userRole}
                    options={cities}
                    onChange={(e) => setUserRole(e.value)}
                    optionLabel="name"
                    optionValue="name"
                    placeholder="Select "
                  />
                </div>

                {formErrors.userRole && (
                  <div className="invalid-feedback error-message">
                    {formErrors.userRole}
                  </div>
                )}

                <div class="field col-4">
                  <label style={{ color: "black" }}>Status</label>
                  <div class="formgroup-inline">
                    <div class="formgroup-inline">
                      <div class="field-radiobutton">
                        <input
                          style={{ height: "20px", width: "20px" }}
                          type="radio"
                          name="status"
                          value="Active"
                          checked={status === "Active"}
                          onChange={(e) => {
                            setStatus(e.target.value);
                          }}
                        />
                        {errors.status && (
                          <div style={{ color: "red" }}>{errors.status}</div>
                        )}
                        <label for="city7">Active</label>
                      </div>

                      <div class="field-radiobutton">
                        <input
                          type="radio"
                          style={{ height: "20px", width: "20px" }}
                          value="Inactive"
                          name="status"
                          checked={status === "Inactive"}
                          onChange={(e) => {
                            setStatus(e.target.value);
                          }}
                        />
                        {errors.status && (
                          <div style={{ color: "red" }}>{errors.status}</div>
                        )}
                        <label for="city8">Inactive</label>
                      </div>
                    </div>
                  </div>
                  {formErrors.status && (
                    <div className="invalid-feedback error-message">
                      {formErrors.status}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Card>

          <br />
          {/* <br/>
          <span style={{ float: "right" }}>
        <Button
          label="Cancel"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onMouseDown={handleClick}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          //  onClick={() => onHide(name)} 
          // className={`text-black p-button-sm  ${
          //   changeColor === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}
          // onClick={() => onHide(name)}
        />
  
      &nbsp;  <Button
          style={{
            color: "#D04A02",

            borderRadius: "2px",
          }}
          label="Submit"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined" 
          // onMouseUp={handleClick1}
          // className={`text-black p-button-sm  ${
          //   changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}
      
          disabled={isFormIncomplete}
          onClick={saveUser}
        />

      </span> */}
        </Dialog>
      </div>
    </div>
  );
}

export default Product;
