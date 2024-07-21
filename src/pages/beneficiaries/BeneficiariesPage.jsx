import { Button } from "@fluentui/react-components";
import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Row from "../../UI/row/Row";

import Card from "../../UI/card/Card";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useNavigate } from "react-router-dom";
const BeneficiariesPage = () => {
	//hooks
	const navigate = useNavigate();
	//states
	//queries
	//functions
	const onSaveHandler = () => {};
	const test = () => {};
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
		</>
	);
};

export default BeneficiariesPage;
