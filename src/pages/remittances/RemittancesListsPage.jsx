import React, { useRef, useState } from "react";
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
} from "@fluentui/react-components";
import { SaveRegular, DeleteRegular } from "@fluentui/react-icons";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
	getAllDocs,
	sendWhatsappMessages,
	updateDoc,
} from "../../api/serverApi";
import {
	DataGridBody,
	DataGridRow,
	DataGrid,
	DataGridHeader,
	DataGridHeaderCell,
	DataGridCell,
	TableCellLayout,
	createTableColumn,
} from "@fluentui/react-components";
import Card from "../../UI/card/Card";
import { toast } from "react-toastify";

const RemittancesListsPage = () => {
	//hooks
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const restoreFocusTargetAttribute = useRestoreFocusTarget();
	const componentRef = useRef();
	//states
	const [sortState, setSortState] = useState({
		sortColumn: "id",
		sortDirection: "ascending",
	});
	const [dialog, setDialog] = useState({
		isOpened: false,
		title: "",
		content: "",
		actions: "",
	});
	//queries
	const { data: docs } = useQuery({
		queryKey: ["doc", ""],
		queryFn: getAllDocs,
		select: (res) => {
			return res.data.docs.map((el) => el);
		},
	});
	const sendWhatsappMessagesMutation = useMutation({
		mutationFn: sendWhatsappMessages,
		onSuccess: (res) => {
			toast.success("تم ارسال الرسائل بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["doc"] });
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
		mutationFn: updateDoc,
		onSuccess: (res) => {
			console.log(`test`);
			toast.success("تم تعديل الحالة بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["doc"] });
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
	const onSortChange = (e, nextSortState) => {
		setSortState(nextSortState);
	};

	const columns = [
		createTableColumn({
			columnId: "id",
			compare: (a, b) => {
				return a.id.toString().localeCompare(b.id.toString());
			},
			renderHeaderCell: () => {
				return "م";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.id}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "title",
			compare: (a, b) => {
				return a.title.toString().localeCompare(b.title.toString());
			},
			renderHeaderCell: () => {
				return "العنوان";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.title}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "total",
			compare: (a, b) => {
				return a.total.toString().localeCompare(b.total.toString());
			},
			renderHeaderCell: () => {
				return "الاجمالي";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.total.toLocaleString()}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "date",
			compare: (a, b) => {
				return a.date.toString().localeCompare(b.date.toString());
			},
			renderHeaderCell: () => {
				return "التاريخ";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.date}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "state",
			compare: (a, b) => {
				return a.date.toString().localeCompare(b.date.toString());
			},
			renderHeaderCell: () => {
				return "الحالة";
			},
			renderCell: (item) => {
				return (
					<TableCellLayout>
						<Select
							disabled={item.state === "closed" ? true : false}
							value={item.state}
							{...restoreFocusTargetAttribute}
							onChange={(em) => {
								// it is the user responsibility to open the dialog

								setDialog((prev) => {
									const newState = em.target.value;
									return {
										...prev,
										isOpened: true,
										title: "صرف مستحقات",
										content: (
											<>
												<div>
													هل انت متاكد من تغيير حالة الكشف {item.id} الى
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
														stateChangeHandler(newState, item);
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
								disabled={item.money_received === 1 ? true : false}
								value="underReview"
							>
								تحت المراجعة
							</option>
							<option
								value="reviewed"
								disabled={item.money_received === 1 ? true : false}
							>
								تمت المراجعة
							</option>
							<option
								value="payable"
								disabled={item.money_received === 0 ? true : false}
							>
								قابل للدفع
							</option>
							<option
								value="closed"
								disabled={item.state === "payable" ? false : true}
							>
								مغلق
							</option>
						</Select>
					</TableCellLayout>
				);
			},
		}),
		createTableColumn({
			columnId: "actions",

			renderHeaderCell: () => {
				return "خيارات";
			},
			renderCell: (item) => {
				return (
					<TableCellLayout>
						<div style={{ display: "flex", gap: "5px" }}>
							<Tooltip content="ارسال رسائل واتساب" relationship="label">
								<Button
									appearance="primary"
									disabled={item.state === "payable" ? false : true}
									style={{
										backgroundColor:
											item.state === "payable" ? "#24b459" : "#ededed",
									}}
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
																	id: item.id,
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
							<Tooltip content="حذف" relationship="label">
								<Button
									disabled={
										item.money_received === 1 ||
										item.state === "payable" ||
										item.state === "closed"
											? true
											: false
									}
									// onClick={() => {
									// 	deleteHandler(item);
									// }}
									appearance="primary"
									style={{
										backgroundColor:
											item.money_received === 1 ||
											item.state === "payable" ||
											item.state === "closed"
												? "#ededed"
												: "#d11a2a ",
									}}
									icon={<DeleteRegular />}
								/>
							</Tooltip>
						</div>
					</TableCellLayout>
				);
			},
		}),
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
							icon={<SaveRegular />}
							onClick={() => {
								navigate("./add");
							}}
						>
							إضافة
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
				{docs && (
					<Card>
						<DataGrid
							items={docs}
							columns={columns}
							sortable
							selectionMode="multiselect"
							getRowId={(item) => item.id}
							sortState={sortState}
							onSortChange={onSortChange}
							style={{ minWidth: "500px" }}
							focusMode="none"
							selectionAppearance="none"
						>
							<DataGridHeader>
								<DataGridRow>
									{({ renderHeaderCell }) => (
										<DataGridHeaderCell>
											{renderHeaderCell()}
										</DataGridHeaderCell>
									)}
								</DataGridRow>
							</DataGridHeader>
							<DataGridBody>
								{({ item, rowId }) => (
									<DataGridRow key={rowId}>
										{({ renderCell }) => (
											<DataGridCell
												onClick={(e) => {
													e.stopPropagation();
												}}
											>
												{renderCell(item)}
											</DataGridCell>
										)}
									</DataGridRow>
								)}
							</DataGridBody>
						</DataGrid>
					</Card>
				)}
			</div>
		</>
	);
};

export default RemittancesListsPage;
