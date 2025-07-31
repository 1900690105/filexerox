"use client";
import { useEffect, useState } from "react";
import { FileText, Calendar, Hash, Clock, ChevronRight } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "../../../../utils/firebaseConfig";

function XeroxOrderList() {
  const [orders, setOrders] = useState([]);
  const params = useParams();
  const { xeroxCode } = params;

  useEffect(() => {
    const fetchFiles = async () => {
      if (!xeroxCode) return;

      try {
        const q = query(
          collection(db, "xeroxUploads"),
          where("xeroxCenterCode", "==", xeroxCode)
        );
        const snapshot = await getDocs(q);
        const files = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();
          if (docData) {
            // Debug: Log the createdAt field to see its format
            console.log(
              "Raw createdAt data:",
              docData.createdAt,
              typeof docData.createdAt
            );

            let createdAtDate;

            // Handle different possible formats of createdAt
            if (docData.createdAt) {
              // If it's a Firestore Timestamp
              if (
                docData.createdAt.toDate &&
                typeof docData.createdAt.toDate === "function"
              ) {
                createdAtDate = docData.createdAt.toDate();
              }
              // If it's already a Date object
              else if (docData.createdAt instanceof Date) {
                createdAtDate = docData.createdAt;
              }
              // If it's a string or number, try to parse it
              else {
                createdAtDate = new Date(docData.createdAt);
              }
            }

            // Check if the date is valid
            const isValidDate =
              createdAtDate && !isNaN(createdAtDate.getTime());

            const formattedData = {
              ...docData,
              formattedDate: isValidDate
                ? createdAtDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date not available",
              formattedTime: isValidDate
                ? createdAtDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Time not available",
            };
            files.push(formattedData);
          }
        });

        setOrders(files);
        console.log(files);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [xeroxCode]);

  // Remove the problematic second useEffect - it's no longer needed

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      processing: "bg-amber-100 text-amber-800 border-amber-200",
      pending: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Xerox Orders</h1>
          </div>
          <p className="text-slate-600">
            Manage and track your printing orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.length}
                </p>
              </div>
              <Hash className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Files
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.reduce(
                    (sum, order) => sum + (order.totalFiles || 0),
                    0
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    orders.filter((order) => order.status === "completed")
                      .length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Orders
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order, index) => (
                  <tr
                    key={order.orderid || index}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Hash className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            Order #{order.orderid}
                          </div>
                          <div className="text-sm text-slate-500">
                            ID: {order.orderid}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-900">
                          {order.totalFiles || 0}{" "}
                          {(order.totalFiles || 0) === 1 ? "file" : "files"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(order.status || "pending")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-900">
                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                        <div>
                          <div className="font-medium">
                            {order.formattedDate || "N/A"}
                          </div>
                          <div className="text-slate-500">
                            {order.formattedTime || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          window.location.href = `/xerox/${xeroxCode}/${order.orderid}`;
                        }}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-150"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No orders found
              </h3>
              <p className="text-slate-500">
                Orders will appear here once they are created.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Showing {orders.length} orders • Last updated just now
          </p>
        </div>
      </div>
    </div>
  );
}

export default XeroxOrderList;

// "use client";
// import { useEffect, useState } from "react";
// import { FileText, Calendar, Hash, Clock, ChevronRight } from "lucide-react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { useParams } from "next/navigation";
// import { db } from "../../../../utils/firebaseConfig";

// function XeroxOrderList() {
//   const [orders, setOrders] = useState([]);
//   const params = useParams();
//   const { xeroxCode } = params;

//   useEffect(() => {
//     const fetchFiles = async () => {
//       if (!xeroxCode) return;

//       try {
//         const q = query(
//           collection(db, "xeroxUploads"),
//           where("xeroxCenterCode", "==", xeroxCode) // ✅ fix query
//         );
//         const snapshot = await getDocs(q);
//         const files = [];

//         snapshot.forEach((doc) => {
//           const docData = doc.data();
//           if (docData) {
//             files.push(docData);
//           }
//         });
//         setOrders(files);
//         console.log(files);
//       } catch (err) {
//         console.error("Error fetching files:", err);
//       }
//     };

//     fetchFiles();
//   }, [xeroxCode]);

//   useEffect(() => {
//     const formatted = orders.map((order) => ({
//       ...order,
//       formattedDate: new Date(order.createdAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       }),
//       formattedTime: new Date(order.createdAt).toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     }));

//     setOrders(formatted);
//   }, []);

//   const getStatusBadge = (status) => {
//     const styles = {
//       completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
//       processing: "bg-amber-100 text-amber-800 border-amber-200",
//       pending: "bg-slate-100 text-slate-600 border-slate-200",
//     };

//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
//       >
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-blue-600 rounded-lg">
//               <FileText className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-slate-800">Xerox Orders</h1>
//           </div>
//           <p className="text-slate-600">
//             Manage and track your printing orders
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">
//                   Total Orders
//                 </p>
//                 <p className="text-2xl font-bold text-slate-900">
//                   {orders.length}
//                 </p>
//               </div>
//               <Hash className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">
//                   Total Files
//                 </p>
//                 <p className="text-2xl font-bold text-slate-900">
//                   {orders.reduce((sum, order) => sum + order.totalFiles, 0)}
//                 </p>
//               </div>
//               <FileText className="w-8 h-8 text-emerald-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Completed</p>
//                 <p className="text-2xl font-bold text-slate-900">
//                   {
//                     orders.filter((order) => order.status === "completed")
//                       .length
//                   }
//                 </p>
//               </div>
//               <Clock className="w-8 h-8 text-amber-600" />
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-200">
//             <h2 className="text-lg font-semibold text-slate-800">
//               Recent Orders
//             </h2>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Order Details
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Files
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Date & Time
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200">
//                 {orders.map((order, index) => (
//                   <tr
//                     key={index}
//                     className="hover:bg-slate-50 transition-colors duration-150"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <Hash className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium text-slate-900">
//                             Order #{order.orderid}
//                           </div>
//                           <div className="text-sm text-slate-500">
//                             ID: {order.orderid}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <FileText className="w-4 h-4 text-slate-400 mr-2" />
//                         <span className="text-sm font-medium text-slate-900">
//                           {order.totalFiles}{" "}
//                           {order.totalFiles === 1 ? "file" : "files"}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       {getStatusBadge("processing")}
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center text-sm text-slate-900">
//                         <Calendar className="w-4 h-4 text-slate-400 mr-2" />
//                         <div>
//                           <div className="font-medium">
//                             {order.formattedDate}
//                           </div>
//                           <div className="text-slate-500">
//                             {order.formattedTime}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <button className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-150">
//                         View Details
//                         <ChevronRight className="w-4 h-4 ml-1" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-sm text-slate-500">
//             Showing {orders.length} orders • Last updated just now
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default XeroxOrderList;
