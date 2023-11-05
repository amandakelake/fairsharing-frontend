import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
	Box,
	FormControl, FormControlLabel,
	FormLabel, InputAdornment,
	MenuItem, Radio,
	RadioGroup,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material';

import { IStepBaseProps } from '@/components/createProject/step/start';
import { StyledFlexBox } from '@/components/styledComponents';
import { showToast } from '@/store/utils';
import { CreateProjectParams } from '@/services';
import ButtonGroup from '@/components/createProject/step/buttonGroup';

export interface IStepStrategyProps extends Partial<IStepBaseProps> {
	data?: Pick<CreateProjectParams, 'network' | 'votePeriod' | 'symbol'>;
	onSave?: () => void;
	canEdit?: boolean;
}

export interface StepStrategyRef {
	getFormData: () => {
		symbol: string;
		network: number;
		period: string;
	};
}

const StepStrategy = forwardRef<StepStrategyRef, IStepStrategyProps>((props, ref) => {
	const { step, setActiveStep, canEdit = true, onSave, data } = props;
	const [symbol, setSymbol] = useState(data?.symbol ?? '');
	const [network, setNetwork] = useState(data?.network ?? 420);
	const [period, setPeriod] = useState(data?.votePeriod ?? '');

	const [voteSystem, setVoteSystem] = useState('1');
	const [voteApproveType, setVoteApproveType] = useState('1');
	const [forWeightOfTotal, setForWeightOfTotal] = useState('');
	const [differWeightOfTotal, setDifferWeightOfTotal] = useState('');

	const handleVoteSystemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVoteSystem((event.target as HTMLInputElement).value);
	};
	const handleVoteApproveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVoteApproveType((event.target as HTMLInputElement).value);
	};

	const handleForWeightInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForWeightOfTotal(event.target.value);
	};
	const handleDifferWeightInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDifferWeightOfTotal(event.target.value);
	};

	const [symbolError, setSymbolError] = useState(false);
	const [periodError, setPeriodError] = useState(false);
	const [isEdited, setIsEdited] = useState(false);

	const isSettingPage = !!data;

	const handleSymbolInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSymbol(event.target.value);
		setSymbolError(false);
	};

	const handleNetworkChange = (event: SelectChangeEvent) => {
		setNetwork(Number(event.target.value));
	};

	const handlePeriodInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsEdited(true);
		setPeriod(event.target.value);
		setPeriodError(false);
	};

	useImperativeHandle(
		ref,
		() => ({
			getFormData: () => ({ network, period, symbol }),
		}),
		[network, period, symbol],
	);

	const handleSubmit = (action: 'BACK' | 'NEXT') => {
		if (action === 'BACK') {
			setActiveStep!(step! - 1);
			return;
		}
		if (!symbol) {
			setSymbolError(true);
			return;
		}
		if (!period) {
			setPeriodError(true);
			return;
		}
		if (!Number(period)) {
			setPeriodError(true);
			showToast('Vote period must be number', 'error');
			return;
		}
		setActiveStep!(step! + 1);
	};

	const handleClick = (type: 'primary' | 'secondary') => {
		if (!isSettingPage) {
			handleSubmit(type === 'primary' ? 'NEXT' : 'BACK');
			return;
		}
		if (type === 'primary') {
			if (!Number(period)) {
				setPeriodError(true);
				showToast('Vote period must be number', 'error');
				return;
			}
			onSave!();
			setIsEdited(false);
		} else {
			setIsEdited(false);
			setPeriod(data?.votePeriod ?? '');
		}
	};

	return (
		<>
			<TextField
				required
				label="Symbol"
				value={symbol}
				placeholder={'Token Symbol *'}
				onChange={handleSymbolInputChange}
				sx={{ display: 'block', minWidth: '' }}
				error={symbolError}
				disabled={isSettingPage}
			/>

			<Select
				labelId="network-select-label"
				id="network-select"
				value={network.toString()}
				onChange={handleNetworkChange}
				placeholder={'Select network'}
				sx={{ width: '320px', marginTop: '32px' }}
				disabled={isSettingPage}
			>
				<MenuItem value={'10'}>Optimism</MenuItem>
				<MenuItem value={'420'}>Optimism Goerli</MenuItem>
			</Select>

			<div style={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
				<TextField
					required
					label="period"
					value={period}
					placeholder={'Voting period *'}
					onChange={handlePeriodInputChange}
					error={periodError}
					disabled={!canEdit}
				/>
				<span style={{ marginLeft: '12px' }}>days</span>
			</div>

			<Typography variant={'subtitle1'} sx={{ marginTop: '32px' }}>Voting system: </Typography>
			<FormControl>
				{/*<FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>*/}
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					value={voteSystem}
					onChange={handleVoteSystemChange}
				>
					<FormControlLabel
						value="1"
						control={<Radio />}
						sx={{ marginTop: '12px' }}
						label={
							<>
								<Typography variant={'subtitle2'}>One person, one vote</Typography>
								<Typography variant={'body2'} color={'#64748B'}>All contributors in this project can
									vote,
									and each vote is equal.</Typography>
							</>
						} />
					<FormControlLabel
						value="2"
						control={<Radio />}
						sx={{ marginTop: '20px' }}
						label={
							<>
								<Typography variant={'subtitle2'}>Weighted voting</Typography>
								<Typography variant={'body2'} color={'#64748B'}>Votes are weighted by admin settings,
									configured in the next step.</Typography>
							</>
						} />
				</RadioGroup>
			</FormControl>

			{
				voteSystem !== '1' ? <>
					<Typography variant={'subtitle1'} sx={{ marginTop: '32px' }}>Voting approved: </Typography>

					<FormControl>
						{/*<FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>*/}
						<RadioGroup
							aria-labelledby="demo-controlled-radio-buttons-group"
							name="controlled-radio-buttons-group"
							value={voteApproveType}
							onChange={handleVoteApproveChange}
						>
							<FormControlLabel
								value="1"
								sx={{ marginTop: '12px' }}
								control={<Radio />}
								label={
									<>
										<Typography variant={'subtitle2'}>Number of for ≥ number of
											against（Requirement: for ≥ 1)</Typography>
										<Typography variant={'body2'} color={'#64748B'}>No votes, or
											equally split between for and against.</Typography>
									</>
								} />
							<FormControlLabel
								value="2"
								sx={{ marginTop: '20px' }}
								control={<Radio />}
								label={

									<>
										<StyledFlexBox>
											<Typography variant={'subtitle2'}>Number of for / total votes *
												100% ≥ </Typography>
											<TextField
												sx={{ marginLeft: '12px', width: '60px' }}
												variant={'standard'}
												required
												onChange={handleForWeightInputChange}
												value={forWeightOfTotal}
												size={'small'}
												placeholder={'50.00'}
												InputProps={{
													disableUnderline: true,
													endAdornment: (
														<InputAdornment position="end">
															<Typography variant="body1">%</Typography>
														</InputAdornment>
													),
												}}
											/>
										</StyledFlexBox>
										<Typography variant={'body2'} color={'#64748B'}>The ratio of "for"
											votes to the total votes satisfies a specified
											threshold.</Typography>
									</>
								} />
							<FormControlLabel
								value="3" sx={{ marginTop: '20px' }}
								control={<Radio />}
								label={
									<>
										<StyledFlexBox>
											<Typography variant={'subtitle2'}>(Number of for - number of
												against) / total votes * 100% ≥ </Typography>

											<TextField
												sx={{ marginLeft: '12px', width: '60px' }}
												variant={'standard'}
												required
												onChange={handleDifferWeightInputChange}
												value={differWeightOfTotal}
												size={'small'}
												placeholder={'50.00'}
												InputProps={{
													disableUnderline: true,
													endAdornment: (
														<InputAdornment position="end">
															<Typography variant="body1">%</Typography>
														</InputAdornment>
													),
												}}
											/>
										</StyledFlexBox>
										<Typography variant={'body2'} color={'#64748B'}>The ratio of
											"for-against" votes to the total votes satisfies a specified
											threshold.</Typography>
									</>
								} />
						</RadioGroup>
					</FormControl>
				</> : null
			}

			<ButtonGroup
				canEdit={canEdit}
				isEdited={isEdited}
				isSettingPage={isSettingPage}
				handlePrimary={() => handleClick('primary')}
				handleSecondary={() => handleClick('secondary')}
			/>
		</>
	);
});
StepStrategy.displayName = 'StepStrategy';

export default StepStrategy;
