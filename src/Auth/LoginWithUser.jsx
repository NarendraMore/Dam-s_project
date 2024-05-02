import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import jwt_decode from "jwt-decode";
import axios from "axios";
import PwC_Logo_Black from "../Assets/PwC_Logo_Black.png";
import CryptoJS from "crypto-js";
import { format } from 'date-fns';
const Login = () => {
  const [emailId, setUsername] = useState("");
  const [loginpassword, setPassword] = useState(null);
  const [loginStatus, setLoginStatus] = useState("");
  const toast = useRef(null);
  const [emailOtp, setOtp] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [loggedUserData, setLoggedUserData] = useState();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [loading, setLoading] = useState(Boolean);
  // IDAM code
  const [username, usernameupdate] = useState("");
  // const [password, passwordupdate] = useState("");

  const usenavigate = useNavigate();

  // const login_url = "https://login-stg.pwc.com/openam/oauth2/authorize";
  // const reponse_type = "code";
  // const client_id = "urn:ipzyatgcaswv001.pwcglb.com";
  // const redirect_url = "https://ipzyatgcaswv001.pwcglb.com";
  // const scope = "openid";
  //  const grant_type = "authorization_code";
  // const secret = "NymifqabiwKnfD7BeHcR";
  // const access_token = "https://login-stg.pwc.com/openam/oauth2/access_token";
  // const user_info = "https://login-stg.pwc.com/openam/oauth2/userinfo";
  // const REACT_APP_API_KEY = "https://ipzyatgcaswv001.pwcglb.com/api";
  ///

  const reponse_type = `${process.env.REACT_APP_API_RESPONSEKEY} `;
  const scope = `${process.env.REACT_APP_API_SCOPE}`;
  const grant_type = `${process.env.REACT_APP_API_GRANTTYPE} `;

  const login_url = `${process.env.REACT_APP_BASE_URL}/authorize`;
  const access_token = `${process.env.REACT_APP_BASE_URL}/access_token`;
  const user_info = `${process.env.REACT_APP_BASE_URL}/userinfo`;

  const client_id = `${process.env.REACT_APP_API_CLIENTKEY}`;
  const redirect_url = `${process.env.REACT_APP_API_REDIRECTKEY}`;
  const secret = `${process.env.REACT_APP_API_SECRETKEY}`;
  const REACT_APP_API_KEY = `${process.env.REACT_APP_API_MAINAPPKEY}`;

  useEffect(() => {
    sessionStorage.clear();

    axios
      .get(`${process.env.REACT_APP_API_KEY}/dam/Configurations/list`)
      .then((res) => {
        console.log(res, "acc statsu");
        console.log(res.data[0].noOfDaysExpiry, "???????");
        setLoginStatus(res.data[0].loginStatus, " loginStatus");
        //  if(res.data[0].loginStatus===true){
        sessionStorage.setItem("trigger", res.data[0].loginStatus);
      });
  }, []);

  if (loginStatus === true) {
    const isFormIncomplete = !emailId || !loginpassword;

    const proceedLogin = (e) => {
      console.log("<=======================================>");
      setLoading(true);

      e.preventDefault();

      console.log("loading: ", loading);
      if (validate()) {
        // const encoded = btoa(password);
        // var encoded= btoa(password);
        // const encoded = encodeURI(password);
        const data = {
          emailId,
          password: btoa(loginpassword),
          // password: encodeURIComponent(btoa(password)),
          //  password: btoa(password),
        };
        setLoading(true);

        fetch(`${process.env.REACT_APP_API_KEY}/dam/user/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              setLoading(false);
              return response.json().then((data) => {
                // Successful response handling
                if (data.status != "Active") {
                } else {
                  setShowOtpVerification(true);

                  setLoading(false);

                  console.warn("Response:", data);
                  setLoggedUserData(data);
                  toast.current.show({
                    severity: "success",
                    summary: "Email OTP sent",
                    detail: "Email OTP sent on registered mail-id ",
                  });
                }

                if (Object.keys(data).length === 0) {
                  console.log(data, ">>>>>>>>>");

                  // Handle empty response
                } else {
                  setLoading(false);

                  if (data.status === "Inactive") {
                    toast.current.show({
                      severity: "warn",
                      summary: "User Inactive",
                      detail:
                        "The user is inactive. Please contact to your administrator.",
                      life: 2000,
                    });
                  } else {
                    sessionStorage.setItem("userName", data.userName);
                    sessionStorage.setItem("userrole", data.userRole);
                    sessionStorage.setItem("emailId", data.emailId);
                    sessionStorage.setItem("status", data.status);
                    setLoading(false);
                  }
                }
              });
            } else {
              return response.json().then((errorData) => {
                // Error response handling
                setLoading(false);
                console.warn("Error Response:", errorData);
                const errorMessage =
                  errorData.message || "Error while registering user";
                toast.current.show({
                  severity: "warn",
                  summary: "Invalid Credentials",
                  detail: errorMessage,
                });
              });
            }
          })

          .catch((error) => {
            // Network or other errors
            setLoading(false);

            console.error("Error...!!:", error);
            toast.current.show({
              severity: "error",
              summary: "User Not Added",
              detail: "Error while registering user",
            });
          })

          .catch((err) => {
            console.log(err.message, "????");
            toast.current.error("Login Failed due to: " + err.message);
          });
        // setLoading(false);
      }
    };

    const validate = () => {
      let result = true;
      let isProceed = true;
      let errors = {};
      if (emailId.trim() === "") {
        result = false;

        if (!emailId) {
          errors.emailId = "Please enter the userName";
          isProceed = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(emailId)) {
          errors.emailId = "Please enter a valid alphanumeric userName";
          isProceed = false;
        }

        if (!loginpassword) {
          errors.loginpassword = "Please enter the password";
          isProceed = false;
        }

        setFormErrors(errors);
      }

      return result;
    };

    const validateOTP = (otp) => {
      // Regular expression to check the OTP format (alphanumeric and 6 characters long)
      const otpRegex = /^[a-zA-Z0-9]{6}$/;
      return otpRegex.test(otp);
    };

    const isValidateOTP = () => {
      let isProceed = true;
      let errors = {};

      if (!emailOtp) {
        errors.emailOtp = "Please enter the emailOTP";
        isProceed = false;
      } else if (!validateOTP(emailOtp)) {
        errors.emailOtp =
          "Please enter a valid OTP (alphanumeric, 6 characters)";
        isProceed = false;
      }

      setFormErrors(errors);

      if (!isProceed) {
        toast.warning("Please fill in all the required fields.");
      }

      return isProceed;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.warn("loggedUserData...!!!", loggedUserData);

      if (isValidateOTP()) {
        console.log(emailOtp, "emailotp...");

        let data = {
          emailOtp: emailOtp,
          emailId: loggedUserData.emailId,
        };

        const cIter = 1000;
        const kSize = 128;
        const kSeparator = "::";
        const val1 = "abcd65443A";
        const val2 = "AbCd124_09876";
        const val3 = "sa2@3456s";

        // const jsonString = JSON.stringify(data);
        // console.log(jsonString, "jsonString");
        // const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
        //   CryptoJS.enc.Hex
        // );
        // const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
        //   CryptoJS.enc.Hex
        // );
        // const passPhrase = "anemoi";
        // const key = CryptoJS.PBKDF2(
        //   `${val1}${val2}${val3}`,
        //   CryptoJS.enc.Hex.parse(salt),
        //   { keySize: kSize / 32, iterations: cIter }
        // );

        // console.log("key", key);
        // let cText = CryptoJS.AES.encrypt(jsonString, key, {
        //   iv: CryptoJS.enc.Hex.parse(iv),
        //   mode: CryptoJS.mode.CBC,
        //   padding: CryptoJS.pad.Pkcs7,
        // });

        // let aesText =
        //   iv +
        //   kSeparator +
        //   salt +
        //   kSeparator +
        //   cText.ciphertext.toString(CryptoJS.enc.Base64);
        // let aesFinalText = btoa(aesText);
        // //  this.newEncryptedObject = {};
        // const encryptedData = aesFinalText;
        // console.log("encrypt data 2 :", encryptedData);

        // console.log("data: ", data);

        fetch(
          `
    ${process.env.REACT_APP_API_KEY}/dam/user/loginUser/forgetPassword/verifyOtp`,
          // dam/user/loginUser/forgetPassword/verifyOtp
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        ).then(
          (result) => {
            console.warn("result...!!!", result);
            if (result.status === 200) {
              console.warn("loggedUserData...!!!", loggedUserData);
              result.text().then((resp) => {
                console.log("resp.....''''''", resp);

                const base64EncodedData = resp;
                const decodedData = atob(base64EncodedData);
                let toArray = decodedData.split(kSeparator);
                console.log('toArray',toArray);
                const key = CryptoJS.PBKDF2(
                  `${val1}${val2}${val3}`,
                  CryptoJS.enc.Hex.parse(toArray[1]),
                  {
                    keySize: kSize / 32,
                    iterations: cIter
                  }
                  );
                  console.log(key, 'key');
                let cipherParams = CryptoJS.lib.CipherParams.create({
                  ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
                });
                   console.log('cipherParams',cipherParams);

                const _iv = toArray[0]
                let cText1 = CryptoJS.AES.decrypt(
                  cipherParams,
                  key,
                  {
                    iv: CryptoJS.enc.Hex.parse(_iv),
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                  }
                );
                // OTP valid::morenarendras98@gmail.com

                console.log('cText1',cText1);
                const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
                console.log('decryptedString.......',decryptedString);
                const otpString = decryptedString;
                const parts = otpString.split("::");
                const message = parts[0];
                const email = parts[1];
                const time = parts[2];
                console.log('email',email);
                console.log('message',message);
                console.log('time',time);
                
                const currentDateTime = new Date();
                currentDateTime.setMinutes(currentDateTime.getMinutes() - 5);
                
                const serverTime = new Date(time);
                console.log('converted date time :::',serverTime);

                const localServerTime = new Date(serverTime.getTime() - (currentDateTime.getTimezoneOffset()*60000));
                console.log('converted local date time :::',localServerTime);

                console.log('current date time - 5 min :::',currentDateTime);

                if(loggedUserData.emailId === email && message === 'OTP valid' && localServerTime > currentDateTime){
                  
                  if (
                    loggedUserData.userRole === "Admin" &&
                    loggedUserData.status === "Active"
                    
                  ) {
                    navigate("/dashboardMain");
                  } else if (
                    loggedUserData.userRole === "Reviewer" &&
                    loggedUserData.status === "Active"
                  ) {
                    
                    navigate("/reviewermain");
                  } else if (
                    loggedUserData.userRole === "Viewer" &&
                    loggedUserData.status === "Active"
                  ) {
                    
                    navigate("/bookmarkdoc");
                  } else {
                    alert("Incorrect credentials...!!");
                  }
                }else{
                  console.log('emal not validate');
                }
               
              });

              toast.current.show({
                severity: "success",
                summary: "OTP Verified ",
                detail: "OTP Verified Successfully",
                life: 2000,
              });
              // navigate("/ConfirmPassword")
            } else {
              toast.current.show({
                severity: "warn",
                summary: "Invalid OTP",
                detail: "You have entered invalid OTP",
                life: 2000,
              });
            }
          },
          (error) => {
            toast.current.show({
              severity: "error",
              summary: "OTP Not Verify",
              detail: "Error while Verify OTP",
              life: 6000,
            });
          }
        );
      }
    };
    return (
      <>
        <Toast ref={toast} />

        {loading ? (
          <span className="loading">
            <ProgressSpinner />
          </span>
        ) : null}

        <form onSubmit={proceedLogin}>
          <Card style={{ borderRadius: "2px" }} className="loginCard">
            <div className="card_module">
              <div className="card-header">
                <img
                  style={{ width: "20%", height: "100%", color: "black" }}
                  src={PwC_Logo_Black}
                  alt="PwC_Logo_Black"
                />

                <h4 style={{ color: "black" }}>DIGITAL ACCOUNTING MANUAL </h4>
              </div>
              <br />
              <div className="card-body">
                <label style={{ color: "black" }}>
                  Email Id: <span className="errmsg">*</span>
                </label>
                <br />
                <InputText
                  value={emailId}
                  style={{ borderRadius: "2px", width: "100%", height: "40px" }}
                  onChange={(e) => setUsername(e.target.value)}
                  // className="form-control"
                  className={`form-control ${
                    formErrors.userName ? "is-invalid" : ""
                  }`}
                />

                {formErrors.userName && (
                  <div className="invalid-feedback error-message">
                    {formErrors.userName}
                  </div>
                )}
                <br />
                <br />
                <label style={{ color: "black" }}>
                  Password: <span className="errmsg">*</span>
                </label>
                <br />
                <div className="p-inputgroup">
                  <InputText
                    type="password"
                    style={{ height: "40px" }}
                    value={loginpassword}
                    onChange={(e) => setPassword(e.target.value)}
                    toggleMask
                  />
                </div>
                {formErrors.password && (
                  <div className="invalid-feedback error-message">
                    {formErrors.password}
                  </div>
                )}
                <br />
                <Link style={{ color: "#FFB601" }} to={"/reset"}>
                  Forgot Password?
                </Link>
                <br />
                <br />
                {/* className="footer"
                 */}
                <div>
                  <button
                    type="submit"
                    disabled={isFormIncomplete}
                    style={{
                      borderRadius: "2px",
                      width: "100%",
                      backgroundColor: "#D04A02",
                    }}
                    className="p-button-sm btn btn-primary"
                  >
                    LOGIN
                  </button>{" "}
                </div>

                <div>
                  <br />
                  Don't have an account? |{" "}
                  <Link
                    style={{ color: "#FFB601" }}
                    className="btn btn-success"
                    to={"/register"}
                  >
                    Register now
                  </Link>
                </div>
              </div>
              <br />

              {showOtpVerification && (
                <div className="footer">
                  <hr></hr>
                  <br />
                  {/* onSubmit={handleSubmit} */}
                  <form className="container">
                    <div class="grid">
                      <div class="col">
                        <input
                          type="password"
                          value={emailOtp}
                          placeholder="Enter OTP"
                          style={{ height: "31px" }}
                          onChange={(e) => setOtp(e.target.value)}
                          className={`form-control ${
                            formErrors.emailOtp ? "is-invalid" : ""
                          }`}
                        ></input>
                        {formErrors.emailOtp && (
                          <div className="invalid-feedback error-message">
                            {formErrors.emailOtp}
                          </div>
                        )}
                      </div>

                      <div class="col">
                        <Button
                          type="submit"
                          style={{
                            borderRadius: "2px",
                            backgroundColor: "#D04A02",
                          }}
                          label="Verify OTP"
                          onClick={handleSubmit}
                          className="p-button-danger p-button-sm"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </Card>
        </form>
      </>
    );
  } else if (loginStatus === false) {
    // navigate("/Idam");

    sessionStorage.clear();
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      getAccessToken(code);
    } else {
      const loginUrl = `${login_url}?response_type=${reponse_type}&client_id=${client_id}&redirect_uri=${redirect_url}&scope=${scope}`;
      window.location.href = loginUrl;
    }

    function getAccessToken(code) {
      // console.log("code: ", code);
      const data = new URLSearchParams({
        code: code,
        redirect_uri: redirect_url,
        grant_type: grant_type,
        client_id: client_id,
        client_secret: secret,
      });

      axios
        .post(access_token, data)
        .then((response) => {
          ProceedLogin(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Error while getting userinfo");
        });
    }

    function getTokenInfo(token) {
      try {
        return jwt_decode(token);
      } catch (error) {
        return null;
      }
    }

    function ProceedLogin(data) {
      // e.preventDefault();
      // console.log("token data: ",data);

      const allUserData = getTokenInfo(data.id_token);
      // console.log("extracted token data: ",allUserData);
      usernameupdate(allUserData.upn);

      if (true) {
        fetch(
          `${process.env.REACT_APP_API_KEY}/dam/user/email/` + allUserData.upn
        )
          .then((res) => {
            return res.json();
          })
          .then((resp) => {
            // console.log(resp, "///////////");
            console.log("userData: ", resp);
            sessionStorage.setItem("emailId", resp.emailId);
            sessionStorage.setItem("userName", resp.userName);
            sessionStorage.setItem("userrole", resp.userRole);

            if (resp.userRole === "Admin" && resp.status === "Active") {
              usenavigate("/dashboardMain");
            } else if (
              resp.userRole === "Reviewer" &&
              resp.status === "Active"
            ) {
              usenavigate("/reviewermain");
            } else if (resp.userRole === "Viewer" && resp.status === "Active") {
              usenavigate("/bookmarkdoc");
            } else {
              alert("incorrect credentials...!!");
            }
          })
          .catch((err) => {
            const logoutUrl = "https://login-stg.pwc.com/openam/UI/Logout";
            console.log("inside error log");
            // window.location.href = logoutUrl;
          });
      }
    }
  }
  //  else{
  //   alert("someting went wrong...!!")
  //  }
};

export default Login;
