import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DismissRegular, SaveRegular } from "@fluentui/react-icons";
import TopBar from "../../components/TopBar/TopBar";
import { Button, Card, Field, Input } from "@fluentui/react-components";
import Row from "../../UI/row/Row";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { addTreasury, editTreasury, getTreasury } from "../../api/serverApi";

const TreasuryFromPage = () => {
	//hooks
	const navigate = useNavigate();
	const info = useLocation();
	//states
	const [name, setName] = useState("");

	//queries
	useQuery({
		queryKey: ["Treasury", info.state?.id],
		queryFn: getTreasury,
		onSuccess: (res) => {
			console.log(`res`, res);
			setName(res.data.treasury.name);
		},
		enabled: !!info.state,
	});
	const saveMutation = useMutation({
		mutationFn: addTreasury,
		onSuccess: (res) => {
			toast.success("تم إضافة الصندوق بنجاح", {
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
		mutationFn: editTreasury,
		onSuccess: (res) => {
			toast.success("تم تعديل الصندوق بنجاح", {
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
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				info.state
					? editMutation.mutate({
							name,
							id: info.state.id,
					  })
					: saveMutation.mutate({
							name,
					  });
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
				<Card title="بيانات الصندوق">
					<Row flex={[2, 1]}>
						<Field label="اسم الصندوق" required>
							<Input value={name} onChange={(e) => setName(e.target.value)} />
						</Field>
						<></>
					</Row>
				</Card>
			</div>
		</form>
	);
};

export default TreasuryFromPage;
