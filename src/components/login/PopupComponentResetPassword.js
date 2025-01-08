'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import { padding, pageUrlConstants } from '@/lib/constants';
import toastCall from '@/lib/services/toastCall';
import { useGlobalContext, useGlobalDispatch } from '@/store';
import IconInput, { input_margin } from '@/components/login/IconInputComponent';
import Image from 'next/image';
import { backRoutes, replaceRoutes } from '@/store/actions/historyActions';
import { toResetPassword } from '@/store/actions/pages/loginResetPasswordAction';
import { closePopup } from '@/store/actions/user';

const { login } = pageUrlConstants;

const PopupDialogResetPassword = ({ closePopup }) => {
	const { state } = useGlobalContext();
	const t = useTranslations();

	const oldPasswordRef = useRef(null);
	const passwordRef = useRef(null);
	const newPasswordRef = useRef(null);

	const [oldPassword, setOldPassword] = useState('');
	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	function oldPasswordEvent(e) {
		var key = window.event ? e.keyCode : e.which;
		setOldPassword(e.target.value);
		if (key === 13) {
			passwordRef.current.focus();
		}
	}

	function passwordEvent(e) {
		var key = window.event ? e.keyCode : e.which;
		setPassword(e.target.value);
		if (key === 13) {
			newPasswordRef.current.focus();
		}
	}
	function newPasswordEvent(e) {
		var key = window.event ? e.keyCode : e.which;
		setNewPassword(e.target.value);
		if (key === 13) {
			submitPassword();
		}
	}

	function submitPassword() {
		if (password && newPassword) {
			if (password === newPassword) {
				let data = {
					password: password,
				};
				if (state.user.id !== 'guest') {
					data.old_password = oldPassword;
				}
				resetPasswordSubmit(data);
			} else {
				toastCall(intl.formatMessage({ id: 'LOGIN.TIP.NOREPEAT.PASSWORD' }));
			}
		} else {
			toastCall(intl.formatMessage({ id: 'LOGIN.TIP.ERROR.MUST' }));
		}
	}

	const resetPasswordSubmit = (data) => {
		const user = state.user;
		const temporaryData = user.temporaryData;
		let dataQuery = {
			username: user.username || temporaryData.username,
			password: data.password,
		};
		if (user.id !== 'guest') {
			dataQuery.old_password = data.old_password;
		}
		useGlobalDispatch(toResetPassword(dataQuery, (check) => {
			if (check) {
				toastCall('请牢记您的新密码!请退出账号再重新登陆防止忘记哦~~！！');
        closeModal();
			}
		}));
	};

	const closeModal = () => {
		useGlobalDispatch({
			type: 'UPDATE_POPUP_TYPE',
			data: {
				popupType: 'login',
			},
		});

		useGlobalDispatch(closePopup());
	};

	return (
		<div className='card-body'>
			<div>
				<div className='form-item'>
					{state.user.id !== 'guest'
						? (
							<div className='input_content_box'>
								<IconInput
									className='input_content_box_input'
									ref={oldPasswordRef}
									icon='/images/icons/lock.png'
									inputType='text'
									value={oldPassword}
									callback={oldPasswordEvent}
									placeholder={t('Login.placeholder_again_password')}
									placeholder={intl.formatMessage({
										id: 'LOGIN.PLACEHOLDER.AGAIN_PASSWORD',
									})}
									enterKeyHint='next'
								/>
							</div>
						)
						: (
							''
						)}
				</div>
				<div className='form-item'>
					<IconInput
						className='input_content_box_input'
						ref={passwordRef}
						icon='/images/icons/lock.png'
						inputType='text'
						value={password}
						callback={passwordEvent}
						placeholder={t('Login.placeholder_new_password')}
						enterKeyHint='next'
					/>
				</div>
				<div className='form-item'>
					<IconInput
						className='input_content_box_input'
						ref={newPasswordRef}
						icon='/images/icons/lock.png'
						inputType='text'
						value={newPassword}
						callback={newPasswordEvent}
						placeholder={t('Login.placeholder_again_password')}
						enterKeyHint='done'
					/>
				</div>

				<div className='btn-wrapper' onClick={submitPassword}>
					<button className='submit-btn'>{t('Login.reset_password')}</button>
				</div>
			</div>
		</div>
	);
};

export default PopupDialogResetPassword;
