import axios from "axios";
axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
	localStorage.getItem("token")
)}`;
export const serverApi = axios.create({
	baseURL: "http://localhost:8050/api/v1/",
	// baseURL: "http://192.168.2.200:8050/api/v1/",
	// baseURL: "https://pixalloy.com/edt/api/v1/",
});
//Dues API
export const searchDues = async (data) => {
	console.log(`data`, data);
	if (data.queryKey[1] === "duesList" && !data.queryKey[6]) {
		return;
	}
	const res = await serverApi.get(
		`/search?searchBy=${data.queryKey[1]}&name=${data.queryKey[2]}&number=${data.queryKey[3]}&searchOnlyUnpaied=${data.queryKey[4]}&clause=${data.queryKey[5]}&selectedDuesListId=${data.queryKey[6]}`
	);
	return res;
};
export const getDuesByDuesListId = async (data) => {
	const res = await serverApi.get(`/dues/${data.queryKey[1]}`);
	return res;
};
export const getDuesByPayId = async (data) => {
	const res = await serverApi.get(`/dues/pay/${data.queryKey[1]}`);
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
export const deleteBeneficiary = async (id) => {
	const res = await serverApi.delete(`/beneficiaries/${id}`);
	return res;
};
export const ediBeneficiary = async (data) => {
	const res = await serverApi.patch(`/beneficiaries/${data.id}`, data);
	return res;
};
export const getBeneficiary = async (data) => {
	const res = await serverApi.get(`/beneficiaries/${data.queryKey[1]}`);
	return res;
};
//Dues Lists API
export const addDuesList = async (data) => {
	const res = await serverApi.post("/duesLists", data);
	return res;
};
export const addDuesListUsingExcel = async (data) => {
	const res = await serverApi.post("/duesLists/excel", data);
	return res;
};
export const getAllDuesLists = async (data) => {
	console.log(`test`);
	const res = await serverApi.get(
		`/duesLists?money_received=${data.queryKey[1]}&state=${data.queryKey[2]}&clause=${data.queryKey[3]}`
	);
	return res;
};

export const getDuesListById = async (data) => {
	const res = await serverApi.get(`/duesLists/${data.queryKey[1]}`);
	return res;
};
export const updateDuesList = async (data) => {
	const res = await serverApi.patch(`/duesLists/${data.id}`, data);
	return res;
};
export const updateDuesListUsingExcel = async (data) => {
	const res = await serverApi.patch(`/duesLists/excel/${data.id}`, data);
	return res;
};
export const updateDuesListState = async (data) => {
	const res = await serverApi.patch(`/duesLists/state/${data.id}`, data);
	return res;
};
export const deleteDuesList = async (id) => {
	const res = await serverApi.delete(`/duesLists/${id}`);
	return res;
};
export const sendWhatsappMessages = async (data) => {
	const res = await serverApi.post(`/duesLists/sendWhatsappMessages`, data);
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

export const getAllReceives = async () => {
	const res = await serverApi.get(`/receives`);
	return res;
};
export const deleteReceive = async (id) => {
	const res = await serverApi.delete(`/receives/${id}`);
	return res;
};
//Pay API
export const addPay = async (data) => {
	const res = await serverApi.post(`/pay`, data);
	return res;
};
export const getAllPays = async () => {
	const res = await serverApi.get(`/pay`);
	return res;
};
export const deletePay = async (id) => {
	const res = await serverApi.delete(`/pay/${id}`);
	return res;
};
//Treasuries API
export const addTreasury = async (data) => {
	const res = await serverApi.post("/treasuries", data);
	return res;
};
export const getAllTreasuries = async () => {
	const res = await serverApi.get("/treasuries");
	return res;
};
export const deleteTreasury = async (id) => {
	const res = await serverApi.delete(`/treasuries/${id}`);
	return res;
};
export const getTreasury = async (data) => {
	const res = await serverApi.get(`/treasuries/${data.queryKey[1]}`);
	return res;
};
export const editTreasury = async (data) => {
	const res = await serverApi.patch(`/treasuries/${data.id}`, data);
	return res;
};
//Users API
export const addUser = async (data) => {
	const res = await serverApi.post("/users", data);
	return res;
};
export const getAllUsers = async () => {
	const res = await serverApi.get("/users");
	return res;
};
export const getUser = async (data) => {
	const res = await serverApi.get(`/users/${data.queryKey[1]}`);
	return res;
};
export const getUsername = async (data) => {
	const res = await serverApi.get(`/users/username/${data.queryKey[1]}`);
	return res;
};
export const editUser = async (data) => {
	const res = await serverApi.patch(`/users/${data.id}`, data);
	return res;
};
export const deleteUser = async (id) => {
	const res = await serverApi.delete(`/users/${id}`);
	return res;
};
//Reports API
export const getReceiveReport = async (data) => {
	const res = await serverApi.post("/reports/receive", data);
	return res;
};
//Aalary Advance API
export const addSalaryAdvance = async (data) => {
	const res = await serverApi.post(`/salaryAdvance`, data);
	return res;
};
export const getSalaryAdvanceByFinancialNum = async (data) => {
	const res = await serverApi.get(`/salaryAdvance/fn/${data.queryKey[1]}`);
	return res;
};
export const getSalaryAdvancesForMultiBeneficiaries = async (data) => {
	console.log(`data`, data.queryKey[1]);
	const res = await serverApi.post(`/salaryAdvance/fn/`, data.queryKey[1]);
	return res;
};
export const getAllSalaryAdvances = async (data) => {
	const res = await serverApi.get(`/salaryAdvance`);
	return res;
};
export const deleteSalaryAdvance = async (id) => {
	const res = await serverApi.delete(`/salaryAdvance/${id}`);
	return res;
};
// export const getAllPays = async () => {
// 	const res = await serverApi.get(`/pay`);
// 	return res;
// };
// export const deletePay = async (id) => {
// 	const res = await serverApi.delete(`/pay/${id}`);
// 	return res;
// };
