









// import React, { useState, useEffect, useRef } from "react";
// import "./navbar.css";
// import { Link } from "react-router-dom";
// import { Button } from "primereact/button";
// import { useNavigate } from "react-router";
// import { OverlayPanel } from "primereact/overlaypanel";
// import { Toast } from "primereact/toast";
// import { TabView, TabPanel } from "primereact/tabview";
// import Notification from "./Notification";
// import PwC_Name_Mark_Black from "../Assets/PwC_Name_Mark_Black.png";
// import JSZip from 'jszip';
// import axios from 'axios';
// import { ProgressSpinner } from 'primereact/progressspinner';
// import { Dialog } from 'primereact/dialog';


// const Navbar = () => {
//   const [Mobile, setMobile] = useState(false);
//   const [position, setPosition] = useState('center');
//   const navigate = useNavigate();
//   const op = useRef(null);
//   const op1 = useRef(null);
//   const op2 = useRef(null);
//   const toast = useRef(null);
//   const [isCardOpen, setIsCardOpen] = useState(false);

//   const [loginUser, setLoginUser] = useState();
//   const [loginRole, setLoginRole] = useState();
//   const [videos, setVideos] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [displayBasic, setDisplayBasic] = useState(false);
//   const [displayPosition, setDisplayPosition] = useState(false);


 

//   useEffect(() => {
    

