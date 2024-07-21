import { Button, Field, Input } from "@fluentui/react-components";
import Row from "../../UI/row/Row";
import Card from "../../UI/card/Card";
import { DismissRegular, SaveRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { addBeneficiary } from "../../api/serverApi";
import { toast } from "react-toastify";
import TopBar from "../../components/TopBar/TopBar";
const AddBeneficiaryPage = () => {
	//hooks
	const navigate = useNavigate();
	//states
	const [name, setName] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	//queries

	const saveMutation = useMutation({
		mutationFn: addBeneficiary,
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
	const nameChangeHandler = (e) => {
		setName(e.target.value);
	};
	const jobNameChangeHandler = (e) => {
		setJobTitle(e.target.value);
	};
	const phoneNumberChangeHandler = (e) => {
		setPhoneNumber(e.target.value);
	};
	const onSaveHandler = () => {
		if (name === "") {
			toast.error("الرجاء ادخال اسم المستفيد", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		if (name === "") {
			toast.error("الرجاء ادخال المسمى الوظيفي للمستفيد", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}
		saveMutation.mutate({ name, jobTitle, phoneNumber });
	};

	return (
		<>
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
						<Button
							appearance="primary"
							icon={<SaveRegular />}
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
				<Card title="بيانات المستفيد">
					<Row flex={[2, 1]}>
						<Field label="اسم المستفيد">
							<Input value={name} onChange={nameChangeHandler} required />
						</Field>
						<></>
					</Row>
					<Row flex={[1, 1]}>
						<Field label="المسمى الوظيفي">
							<Input value={jobTitle} onChange={jobNameChangeHandler} />
						</Field>
						<Field label="رقم الجوال">
							<Input
								value={phoneNumber}
								onChange={phoneNumberChangeHandler}
								type="number"
							/>
						</Field>
						<></>
					</Row>
				</Card>
			</div>
		</>
	);
};

export default AddBeneficiaryPage;
