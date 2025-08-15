// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   FileText,
//   Filter,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Calendar,
//   RefreshCw,
//   Plus,
//   Send,
//   Eye,
//   CheckCheck,
// } from "lucide-react";
// import {
//   useRequestList,
//   useUpdateRequestStatus,
// } from "@/hooks/queries/request";
// import {
//   RequestWithDocumentStatus,
//   NotificationItem,
// } from "@/types/notification";
// import { useQuery } from "@tanstack/react-query";
// import { getNotificationList } from "@/services/resources/notification";
// import { toast } from "sonner";
// import {
//   finalApproveProposal,
//   updateProjectStatus,
// } from "@/services/resources/notification";
// import { useMutation } from "@tanstack/react-query";

// const RequestManagement: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [selectedRequest, setSelectedRequest] =
//     useState<RequestWithDocumentStatus | null>(null);
//   const [actionType, setActionType] = useState<
//     "approve" | "reject" | "create_document" | null
//   >(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [setIsDocumentDialogOpen] = useState(false);

//   // Build request parameters
//   const requestParams = {
//     isRequest: true,
//     "page-index": currentPage,
//     "page-size": pageSize,
//     ...(statusFilter !== "all" && {
//       status: statusFilter as "pending" | "approved" | "rejected",
//     }),
//   };

//   // Debug: Log the request parameters
//   console.log("Request params for getRequestList:", requestParams);

//   // Hooks - Try both APIs
//   const {
//     data: requestData,
//     isLoading,
//     error,
//     refetch,
//   } = useRequestList(requestParams);

//   // Alternative: Try using normal notification API
//   const {
//     data: notificationData,
//     isLoading: isNotificationLoading,
//     error: notificationError,
//   } = useQuery({
//     queryKey: ["notifications", currentPage, pageSize],
//     queryFn: () =>
//       getNotificationList({
//         "page-index": currentPage,
//         "page-size": pageSize,
//       }),
//     staleTime: 1000 * 60 * 5,
//   });

//   const updateStatusMutation = useUpdateRequestStatus();

//   // Create mutation for updating project status
//   const updateProjectMutation = useMutation({
//     mutationFn: ({
//       projectId,
//       status,
//     }: {
//       projectId: string;
//       status: string;
//     }) => updateProjectStatus(projectId, status),
//     onSuccess: () => {
//       refetch(); // Refresh the data
//     },
//   });

//   const requests = requestData?.["data-list"] || [];
//   const totalPages = requestData?.["total-page"] || 1;
//   const totalCount = requestData?.["total-count"] || 0;

//   // Get notifications as alternative data source
//   const notifications = notificationData?.["data-list"] || [];

//   // Debug: Log both data sources
//   console.log("Request data received:", requestData);
//   console.log("Number of requests:", requests.length);
//   console.log("Notification data received:", notificationData);
//   console.log("Number of notifications:", notifications.length);

//   // Merge both requests and notifications data
//   const mappedNotifications = notifications.map(
//     (notification: NotificationItem) => ({
//       Id: notification.id,
//       Title: notification.title,
//       Type: notification.type,
//       Status: notification.status,
//       CreateDate: notification["create-date"],
//       IsGlobalSend: notification["is-global-send"],
//       ProjectId: notification["type-object-id"],
//       source: "notification" as const,
//       // Set document status based on notification title
//       documentStatus: notification.title.includes("Ready for Final Approval")
//         ? "returned_from_pi"
//         : undefined,
//       documentId: notification["type-object-id"], // Document ID from notification
//     })
//   );

//   const mappedRequests = requests.map((request: RequestWithDocumentStatus) => ({
//     ...request,
//     source: "request" as const,
//   }));

//   // Combine both data sources, prioritizing requests but including notifications
//   const displayData = [...mappedRequests, ...mappedNotifications];
//   const displayCount = totalCount + notifications.length;

//   console.log("Final display data:", displayData);
//   console.log("Mapped notifications:", mappedNotifications.length);
//   console.log("Mapped requests:", mappedRequests.length);

