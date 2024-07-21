import React, { useRef, useState } from "react";
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
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHeaderCell,
	TableRow,
	useRestoreFocusTarget,
	Tooltip,
} from "@fluentui/react-components";
import {
	SearchRegular,
	DismissRegular,
	PrintRegular,
	DocumentBulletListRegular,
	MoneyHandRegular,
} from "@fluentui/react-icons";
import Card from "../../UI/card/Card";
import Row from "../../UI/row/Row";
import { useMutation, useQuery } from "react-query";
import { PayRemittance, searchRemittances } from "../../api/serverApi";
import { toast } from "react-toastify";
import Receipt from "../templates/Receipt";
import ReactToPrint from "react-to-print";
const Search = () => {
	//hooks
	const restoreFocusTargetAttribute = useRestoreFocusTarget();
	const componentRef = useRef();
	//states
	const [name, setName] = useState("");
	const [number, setNumber] = useState("");
	const [searchOnlyUnpaied, setSearchOnlyUnpaied] = useState(true);
	const [searchBy, setSearchBy] = useState("name");
	const [dialog, setDialog] = useState({
		isOpened: false,
		title: "",
		content: "",
		actions: "",
	});
	//queries
	const { data: results } = useQuery({
		queryKey: ["results", searchBy, name, number, searchOnlyUnpaied],
		queryFn: searchRemittances,
		select: (res) => {
			return res.data.results.map((el) => {
				return {
					...el,
					stateAr: el.state === "paid" ? "مستلمة" : "غير مستلمة",
				};
			});
		},
		enabled: !!name || !!number,
	});
	const payMutation = useMutation({
		mutationFn: PayRemittance,
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
		},
		onError: (err) => {
			toast.error("حصل خطأ أثناء عملية الصرف،الرجاء التواصل مع الدعم الفني", {
				position: toast.POSITION.TOP_CENTER,
			});
		},
	});
	//functions
	const nameCHangeHandler = (e) => {
		setName(e.target.value);
	};
	const numberChangeHandler = (e) => {
		setNumber(e.target.value);
	};
	const onSwitchChange = (ev) => {
		setSearchOnlyUnpaied(ev.currentTarget.checked);
	};
	const onPayHandler = (data) => {
		payMutation.mutate(data);
	};
	const test = () => {
		console.log(`dialog`, dialog);
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
						<DialogContent ref={componentRef}>{dialog.content}</DialogContent>
						<DialogActions>{dialog.actions}</DialogActions>
					</DialogBody>
				</DialogSurface>
			</Dialog>
			<div
				style={{
					padding: "0 5px",
					marginTop: "20px",
					paddingBottom: "120px",
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				<Card title="معلومات البحث">
					<Row flex={[1, 2]}>
						<Field label="البحث بواسطة">
							<Select
								onChange={(e) => {
									setName("");
									setNumber("");
									setSearchBy(e.target.value);
								}}
							>
								<option value="name">اسم المستفيد</option>
								<option value="number">الرقم</option>
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
							<button onClick={test}>test</button>
						</div>
					</Row>

					<Row flex={[2, 1]}>
						{searchBy === "name" ? (
							<Field label="أسم المستفيد">
								<Input
									contentAfter={<SearchRegular />}
									onChange={nameCHangeHandler}
									value={name}
								/>
							</Field>
						) : (
							<Field label="رقم السند">
								<Input
									value={number}
									contentAfter={<SearchRegular />}
									onChange={numberChangeHandler}
								/>
							</Field>
						)}
						<></>
					</Row>
				</Card>
				{results && results.length > 0 && (
					<Card title="النتائج">
						<Table arial-label="Default table" style={{ minWidth: "510px" }}>
							<TableHeader>
								<TableRow>
									<TableHeaderCell
										style={{
											fontWeight: "bold",
											color: "#4763ac",
											fontSize: "16px",
											width: "10px",
										}}
									>
										#
									</TableHeaderCell>
									<TableHeaderCell
										style={{
											fontWeight: "bold",
											color: "#4763ac",
											fontSize: "16px",
											width: "90px",
										}}
									>
										الاسم
									</TableHeaderCell>

									<TableHeaderCell
										style={{
											fontWeight: "bold",
											color: "#4763ac",
											fontSize: "16px",
											width: "20px",
										}}
									>
										المبلغ
									</TableHeaderCell>
									<TableHeaderCell
										style={{
											fontWeight: "bold",
											color: "#4763ac",
											fontSize: "16px",
											width: "150px",
										}}
									>
										مقابل
									</TableHeaderCell>
									<TableHeaderCell
										style={{
											fontWeight: "bold",
											color: "#4763ac",
											fontSize: "16px",
											width: "20px",
										}}
									>
										الحالة
									</TableHeaderCell>
									<TableHeaderCell
										style={{
											fontWeight: "bold",
											color: "#4763ac",
											fontSize: "16px",
											width: "55px",
										}}
									>
										الحالة
									</TableHeaderCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{results.map((item) => (
									<TableRow key={item.id}>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.amount.toLocaleString()}</TableCell>
										<TableCell>{item.title}</TableCell>
										<TableCell>{item.stateAr}</TableCell>
										<TableCell>
											<div style={{ display: "flex", gap: "10px" }}>
												{/* <Dialog>
													<DialogTrigger disableButtonEnhancement> */}
												<Tooltip content="صرف" relationship="label">
													<Button
														appearance="primary"
														icon={<MoneyHandRegular />}
														size="medium"
														disabled={item.state === "paid" ? true : false}
														{...restoreFocusTargetAttribute}
														onClick={() => {
															// it is the user responsibility to open the dialog

															setDialog((prev) => {
																return {
																	...prev,
																	isOpened: true,
																	title: "صرف مستحقات",
																	content: (
																		<DialogContent>
																			هل أنت متأكد من صرف مبلغ
																			<div
																				style={{
																					fontSize: "18px",
																					fontWeight: "bold",
																					display: "inline",
																					paddingLeft: "5px",
																					paddingRight: "5px",
																				}}
																			>
																				{item.amount.toLocaleString()} ريال يمني
																			</div>
																			للاخ
																			<div
																				style={{
																					fontSize: "18px",
																					fontWeight: "bold",
																					display: "inline",
																					paddingLeft: "5px",
																					paddingRight: "5px",
																				}}
																			>
																				{item.name}
																			</div>
																			مقابل
																			<div
																				style={{
																					fontSize: "18px",
																					fontWeight: "bold",
																					display: "inline",
																					paddingLeft: "5px",
																					paddingRight: "5px",
																				}}
																			>
																				{item.title}
																			</div>
																		</DialogContent>
																	),
																	actions: (
																		<DialogActions>
																			<DialogTrigger disableButtonEnhancement>
																				<Button appearance="secondary">
																					الغاء
																				</Button>
																			</DialogTrigger>
																			<Button
																				appearance="primary"
																				onClick={() => {
																					onPayHandler({
																						...item,
																						state: "paid",
																						paid_at:
																							new Date().toLocaleString(),
																					});
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
												<Tooltip content="الغاء الصرف" relationship="label">
													<Button
														appearance="secondary"
														icon={
															<DismissRegular
																style={{
																	color:
																		item.state === "paid" ? "#fff" : "#bdbdbd",
																}}
															/>
														}
														size="medium"
														style={{
															backgroundColor:
																item.state === "paid" ? "#b33c37" : "#ededed",
														}}
														disabled={item.state === "paid" ? false : true}
														{...restoreFocusTargetAttribute}
														onClick={() => {
															setDialog((prev) => {
																return {
																	...prev,
																	isOpened: true,
																	title: "الغاء صرف مستحقات",
																	content: (
																		<DialogContent>
																			هل أنت متأكد من الغاء صرف مبلغ
																			<div
																				style={{
																					fontSize: "18px",
																					fontWeight: "bold",
																					display: "inline",
																					paddingLeft: "5px",
																					paddingRight: "5px",
																				}}
																			>
																				{item.amount.toLocaleString()} ريال يمني
																			</div>
																			للاخ
																			<div
																				style={{
																					fontSize: "18px",
																					fontWeight: "bold",
																					display: "inline",
																					paddingLeft: "5px",
																					paddingRight: "5px",
																				}}
																			>
																				{item.name}
																			</div>
																			مقابل
																			<div
																				style={{
																					fontSize: "18px",
																					fontWeight: "bold",
																					display: "inline",
																					paddingLeft: "5px",
																					paddingRight: "5px",
																				}}
																			>
																				{item.title}
																			</div>
																		</DialogContent>
																	),
																	actions: (
																		<DialogActions>
																			<DialogTrigger disableButtonEnhancement>
																				<Button appearance="secondary">
																					الغاء
																				</Button>
																			</DialogTrigger>
																			<Button
																				appearance="primary"
																				onClick={() => {
																					onPayHandler({
																						...item,
																						state: "unPaid",
																						paid_at: null,
																					});
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
												<Tooltip content="طباعة السند" relationship="label">
													<Button
														appearance="primary"
														icon={
															<PrintRegular
																style={{
																	color:
																		item.state === "Paid" ? "#fff" : "#bdbdbd",
																}}
															/>
														}
														size="medium"
														disabled={item.state === "paid" ? false : true}
														{...restoreFocusTargetAttribute}
														onClick={() => {
															setDialog((prev) => {
																return {
																	...prev,
																	isOpened: true,
																	title: "طباعة السند",
																	content: <Receipt info={item} />,
																	actions: (
																		<DialogActions>
																			<DialogTrigger disableButtonEnhancement>
																				<Button appearance="secondary">
																					الغاء
																				</Button>
																			</DialogTrigger>
																			<ReactToPrint
																				trigger={() => (
																					<Button appearance="primary">
																						طباعة
																					</Button>
																				)}
																				content={() => componentRef.current}
																			/>
																		</DialogActions>
																	),
																};
															});
														}}
													/>
												</Tooltip>
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
																			<div
																				style={{ display: "flex", gap: "5px" }}
																			>
																				<span>رقم الحوالة:</span>
																				<span style={{ fontWeight: "bold" }}>
																					{item.id}
																				</span>
																			</div>
																			<div
																				style={{ display: "flex", gap: "5px" }}
																			>
																				<span>اسم المستفيد:</span>
																				<span style={{ fontWeight: "bold" }}>
																					{item.name}
																				</span>
																			</div>
																			<div
																				style={{ display: "flex", gap: "5px" }}
																			>
																				<span>المبلغ:</span>
																				<span style={{ fontWeight: "bold" }}>
																					{item.amount} ريال يمني
																				</span>
																			</div>
																			<div
																				style={{ display: "flex", gap: "5px" }}
																			>
																				<span>مقابل:</span>
																				<span style={{ fontWeight: "bold" }}>
																					{item.title}
																				</span>
																			</div>
																		</div>
																	),
																	actions: (
																		<DialogActions>
																			<DialogTrigger disableButtonEnhancement>
																				<Button appearance="primary">
																					تأكيد
																				</Button>
																			</DialogTrigger>
																		</DialogActions>
																	),
																};
															});
														}}
													/>
												</Tooltip>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				)}
			</div>
		</>
	);
};

export default Search;
