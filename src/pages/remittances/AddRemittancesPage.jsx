import { useState } from "react";
import Row from "../../UI/row/Row";
import TopBar from "../../components/TopBar/TopBar";
import Card from "../../UI/card/Card";

import { DismissRegular, SaveRegular } from "@fluentui/react-icons";
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
} from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import AutocompleteInput from "../../UI/autocompleteInput/AutocompleteInput";

// import Table from "../../UI/table/Table";
import { addRemittancesList, getAllBeneficiaries } from "../../api/serverApi";
import { toast } from "react-toastify";

const AddRemittancesPage = () => {
	//hooks
	const navigate = useNavigate();
	//states
	const [title, setTitle] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [addedEmployees, setAddedEmployees] = useState([
		{ id: 1, amount: "", beneficiaryId: null, name: "" },
	]);
	const [addedOthers, setAddedOthers] = useState([
		{ id: 1, amount: "", name: "" },
	]);
	const [types, setTypes] = useState({ employees: false, others: false });
	const [employeesCount, setEmployeesCount] = useState(1);
	const [othersCount, setOthersCount] = useState(1);
	const [employeesTotal, setEmployeesTotal] = useState(0);
	const [othersTotal, setOthersTotal] = useState(0);

	//queries
	const { data: beneficiaries } = useQuery({
		queryKey: ["beneficiaries"],
		queryFn: getAllBeneficiaries,
		select: (res) => {
			return res.data.beneficiaries.map((el) => {
				return { ...el };
			});
		},
	});
	const saveMutation = useMutation({
		mutationFn: addRemittancesList,
		onSuccess: (res) => {
			toast.success("تم إضافة المستحقات بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			navigate("./..");
		},
		onError: (err) => {
			toast.error("حصل خطأ أثناء عملية الحفظ،الرجاء التواصل مع الدعم الفني", {
				position: toast.POSITION.TOP_CENTER,
			});
		},
	});

	//functions
	const titleChangeHandler = (e) => {
		setTitle(e.target.value);
	};
	const employeeChangeHandler = (e, value, fieldId) => {
		var total = 0;
		const updatedAdded = addedEmployees.map((el) => {
			if (el.id === fieldId) {
				if (!value) {
					return {
						...el,
						beneficiaryId: null,
						amount: "",
						name: "",
					};
				}
				return {
					...el,
					beneficiaryId: value.id,
					amount: "",
					name: value.name,
				};
			}
			return el;
		});
		updatedAdded.forEach((el) => (total = total + el.amount));
		setEmployeesTotal(total);
		setAddedEmployees(updatedAdded);
	};
	const othersChangeHandler = (e, id) => {
		var total = 0;
		const updatedAdded = addedOthers.map((el) => {
			if (el.id === id) {
				return {
					...el,
					name: e.target.value,
					amount: "",
				};
			}
			return el;
		});
		updatedAdded.forEach((el) => (total = total + el.amount));
		setOthersTotal(total);
		setAddedOthers(updatedAdded);
	};
	const employeeAmountChangeHandler = (e, value) => {
		var total = 0;
		const updatedAdded = addedEmployees.map((el) => {
			if (el.id === value) {
				return {
					...el,
					amount: +e.target.value,
				};
			}
			return el;
		});
		updatedAdded.forEach((el) => (total = total + el.amount));
		setEmployeesTotal(total);
		setAddedEmployees(updatedAdded);
	};
	const othersAmountChangeHandler = (e, value) => {
		var total = 0;
		const updatedAdded = addedOthers.map((el) => {
			if (el.id === value) {
				return {
					...el,
					amount: +e.target.value,
				};
			}
			return el;
		});
		updatedAdded.forEach((el) => (total = total + el.amount));
		setOthersTotal(total);
		setAddedOthers(updatedAdded);
	};
	const addEmployeeChangeHandler = () => {
		setAddedEmployees((prev) => [
			...prev,
			{
				id: employeesCount + 1,
				amount: "",
				beneficiaryId: null,
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
				amount: "",
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
			title,
			addedEmployees: filteredAddedEmployees,
			addedOthers: filteredAddedOthers,
			total: employeesTotal + othersTotal,
			date,
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
	const test = () => {
		console.log(`addedEmployees`, addedEmployees);
	};
	return (
		<>
			<form onSubmit={onSaveHandler}>
				<TopBar
					right={
						<>
							<button onClick={test} type="button">
								test
							</button>
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
						<Row flex={[2, 1]}>
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

export default AddRemittancesPage;
