import React, { useContext, useRef, useState } from "react";
import TopBar from "../../components/TopBar/TopBar";
import {
	Button,
	Dialog,
	DialogActions,
	DialogBody,
	DialogContent,
	DialogSurface,
	DialogTitle,
	DialogTrigger,
	Select,
	Tooltip,
	useRestoreFocusTarget,
	Menu,
	MenuTrigger,
	MenuPopover,
	MenuList,
	MenuItem,
} from "@fluentui/react-components";
import {
	DeleteRegular,
	PrintRegular,
	AddRegular,
	EditRegular,
	CopyAddRegular,
} from "@fluentui/react-icons";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
	deleteDuesList,
	getAllDuesLists,
	getAllTreasuries,
	sendWhatsappMessages,
	updateDuesListState,
} from "../../api/serverApi";
import Card from "../../UI/card/Card";
import Table from "../../UI/table/Table";
import { toast } from "react-toastify";
import { AuthContext } from "../../store/auth-context";
const DuesListsPage = () => {
	//hooks
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
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
	const { data: duesLists } = useQuery({
		queryKey: ["duesLists", "", "", ""],
		queryFn: getAllDuesLists,
		select: (res) => {
			return res.data.duesLists.map((el) => {
				return {
					...el,
					clauseText: treasuries.filter((ele) => ele.id === el.clause)[0].name,
				};
			});
		},
		enabled: !!treasuries,
	});

	const sendWhatsappMessagesMutation = useMutation({
		mutationFn: sendWhatsappMessages,
		onSuccess: (res) => {
			toast.success("تم ارسال الرسائل بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["duesLists"] });
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
	const updateMutation = useMutation({
		mutationFn: updateDuesListState,
		onSuccess: (res) => {
			toast.success("تم تعديل الحالة بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["duesLists"] });
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
	const deleteMutation = useMutation({
		mutationFn: deleteDuesList,
		onSuccess: (res) => {
			toast.success("تم الحذف بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["duesLists"] });
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
	const stateChangeHandler = (newState, data) => {
		updateMutation.mutate({ ...data, state: newState });
	};

	const columns1 = [
		{ field: "id", headerName: "م", width: "60" },
		{ field: "title", headerName: "الاسم", width: "500" },
		{ field: "total", headerName: "الاجمالي", width: "100" },
		{ field: "clauseText", headerName: "البند", width: "100" },
		{
			field: "state",
			headerName: "الحالة",
			width: "150",
			renderCell: (params) => {
				return (
					<Select
						disabled={
							(params.row.state === "closed" ? true : false) ||
							(authCtx.permissions.editDuesListState ? false : true)
						}
						value={params.row.state}
						{...restoreFocusTargetAttribute}
						onChange={(em) => {
							setDialog((prev) => {
								const newState = em.target.value;
								return {
									...prev,
									isOpened: true,
									title: "صرف مستحقات",
									content: (
										<>
											<div>
												هل انت متاكد من تغيير حالة الكشف {params.row.id} الى
												{newState}
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
													stateChangeHandler(newState, params.row);
												}}
											>
												تأكيد
											</Button>
										</>
									),
								};
							});
						}}
					>
						<option
							disabled={params.row.money_received === 1 ? true : false}
							value="underReview"
						>
							تحت المراجعة
						</option>
						<option
							value="reviewed"
							disabled={params.row.money_received === 1 ? true : false}
						>
							تمت المراجعة
						</option>
						<option
							value="payable"
							disabled={params.row.money_received === 0 ? true : false}
						>
							قابل للدفع
						</option>
						<option
							value="closed"
							disabled={params.row.state === "payable" ? false : true}
						>
							مغلق
						</option>
					</Select>
				);
			},
		},
		{
			field: "actions",
			headerName: "خيارات",
			width: "200",
			renderCell: (params) => {
				return (
					<div style={{ display: "flex", gap: "5px" }}>
						<Tooltip content="ارسال رسائل واتساب" relationship="label">
							<Button
								appearance="primary"
								disabled
								// disabled={params.row.state === "payable" ? false : true}
								style={{
									backgroundColor: "#ededed",
								}}
								// style={{
								// 	backgroundColor:
								// 		params.row.state === "payable" ? "#24b459" : "#ededed",
								// }}
								onClick={() =>
									setDialog((prev) => {
										return {
											...prev,
											isOpened: true,
											title: "ارسال رسائل واتساب",
											content: (
												<>
													<div>
														هل انت متأكد من أرسال رسائل واتساب للمستفيدين ؟
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
															sendWhatsappMessagesMutation.mutate({
																id: params.row.id,
															});
														}}
													>
														تأكيد
													</Button>
												</>
											),
										};
									})
								}
								icon={<WhatsAppIcon />}
							/>
						</Tooltip>
						<Tooltip content="تعديل" relationship="label">
							<Button
								appearance="primary"
								icon={<EditRegular />}
								size="medium"
								disabled={
									params.row.money_received === 1 ||
									params.row.state === "reviewed"
										? true
										: false
								}
								{...restoreFocusTargetAttribute}
								onClick={() => {
									if (params.row.type === "manual") {
										navigate("./edit", { state: { id: params.id } });
									}
									if (params.row.type === "excel") {
										navigate("./editExcel", { state: { id: params.id } });
									}
									if (params.row.type === "hr_excel") {
										navigate("./editHrDues", { state: { id: params.id } });
									}
								}}
							/>
						</Tooltip>
						<Tooltip content="حذف" relationship="label">
							<Button
								disabled={
									(params.row.money_received === 1 ||
									params.row.state === "payable" ||
									params.row.state === "closed" ||
									params.row.state === "reviewed"
										? true
										: false) ||
									(authCtx.permissions.deleteDuesList ? false : true)
								}
								appearance="primary"
								style={{
									backgroundColor:
										params.row.money_received === 1 ||
										params.row.state === "payable" ||
										params.row.state === "closed" ||
										params.row.state === "reviewed" ||
										!authCtx.permissions.deleteDuesList
											? "#ededed"
											: "#d11a2a ",
								}}
								onClick={() => {
									setDialog((prev) => {
										return {
											...prev,
											isOpened: true,
											title: "حذف كشف مستحقات",
											content: (
												<>
													<div>
														{`هل انت متاكد من حذف كشف المستحقات رقم ${params.row.id} بعنوان ${params.row.title} ؟`}
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
						<Tooltip content="طباعة" relationship="label">
							<Button
								appearance="primary"
								onClick={() =>
									navigate("./print", { state: { item: params.row } })
								}
								icon={<PrintRegular />}
							/>
						</Tooltip>
						<Tooltip content="انشاء نسحة" relationship="label">
							<Button
								appearance="primary"
								icon={<CopyAddRegular />}
								size="medium"
								{...restoreFocusTargetAttribute}
								onClick={() =>
									navigate("./addUsingTemplate", { state: { id: params.id } })
								}
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
						<Menu>
							<MenuTrigger disableButtonEnhancement>
								<Button
									appearance="primary"
									icon={<AddRegular />}
									disabled={authCtx.permissions.addDuesList ? false : true}
								>
									اضافة
								</Button>
							</MenuTrigger>

							<MenuPopover>
								<MenuList>
									<MenuItem
										onClick={() => {
											navigate("./add");
										}}
									>
										يدوي
									</MenuItem>
									<MenuItem
										onClick={() => {
											navigate("./addUsingExcel");
										}}
									>
										ملف اكسل
									</MenuItem>
									<MenuItem
										onClick={() => {
											navigate("./addHrDues");
										}}
									>
										مستحقات موارد
									</MenuItem>
								</MenuList>
							</MenuPopover>
						</Menu>
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
				{duesLists && (
					<Card title="كشوفات المستحقات">
						<div style={{ margin: "20px 0" }}>
							<Table columns={columns1} rows={duesLists} />
						</div>
					</Card>
				)}
			</div>
		</>
	);
};

export default DuesListsPage;
