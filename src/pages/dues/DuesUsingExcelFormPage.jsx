import React, { useState } from "react";
import Row from "../../UI/row/Row";
import TopBar from "../../components/TopBar/TopBar";
import Card from "../../UI/card/Card";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {
	Button,
	Field,
	Input,
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHeader,
	TableHeaderCell,
	TableCellLayout,
	Select,
} from "@fluentui/react-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as XLSX from "xlsx";

import { DismissRegular, SaveRegular } from "@fluentui/react-icons";

import { toast } from "react-toastify";
import {
	addDuesListUsingExcel,
	getAllBeneficiaries,
	getAllTreasuries,
	getDuesByDuesListId,
	getDuesListById,
	updateDuesListUsingExcel,
} from "../../api/serverApi";

const columns = [
	{ columnKey: "م", label: "م" },
	{ columnKey: "الرقم المالي", label: "الرقم المالي" },
	{ columnKey: "الاسم", label: "الاسم" },
	{ columnKey: "المبلغ", label: "المبلغ" },
];
const DuesUsingExcelFormPage = () => {
	//hooks
	const navigate = useNavigate();
	const info = useLocation();

	//states
	const [title, setTitle] = useState("");
	const [excelFile, setExcelFile] = useState(null);
	const [excelData, setExcelData] = useState(null);
	const [total, setTotal] = useState(0);
	const [clause, setClause] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => {
				return { ...el };
			});
		},
	});
	useQuery({
		queryKey: ["duesList", info.state?.id],
		queryFn: getDuesListById,
		select: (res) => {
			return res.data.duesList;
		},
		onSuccess: (data) => {
			setTitle(data.title);
			setDate(data.date);
			setTotal(data.total);
			setClause(treasuries.filter((el) => el.id === data.clause)[0].name);
		},
		enabled: !!info.state && !!treasuries,
	});

	useQuery({
		queryKey: ["duesByListId", info.state?.id],
		queryFn: getDuesByDuesListId,
		select: (res) =>
			res.data.dues.map((el, i) => {
				return {
					...el,
					م: i + 1,
					الاسم: el.name,
					"الرقم المالي": el.financial_num,
					المبلغ: el.amount,
				};
			}),
		onSuccess: (data) => {
			setExcelData(data);
		},
		enabled: !!info.state,
	});

	const saveMutation = useMutation({
		mutationFn: addDuesListUsingExcel,
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
	const editMutation = useMutation({
		mutationFn: updateDuesListUsingExcel,
		onSuccess: (res) => {
			toast.success("تم تعديل المستحقات بنجاح", {
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
	const titleChangeHandler = (e) => {
		setTitle(e.target.value);
	};
	const uploadExcelFileHandler = () => {
		if (excelFile) {
			const reader = new FileReader();
			reader.onload = (e) => {
				let totalAmount = 0;
				const data = e.target.result;
				const workbook = XLSX.read(data, { type: "binary" });

				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const json = XLSX.utils.sheet_to_json(worksheet);
				json.map((el) => (totalAmount = totalAmount + el["المبلغ"]));

				const newData = json.map((jsonObj) => {
					const matchingBenficary = beneficiaries.find(
						(bObj) => bObj.financial_num === jsonObj["الرقم المالي"]
					);
					if (matchingBenficary) {
						return { ...jsonObj, الاسم: matchingBenficary.name };
					} else {
						return jsonObj;
					}
				});

				setExcelData(newData);

				setTotal(totalAmount);
			};
			reader.readAsBinaryString(excelFile);
		}
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (!info.state) {
					saveMutation.mutate({
						title,
						excelData,
						total,
						date,
						clause: treasuries.filter((el) => el.name === clause)[0].id,
						type: "excel",
					});
				} else {
					editMutation.mutate({
						title,
						excelData,
						total,
						date,
						clause: treasuries.filter((el) => el.name === clause)[0].id,
						type: "excel",
						id: info.state.id,
					});
				}
			}}
		>
			<TopBar
				right={
					<>
						<Button
							appearance="secondary"
							icon={<DismissRegular />}
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
					<Row flex={[1, 1, 2]}>
						<div
							style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
						>
							<Field
								label="تحديد ملف اكسل"
								required={!info.state ? true : false}
							>
								<Input
									type="file"
									onChange={(e) => {
										setExcelData(null);
										setExcelFile(e.target.files[0]);
									}}
									accept=".xls,.xlsx"
								/>
							</Field>
							<Button
								appearance="secondary"
								icon={
									<DriveFolderUploadOutlinedIcon
										sx={{
											width: 20,
											height: 20,
										}}
									/>
								}
								onClick={uploadExcelFileHandler}
							>
								رفع
							</Button>
						</div>
						<></>
						<></>
					</Row>
				</Card>
				<Card title="بيانات المستحقين">
					{excelData && excelData.length > 0 ? (
						<>
							<Table arial-label="Default table">
								<TableHeader>
									<TableRow>
										{columns.map((column) => (
											<TableHeaderCell key={column.columnKey}>
												{column.label}
											</TableHeaderCell>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{excelData.map((item, i) => {
										return (
											<TableRow key={i}>
												<TableCell>
													<TableCellLayout>{item["م"]}</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>
														{item["الرقم المالي"]}
													</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>{item["الاسم"]}</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>
														{item["المبلغ"].toLocaleString()}
													</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>
														{item["رقم الجوال"]}
													</TableCellLayout>
												</TableCell>
											</TableRow>
										);
									})}
									<TableRow
										style={{
											backgroundColor: "#4763ac",
											color: "#fff",
											fontSize: "18px",
											fontWeight: "bold",
										}}
									>
										<TableCell>
											<TableCellLayout>الاجمالي</TableCellLayout>
										</TableCell>
										<TableCell></TableCell>

										<TableCell></TableCell>
										<TableCell>
											<TableCellLayout>
												{total.toLocaleString()}
											</TableCellLayout>
										</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</>
					) : (
						""
					)}
				</Card>
			</div>
		</form>
	);
};

export default DuesUsingExcelFormPage;
