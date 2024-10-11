import { useEffect, useState } from "react";
import Row from "../../UI/row/Row";
import TopBar from "../../components/TopBar/TopBar";
import Card from "../../UI/card/Card";

import {
	DismissRegular,
	SaveRegular,
	DeleteRegular,
} from "@fluentui/react-icons";
import {
	Button,
	Field,
	Input,
	Checkbox,
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHeader,
	TableHeaderCell,
	Select,
	makeStyles,
} from "@fluentui/react-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import AutocompleteInput from "../../UI/autocompleteInput/AutocompleteInput";

import {
	addDuesList,
	getAllBeneficiaries,
	getAllTreasuries,
	getDuesListById,
	getDuesByDuesListId,
} from "../../api/serverApi";
import { toast } from "react-toastify";

const useStyles = makeStyles({
	deleteBtn: {
		backgroundColor: "#dd3547",
		":hover": { backgroundColor: "#c82333" },
	},
});
const AddDuesUsingTemplatePage = () => {
	//hooks
	const navigate = useNavigate();
	const info = useLocation();
	const styles = useStyles();

	//states
	const [title, setTitle] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [addedEmployees, setAddedEmployees] = useState([
		{ id: 1, amount: 0, beneficiaryId: null, name: "" },
	]);
	const [addedOthers, setAddedOthers] = useState([
		{ id: 1, amount: 0, name: "" },
	]);
	const [types, setTypes] = useState({ employees: false, others: false });
	const [beneficiaries, setBeneficiaries] = useState([]);
	const [employeesCount, setEmployeesCount] = useState(1);
	const [othersCount, setOthersCount] = useState(1);
	const [employeesTotal, setEmployeesTotal] = useState(0);
	const [othersTotal, setOthersTotal] = useState(0);
	const [clause, setClause] = useState("");

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
	const { data: beneficiariesData } = useQuery({
		queryKey: ["beneficiaries"],
		queryFn: getAllBeneficiaries,
		select: (res) => {
			return res.data.beneficiaries.map((el) => {
				return { ...el };
			});
		},
		onSuccess: (res) => setBeneficiaries(res),
	});
	useQuery({
		queryKey: ["duesList", info.state?.id],
		queryFn: getDuesListById,
		select: (res) => {
			return res.data.duesList;
		},
		onSuccess: (data) => {
			setTitle(data.title);
			setClause(treasuries.filter((el) => el.id === data.clause)[0].name);
		},
		enabled: !!info.state && !!treasuries,
	});
	useQuery({
		queryKey: ["duesByListId", info.state?.id],
		queryFn: getDuesByDuesListId,
		select: (res) => {
			let employees = [];
			let employeesCount = 0;
			let othersCount = 0;
			let others = [];
			res.data.dues.forEach((el) => {
				if (el.type === "employee") {
					employees.push({ ...el, id: employeesCount + 1 });
					employeesCount++;
				}
				if (el.type === "others") {
					others.push({ ...el, id: othersCount + 1 });
					othersCount++;
				}
			});

			return { employees, others };
		},
		onSuccess: (data) => {
			if (data.employees.length > 0) {
				let total = 0;
				const editEdemployees = data.employees.map((el) => {
					total = total + el.amount;
					const beneficiary = beneficiariesData.filter(
						(ele) => ele.name === el.name
					);

					return {
						...el,
						beneficiaryId: beneficiary[0].id,
						financial_num: beneficiary[0].financial_num,
					};
				});
				setAddedEmployees(editEdemployees);
				setEmployeesTotal(total);
				setEmployeesCount(data.employees.length + 1);
				setOthersCount(data.others.length + 1);
				setTypes((prev) => {
					return { ...prev, employees: true };
				});
			}
			if (data.others.length > 0) {
				let total = 0;
				data.others.forEach((el) => {
					total = total + el.amount;
				});
				setOthersTotal(total);
				setAddedOthers(data.others);
				setTypes((prev) => {
					return { ...prev, others: true };
				});
			}
		},
		enabled: !!info.state && !!beneficiariesData,
	});

	const saveMutation = useMutation({
		mutationFn: addDuesList,
		onSuccess: (res) => {
			toast.success("تم إضافة المستحقات بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			navigate("./..");
		},
		onError: (err) => {
			toast.error(err.response.data.message, {
				position: toast.POSITION.TOP_CENTER,
			});
		},
	});

	//functions
	useEffect(() => {
		let total = 0;
		const updatedBeneficiaries = beneficiaries.map((beneficiary) => {
			const match = addedEmployees.find(
				(employee) => employee.beneficiaryId === beneficiary.id
			);
			if (match) {
				return { ...beneficiary, disabled: true };
			}
			return { ...beneficiary, disabled: false };
		});
		addedEmployees.forEach((el) => (total = total + el.amount));
		setEmployeesTotal(total);
		setBeneficiaries(updatedBeneficiaries);
	}, [addedEmployees]);
	useEffect(() => {
		let total = 0;
		addedOthers.forEach((el) => (total = total + el.amount));
		setOthersTotal(total);
	}, [addedOthers]);
	const titleChangeHandler = (e) => {
		setTitle(e.target.value);
	};
	const employeeChangeHandler = (e, value, fieldId) => {
		const updatedAdded = addedEmployees.map((el) => {
			if (el.id === fieldId) {
				if (!value) {
					return {
						...el,
						beneficiaryId: null,
						financial_num: null,
						amount: 0,
						name: "",
						phone_number: "",
					};
				}
				return {
					...el,
					beneficiaryId: value.id,
					financial_num: value.financial_num,
					amount: 0,
					name: value.name,
					phone_number: value.phone_number,
				};
			}
			return el;
		});
		setAddedEmployees(updatedAdded);
	};
	const othersChangeHandler = (e, id) => {
		const updatedAdded = addedOthers.map((el) => {
			if (el.id === id) {
				return {
					...el,
					name: e.target.value,
					amount: 0,
				};
			}
			return el;
		});

		setAddedOthers(updatedAdded);
	};
	const employeeAmountChangeHandler = (e, value) => {
		const updatedAdded = addedEmployees.map((el) => {
			if (el.id === value) {
				return {
					...el,
					amount: +e.target.value,
				};
			}
			return el;
		});
		setAddedEmployees(updatedAdded);
	};
	const othersAmountChangeHandler = (e, value) => {
		const updatedAdded = addedOthers.map((el) => {
			if (el.id === value) {
				return {
					...el,
					amount: +e.target.value,
				};
			}
			return el;
		});
		setAddedOthers(updatedAdded);
	};
	const addEmployeeChangeHandler = () => {
		setAddedEmployees((prev) => [
			...prev,
			{
				id: employeesCount + 1,
				amount: 0,
				beneficiaryId: null,
				financial_num: null,
				name: "",
			},
		]);

		setEmployeesCount((prev) => prev + 1);
	};
	const addOtherChangeHandler = () => {
		setAddedOthers((prev) => [
			...prev,
			{
				id: othersCount + 1,
				amount: 0,
				name: "",
			},
		]);

		setOthersCount((prev) => prev + 1);
	};

	const onSaveHandler = (e) => {
		e.preventDefault();
		const filteredAddedEmployees = addedEmployees.filter((el) => {
			if (el.amount !== 0 && el.beneficiaryId) return el;
		});
		const filteredAddedOthers = addedOthers.filter((el) => {
			if (el.amount !== 0 && el.name !== "") return el;
		});
		if (title === "") {
			toast.error("الرجاء أدخال العنوان", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		if (date === "") {
			toast.error("الرجاء أدخال التاريخ", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		if (filteredAddedEmployees.length === 0 && types.employees) {
			toast.error("الرجاء أدخال بيانات موظفي الفرع", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		if (filteredAddedOthers.length === 0 && types.others) {
			toast.error("الرجاء أدخال بيانات اخرى", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		if (
			filteredAddedOthers.length === 0 &&
			filteredAddedEmployees.length === 0
		) {
			toast.error("الرجاء أدخال مستفيدين", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		saveMutation.mutate({
			title: title.trim(),
			addedEmployees: filteredAddedEmployees,
			addedOthers: filteredAddedOthers,
			total: employeesTotal + othersTotal,
			date,
			clause: treasuries.filter((el) => el.name === clause)[0].id,
			type: "manual",
		});
	};

	//data
	const employeesColumns = [
		{
			field: "employeeName",
			headerName: "الاسم",
		},
		{
			field: "employeeAmount",
			headerName: "المبلغ",
		},
	];
	const othersColumns = [
		{
			field: "otherName",
			headerName: "الاسم",
		},
		{
			field: "otherAmount",
			headerName: "المبلغ",
			minWidth: 50,
			maxWidth: 50,
			isResizable: true,
		},
	];

	return (
		<>
			<form onSubmit={onSaveHandler}>
				<TopBar
					right={
						<>
							<Button
								appearance="secondary"
								icon={<DismissRegular />}
								type="button"
								onClick={() => {
									navigate("./..");
								}}
							>
								الغاء
							</Button>
							<Button appearance="primary" icon={<SaveRegular />} type="submit">
								حفظ
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
					<Card title="بيانات المستند">
						<Row flex={[2, 1, 1]}>
							<Field label="العنوان" required={true}>
								<Input value={title} onChange={titleChangeHandler} />
							</Field>
							<Field label="التاريخ" required={true}>
								<Input
									value={date}
									type="date"
									onChange={(e) => {
										setDate(e.target.value);
									}}
								/>
							</Field>
							{treasuries && (
								<Field
									label="البند"
									required={true}
									onChange={(e) => setClause(e.target.value)}
								>
									<Select value={clause}>
										<option></option>
										{treasuries.map((el) => (
											<option key={el.id}>{el.name}</option>
										))}
									</Select>
								</Field>
							)}
						</Row>
						<Row>
							<div>
								<Checkbox
									checked={types.employees}
									onChange={(ev, data) =>
										setTypes((prevState) => {
											return { ...prevState, employees: data.checked };
										})
									}
									label="موظفي الفرع"
								/>
								<Checkbox
									checked={types.others}
									onChange={(ev, data) =>
										setTypes((prevState) => {
											return { ...prevState, others: data.checked };
										})
									}
									label="اخرى"
								/>
							</div>
						</Row>
					</Card>
					{beneficiaries && types.employees ? (
						<Card title="بيانات موظفي الفرع">
							<Table arial-label="Default table" style={{ minWidth: "510px" }}>
								<TableHeader>
									<TableRow>
										{employeesColumns.map((column) => (
											<TableHeaderCell key={column.field}>
												{column.headerName}
											</TableHeaderCell>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{addedEmployees.map((item) => (
										<TableRow key={item.id}>
											<TableCell>
												<AutocompleteInput
													options={beneficiaries}
													onChange={(event, value) => {
														employeeChangeHandler(event, value, item.id);
													}}
													value={
														addedEmployees.filter((el) => el.id === item.id)[0]
															.beneficiaryId === null
															? null
															: addedEmployees.filter(
																	(el) => el.id === item.id
															  )[0]
													}
													required={true}
													emptyMsg="الرجاء تحديد اسم الموظف المستفيد"
												/>
											</TableCell>
											<TableCell>
												<Field required={true}>
													<Input
														value={
															addedEmployees.filter(
																(el) => el.id === item.id
															)[0].amount
														}
														min="1"
														onChange={(event) =>
															employeeAmountChangeHandler(event, item.id)
														}
														type="number"
														onFocus={(e) => e.target.select()}
														onWheel={(e) => e.target.blur()}
														onKeyDown={(e) => {
															if (
																e.key === "ArrowUp" ||
																e.key === "ArrowDown"
															) {
																e.preventDefault();
															}
														}}
													/>
												</Field>
											</TableCell>
											<TableCell>
												<Button
													icon={<DeleteRegular />}
													appearance="primary"
													className={styles.deleteBtn}
													onClick={() =>
														setAddedEmployees((prev) =>
															prev.filter((el) => el.id !== item.id)
														)
													}
												/>
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell>الاجمالي</TableCell>
										<TableCell>
											<div style={{ padding: 10, fontWeight: "bold" }}>
												{employeesTotal.toLocaleString()}
											</div>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>

							<Row>
								<Button appearance="primary" onClick={addEmployeeChangeHandler}>
									إضافة
								</Button>
							</Row>
						</Card>
					) : (
						""
					)}
					{types.others ? (
						<Card title="بيانات الاخرى">
							<Table arial-label="Default table" style={{ minWidth: "510px" }}>
								<TableHeader>
									<TableRow>
										{othersColumns.map((column) => (
											<TableHeaderCell key={column.field}>
												{column.headerName}
											</TableHeaderCell>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{addedOthers.map((item) => (
										<TableRow key={item.id}>
											<TableCell>
												<Field required={true}>
													<Input
														value={
															addedOthers.filter((el) => el.id === item.id)[0]
																.name
														}
														onChange={(event) => {
															event.stopPropagation();
															othersChangeHandler(event, item.id);
														}}
														style={{ width: "400px" }}
													/>
												</Field>
											</TableCell>
											<TableCell>
												<Field required={true}>
													<Input
														value={
															addedOthers.filter((el) => el.id === item.id)[0]
																.amount
														}
														onChange={(event) => {
															othersAmountChangeHandler(event, item.id);
														}}
														onFocus={(e) => e.target.select()}
														onWheel={(e) => e.target.blur()}
														onKeyDown={(e) => {
															if (
																e.key === "ArrowUp" ||
																e.key === "ArrowDown"
															) {
																e.preventDefault();
															}
														}}
														type="number"
														min="1"
													/>
												</Field>
											</TableCell>
											<TableCell>
												<Button
													icon={<DeleteRegular />}
													appearance="primary"
													className={styles.deleteBtn}
													onClick={() =>
														setAddedOthers((prev) =>
															prev.filter((el) => el.id !== item.id)
														)
													}
												/>
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell>الاجمالي</TableCell>
										<TableCell>
											<div style={{ padding: 10, fontWeight: "bold" }}>
												{othersTotal.toLocaleString()}
											</div>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<Row>
								<Button appearance="primary" onClick={addOtherChangeHandler}>
									إضافة
								</Button>
							</Row>
						</Card>
					) : (
						""
					)}
				</div>
			</form>
		</>
	);
};

export default AddDuesUsingTemplatePage;
