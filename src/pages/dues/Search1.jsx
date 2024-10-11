import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	Field,
	Input,
	Dialog,
	DialogTrigger,
	DialogSurface,
	DialogTitle,
	DialogBody,
	DialogActions,
	DialogContent,
	Select,
	Switch,
	useRestoreFocusTarget,
	Tooltip,
	Checkbox,
} from "@fluentui/react-components";
import {
	SearchRegular,
	DocumentBulletListRegular,
	MoneyHandRegular,
	ErrorCircleRegular,
} from "@fluentui/react-icons";
import Card from "../../UI/card/Card";
import Row from "../../UI/row/Row";
import { useMutation, useQuery } from "react-query";
import {
	addPay,
	getAllDuesLists,
	getAllTreasuries,
	getSalaryAdvanceByFinancialNum,
	// PayDue,
	searchDues,
} from "../../api/serverApi";
import { toast } from "react-toastify";
import TopBar from "../../components/TopBar/TopBar";
import Table from "../../UI/table/Table";
import { useNavigate } from "react-router-dom";

const Search = () => {
	//hooks
	const restoreFocusTargetAttribute = useRestoreFocusTarget();

	const navigate = useNavigate();
	//states

	const [name, setName] = useState("");
	const [receiverName, setReceiverName] = useState("");
	const [number, setNumber] = useState("");
	const [duesLists, setDuesLists] = useState([]);
	const [selectedDuesListId, setSelectedDuesListId] = useState(null);
	const [searchOnlyUnpaied, setSearchOnlyUnpaied] = useState(true);
	const [searchBy, setSearchBy] = useState("name");
	const [clause, setClause] = useState("");
	const [clauseId, setClauseId] = useState("");
	const [salaryAdvance, setSalaryAdvance] = useState(0);
	const [content, setContnet] = useState("");
	const [checked, setChecked] = useState(false);

	const [dialog, setDialog] = useState({
		isOpened: false,
		title: "",
		content: "",
		actions: "",
	});
	const [selection, setSelection] = useState([]);

	//queries

	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => {
				return { ...el };
			});
		},
		onSuccess: (res) => {
			setClause(res[0].name);
			setClauseId(res[0].id);
		},
	});
	useQuery({
		queryKey: [
			"duesLists",
			"1",
			"payable",
			clauseId,
			searchBy,
			searchOnlyUnpaied,
		],
		queryFn: getAllDuesLists,
		select: (res) => {
			return res.data.duesLists.map((el) => {
				return { ...el };
			});
		},
		// enabled: false,
		enabled: !!clauseId && searchBy === "duesList",
		onSuccess: (data) => {
			console.log(`data`);
			setDuesLists(data);
		},
	});
	const { data: results } = useQuery({
		queryKey: [
			"results",
			searchBy,
			name,
			number,
			searchOnlyUnpaied,
			clauseId,
			selectedDuesListId?.value,
		],
		queryFn: searchDues,
		select: (res) => {
			console.log(`res`, res);
			return res.data.results.map((el) => {
				return {
					...el,
					stateAr: el.state === "paid" ? "مستلمة" : "غير مستلمة",
					clauseText: treasuries.filter((ele) => ele.id === el.clause)[0].name,
				};
			});
		},
		enabled: !!name || !!number || !!selectedDuesListId,
	});
	useQuery({
		queryKey: ["salaryAdvance", selection[0]?.financial_num],
		queryFn: getSalaryAdvanceByFinancialNum,

		onSuccess: (res) => {
			let total = 0;
			if (res.data.salaryAdvance.length > 0) {
				res.data.salaryAdvance.forEach((el) => (total = total + el.amount));
			}

			setSalaryAdvance(total);
		},
		enabled: !!results && selection.length > 0,
	});

	const payMutation = useMutation({
		mutationFn: addPay,
		onSuccess: (res) => {
			setDialog({
				isOpened: false,
				title: "",
				content: "",
				actions: "",
			});
			setName("");
			setNumber("");
			toast.success("تمت العملية بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			const data = {
				...res.data.data[0],
				clauseText: treasuries.filter(
					(el) => el.id === res.data.data[0].clause
				)[0].name,
			};
			navigate("./printDues", {
				state: {
					pay: data,
				},
			});
		},
		onError: (err) => {
			toast.error(err.response.data.message, {
				position: toast.POSITION.TOP_CENTER,
			});
		},
	});
	//functions
	const handleChange = (ev, data) => {
		setChecked((prev) => !prev);
	};
	const nameCHangeHandler = (e) => {
		setName(e.target.value);
	};
	const numberChangeHandler = (e) => {
		setNumber(e.target.value);
	};
	const onSwitchChange = (ev) => {
		setDuesLists([]);
		setSelectedDuesListId(null);
		setReceiverName("");
		setSearchOnlyUnpaied(ev.currentTarget.checked);
	};
	const onPayHandler = (data) => {
		console.log(`data`, data);
		payMutation.mutate(data);
	};
	const columns = [
		{ field: "id", headerName: "م", width: "60" },
		{ field: "name", headerName: "الاسم", width: "250" },
		{ field: "title", headerName: "العنوان", width: "250" },
		{ field: "amount", headerName: "المبلغ", width: "100" },
		{ field: "date", headerName: "التاريخ", width: "100" },
		{ field: "clauseText", headerName: "البند", width: "100" },
		{
			field: "actions",
			headerName: "خيارات",
			width: "200",
			renderCell: (params) => {
				return (
					<div style={{ display: "flex", gap: "5px" }}>
						<Tooltip content="عرض البيانات" relationship="label">
							<Button
								appearance="primary"
								icon={<DocumentBulletListRegular />}
								size="medium"
								style={{
									backgroundColor: "#e1ad01",
								}}
								{...restoreFocusTargetAttribute}
								onClick={() => {
									setDialog((prev) => {
										return {
											...prev,
											isOpened: true,
											title: "عرض بيانات",
											content: (
												<div
													style={{
														fontSize: "18px",
														display: "flex",
														flexDirection: "column",
														gap: "5px",
													}}
												>
													<div style={{ display: "flex", gap: "5px" }}>
														<span>رقم المستحق:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.id}
														</span>
													</div>

													<div style={{ display: "flex", gap: "5px" }}>
														<span>اسم المستفيد:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.name}
														</span>
													</div>
													<div style={{ display: "flex", gap: "5px" }}>
														<span>المبلغ:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.amount.toLocaleString()} ريال يمني
														</span>
													</div>
													<div style={{ display: "flex", gap: "5px" }}>
														<span>مقابل:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.title}
														</span>
													</div>
													<div style={{ display: "flex", gap: "5px" }}>
														<span>الحالة:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.state === "unPaid"
																? "غير مستلمة"
																: "مستلمة"}
														</span>
													</div>
													<div style={{ display: "flex", gap: "5px" }}>
														<span>رقم سند الصرف:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.pay_id === null
																? "غير محدد"
																: params.row.pay_id}
														</span>
													</div>
													<div style={{ display: "flex", gap: "5px" }}>
														<span>تاريخ ووقت الاستلام:</span>
														<span style={{ fontWeight: "bold" }}>
															{params.row.paid_at === null
																? "غير محدد"
																: params.row.paid_at}
														</span>
													</div>
												</div>
											),
											actions: (
												<DialogActions>
													<DialogTrigger disableButtonEnhancement>
														<Button appearance="primary">تأكيد</Button>
													</DialogTrigger>
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
	useEffect(() => {
		if (searchBy === "name") {
			setContnet(
				<Row flex={[2, 1]}>
					<Field label="أسم المستفيد">
						<Input
							contentAfter={<SearchRegular />}
							onChange={nameCHangeHandler}
							value={name}
						/>
					</Field>
					<></>
				</Row>
			);
		}
		if (searchBy === "number") {
			setContnet(
				<Row flex={[2, 1]}>
					<Field label="رقم المستحق">
						<Input
							value={number}
							contentAfter={<SearchRegular />}
							onChange={numberChangeHandler}
						/>
					</Field>
					<></>
				</Row>
			);
		}
		if (searchBy === "duesList") {
			setContnet(
				duesLists ? (
					<Row flex={[3, 2]}>
						<Field label="كشف الاستحقاق" required>
							<Select
								onChange={(e, value) => {
									setSelectedDuesListId(value);
									// const clause = duesList.filter(
									// 	(el) => el.title === e.target.value
									// )[0].clause;

									// setAmount(
									// 	duesList.filter((el) => el.title === e.target.value)[0].total
									// );
									// setDuesListId(
									// 	duesList.filter((el) => el.title === e.target.value)[0].id
									// );
									// setClause(treasuries.filter((el) => el.id === clause)[0].name);
								}}
							>
								<option>{""}</option>
								{duesLists.map((el) => (
									<option key={el.id} value={el.id}>
										{el.title}
									</option>
								))}
							</Select>
						</Field>
						{searchOnlyUnpaied ? (
							<Field label="اسم المستلم">
								<Input
									value={receiverName}
									onChange={(e) => setReceiverName(e.target.value)}
								/>
							</Field>
						) : (
							<></>
						)}
					</Row>
				) : (
					""
				)
			);
		}
	}, [searchBy, name, number, duesLists, receiverName, searchOnlyUnpaied]);
	const test = () => {
		console.log(`checked`, checked);
	};
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
						<DialogContent>{dialog.content}</DialogContent>
						<DialogActions>{dialog.actions}</DialogActions>
					</DialogBody>
				</DialogSurface>
			</Dialog>
			<TopBar
				right={
					<>
						<DialogTrigger disableButtonEnhancement>
							<Button
								appearance="primary"
								icon={<MoneyHandRegular />}
								disabled={
									selection.length === 0 || !searchOnlyUnpaied ? true : false
								}
								onClick={() => {
									const testedNamed = selection.filter(
										(el) => el.name !== selection[0].name
									);
									if (testedNamed.length > 0 && searchBy !== "duesList") {
										toast.error(
											"لا يمكن صرف مستحقات أكثر من شخص بنفس العملية",
											{
												position: toast.POSITION.TOP_CENTER,
											}
										);
										return;
									}
									if (receiverName === "" && searchBy == "duesList") {
										toast.error("يجب ادخال اسم المستلم", {
											position: toast.POSITION.TOP_CENTER,
										});
										return;
									}
									if (selection.length > 4 && searchBy !== "duesList") {
										toast.error("لايمكن صرف أكثر من 4 مستحقات بنفس العملية", {
											position: toast.POSITION.TOP_CENTER,
										});
										return;
									}
									// fetchSalaryAdvance();
									if (searchBy == "duesList") {
										setDialog({
											isOpened: true,
											title: "صرف مستحقات",
											content: (
												<div>
													هل انت متاكد من صرف المستحقات مقابل
													{selection[0].title} للمستفيدين:
													<ol
														style={{
															display: "flex",
															flexDirection: "column",
															gap: "5px",
															marginTop: "5px",
														}}
													>
														{selection.map((el, i) => (
															<li
																key={i}
																style={{
																	display: "flex",
																	gap: "5px",
																	alignItems: "center",
																}}
															>
																<div
																	style={{
																		width: "10px",
																		height: "10px",
																		borderRadius: "50%",
																		backgroundColor: "#000",
																	}}
																/>
																{`${el.amount.toLocaleString()} ريال يمني لـ   ${
																	el.name
																}`}
															</li>
														))}
													</ol>
													{salaryAdvance !== 0 && (
														<div>
															<div
																style={{
																	backgroundColor: "#ff8383 ",
																	padding: "7px",
																	fontWeight: "bold",
																	fontSize: "18px",
																	display: "flex",
																	alignItems: "center",
																	gap: "15px",
																	lineHeight: "24px",
																	borderRadius: "5px",
																	marginTop: "5px",
																}}
															>
																<ErrorCircleRegular
																	style={{ fontSize: "24px" }}
																/>
																يوجد سلفة بمبلغ
																{salaryAdvance.toLocaleString()}
																ريال يمني
															</div>
														</div>
													)}
												</div>
											),
											actions: (
												<>
													<DialogTrigger disableButtonEnhancement>
														<Button appearance="secondary">الغاء</Button>
													</DialogTrigger>
													<Button
														appearance="primary"
														onClick={() => {
															onPayHandler({
																selection,
																receiverName,
																has_portfolio: false,
																supplier: null,
																clause: clauseId,
																type: "duesList",
																paid_at: new Date().toLocaleString(),
															});
														}}
													>
														تأكيد
													</Button>
												</>
											),
										});
									} else {
										console.log(`foo`, salaryAdvance);
										console.log(`foo`, selection);
										setDialog({
											isOpened: true,
											title: "صرف مستحقات",
											content: (
												<div>
													هل انت متاكد من صرف المستحقات التالية ل
													{selection[0].name}
													<ol
														style={{
															display: "flex",
															flexDirection: "column",
															gap: "5px",
															marginTop: "5px",
														}}
													>
														{selection.map((el, i) => (
															<li
																key={i}
																style={{
																	display: "flex",
																	gap: "5px",
																	alignItems: "center",
																}}
															>
																<div
																	style={{
																		width: "10px",
																		height: "10px",
																		borderRadius: "50%",
																		backgroundColor: "#000",
																	}}
																/>
																{`${el.amount.toLocaleString()} ريال يمني مقابل ${
																	el.title
																}`}
															</li>
														))}
													</ol>
													{salaryAdvance !== 0 && (
														<div>
															<div
																style={{
																	backgroundColor: "#ff8383 ",
																	padding: "7px",
																	fontWeight: "bold",
																	fontSize: "18px",
																	display: "flex",
																	alignItems: "center",
																	gap: "15px",
																	lineHeight: "24px",
																	borderRadius: "5px",
																	marginTop: "5px",
																}}
															>
																<ErrorCircleRegular
																	style={{ fontSize: "24px" }}
																/>
																يوجد سلفة بمبلغ {salaryAdvance.toLocaleString()}
																ريال يمني
															</div>
															<input
																type="checkbox"
																checked={checked}
																onChange={(e) => {
																	console.log(`e.targer.value`, e.target.value);
																}}
																value={checked}
															/>
															{/* <Checkbox
																checked={checked}
																onChange={handleChange}
																value={checked}
																label="Yes, delete this campaign and all its associated resources"
															/> */}
														</div>
													)}
												</div>
											),
											actions: (
												<>
													<DialogTrigger disableButtonEnhancement>
														<Button appearance="secondary">الغاء</Button>
													</DialogTrigger>
													<Button
														appearance="primary"
														onClick={() => {
															onPayHandler({
																selection,
																has_portfolio: false,
																supplier: null,
																clause: clauseId,
																type: "dues",
																paid_at: new Date().toLocaleString(),
															});
														}}
													>
														صرف
													</Button>
													{/* <Button
													appearance="primary"
													onClick={() => {
														onPayHandler({
															selection,
															has_portfolio: false,
															supplier: null,
															clause: clauseId,
															type: "dues",
															paid_at: new Date().toLocaleString(),
														});
													}}
													style={{ width: "200px" }}
												>
													صرف مع سداد السلفة
												</Button> */}
												</>
											),
										});
									}
								}}
							>
								صرف
							</Button>
						</DialogTrigger>
					</>
				}
			/>
			<div
				style={{
					padding: "0 5px",
					// marginTop: "20px",
					paddingBottom: "120px",
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				<Card title="معلومات البحث">
					<Row flex={[1, 1, 1, 1]}>
						<Field label="البحث بواسطة">
							<Select
								onChange={(e) => {
									setName("");
									setNumber("");
									setDuesLists([]);
									setReceiverName("");
									setSelectedDuesListId(null);
									setSearchBy(e.target.value);
								}}
							>
								<option value="name">اسم المستفيد</option>
								<option value="number">رقم المستحق</option>
								<option value="duesList">كشف الاستحقاق</option>
							</Select>
						</Field>
						<div
							style={{
								marginTop: 25,
								display: "flex",
								alignItems: "center",
							}}
						>
							{searchOnlyUnpaied ? "" : "المستحقات المستلمة"}
							<Switch checked={searchOnlyUnpaied} onChange={onSwitchChange} />
							{searchOnlyUnpaied ? "المستحقات غير المستلمة" : ""}
						</div>
						{treasuries && (
							<Field
								label="البند"
								required={true}
								onChange={(e) => {
									setDuesLists([]);
									setSelectedDuesListId(null);
									setReceiverName("");
									setClause(e.target.value);
									setClauseId(
										treasuries.filter((el) => el.name === e.target.value)[0].id
									);
								}}
							>
								<Select value={clause}>
									{treasuries.map((el) => (
										<option key={el.id}>{el.name}</option>
									))}
								</Select>
							</Field>
						)}
						<button onClick={test}>test</button>
						<></>
					</Row>

					{content}
				</Card>
				{results && results.length > 0 && (
					<Card title="النتائج">
						<div style={{ margin: "20px 0" }}>
							<Table
								columns={columns}
								rows={results}
								hideFooter={false}
								checkboxSelection={searchOnlyUnpaied ? true : false}
								onRowSelectionModelChange={setSelection}
								pageSize={100}
							/>
						</div>
					</Card>
				)}
			</div>
		</>
	);
};

export default Search;
