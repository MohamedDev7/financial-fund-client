import axios from "axios";
axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
	localStorage.getItem("token")
)}`;
export const serverApi = axios.create({
	baseURL: "http://127.0.0.1:8050/api/v1/",
	// baseURL: "https://pixalloy.com/edt/api/v1/",
});
//Remittances API
export const addRemittancesList = async (data) => {
	const res = await serverApi.post("/remittances", data);
	return res;
};

export const PayRemittance = async (data) => {
	console.log(`data`, data);
	const res = await serverApi.patch(`/remittances/${data.id}`, data);
	return res;
};
export const searchRemittances = async (data) => {
	console.log(`data`, data.queryKey[2]);
	const res = await serverApi.get(
		`/search?searchBy=${data.queryKey[1]}&name=${data.queryKey[2]}&number=${data.queryKey[3]}&searchOnlyUnpaied=${data.queryKey[4]}`
	);
	return res;
};
//Beneficiaries API
export const addBeneficiary = async (data) => {
	const res = await serverApi.post("/beneficiaries", data);
	return res;
};
export const getAllBeneficiaries = async () => {
	const res = await serverApi.get("/beneficiaries");
	return res;
};
//Docs API
export const getAllDocs = async (data) => {
	const res = await serverApi.get(`/docs?money_received=${data.queryKey[1]}`);
	return res;
};
export const updateDoc = async (data) => {
	const res = await serverApi.patch(`/docs/${data.id}`, data);
	return res;
};
export const sendWhatsappMessages = async (data) => {
	const res = await serverApi.post(`/docs/sendWhatsappMessages`, data);
	return res;
};
//Statistics API
export const getAllStatistics = async () => {
	const res = await serverApi.get("/statistics");
	return res;
};
//Receive API
export const addReceive = async (data) => {
	const res = await serverApi.post(`/receives`, data);
	return res;
};
export const addOtherReceive = async (data) => {
	const res = await serverApi.post(`/receives/others`, data);
	return res;
};
export const getAllReceives = async () => {
	const res = await serverApi.get(`/receives`);
	return res;
};
