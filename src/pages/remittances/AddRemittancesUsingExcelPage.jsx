import React, { useState } from "react";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Row from "../../UI/row/Row";
import TopBar from "../../components/TopBar/TopBar";
import Card from "../../UI/card/Card";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { Button, Field, Input } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as XLSX from "xlsx";
import {
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHeader,
	TableHeaderCell,
	TableCellLayout,
} from "@fluentui/react-components";
import { addRemittancesList, getAllBeneficiaries } from "../../api/serverApi";
import { toast } from "react-toastify";

const columns = [
	{ columnKey: "م", label: "م" },
	{ columnKey: "الاسم", label: "الاسم" },
	{ columnKey: "المبلغ", label: "المبلغ" },
	{ columnKey: "ملاحظة", label: "ملاحظة" },
];
const AddRemittancesUsingExcelPage = () => {
	//hooks
	const navigate = useNavigate();
	//states
	const [title, setTitle] = useState("");
	const [excelFile, setExcelFile] = useState(null);
	const [excelData, setExcelData] = useState(null);
	const [total, setTotal] = useState(0);

	//queries
	const { data: beneficiaries } = useQuery({
		queryKey: ["beneficiaries"],
		queryFn: getAllBeneficiaries,
		select: (res) => {
			return res.data.beneficiaries.map((el) => el);
		},
	});
	const saveMutation = useMutation({
		mutationFn: addRemittancesList,
		onSuccess: (res) => {
			toast.success("تم إضافة المستحقات بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
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
	const uploadExcelFileHandler = (e) => {
		if (excelFile) {
			const reader = new FileReader();
			reader.onload = (e) => {
				let totalAmount = 0;
				const data = e.target.result;
				const workbook = XLSX.read(data, { type: "binary" });
				console.log(`workbook`, workbook);
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const json = XLSX.utils.sheet_to_json(worksheet);
				json.map((el) => (totalAmount = totalAmount + el["المبلغ"]));
				setExcelData(json);
				setTotal(totalAmount);
			};
			reader.readAsBinaryString(excelFile);
		}
	};
	const onSaveHandler = () => {
		if (title === "") {
			toast.error("الرجاء أدخال العنوان", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		if (!excelData) {
			toast.error("الرجاء تحديد ملف الاكسل", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}

		saveMutation.mutate({ title, excelData, total });
	};
	const test = () => {
		console.log(`beneficiaries`, beneficiaries);
		console.log(`total`, total);
	};
	return (
		<>
			<TopBar
				right={
					<>
						<button onClick={test}>test</button>
						<Button
							appearance="secondary"
							icon={
								<CloseOutlinedIcon
									sx={{
										width: 20,
										height: 20,
									}}
									onClick={() => {
										navigate("./..");
									}}
								/>
							}
						>
							الغاء
						</Button>
						<Button
							appearance="primary"
							icon={
								<SaveOutlinedIcon
									sx={{
										width: 20,
										height: 20,
									}}
								/>
							}
							onClick={onSaveHandler}
						>
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
					<Row flex={[1, 1]}>
						<Field label="العنوان">
							<Input value={title} onChange={titleChangeHandler} />
						</Field>
						<></>
					</Row>
					<Row flex={[1, 1, 2]}>
						<div
							style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
						>
							<Field label="تحديد ملف اكسل">
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
									{excelData.map((item) => {
										return (
											<TableRow key={item["م"]}>
												<TableCell>
													<TableCellLayout>{item["م"]}</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>{item["الاسم"]}</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>{item["المبلغ"]}</TableCellLayout>
												</TableCell>
												<TableCell>
													<TableCellLayout>{item["ملاحظة"]}</TableCellLayout>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</>
					) : (
						""
					)}
				</Card>
			</div>
		</>
	);
};

export default AddRemittancesUsingExcelPage;
