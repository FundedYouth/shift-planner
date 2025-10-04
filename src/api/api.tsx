import axios from 'axios';
import { DateItem } from 'context/DatesContext';
import { User, UpdateUserArgs } from 'context/UsersContext';

const base_url = "http://localhost"

export const getRoles = async () => {
    const response = await axios.get(`${base_url}/api/roles`);
    return response;
}

export const getDates = async () => {
    const response = await axios.get(`${base_url}/api/dates`);
    return response;
}

const pad = (n: number) => n.toString().padStart(2, "0");

const formatLocalDate = (d: Date) => {
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1); //months are 0-based
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

export const postDate = async (date: DateItem) => {
    const user_id = date.user_id;
    const dt_start = formatLocalDate(date.dt_start);
    const dt_end = formatLocalDate(date.dt_end);
    const response = await axios.post(`${base_url}/api/dates`, {
        user_id,
        dt_start,
        dt_end,
    });
    return response;
}

export const putDate = async (date: DateItem) => {
    const dt_start = formatLocalDate(date.dt_start);
    const dt_end = formatLocalDate(date.dt_end);
    const response = await axios.put(`${base_url}/api/dates/id/${date.id}`, {
        dt_start,
        dt_end,
    });
    return response;
}

export const delDate = async (id: number) => {
    const response = await axios.delete(`${base_url}/api/dates/id/${id}`);
    return response;
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(`${base_url}/api/users/id/${id}`);
  return response.data.data as User;
};


export const putUser = async (user_id:number, { first_name, last_name, email, phone, dob, password }: UpdateUserArgs) => {
    const response = await axios.put(`${base_url}/api/users/id/${user_id}`, {
        ...(first_name && { first_name: first_name }),
        ...(last_name && { last_name: last_name }),
        ...(email && { email: email }),
        ...(phone && { phone: phone }),
        ...(dob && { dob: dob }),
        ...(password && { password: password }),
    });
    return response;
}

export const loginAPI = async(email:string, password:string) => {
    const response = await axios.get(`${base_url}/api/users/email/${email}`);
    return response;
}