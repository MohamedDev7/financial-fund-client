import React, { useState } from "react";
import Card from "../../UI/card/Card";
import {
	Button,
	Field,
	Input,
	Radio,
	RadioGroup,
} from "@fluentui/react-components";
import Row from "../../UI/row/Row";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getReceiveReport } from "../../api/serverApi";

const ReceiveReport = () => {
	//hooks
	const navigate = useNavigate();
	//states
	const [searchBy, setSearchBy] = useState("number");
	const [value, setValue] = useState("");

	//queries
	const submitMutation = useMutation({
		mutationFn: getReceiveReport,
		select: (res) => {
			const newDues = res.data.dues.map((el) => {
				return { ...el, amountText: el.amount.toLocaleString("US-en") };
			});

			return { ...res.data, dues: newDues };
		},
		onSuccess: (res) => {
			if (res.data.duesLists.length === 0) {
				toast.error(`لايوجد كشف يحمل الرقم ${value} `, {
					position: toast.POSITION.TOP_CENTER,
				});
				return;
			}
			const newDues = res.data.dues.map((el) => {
				return { ...el, amountText: el.amount.toLocaleString("US-en") };
			});
			navigate("./print", {
				state: { duesList: res.data.duesLists[0], dues: newDues },
			});
		},
		onError: (err) => {
			toast.error(err.response.data.message, {
				position: toast.POSITION.TOP_CENTER,
			});
		},
	});
	return (
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
			<Card title="تقارير الاستلام">
				<Row>
					<Field label="البحث بواسطة">
						<RadioGroup
							layout="horizontal"
							value={searchBy}
							onChange={(_, data) => {
								setValue("");
								setSearchBy(data.value);
							}}
						>
							<Radio value="number" label="رقم الكشف" />
							{/* <Radio value="title" label="عنوان الكشف" /> */}
						</RadioGroup>
					</Field>
				</Row>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						submitMutation.mutate({ searchBy, value });
					}}
				>
					{searchBy === "number" ? (
						<Row>
							<div
								style={{ display: "flex", alignItems: "flex-end", gap: "15px" }}
							>
								<Field label="رقم الكشف">
									<Input
										type="number"
										value={value}
										onChange={(e) => setValue(e.target.value)}
									/>
								</Field>
								<Button appearance="primary" type="submit">
									عرض
								</Button>
							</div>
						</Row>
					) : (
						<Row>
							<div
								style={{ display: "flex", alignItems: "flex-end", gap: "15px" }}
							>
								<Field label="عنوhhhhان الكشف" style={{ width: "550px" }}>
									<Input
										type="text"
										value={value}
										onChange={(e) => setValue(e.target.value)}
									/>
								</Field>
								<Button appearance="primary" type="submit">
									عرض
								</Button>
							</div>
						</Row>
					)}
				</form>
			</Card>
		</div>
	);
};

export default ReceiveReport;
