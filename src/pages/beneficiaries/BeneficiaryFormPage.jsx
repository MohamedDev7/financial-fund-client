import { Button, Field, Input } from "@fluentui/react-components";
import Row from "../../UI/row/Row";
import Card from "../../UI/card/Card";
import { DismissRegular, SaveRegular } from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
	addBeneficiary,
	ediBeneficiary,
	getBeneficiary,
} from "../../api/serverApi";
import { toast } from "react-toastify";
import TopBar from "../../components/TopBar/TopBar";
const BeneficiaryFormPage = () => {
	//hooks
	const navigate = useNavigate();
	const info = useLocation();
	//states
	const [name, setName] = useState("");
	const [financialNum, setFinancialNum] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	//queries
	useQuery({
		queryKey: ["Beneficiary", info.state?.id],
		queryFn: getBeneficiary,
		onSuccess: (res) => {
			setName(res.data.beneficiary.name);
			setFinancialNum(res.data.beneficiary.financial_num);
			setPhoneNumber(res.data.beneficiary.phone_number);
		},
		enabled: !!info.state,
	});
	const addMutation = useMutation({
		mutationFn: addBeneficiary,
		onSuccess: (res) => {
			toast.success("تم إضافة المستفيد بنجاح", {
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
		mutationFn: ediBeneficiary,
		onSuccess: (res) => {
			toast.success("تم تعديل المستفيد بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			navigate("./..", {});
		},
		onError: (err) => {
			toast.error(err.response.data.message, {
				position: toast.POSITION.TOP_CENTER,
			});
		},
	});
	//functions
	const nameChangeHandler = (e) => {
		setName(e.target.value);
	};
	const financialNumChangeHandler = (e) => {
		setFinancialNum(e.target.value);
	};
	const phoneNumberChangeHandler = (e) => {
		setPhoneNumber(e.target.value);
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();

				{
					info.state
						? editMutation.mutate({
								id: info.state.id,
								name: name.trim(),
								financialNum,
								phoneNumber,
						  })
						: addMutation.mutate({
								name: name.trim(),
								financialNum,
								phoneNumber,
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
				<Card title="بيانات المستفيد">
					<Row flex={[2, 1]}>
						<Field label="اسم المستفيد" required>
							<Input value={name} onChange={nameChangeHandler} required />
						</Field>
						<></>
					</Row>
					<Row flex={[1, 1]}>
						<Field label="الرقم المالي" required>
							<Input
								value={financialNum}
								type="number"
								onChange={financialNumChangeHandler}
							/>
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
		</form>
	);
};

export default BeneficiaryFormPage;
