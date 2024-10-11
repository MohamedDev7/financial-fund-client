import React, { useState } from "react";
import Card from "../../UI/card/Card";
import { Field, Button, Input } from "@fluentui/react-components";
import { useMutation, useQuery } from "react-query";
import {
	addReceive,
	addSalaryAdvance,
	getAllBeneficiaries,
} from "../../api/serverApi";
import { toast } from "react-toastify";
import Row from "../../UI/row/Row";
import TopBar from "../../components/TopBar/TopBar";
import { SaveRegular, DismissRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from "../../UI/autocompleteInput/AutocompleteInput";

const SalaryAdvanceFormPage = () => {
	//hooks

	const navigate = useNavigate();
	//states
	const [name, setName] = useState(null);
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	//queries
	const { data: beneficiaries } = useQuery({
		queryKey: ["beneficiaries"],
		queryFn: getAllBeneficiaries,
		select: (res) => {
			const test = [
				{
					id: 0,
					name: "",
					job_title: "",
					phone_number: null,
					financial_num: null,
				},
				...res.data.beneficiaries,
			];

			return test;
		},
		onSuccess: (data) => {
			setName(data[0]);
		},
	});
	const addMutation = useMutation({
		mutationFn: addSalaryAdvance,
		onSuccess: (res) => {
			toast.success("تم اضافة السلفة بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});

			navigate("./../print", {
				state: {
					data: res.data.salaryAdvance,
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
	const submitHandler = (e) => {
		e.preventDefault();
		if (name.name === "") {
			toast.error("يرجى ادخال اسم المستفيد", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		addMutation.mutate({
			name,
			date,
			amount,
		});
	};

	return (
		<form onSubmit={submitHandler}>
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
				{beneficiaries && (
					<Card title="بيانات السلفة">
						<Row flex={[3, 1, 2]}>
							<Field label="اسم المستفيد" required>
								<AutocompleteInput
									value={name}
									disablePortal
									id="combo-box-demo"
									options={beneficiaries}
									onChange={(e, value) => {
										setName(value);
									}}
								/>
							</Field>
							<></>
							<></>
						</Row>
						<Row flex={[1, 1, 2]}>
							<Field label="المبلغ" required>
								<Input
									type="number"
									value={amount}
									min={0}
									onChange={(e) => setAmount(e.target.value)}
								/>
							</Field>
							<Field label="التاريخ" required>
								<Input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
								/>
							</Field>
							<></>
						</Row>
					</Card>
				)}
			</div>
		</form>
	);
};

export default SalaryAdvanceFormPage;
