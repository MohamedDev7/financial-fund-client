import {
	Button,
	Dialog,
	DialogActions,
	DialogBody,
	DialogContent,
	DialogSurface,
	DialogTitle,
	DialogTrigger,
	Tooltip,
	useRestoreFocusTarget,
} from "@fluentui/react-components";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { deleteTreasury, getAllTreasuries } from "../../api/serverApi";
import { toast } from "react-toastify";
import TopBar from "../../components/TopBar/TopBar";
import Table from "../../UI/table/Table";
import { AddRegular, DeleteRegular, EditRegular } from "@fluentui/react-icons";
import Card from "../../UI/card/Card";

const TreasuriesPage = () => {
	//hooks
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const restoreFocusTargetAttribute = useRestoreFocusTarget();
	const componentRef = useRef();
	//states
	const [dialog, setDialog] = useState({
		isOpened: false,
		title: "",
		content: "",
		actions: "",
	});
	//states
	//queries
	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => el);
		},
	});
	const deleteMutation = useMutation({
		mutationFn: deleteTreasury,
		onSuccess: (res) => {
			queryClient.invalidateQueries("treasuries");
			toast.success("تم حذف الصندوق بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			setDialog({
				isOpened: false,
				title: "",
				content: "",
				actions: "",
			});
		},
		onError: (err) => {
			toast.error(err.response.data.message, {
				position: toast.POSITION.TOP_CENTER,
			});
			setDialog({
				isOpened: false,
				title: "",
				content: "",
				actions: "",
			});
		},
	});
	const columns = [
		{ field: "id", headerName: "م", width: 70 },
		{ field: "name", headerName: "اسم الصندوق", width: 350 },
		{
			field: "actions",
			filterable: false,
			headerName: "خيارات",
			width: 250,
			renderCell: (params) => {
				return (
					<div style={{ display: "flex", gap: "10px" }}>
						<Tooltip content="تعديل" relationship="label">
							<Button
								appearance="primary"
								icon={<EditRegular />}
								size="medium"
								{...restoreFocusTargetAttribute}
								onClick={() => {
									navigate("./edit", { state: { id: params.id } });
								}}
							/>
						</Tooltip>
						<Tooltip content="حذف" relationship="label">
							<Button
								style={{
									backgroundColor: "#b33c37",
								}}
								appearance="primary"
								icon={<DeleteRegular />}
								size="medium"
								{...restoreFocusTargetAttribute}
								onClick={() => {
									setDialog((prev) => {
										return {
											...prev,
											isOpened: true,
											title: "حذف مستخدم",
											content: (
												<DialogContent>
													هل أنت متأكد من حذف الصندوق
													<span
														style={{
															fontWeight: "bold",
															fontSize: "16px",
															color: "#b33c37",
														}}
													>{` ${params.row.name} `}</span>
													؟
												</DialogContent>
											),
											actions: (
												<DialogActions>
													<DialogTrigger disableButtonEnhancement>
														<Button appearance="secondary">الغاء</Button>
													</DialogTrigger>
													<Button
														appearance="primary"
														onClick={() => {
															deleteMutation.mutate(params.id);
														}}
													>
														تأكيد
													</Button>
												</DialogActions>
											),
										};
									});
								}}
							/>
						</Tooltip>
					</div>
				);
			},
		},
	];
	return (
		<>
			<Dialog
				open={dialog.isOpened}
				onOpenChange={(event, data) => {
					setDialog((prev) => {
						return { ...prev, isOpened: data.open };
					});
				}}
			>
				<DialogSurface>
					<DialogBody>
						<DialogTitle>{dialog.title}</DialogTitle>
						<DialogContent ref={componentRef}>{dialog.content}</DialogContent>
						<DialogActions>{dialog.actions}</DialogActions>
					</DialogBody>
				</DialogSurface>
			</Dialog>
			<TopBar
				right={
					<>
						<TopBar
							right={
								<>
									<Button
										appearance="primary"
										icon={<AddRegular />}
										onClick={() => {
											navigate("./add");
										}}
									>
										اضافة
									</Button>
								</>
							}
						/>
					</>
				}
			/>
			<div
				style={{
					padding: "0 5px",
					marginTop: "80px",
					paddingBottom: "120px",
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				<Card title="الصناديق المالية">
					<div style={{ margin: "20px 0" }}>
						{treasuries && treasuries.length > 0 ? (
							<Table rows={treasuries} columns={columns} />
						) : (
							<div style={{ padding: "20px", textAlign: "center" }}>
								لا توجد بيانات مضافة
							</div>
						)}
					</div>
				</Card>
			</div>
		</>
	);
};

export default TreasuriesPage;