//   const handleStatusFilter = (value: string) => {
//     setStatusFilter(value);
//     setCurrentPage(1); // Reset to first page when filtering
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleConfirmAction = async () => {
//     if (!selectedRequest || !actionType) return;

//     try {
//       if (actionType === "approve") {
//         // Duyệt proposal và chuyển project status thành "in-progress" luôn
//         if (!selectedRequest.ProjectId) {
//           toast.error("No project ID found for this request");
//           return;
//         }

//         await updateProjectMutation.mutateAsync({
//           projectId: selectedRequest.ProjectId,
//           status: "inprogress",
//         });

//         toast.success("Proposal đã được duyệt và chuyển thành In Progress!");
//       } else {
//         // Từ chối request
//         await updateStatusMutation.mutateAsync({
//           id: selectedRequest.Id,
//           status: "rejected",
//         });

//         toast.success("Request đã được từ chối thành công");
//       }

//       setIsDialogOpen(false);
//       setSelectedRequest(null);
//       setActionType(null);
//       refetch(); // Refresh data
//     } catch (error) {
//       toast.error(
//         actionType === "approve"
//           ? "Có lỗi xảy ra khi duyệt proposal"
//           : "Có lỗi xảy ra khi từ chối request"
//       );
//       console.error("Error updating:", error);
//     }
//   };

//   const handleFinalApprove = async (request?: RequestWithDocumentStatus) => {
//     const targetRequest = request || selectedRequest;

//     if (!targetRequest) {
//       toast.error("No request selected for final approval");
//       return;
//     }

//     if (!targetRequest.ProjectId) {
//       toast.error("No project ID found for this request");
//       return;
//     }

//     if (!targetRequest.documentId) {
//       toast.error("No document ID found for this request");
//       return;
//     }

//     try {
//       // Call final approve API
//       await finalApproveProposal(
//         targetRequest.ProjectId,
//         targetRequest.documentId
//       );

//       toast.success(
//         "Document đã được phê duyệt cuối cùng! Project chuyển sang trạng thái In Progress."
//       );

//       // Refresh the request list
//       refetch();
//     } catch (error) {
//       toast.error("Có lỗi xảy ra khi phê duyệt cuối cùng");
//       console.error("Error final approving:", error);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-amber-50 text-amber-700 border-amber-200"
//           >
//             <Clock className="h-3 w-3 mr-1" />
//             Pending
//           </Badge>
//         );
//       case "approved":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-green-50 text-green-700 border-green-200"
//           >
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Approved
//           </Badge>
//         );
//       case "rejected":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-red-50 text-red-700 border-red-200"
//           >
//             <XCircle className="h-3 w-3 mr-1" />
//             Rejected
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getDocumentStatusBadge = (documentStatus?: string) => {
//     if (!documentStatus) return null;

//     switch (documentStatus) {
//       case "not_created":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-gray-50 text-gray-700 border-gray-200"
//           >
//             <FileText className="h-3 w-3 mr-1" />
//             Not Created
//           </Badge>
//         );
//       case "created":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-blue-50 text-blue-700 border-blue-200"
//           >
//             <Plus className="h-3 w-3 mr-1" />
//             Created
//           </Badge>
//         );
//       case "sent_to_pi":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-orange-50 text-orange-700 border-orange-200"
//           >
//             <Send className="h-3 w-3 mr-1" />
//             Sent to PI
//           </Badge>
//         );
//       case "returned_from_pi":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-purple-50 text-purple-700 border-purple-200"
//           >
//             <Eye className="h-3 w-3 mr-1" />
//             Returned from PI
//           </Badge>
//         );
//       case "approved":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-green-50 text-green-700 border-green-200"
//           >
//             <CheckCheck className="h-3 w-3 mr-1" />
//             Final Approved
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">{documentStatus}</Badge>;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const renderPagination = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
//     const startPage = Math.max(
//       1,
//       currentPage - Math.floor(maxVisiblePages / 2)
//     );
//     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <Button
//           key={i}
//           variant={i === currentPage ? "default" : "outline"}
//           size="sm"
//           onClick={() => handlePageChange(i)}
//           className="mx-1"
//         >
//           {i}
//         </Button>
//       );
//     }

//     return (
//       <div className="flex items-center justify-between mt-6">
//         <p className="text-sm text-gray-600">
//           Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
//           {Math.min(currentPage * pageSize, displayCount)} trong số{" "}
//           {displayCount} requests
//         </p>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Trước
//           </Button>
//           {pages}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Sau
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   // Show error only if both APIs fail
//   if (error && notificationError) {
//     console.error("Request list error:", error);
//     console.error("Notification list error:", notificationError);
//     return (
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center py-8">
//             <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <p className="text-lg font-medium text-gray-900 mb-2">
//               Có lỗi xảy ra
//             </p>
//             <p className="text-gray-600 mb-4">
//               Không thể tải danh sách requests và notifications
//             </p>
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
//               <p className="text-sm text-red-800">
//                 <strong>Debug Info:</strong>
//                 <br />
//                 Request API Error: {(error as Error)?.message}
//                 <br />
//                 Notification API Error: {(notificationError as Error)?.message}
//                 <br />
//                 Request params: {JSON.stringify(requestParams, null, 2)}
//               </p>
//             </div>
//             <Button onClick={() => refetch()} variant="outline">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Thử lại
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FileText className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <CardTitle className="text-xl font-bold">
//                   Request Management
//                 </CardTitle>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Quản lý và xử lý các yêu cầu từ người dùng
//                 </p>
//               </div>
//             </div>
//             <Button onClick={() => refetch()} variant="outline" size="sm">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Làm mới
//             </Button>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">
//                 Lọc theo trạng thái:
//               </span>
//             </div>
//             <Select value={statusFilter} onValueChange={handleStatusFilter}>
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="Chọn trạng thái" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tất cả</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="approved">Approved</SelectItem>
//                 <SelectItem value="rejected">Rejected</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Request Table */}
//       <Card>
//         <CardContent className="pt-6">
//           {isLoading || isNotificationLoading ? (
//             <div className="space-y-4">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="flex items-center gap-4">
//                   <Skeleton className="h-12 w-12 rounded-full" />
//                   <div className="space-y-2 flex-1">
//                     <Skeleton className="h-4 w-1/2" />
//                     <Skeleton className="h-3 w-1/3" />
//                   </div>
//                   <Skeleton className="h-8 w-24" />
//                   <Skeleton className="h-8 w-20" />
//                 </div>
//               ))}
//             </div>
//           ) : displayData.length === 0 ? (
//             <div className="text-center py-12">
//               <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-lg font-medium text-gray-900 mb-2">
//                 Không có request nào
//               </p>
//               <p className="text-gray-600">
//                 {statusFilter === "all"
//                   ? "Chưa có request nào được tạo. Hãy thử Council approve một proposal để tạo request."
//                   : `Không có request nào với trạng thái "${statusFilter}"`}
//               </p>
//               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   <strong>Để test tính năng:</strong>
//                   <br />
//                   1. Vào Council → Project Approval
//                   <br />
//                   2. Chọn một topic có proposals
//                   <br />
//                   3. Click "Select Proposal" và approve một proposal
//                   <br />
//                   4. Request sẽ xuất hiện ở đây
//                 </p>
//               </div>
//               <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//                 <p className="text-sm text-gray-800">
//                   <strong>Debug Info:</strong>
//                   <br />
//                   Requests API: {requests.length} items
//                   <br />
//                   Notifications API: {notifications.length} items
//                   <br />
//                   Total Display Items: {displayData.length}
//                   <br />
//                   Request API Error: {error ? (error as Error).message : "None"}
//                   <br />
//                   Notification API Error:{" "}
//                   {notificationError
//                     ? (notificationError as Error).message
//                     : "None"}
//                   <br />
//                   Loading states: Request={isLoading.toString()}, Notification=
//                   {isNotificationLoading.toString()}
//                   <br />
//                   Status Filter: {statusFilter}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Tiêu đề</TableHead>
//                     <TableHead>Loại</TableHead>
//                     <TableHead>Nguồn</TableHead>
//                     <TableHead>Trạng thái Request</TableHead>
//                     <TableHead>Trạng thái Document</TableHead>
//                     <TableHead>Ngày tạo</TableHead>
//                     <TableHead>Thao tác</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {displayData.map((request) => {
//                     const requestWithStatus =
//                       request as RequestWithDocumentStatus;
//                     // Simulate document status based on request status for demo
//                     if (
//                       !requestWithStatus.documentStatus &&
//                       requestWithStatus.Status === "approved"
//                     ) {
//                       requestWithStatus.documentStatus = "not_created";
//                     }

//                     return (
//                       <TableRow key={request.Id}>
//                         <TableCell>
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {request.Title}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               ID: {request.Id}
//                             </p>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant="outline"
//                             className="bg-gray-50 text-gray-700"
//                           >
//                             {request.Type}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant="outline"
//                             className={
//                               "source" in request &&
//                               request.source === "request"
//                                 ? "bg-blue-50 text-blue-700 border-blue-200"
//                                 : "bg-purple-50 text-purple-700 border-purple-200"
//                             }
//                           >
//                             {"source" in request && request.source === "request"
//                               ? "Request API"
//                               : "Notification API"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{getStatusBadge(request.Status)}</TableCell>
//                         <TableCell>
//                           {getDocumentStatusBadge(
//                             requestWithStatus.documentStatus
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Calendar className="h-4 w-4" />
//                             {formatDate(request.CreateDate)}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-2 flex-wrap">
//                             {/* Pending requests - approve/reject */}
//                             {request.Status === "pending" && (
//                               <>
//                                 <Button
//                                   size="sm"
//                                   onClick={() =>
//                                     handleActionClick(
//                                       requestWithStatus,
//                                       "approve"
//                                     )
//                                   }
//                                   disabled={
//                                     updateProjectMutation.isPending ||
//                                     updateStatusMutation.isPending
//                                   }
//                                   className="bg-green-600 hover:bg-green-700 text-white"
//                                 >
//                                   <CheckCircle className="h-4 w-4 mr-1" />
//                                   {updateProjectMutation.isPending
//                                     ? "Đang duyệt..."
//                                     : "Duyệt"}
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="destructive"
//                                   onClick={() =>
//                                     handleActionClick(
//                                       requestWithStatus,
//                                       "reject"
//                                     )
//                                   }
//                                   disabled={
//                                     updateProjectMutation.isPending ||
//                                     updateStatusMutation.isPending
//                                   }
//                                 >
//                                   <XCircle className="h-4 w-4 mr-1" />
//                                   Từ chối
//                                 </Button>
//                               </>
//                             )}

//                             {/* Approved requests - document workflow */}
//                             {request.Status === "approved" && (
//                               <>
//                                 {(!requestWithStatus.documentStatus ||
//                                   requestWithStatus.documentStatus ===
//                                     "not_created") && (
//                                   <Button
//                                     size="sm"
//                                     onClick={() =>
//                                       handleActionClick(
//                                         requestWithStatus,
//                                         "create_document"
//                                       )
//                                     }
//                                     disabled={updateStatusMutation.isPending}
//                                     className="bg-blue-600 hover:bg-blue-700 text-white"
//                                   >
//                                     <Plus className="h-4 w-4 mr-1" />
//                                     Tạo Document
//                                   </Button>
//                                 )}

//                                 {requestWithStatus.documentStatus ===
//                                   "returned_from_pi" && (
//                                   <Button
//                                     size="sm"
//                                     onClick={() => handleFinalApprove()}
//                                     disabled={updateStatusMutation.isPending}
//                                     className="bg-green-600 hover:bg-green-700 text-white"
//                                   >
//                                     <CheckCheck className="h-4 w-4 mr-1" />
//                                     Phê duyệt cuối
//                                   </Button>
//                                 )}
//                               </>
//                             )}

//                             {/* Show document status info for approved requests */}
//                             {request.Status === "approved" &&
//                               requestWithStatus.documentStatus ===
//                                 "sent_to_pi" && (
//                                 <div className="text-sm text-gray-600 italic">
//                                   Đang chờ PI chỉnh sửa...
//                                 </div>
//                               )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>

//               {totalPages > 1 && renderPagination()}
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Confirmation Dialog */}
//       <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {actionType === "approve"
//                 ? "Phê duyệt Request"
//                 : "Từ chối Request"}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {actionType === "approve" ? (
//                 <>
//                   Bạn có chắc chắn muốn <strong>duyệt</strong> proposal{" "}
//                   <strong>"{selectedRequest?.Title}"</strong>?
//                   <span className="block mt-2 text-green-600 font-medium">
//                     Proposal sẽ được chuyển thành trạng thái "In Progress" ngay
//                     lập tức.
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   Bạn có chắc chắn muốn <strong>từ chối</strong> request{" "}
//                   <strong>"{selectedRequest?.Title}"</strong>?
//                   <span className="block mt-2 text-red-600 font-medium">
//                     Hành động này không thể hoàn tác.
//                   </span>
//                 </>
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               disabled={
//                 updateProjectMutation.isPending ||
//                 updateStatusMutation.isPending
//               }
//             >
//               Hủy
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleConfirmAction}
//               disabled={
//                 updateProjectMutation.isPending ||
//                 updateStatusMutation.isPending
//               }
//               className={
//                 actionType === "approve"
//                   ? "bg-green-600 hover:bg-green-700"
//                   : "bg-red-600 hover:bg-red-700"
//               }
//             >
//               {updateProjectMutation.isPending || updateStatusMutation.isPending
//                 ? "Đang xử lý..."
//                 : actionType === "approve"
//                 ? "Duyệt & Chuyển In Progress"
//                 : "Từ chối"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default RequestManagement;
