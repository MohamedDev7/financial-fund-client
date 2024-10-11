import React, { useState } from "react";
import Card from "../../UI/card/Card";
import {
	Field,
	Select,
	Button,
	RadioGroup,
	Radio,
	Input,
	Checkbox,
} from "@fluentui/react-components";
import { useMutation, useQuery } from "react-query";
import {
	addReceive,
	getAllDuesLists,
	getAllTreasuries,
} from "../../api/serverApi";
import { toast } from "react-toastify";
import Row from "../../UI/row/Row";
import TopBar from "../../components/TopBar/TopBar";
import { SaveRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";

const AddReceivePage = () => {
	//hooks

	const navigate = useNavigate();
	//states
	const [from, setFrom] = useState("");
	const [isDues, setIsDues] = useState(false);
	const [type, setType] = useState("نقدي");
	const [checkNumber, setCheckNumber] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState("");
	const [duesListId, setDuesListId] = useState(null);
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
		// onSuccess: (res) => {
		// 	setClause(res[0].name);
		// },
	});
	const { data: duesList } = useQuery({
		queryKey: ["duesLists", "0", "reviewed", ""],
		queryFn: getAllDuesLists,
		select: (res) => {
			console.log(`res.data`, res.data);
			return res.data.duesLists.map((el) => el);
		},
		enabled: isDues,
	});
	const addMutation = useMutation({
		mutationFn: addReceive,
		onSuccess: (res) => {
			toast.success("تم قبض المبلغ بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			const data = {
				...res.data.receive[0],
				clauseText: treasuries.filter(
					(el) => el.id === res.data.receive[0].clause
				)[0].name,
			};
			navigate("./../print", {
				state: {
					receive: data,
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
		addMutation.mutate({
			from,
			date,
			type,
			title,
			amount,
			duesListId,
			checkNumber: checkNumber ? checkNumber : null,
			clause: treasuries.filter((el) => el.name === clause)[0].id,
		});
	};

	return (
		<form onSubmit={submitHandler}>
			<TopBar
				right={
					<>
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
				<Card title="بيانات القبض">
					<Row flex={[3, 1, 2]}>
						<Field label="جهة التسليم" required>
							<Input value={from} onChange={(e) => setFrom(e.target.value)} />
						</Field>
						<div
							style={{
								height: "60px",
								display: "flex",
								alignItems: "flex-end",
							}}
						>
							<Checkbox
								checked={isDues}
								onChange={(ev, data) => {
									setTitle("");
									setAmount("");
									setDuesListId(null);
									setIsDues(data.checked);
								}}
								label="مستحقات"
							/>
						</div>
					</Row>
					<Row flex={[1, 1, 2, 2]}>
						<Field label="التاريخ" required>
							<Input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</Field>
						<Field label="نوع السند">
							<RadioGroup
								layout="horizontal"
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<Radio value="نقدي" label="نقدي" />
								<Radio value="شيك" label="شيك" />
							</RadioGroup>
						</Field>
						{type === "شيك" && (
							<Field label="رقم الشيك" required>
								<Input
									type="number"
									value={checkNumber}
									onChange={(e) => setCheckNumber(e.target.value)}
								/>
							</Field>
						)}
						<></>
					</Row>
					<Row flex={[2, 1, 1]}>
						{isDues ? (
							duesList && (
								<Field label="مقابل" required>
									<Select
										onChange={(e) => {
											setTitle(e.target.value);
											console.log(`e.target.value`, e.target.value);
											const clause = duesList.filter(
												(el) => el.title === e.target.value
											)[0].clause;

											setAmount(
												duesList.filter((el) => el.title === e.target.value)[0]
													.total
											);
											setDuesListId(
												duesList.filter((el) => el.title === e.target.value)[0]
													.id
											);
											setClause(
												treasuries.filter((el) => el.id === clause)[0].name
											);
										}}
									>
										<option>{""}</option>
										{duesList.map((el) => (
											<option key={el.id}>{el.title}</option>
										))}
									</Select>
								</Field>
							)
						) : (
							<Field label="مقابل" required>
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</Field>
						)}
						<Field label="المبلغ" required>
							<Input
								type="number"
								value={amount}
								disabled={isDues ? true : false}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</Field>
						{treasuries && (
							<Field
								label="البند"
								required={true}
								onChange={(e) => setClause(e.target.value)}
							>
								<Select value={clause} disabled={isDues}>
									<option value=""></option>
									{treasuries.map((el) => (
										<option key={el.id}>{el.name}</option>
									))}
								</Select>
							</Field>
						)}
					</Row>
				</Card>
			</div>
		</form>
	);
};

export default AddReceivePage;
