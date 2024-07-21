import React, { useState } from "react";
import Card from "../../UI/card/Card";
import { Field, Button, Input } from "@fluentui/react-components";
import { DismissRegular, AddRegular } from "@fluentui/react-icons";
import { useMutation } from "react-query";
import { addOtherReceive } from "../../api/serverApi";
import { toast } from "react-toastify";
import TopBar from "../../components/TopBar/TopBar";
import { useNavigate } from "react-router-dom";
import Row from "../../UI/row/Row";

const AddOtherReceivePage = () => {
	//hooks
	const navigate = useNavigate();
	//states
	const [title, setTitle] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [amount, setAmount] = useState("");
	//queries

	const addMutation = useMutation({
		mutationFn: addOtherReceive,
		onSuccess: (res) => {
			toast.success("تم قبض المبلغ بنجاح", {
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
	const submitChangeHandler = () => {
		addMutation.mutate({ title, amount, date, type: "اخرى" });
	};
	return (
		<form onSubmit={submitChangeHandler}>
			<TopBar
				right={
					<>
						{/* <button onClick={test} type="button">
							test
						</button> */}
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
						<Button appearance="primary" icon={<AddRegular />} type="submit">
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
					<Row flex={[3, 1]}>
						<Field required={true} label="العنوان">
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
						</Field>
						<Field required={true} label="التاريخ">
							<Input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</Field>
					</Row>
					<Row flex={[1, 2]}>
						<Field required={true} label="المبلغ">
							<Input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</Field>
						<></>
					</Row>
				</Card>
			</div>
		</form>
	);
};

export default AddOtherReceivePage;
