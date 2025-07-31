"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import { db } from "../../../../utils/firebaseConfig";
import { useParams } from "next/navigation";

const XeroxViewPage = () => {
  const params = useParams();
  const { xeroxCode } = params;
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!xeroxCode) return;

      try {
        const q = query(
          collection(db, "xeroxUploads"),
          where("xeroxCenterCode", "==", xeroxCode) // ✅ fix query
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
  }, [xeroxCode]);

  const renderFile = (file) => {
    const { fileType, fileName, imageUrl } = file;

    if (fileType.startsWith("image")) {
      return (
        <div key={fileName} className="border p-4 rounded shadow-md">
          <p className="font-medium">{fileName}</p>
          <Image
            src={imageUrl}
            width={200}
            height={200}
            alt={fileName}
            className="max-w-xs mt-2"
          />
          <button
            onClick={() => window.print()}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
          >
            Print
          </button>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div key={fileName} className="border p-4 rounded shadow-md">
          <p className="font-medium">{fileName}</p>
          <iframe
            src={`${imageUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="500px"
            title={fileName}
          ></iframe>
          <button
            onClick={() => window.print()}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
          >
            Print
          </button>
        </div>
      );
    } else {
      return (
        <div key={fileName} className="border p-4 rounded shadow-md">
          <p className="font-medium">{fileName}</p>
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              imageUrl
            )}`}
            width="100%"
            height="500px"
            frameBorder="0"
            title={fileName}
          ></iframe>
          <button
            onClick={() => window.print()}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
          >
            Print
          </button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Files for Xerox Center: {xeroxCode}
      </h1>
      <div className="grid gap-6">
        {fileData.length > 0 ? (
          fileData.map((file) => renderFile(file))
        ) : (
          <p className="text-center">No files available.</p>
        )}
      </div>
    </div>
  );
};

export default XeroxViewPage;
