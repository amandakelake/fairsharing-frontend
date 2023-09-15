'use client';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';

import Image from 'next/image';

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

import { IContribution, IContributor, IProject } from '@/services/types';
import Checkbox, { CheckboxTypeEnum } from '@/components/checkbox';
import { StyledFlexBox } from '@/components/styledComponents';
import ContributionItem from '@/components/project/contribution/contributionItem';
import { EasAttestation } from '@/services/eas';

export enum IVoteValueEnum {
	FOR = 1,
	AGAINST = 2,
	ABSTAIN = 3,
}

export interface IVoteParams {
	contributionId: number;
	value: IVoteValueEnum;
	uId: string;
}

export interface IClaimParams {
	contributionId: number;
	uId: string;
	token: number;
	voters: string[];
	voteValues: number[];
}

export interface IContributionListProps {
	projectId: string;
	contributionList: IContribution[];
	projectDetail: IProject;
	onVote: (params: IVoteParams) => void;
	onClaim: (params: IClaimParams) => void;
	easVoteMap: Record<string, EasAttestation[]>;
	contributorList: IContributor[];
}

const ContributionList = ({
	contributionList,
	projectDetail,
	onVote,
	onClaim,
	easVoteMap,
	contributorList,
}: IContributionListProps) => {
	const [claimTotal, getClaimTotal] = useState(0);
	const [showFilter, setShowFilter] = useState(false);
	const [showSelect, setShowSelect] = useState(false);

	const [period, setPeriod] = useState('ALL');
	const [voteStatus, setVoteStatus] = useState('ALL');
	const [contributor, setContributor] = useState('ALL');

	const [selected, setSelected] = useState<Array<number>>([]);

	const [showDialog, setShowDialog] = useState(false);

	const handleHideSelect = () => {
		setShowSelect(false);
	};

	const handlePeriodChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value);
	};
	const handleVoteStatusChange = (event: SelectChangeEvent) => {
		setVoteStatus(event.target.value);
	};
	const handleContributorChange = (event: SelectChangeEvent) => {
		setContributor(event.target.value);
	};

	const onClickFilterBtn = () => {
		if (showFilter) {
			setShowSelect(false);
		}
		setShowFilter((pre) => !pre);
	};

	const onClickSelectBtn = () => {
		setShowSelect((pre) => !pre);
	};

	const handleRest = () => {
		setVoteStatus('ALL');
		setPeriod('ALL');
		setContributor('ALL');
	};

	const onClickSelectParent = (type: Exclude<CheckboxTypeEnum, 'Partial'>) => {
		console.log('type', type);
		if (type === 'All') {
			setSelected(contributionList.map((item, idx) => item.id));
		} else {
			setSelected([]);
		}
	};

	const onSelect = (idList: number[]) => {
		setSelected(idList);
	};

	const onCloseDialog = () => {
		setShowDialog(false);
	};
	const showDeleteDialog = () => {
		setShowDialog(true);
	};

	return (
		<>
			<StyledFlexBox sx={{ justifyContent: 'space-between', marginTop: '16px' }}>
				<Typography typography={'h3'}>Contributions</Typography>
				<StyledFlexBox sx={{ cursor: 'pointer' }}>
					<Image
						src={'/images/claim.png'}
						width={24}
						height={24}
						alt={'claim'}
						onClick={onClickFilterBtn}
					/>
					{/*<Button variant={'outlined'} sx={{ marginLeft: '16px' }}>*/}
					{/*	Claim({claimTotal})*/}
					{/*</Button>*/}
				</StyledFlexBox>
			</StyledFlexBox>
			{/*TODO 更新filter条件*/}
			{showFilter ? (
				<StyledFlexBox sx={{ marginTop: '16px', justifyContent: 'space-between' }}>
					<StyledFlexBox>
						<Select
							id="period-select"
							value={period}
							onChange={handlePeriodChange}
							placeholder={'Period'}
							sx={{ width: '160px' }}
							size={'small'}
						>
							<MenuItem value={'ALL'}>All time</MenuItem>
							<MenuItem value={'2'}>This week</MenuItem>
							<MenuItem value={'3'}>This month</MenuItem>
							<MenuItem value={'4'}>This season</MenuItem>
							<MenuItem value={'5'}>This year</MenuItem>
						</Select>
						<Select
							id="vote-status"
							value={voteStatus}
							onChange={handleVoteStatusChange}
							placeholder={'Vote Status'}
							sx={{ width: '200px', margin: '0 16px' }}
							size={'small'}
						>
							<MenuItem value={'ALL'}>All status</MenuItem>
							<MenuItem value={'2'}>Voted by me</MenuItem>
							<MenuItem value={'3'}>Unvoted by me</MenuItem>
							<MenuItem value={'4'}>voted ended</MenuItem>
						</Select>
						<Select
							id="contributor"
							value={contributor}
							onChange={handleContributorChange}
							placeholder={'Contributor'}
							sx={{ width: '200px' }}
							size={'small'}
						>
							<MenuItem value={'ALL'}>All contributors</MenuItem>
							{contributorList.map((contributor) => (
								<MenuItem key={contributor.wallet} value={contributor.wallet}>
									{contributor.nickName}
								</MenuItem>
							))}
						</Select>
						<Button variant={'text'} sx={{ marginLeft: '16px' }} onClick={handleRest}>
							Reset
						</Button>
					</StyledFlexBox>
					<Button variant={'text'} onClick={onClickSelectBtn}>
						Select
					</Button>
				</StyledFlexBox>
			) : null}

			{showSelect ? (
				<StyledFlexBox
					sx={{
						marginTop: '16px',
						marginBottom: '16px',
						justifyContent: 'space-between',
					}}
				>
					<StyledFlexBox>
						{/* TODO use native checkbox */}
						<Checkbox
							total={contributionList.length}
							selected={selected.length}
							onChange={onClickSelectParent}
						/>
						<Typography variant={'body1'}>{selected.length} have selected</Typography>
					</StyledFlexBox>
					<StyledFlexBox>
						<Button
							variant="outlined"
							size={'large'}
							color={'success'}
							sx={{ width: '112px', marginLeft: '12px' }}
							startIcon={<DoneOutlinedIcon />}
						>
							For
						</Button>
						<Button
							variant="outlined"
							size={'large'}
							color={'error'}
							sx={{ width: '112px', marginLeft: '12px' }}
							startIcon={<ClearOutlinedIcon />}
						>
							Again
						</Button>
						<Button
							variant="outlined"
							size={'large'}
							color={'primary'}
							sx={{ width: '112px', marginLeft: '12px' }}
							startIcon={<ArrowForwardOutlinedIcon />}
						>
							Abstain
						</Button>
						<Button
							variant="outlined"
							size={'large'}
							color={'info'}
							sx={{ width: '112px', marginLeft: '12px' }}
							onClick={handleHideSelect}
						>
							Cancel
						</Button>
					</StyledFlexBox>
				</StyledFlexBox>
			) : null}

			{contributionList.map((contribution, idx) => (
				<ContributionItem
					key={contribution.id}
					contribution={contribution}
					showSelect={showSelect}
					selected={selected}
					onSelect={onSelect}
					showDeleteDialog={showDeleteDialog}
					projectDetail={projectDetail}
					onVote={onVote}
					onClaim={onClaim}
					easVoteList={easVoteMap[contribution.uId as string]}
					contributorList={contributorList}
				/>
			))}

			<Dialog
				open={showDialog}
				onClose={onCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{/*<DialogTitle id="alert-dialog-title">*/}
				{/*	{"Use Google's location service?"}*/}
				{/*</DialogTitle>*/}
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure to delete this contribution?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onCloseDialog}>Cancel</Button>
					<Button onClick={onCloseDialog} autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ContributionList;