import React, { useState } from "react";
import TopBar from "../../components/TopBar/TopBar";
import {
	Button,
	Checkbox,
	Field,
	Input,
	Select,
} from "@fluentui/react-components";

import { SaveRegular } from "@fluentui/react-icons";
import Card from "../../UI/card/Card";
import Row from "../../UI/row/Row";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { addPay, getAllTreasuries } from "../../api/serverApi";

const AddPayPage = () => {
	//hooks
	const navigate = useNavigate();
	//states
	const [name, setName] = useState("");
	const [portfolio, setPortfolio] = useState(false);
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState(new Date());
	const [supplier, setSupplier] = useState("");
	const [title, setTitle] = useState("");
	const [clause, setClause] = useState("");

	//quiries
	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => {
				return { ...el };
			});
		},
		// onSuccess: (res) => {
		// 	setClause(res[0].name);
		// },
	});
	const addMutation = useMutation({
		mutationFn: addPay,
		onSuccess: (res) => {
			toast.success("تم إضافة امر الصرف بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});

			const data = {
				...res.data.data[0],
				clauseText: treasuries.filter(
					(el) => el.id === res.data.data[0].clause
				)[0].name,
			};
			navigate("./../print", {
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

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				addMutation.mutate({
					name,
					has_portfolio: portfolio ? 1 : 0,
					amount,
					paid_at: date,
					supplier,
					title,
					clause: treasuries.filter((el) => el.name === clause)[0].id,
					selection: [],
				});
			}}
		>
			<TopBar
				right={
					<>
						<Button appearance="outline" onClick={() => navigate("./..")}>
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
				<Card title="بيانات الصرف">
					<Row flex={[3, 1, 2]}>
						<Field label="المستلم" required>
							<Input value={name} onChange={(e) => setName(e.target.value)} />
						</Field>
						<div
							style={{
								height: "60px",
								display: "flex",
								alignItems: "flex-end",
							}}
						>
							{/* <Checkbox
								checked={portfolio}
								onChange={(ev, data) => {
									setPortfolio(data.checked);
								}}
								label="انشاء حافظة توريد"
							/> */}
						</div>
						{treasuries && (
							<Field
								label="البند"
								required={true}
								onChange={(e) => setClause(e.target.value)}
							>
								<Select value={clause}>
									<option value=""></option>
									{treasuries.map((el) => (
										<option key={el.id}>{el.name}</option>
									))}
								</Select>
							</Field>
						)}
					</Row>
					<Row flex={[1, 1, 1]}>
						<Field label="المبلغ" required>
							<Input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</Field>
						<Field label="التاريخ" required>
							<Input
								type="date"
								value={date.toISOString().split("T")[0]}
								onChange={(e) => setDate(e.target.value)}
							/>
						</Field>
						<></>
						{/* <Field label="المورد">
							<Input
								value={supplier}
								onChange={(e) => setSupplier(e.target.value)}
							/>
						</Field> */}
					</Row>
					<Row flex={[1, 1]}>
						<Field label="مقابل" required>
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
						</Field>
						<></>
					</Row>
				</Card>
			</div>
		</form>
	);
};

export default AddPayPage;
