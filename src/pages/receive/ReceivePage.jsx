import React, { useContext, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {
	deleteReceive,
	getAllReceives,
	getAllTreasuries,
} from "../../api/serverApi";
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
} from "@fluentui/react-components";
import { AddRegular, PrintRegular, DeleteRegular } from "@fluentui/react-icons";
import Card from "../../UI/card/Card";
import TopBar from "../../components/TopBar/TopBar";
import Table from "../../UI/table/Table";
import { toast } from "react-toastify";
import { AuthContext } from "../../store/auth-context";

const ReceivePage = () => {
	//hooks
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const authCtx = useContext(AuthContext);
	const componentRef = useRef();
	//states
	const [dialog, setDialog] = useState({
		isOpened: false,
		title: "",
		content: "",
		actions: "",
	});
	//queries

	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => {
				return { ...el };
			});
		},
	});
	const { data: receives } = useQuery({
		queryKey: ["receives"],
		queryFn: getAllReceives,
		select: (res) => {
			return res.data.receives.map((el) => {
				return {
					...el,
					clauseText: treasuries.filter((ele) => ele.id === el.clause)[0].name,
				};
			});
		},
		enabled: !!treasuries,
	});
	const deleteMutation = useMutation({
		mutationFn: deleteReceive,
		onSuccess: (res) => {
			toast.success("تم الحذف بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["receives"] });
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
	//functions

	const columns = [
		{ field: "id", headerName: "م", width: "60" },
		{ field: "title", headerName: "العنوان", width: "250" },
		{ field: "money_from", headerName: "الاسم", width: "250" },
		{ field: "amount", headerName: "المبلغ", width: "100" },
		{ field: "clauseText", headerName: "البند", width: "100" },

		{
			field: "actions",
			headerName: "خيارات",
			width: "200",
			renderCell: (params) => {
				return (
					<div style={{ display: "flex", gap: "5px" }}>
						<Tooltip content="طباعة" relationship="label">
							<Button
								onClick={() => {
									navigate("./print", {
										state: {
											receive: params.row,
										},
									});
								}}
								appearance="primary"
								icon={<PrintRegular />}
							/>
						</Tooltip>
						<Tooltip content="حذف" relationship="label">
							<Button
								disabled={authCtx.permissions.deleteReceive ? false : true}
								appearance="primary"
								style={{
									backgroundColor: !authCtx.permissions.deleteReceive
										? "#ededed"
										: "#d11a2a ",
								}}
								onClick={() => {
									setDialog((prev) => {
										return {
											...prev,
											isOpened: true,
											title: "حذف سند قبض مستحقات",
											content: (
												<>
													<div>
														{`هل انت متاكد من حذف سند القبض رقم ${params.row.id} بعنوان ${params.row.title} ؟`}
													</div>
												</>
											),
											actions: (
												<>
													<DialogTrigger disableButtonEnhancement>
														<Button appearance="secondary">الغاء</Button>
													</DialogTrigger>
													<Button
														appearance="primary"
														onClick={() => {
															deleteMutation.mutate(params.row.id);
														}}
													>
														تأكيد
													</Button>
												</>
											),
										};
									});
								}}
								icon={<DeleteRegular />}
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
				{receives && (
					<Card title="كشف سندات القبض">
						<div style={{ margin: "20px 0" }}>
							<Table columns={columns} rows={receives} />
						</div>
					</Card>
				)}
			</div>
		</>
	);
};

export default ReceivePage;
