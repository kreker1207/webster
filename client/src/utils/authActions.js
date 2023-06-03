import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api  from "./apiSetting";

const backendURL = 'http://localhost:8080'

export const fetchRegister = createAsyncThunk(
    'auth/fetchRegister',
    async ({ login, email, password}, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        await axios.post(
          `${backendURL}/api/registration`,
          { login, email, password },
          config
        )
      } catch (error) {
      // return custom error message from backend if present
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
)

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async ({ login, password }, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                credentials: 'include',   
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const {data}  = await axios.post(
                `${backendURL}/api/login`,
                { login, password },
                config
            )
            console.log(data)
            // store user's token in local storage
            window.localStorage.setItem('accessToken', data.accessToken)
            return data
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    // eslint-disable-next-line
    async (_, { rejectWithValue }) => {
        try {  
            const {data}  = await api.get(
                '/profile'
            )
            return data
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const fetchLogout = createAsyncThunk(
    'auth/fetchLogout',
    // eslint-disable-next-line
    async (_, { rejectWithValue }) => {
        try {
            await api.post(
                `/logout`,
            )
            window.localStorage.removeItem('accessToken')
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)