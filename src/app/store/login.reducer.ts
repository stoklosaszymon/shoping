import { createReducer, on } from '@ngrx/store';
import { logIn, logOut } from './login.actions';

export const initialState = false;

export const loginReducer = createReducer(
	initialState,
	on(logIn, () => true),
	on(logOut, () => false)
);
