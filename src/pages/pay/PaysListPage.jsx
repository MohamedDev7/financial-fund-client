import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePay, getAllPays, getAllTreasuries } from "../../api/serverApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
import TopBar from "../../components/TopBar/TopBar";
import Card from "../../UI/card/Card";
import Table from "../../UI/table/Table";
import { AuthContext } from "../../store/auth-context";
import { toast } from "react-toastify";
const PaysListPage = () => {
	//hooks
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const authCtx = useContext(AuthContext);
	// const restoreFocusTargetAttribute = useRestoreFocusTarget();
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
	const { data: pays } = useQuery({
		queryKey: ["pays"],
		queryFn: getAllPays,
		select: (res) => {
			return res.data.pays.map((el) => {
				return {
					...el,
					clauseText: treasuries.filter((ele) => ele.id === el.clause)[0].name,
				};
			});
		},
		enabled: !!treasuries,
	});
	const deleteMutation = useMutation({
		mutationFn: deletePay,
		onSuccess: (res) => {
			toast.success("تم الحذف بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["pays"] });
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
		{ field: "name", headerName: "الاسم", width: "250" },
		{ field: "amount", headerName: "المبلغ", width: "100" },
		{ field: "clauseText", headerName: "البند", width: "100" },
		{
			field: "actions",
			headerName: "خيارات",
			width: "200",
			renderCell: (params) => {
				console.log(`params,row.state`, params.row.state);
				return (
					<div style={{ display: "flex", gap: "5px" }}>
						<Tooltip content="طباعة" relationship="label">
							<Button
								onClick={() => {
									if (params.row.type === "dues") {
										navigate("./printDues", {
											state: {
												pay: params.row,
											},
										});
									} else if (params.row.type === "duesList") {
										navigate("./printDuesList", {
											state: {
												pay: params.row,
											},
										});
									} else {
										navigate("./print", {
											state: {
												pay: params.row,
											},
										});
									}
								}}
								appearance="primary"
								icon={<PrintRegular />}
							/>
						</Tooltip>
						<Tooltip content="حذف" relationship="label">
							<Button
								disabled={
									authCtx.permissions.deletePay && params.row.state !== "closed"
										? false
										: true
								}
								appearance="primary"
								style={{
									backgroundColor:
										authCtx.permissions.deletePay &&
										params.row.state !== "closed"
											? "#d11a2a"
											: "#ededed",
								}}
								onClick={() => {
									setDialog((prev) => {
										return {
											...prev,
											isOpened: true,
											title: "حذف سند صرف مستحقات",
											content: (
												<>
													<div>
														{`هل انت متاكد من حذف سند الصرف رقم ${params.row.id} بعنوان ${params.row.title} ؟`}
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
					// marginTop: "80px",
					paddingBottom: "120px",
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				{pays && pays.length > 0 && (
					<Card title="كشف سندات الصرف">
						<div style={{ margin: "20px 0" }}>
							<Table columns={columns} rows={pays} />
						</div>
					</Card>
				)}
			</div>
		</>
	);
};

export default PaysListPage;
