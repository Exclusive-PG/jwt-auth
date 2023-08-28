import { makeAutoObservable } from "mobx";
import { IUser } from "./../models/IUser";
import AuthService from "./../services/AuthService";
import  axios  from 'axios';
import { API_URL } from "../http";
import { AuthResponse } from './../models/responses/AuthResponse';

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(state: boolean) {
    this.isAuth = state;
  }

  setUser(user: IUser) {
    this.user = user;
  }
  setLoading(state: boolean) {
    this.isLoading = state;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      console.log("login")
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);
     
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
  async logout() {
    try {
      const response = await AuthService.logout();
      console.log("logout")
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
  async checkAuth(){
    this.setLoading(true)
    try {
       const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
       console.log(response);
       localStorage.setItem("token", response.data.accessToken);
       this.setAuth(true);
       this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }finally{
      this.setLoading(false)
    }
  }
}
