"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { db } from "../../../../../utils/firebaseConfig";

const XeroxViewPage = () => {
  const params = useParams();
  const orderId = params.orderId;
  const xeroxCode = params.xeroxCode;
  const [fileData, setFileData] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!xeroxCode) return;
      try {
        const q = query(
          collection(db, "xeroxUploads"),
          where("xeroxCenterCode", "==", xeroxCode),
          where("orderid", "==", Number(orderId))
        );
        const snapshot = await getDocs(q);
        const files = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();
          if (docData.files && Array.isArray(docData.files)) {
            files.push(...docData.files);
          }
        });

        setFileData(files);
        console.log(files);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [xeroxCode, orderId]);

  const downloadAndPrint = async (file) => {
    setIsLoading(true);
    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print - ${file.fileName}</title>
            <style>
              @media print {
                @page {
                  margin: 0.5in;
                  size: auto;
                }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  page-break-inside: avoid;
                }
                iframe {
                  width: 100%;
                  height: 100vh;
                  border: none;
                }
                .no-print {
                  display: none !important;
                }
              }
              body {
                margin: 20px;
                font-family: Arial, sans-serif;
              }
              .print-button {
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-bottom: 20px;
              }
              .print-button:hover {
                background: #0056b3;
              }
              img {
                max-width: 100%;
                height: auto;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 5px;
              }
              iframe {
                width: 100%;
                height: 80vh;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <button class="print-button no-print" onclick="window.print()">Print Document</button>
            <h2 class="no-print">File: ${file.fileName}</h2>
      `);

      if (file.fileType.startsWith("image")) {
        printWindow.document.write(`
          <img src="${file.imageUrl}" alt="${file.fileName}" />
        `);
      } else if (file.fileType === "application/pdf") {
        printWindow.document.write(`
          <iframe src="${file.imageUrl}#toolbar=0&navpanes=0&scrollbar=0" title="${file.fileName}"></iframe>
        `);
      } else {
        // For other document types (Word, PPT, etc.)
        printWindow.document.write(`
          <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            file.imageUrl
          )}" title="${file.fileName}"></iframe>
        `);
      }

      printWindow.document.write(`
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load before enabling print
      printWindow.onload = () => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      };
    } catch (error) {
      console.error("Error preparing document for print:", error);
      setIsLoading(false);
      alert("Error preparing document for printing. Please try again.");
    }
  };

  const directDownload = (file) => {
    // Create a temporary link to download the file
    const link = document.createElement("a");
    link.href = file.imageUrl;
    link.download = file.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewDocument = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const renderFileCard = (file) => {
    const { fileType, fileName, imageUrl } = file;
    const isImage = fileType.startsWith("image");
    const isPdf = fileType === "application/pdf";

    return (
      <div key={fileName} className="border p-4 rounded-lg shadow-md bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-lg truncate">{fileName}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {fileType.split("/")[1]?.toUpperCase() || "FILE"}
          </span>
        </div>

        {/* Preview thumbnail */}
        <div className="mb-4 bg-gray-50 rounded p-2 h-32 flex items-center justify-center">
          {isImage ? (
            <Image
              src={imageUrl}
              width={100}
              height={100}
              alt={fileName}
              className="max-h-28 max-w-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm">
                {isPdf ? "PDF Document" : "Document"}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => previewDocument(file)}
            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => downloadAndPrint(file)}
            disabled={isLoading}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Preparing..." : "Print"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Xerox Center: {xeroxCode}
          </h1>
          <p className="text-gray-600">Order ID: {orderId}</p>
          <p className="text-sm text-gray-500 mt-2">
            Total Files: {fileData.length}
          </p>
        </div>

        {fileData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fileData.map((file) => renderFileCard(file))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <p className="text-xl text-gray-600">No files available</p>
            <p className="text-sm text-gray-500 mt-2">
              Please check the order ID and xerox center code
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold truncate">
                {previewFile.fileName}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadAndPrint(previewFile)}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? "Preparing..." : "Print"}
                </button>
                <button
                  onClick={closePreview}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {previewFile.fileType.startsWith("image") ? (
                <Image
                  src={previewFile.imageUrl}
                  height={100}
                  width={100}
                  alt={previewFile.fileName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : previewFile.fileType === "application/pdf" ? (
                <iframe
                  src={`${previewFile.imageUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  width="100%"
                  height="600px"
                  title={previewFile.fileName}
                  className="border rounded"
                />
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    previewFile.imageUrl
                  )}`}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  title={previewFile.fileName}
                  className="border rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">
              Preparing document for printing...
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Please wait while we load the complete document
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default XeroxViewPage;

// "use client";
// import { useEffect, useState } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import Image from "next/image";

// import { useParams } from "next/navigation";
// import { db } from "../../../../../utils/firebaseConfig";

// const XeroxViewPage = () => {
//   const params = useParams();
//   const orderId = params.orderId;
//   const xeroxCode = params.xeroxCode;
//   const [fileData, setFileData] = useState([]);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       if (!xeroxCode) return;
//       try {
//         const q = query(
//           collection(db, "xeroxUploads"),
//           where("xeroxCenterCode", "==", xeroxCode),
//           where("orderid", "==", Number(orderId))
//         );
//         const snapshot = await getDocs(q);
//         const files = [];

//         snapshot.forEach((doc) => {
//           const docData = doc.data();
//           if (docData.files && Array.isArray(docData.files)) {
//             files.push(...docData.files);
//           }
//         });

//         setFileData(files);
//         console.log(files);
//       } catch (err) {
//         console.error("Error fetching files:", err);
//       }
//     };

//     fetchFiles();
//   }, [xeroxCode, orderId]);

//   const renderFile = (file) => {
//     const { fileType, fileName, imageUrl } = file;

//     if (fileType.startsWith("image")) {
//       return (
//         <div key={fileName} className="border p-4 rounded shadow-md">
//           <p className="font-medium">{fileName}</p>
//           <Image
//             src={imageUrl}
//             width={200}
//             height={200}
//             alt={fileName}
//             className="max-w-xs mt-2"
//           />
//           <button
//             onClick={() => window.print()}
//             className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
//           >
//             Print
//           </button>
//         </div>
//       );
//     } else if (fileType === "application/pdf") {
//       return (
//         <div key={fileName} className="border p-4 rounded shadow-md">
//           <p className="font-medium">{fileName}</p>
//           <iframe
//             src={`${imageUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//             width="100%"
//             height="500px"
//             title={fileName}
//           ></iframe>
//           <button
//             onClick={() => window.print()}
//             className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
//           >
//             Print
//           </button>
//         </div>
//       );
//     } else {
//       return (
//         <div key={fileName} className="border p-4 rounded shadow-md">
//           <p className="font-medium">{fileName}</p>
//           <iframe
//             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//               imageUrl
//             )}`}
//             width="100%"
//             height="500px"
//             frameBorder="0"
//             title={fileName}
//           ></iframe>
//           <button
//             onClick={() => window.print()}
//             className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
//           >
//             Print
//           </button>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Files for Xerox Center: {xeroxCode}
//       </h1>
//       <div className="grid gap-6">
//         {fileData.length > 0 ? (
//           fileData.map((file) => renderFile(file))
//         ) : (
//           <p className="text-center">No files available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default XeroxViewPage;