//     setLoginUser(sessionStorage.getItem('emailId'));
//     setLoginRole(sessionStorage.getItem('userrole'));
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_KEY}/help/api`);
//       console.log(response,"???????????????????")
//       const arrayBuffer = await response.arrayBuffer();

//       const zip = new JSZip();
//       const zipFile = await zip.loadAsync(arrayBuffer);

//       const fileNames = Object.keys(zipFile.files);

//       const videoFiles = fileNames.filter((fileName) =>
//         // fileName.toLowerCase().endsWith('.mp4')
//         <></>
//       );

//       const videoURLs = await Promise.all(
//         videoFiles.map(async (fileName) => {
//           const file = zipFile.file(fileName);
//           const videoBlob = await file.async('blob');
//           const videoURL = URL.createObjectURL(videoBlob);
//           console.log("videoURL: ",videoURL);
//           return { fileName, url: videoURL };
//         })
//       );

//       setVideos(videoURLs);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       setLoading(false);
//     }
//   };


 
//   const handleVideoClick = (video) => {
//     setSelectedVideo(video);
//   };

//   const handleBackToList = () => {
//     setSelectedVideo(null);
//   };

//   const handleOpenPdf = () => {
//     window.open(pdfUrl, '_blank');
//   };
  
//   const ResetPassword = () => {
//     navigate("/LoginPassword");

  
//   };

//   const handleLogout = () => {
// if(sessionStorage.getItem('trigger')===false){
//   window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
//   sessionStorage.clear();

// }else{
//   sessionStorage.clear();
//   navigate("/");
// }



// // logout by trigger

 

//   };



//   const dialogFuncMap = {
//     'displayBasic': setDisplayBasic,
//     'displayPosition': setDisplayPosition,
   
// }

// const onClick = (name, position) => {
//     dialogFuncMap[`${name}`](true);

//     if (position) {
//         setPosition(position);
//     }
// }

// const onHide = (name) => {
//     dialogFuncMap[`${name}`](false);
// }


//   return (
//     <>
//       <Toast ref={toast} />
//       <nav className="navbar">
      
//       <div style={{display:"flex"}}>
//          <img  style={{width:"20%",height:"40%"}} src={PwC_Name_Mark_Black} alt="PwC_Name_Mark_Black" /><span style={{marginLeft:"10px"}}>| Digital Accounting Manuals</span>
//          </div>


//         <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
//           <Link to="/help">
//             <Button
//               type="button"
//               style={{
//                 color: "black",
//                 fontFamily: "Helvetica",
//                 fontWeight: "6px",
//               }}
//               label=" Help"
//               icon="pi pi-question-circle"
//               className="p-button-text"
//               onClick={(e) => op2.current.toggle(e)}
//               aria-haspopup
//               aria-controls="overlay_panel"
//             />
//             </Link>
//             {/* header="Header" */}

//             {/* <Button label="Show" icon="pi pi-external-link" onClick={() => onClick('displayBasic', 'top-right')}/>
//                 <Dialog visible={displayBasic} style={{ width: '30vw' }} onHide={() => onHide('displayBasic')}>
//                 <div>
//               {loading ? (
//                 <span className="loading">
//                   <ProgressSpinner />
//                 </span>
//               ) : selectedVideo ? (
//                 <div>
//                   <h5>{selectedVideo.fileName}</h5>
//                   <br />
//                   <br />
                
//                   <video   style={{ width: "50%" }}  controls>
                  
//                     <source src={selectedVideo.url} />
//                     Your browser does not support the video tag.
//                   </video>
//                   <Button style={{color:"black"}} label="Back to List"   icon="pi pi-arrow-left"  className="p-button-text p-button-sm" onClick={handleBackToList}></Button>
//                 </div>
//               ) : (
//                 <div>
//                   {videos.map((video) => (
//                     <div key={video.fileName}>
//                       <h4>{video.fileName}</h4>
//                       <Button
//                         style={{ backgroundColor: '#203570', borderRadius: "2px" }}
//                         className="p-button-sm"
//                         onClick={() => handleVideoClick(video)}
//                       >
//                         Watch Video
//                       </Button>
//                     </div>
//                   ))}
//                   <b> Search Operations</b>
//                   <br />
                  
//                   <Button
//                     style={{ backgroundColor: '#203570', borderRadius: "2px" }}
//                     className="p-button-sm"
//                     onClick={handleOpenPdf}
//                   >
//                     Open PDF
//                   </Button>
//                 </div>
//               )}
//             </div>
//                 </Dialog> */}


// {/* 
//                 <Button style={{
//                 color: "black",
//                 fontFamily: "Helvetica",
//                 fontWeight: "6px",
//               }}  onClick={() => onClick('displayPosition', 'top-right')}  icon="pi pi-question-circle"  label=" Help"  className="p-button-text" />

//                 <Dialog header="Help section"  visible={displayPosition} position={position} modal   onHide={() => onHide('displayPosition')}
//                     draggable={false} resizable={false}>


// <div>
//               {loading ? (
//                 <span className="loading">
//                   <ProgressSpinner />
//                 </span>
//               ) : selectedVideo ? (
//                 <div>
                  
//                   <h5>{selectedVideo.fileName}</h5>
                  
                
//                   <video   style={{ width: "100%" }}  controls>
                  
//                     <source src={selectedVideo.url} />
//                     Your browser does not support the video tag.
//                   </video>
//                   <Button style={{color:"black"}} label="Back to List"   icon="pi pi-arrow-left"  className="p-button-text p-button-sm" onClick={handleBackToList}></Button>
//                 </div>
//               ) : (
//                 <div>
//                   {videos.map((video) => (
//                     <div key={video.fileName}>
//                       <h4>{video.fileName}</h4>
//                       <Button
//                         style={{ backgroundColor: '#203570', borderRadius: "2px" }}
//                         className="p-button-sm"
//                         onClick={() => handleVideoClick(video)}
//                       >
//                         Watch Video
//                       </Button>
//                     </div>
//                   ))}
//                   <b> Search Operation</b>
//                   <br />
                  
//                   <Button
//                     style={{ backgroundColor: '#203570', borderRadius: "2px" }}
//                     className="p-button-sm"
//                     onClick={handleOpenPdf}
//                   >
//                     Open PDF
//                   </Button>
//                 </div>
//               )}
//             </div>



//                 </Dialog> */}
// {/*         
//           <OverlayPanel ref={op2} showCloseIcon id="overlay_panel" className="overlaypanel-demo">
//             <div>
//               {loading ? (
//                 <span className="loading">
//                   <ProgressSpinner />
//                 </span>
//               ) : selectedVideo ? (
//                 <div>
//                   <h5>{selectedVideo.fileName}</h5>
//                   <br />
//                   <br />
                  
//                   <video   controls>
                  
//                     <source src={selectedVideo.url} />
//                     Your browser does not support the video tag.
//                   </video>
//                   <Button style={{color:"black"}} label="Back to List"   icon="pi pi-arrow-left"  className="p-button-text p-button-sm" onClick={handleBackToList}></Button>
//                 </div>
//               ) : (
//                 <div>
//                   {videos.map((video) => (
//                     <div key={video.fileName}>
//                       <h4>{video.fileName}</h4>
//                       <Button
//                         style={{ backgroundColor: '#203570', borderRadius: "2px" }}
//                         className="p-button-sm"
//                         onClick={() => handleVideoClick(video)}
//                       >
//                         Watch Video
//                       </Button>
//                     </div>
//                   ))}
//                   <b> Search Operations</b>
//                   <br />
                  
//                   <Button
//                     style={{ backgroundColor: '#203570', borderRadius: "2px" }}
//                     className="p-button-sm"
//                     onClick={handleOpenPdf}
//                   >
//                     Open PDF
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </OverlayPanel> */}

//           {/* <Button
//             icon="pi pi-bell"
//             style={{ color: "black", border: "none", fontFamily: "Helvetica" }}
//             onClick={(e) => op1.current.toggle(e)}
//             aria-haspopup
//             aria-controls="overlay_panel"
//             label=" Notification"
//             className="p-button-text"
//           /> */}
// {/* 
//           <OverlayPanel
//             ref={op1}
//             showCloseIcon
//             id="overlay_panel"
//             style={{ width: "450px" }}
//             className="overlaypanel-demo"
//           >
//             <TabView>
//               <TabPanel header="All">
//                 <Notification />
//               </TabPanel>
//               <TabPanel header="Unread"></TabPanel>
//             </TabView>
//           </OverlayPanel> */}

// &nbsp;
//           &nbsp;   <Button
//             style={{
//               background: "#D04A02",
//               height: "33px",
//               width: "33px",
//               marginRight:"20px",
//               marginTop:"5px"
//             }}
//             aria-label="User"
//             icon="pi pi-user"
//             onClick={(e) => op.current.toggle(e)}
//             aria-haspopup
//             aria-controls="overlay_panel"
//             className="p-button-rounded p-button-danger"
//           /> 

//           <OverlayPanel ref={op}>
//             <h4 style={{color:"#D04A02"}}>{loginUser}({loginRole})</h4>
           
// <br/>
//             {/* <Link className="btn btn-success" to={"/LoginPassword"}>
//               Reset Password
//             </Link> */}

// <Button
//               label="Reset Password"
              
//               onClick={ResetPassword }
//               style={{ color: "#D04A02", padding: "0%", margin: "0%" }}
//               className="p-button-text p-button-plain"
//             />
//             <br/>
//             <br/>

//             <Button
//               label="Logout"
//               icon="pi pi-sign-out"
//               onClick={handleLogout}
//               style={{ color: "#D04A02", padding: "0%", margin: "0%" }}
//               className="p-button-text p-button-plain"
//             />
//           </OverlayPanel>
//         </ul>
//       </nav>
//     </>
//   );
// };

// export default Navbar;
























import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";

import PwC_Name_Mark_Black from "../Assets/PwC_Name_Mark_Black.png";


const Navbar = () => {
  const [Mobile, setMobile] = useState(false);
 
  const navigate = useNavigate();
  const op = useRef(null);
 
  const op2 = useRef(null);
  const toast = useRef(null);
 

  const [loginUser, setLoginUser] = useState();
  const [loginRole, setLoginRole] = useState();
  
 

  useEffect(() => {
    

    setLoginUser(sessionStorage.getItem('emailId'));
    setLoginRole(sessionStorage.getItem('userrole'));
  }, []);

 
 

  const ResetPassword = () => {
    navigate("/LoginPassword");

  
  };

  const handleLogout = () => {
if(sessionStorage.getItem('trigger')===false){
  window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
  sessionStorage.clear();

}else{
  sessionStorage.clear();
  navigate("/");
}




  };







  return (
    <>
      <Toast ref={toast} />
      <nav className="navbar">
      
      <div style={{display:"flex"}}>
         <img  style={{width:"20%",height:"40%",marginLeft:"12px"}} src={PwC_Name_Mark_Black} alt="PwC_Name_Mark_Black" /><span style={{marginLeft:"10px",fontSize:"20px"}}>| Digital Accounting Manuals</span>
         </div>


        <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to="/help">
            <Button
              type="button"
              style={{
                color: "black",
                fontWeight: "10px",
              }}
              label=" Help"
              icon="pi pi-question-circle"
              className="p-button-text"
              onClick={(e) => op2.current.toggle(e)}
              aria-haspopup
              aria-controls="overlay_panel"
            />
            </Link>
         
&nbsp;
          &nbsp;   <Button
            style={{
              background: "#D04A02",
              height: "33px",
              width: "33px",
              marginRight:"20px",
              marginTop:"5px"
            }}
            aria-label="User"
            icon="pi pi-user"
            onClick={(e) => op.current.toggle(e)}
            aria-haspopup
            aria-controls="overlay_panel"
            className="p-button-rounded p-button-danger"
          /> 

          <OverlayPanel ref={op}>
            <h4 style={{color:"#D04A02"}}>{loginUser}({loginRole})</h4>
           
<br/>
<Button
              label="Reset Password"
              
              onClick={ResetPassword }
              style={{ color: "#D04A02", padding: "0%", margin: "0%" }}
              className="p-button-text p-button-plain"
            />
            <br/>
            <br/>

            <Button
              label="Logout"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              style={{ color: "#D04A02", padding: "0%", margin: "0%" }}
              className="p-button-text p-button-plain"
            />
          </OverlayPanel>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;






























