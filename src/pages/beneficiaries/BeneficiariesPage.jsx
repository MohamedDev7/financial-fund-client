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
import TopBar from "../../components/TopBar/TopBar";
import { AddRegular, DeleteRegular, EditRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteBeneficiary, getAllBeneficiaries } from "../../api/serverApi";
import Card from "../../UI/card/Card";
import Table from "../../UI/table/Table";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
const BeneficiariesPage = () => {
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
	const { data: beneficiaries } = useQuery({
		queryKey: ["beneficiaries"],
		queryFn: getAllBeneficiaries,
		select: (res) => {
			return res.data.beneficiaries.map((el) => el);
		},
	});
	const deleteMutation = useMutation({
		mutationFn: deleteBeneficiary,
		onSuccess: (res) => {
			queryClient.invalidateQueries("beneficiaries");
			toast.success("تم حذف المستخدم بنجاح", {
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
	//functions
	const columns = [
		{ field: "id", headerName: "م", width: 70 },
		{ field: "name", headerName: "الاسم", width: 350 },
		{ field: "financial_num", headerName: "الرقم المالي", width: 350 },
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
													هل أنت متأكد من حذف المستفيد
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
				<Card title="المستفيدين">
					<div style={{ margin: "20px 0" }}>
						{beneficiaries && beneficiaries.length > 0 && (
							<Table rows={beneficiaries} columns={columns} />
						)}
					</div>
				</Card>
			</div>
		</>
	);
};

export default BeneficiariesPage;
