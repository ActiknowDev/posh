import axios from "axios";

export const loginUser = (data) => {
   return axios.post("/users/login", data);
};

export const getUsers = (requestData) => {
   return axios.get('/users', {params: requestData});
}

export const getUserByEmail = (email) => {
   return axios.get(`/user/${email}`);
}

export const saveUsers = (postData) => {
   return axios.post('/create', postData);
}

export const completeTraining = (id, postData) => {
   return axios.put(`/users/${id}/complete`, postData);
}

export const googleLogin = (data) => {
   return axios.post("/users/google-login", data);
};

export const saveConfig = (postData) => {
   return axios.post('/save', postData);
}

export const getConfigs = (requestData) => {
   return axios.get('/configs', {params: requestData});
}